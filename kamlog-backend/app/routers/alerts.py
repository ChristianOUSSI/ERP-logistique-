# app/routers/alerts.py  Router Alertes KAMLOG
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select
from typing import List, Dict
from datetime import datetime, timedelta, timezone
from pydantic import BaseModel

from app.database import get_db
from app.models.transport import MissionTransport, StatutMission
from app.routers.auth import get_current_user
from app.models.user import User
from app.utils.rbac import require_role
from app.services.transport_service import calculer_ecart_carburant, SEUIL_ECART_CARBURANT
from app.services.events import event_service, EventType

router = APIRouter()


async def check_and_broadcast_fuel_alerts(db: Session):
    """Vérifie les alertes de siphonnage de carburant et les diffuse via le service d'événements."""
    # Récupérer les missions en route ou livrées dans les 7 derniers jours
    date_limite = datetime.now(timezone.utc) - timedelta(days=7)

    missions_result = db.execute(
        select(MissionTransport).where(
            MissionTransport.statut.in_([StatutMission.EN_ROUTE, StatutMission.LIVRE]),
            MissionTransport.updated_at >= date_limite
        )
    )
    missions = missions_result.scalars().all()

    for mission in missions:
        from app.models.transport import CamionFlotte, TicketCarburant
        from sqlalchemy import func
        # Consommation réelle basée sur les tickets de carburant du camion
        total_litres = db.query(func.sum(TicketCarburant.quantite_litres)).filter(
            TicketCarburant.camion_id == mission.camion_id
        ).scalar() or Decimal('0')
        consommation_reelle_litres = total_litres

        # Récupérer la conso théorique du camion
        camion = db.get(CamionFlotte, mission.camion_id)

        if camion and camion.conso_theorique_l_100:
            ecart = calculer_ecart_carburant(
                consommation_reelle_litres,
                mission.distance_km,
                camion.conso_theorique_l_100
            )

            if ecart > SEUIL_ECART_CARBURANT:
                # Diffuser l'alerte via le service d'événements
                await event_service.broadcast_fuel_alert(
                    mission_id=mission.id,
                    écart_percent=float(ecart * 100),
                    référence=mission.reference,
                    severity="CRITIQUE" if ecart > Decimal("0.20") else "WARNING"
                )


async def check_and_broadcast_credit_alerts(db: Session):
    """Vérifie les alertes de limite de crédit et les diffuse via le service d'événements."""
    from app.models.tiers import Tiers
    from app.services.finance_service import calculer_encours_client

    active_tiers = db.query(Tiers).filter(Tiers.statut == "ACTIF").all()

    for tier in active_tiers:
        try:
            encours = await calculer_encours_client(db, tier.id)

            if encours["bloque"]:
                # Diffuser l'alerte via le service d'événements
                await event_service.broadcast_credit_alert(
                    tiers_id=tier.id,
                    raison_sociale=tier.raison_sociale,
                    encours_data={
                        "encours_xaf": encours["encours_xaf"],
                        "limite_credit_xaf": encours["limite_credit_xaf"],
                        "taux_occupation": encours["taux_occupation"],
                        "message": f"Limite crédit dépassée pour {tier.raison_sociale}"
                    }
                )
            elif encours["alerte"]:
                # Diffuser l'alerte via le service d'événements
                await event_service.broadcast_credit_alert(
                    tiers_id=tier.id,
                    raison_sociale=tier.raison_sociale,
                    encours_data={
                        "encours_xaf": encours["encours_xaf"],
                        "limite_credit_xaf": encours["limite_credit_xaf"],
                        "taux_occupation": encours["taux_occupation"],
                        "message": f"Limite crédit proche pour {tier.raison_sociale} ({encours['taux_occupation']:.1f}%)"
                    }
                )
        except Exception as e:
            # Log error but continue processing other tiers
            print(f"Error checking credit limit for tier {tier.id}: {e}")


async def check_and_broadcast_low_stock_alerts(db: Session):
    """Vérifie les alertes de stock faible et les diffuse via le service d'événements."""
    from app.models.magasin import Article, Stock

    low_stock_items = db.query(Article, Stock).join(Stock).filter(
        Article.est_actif == True,
        Stock.quantite_disponible < 10,  # Low stock threshold
        Stock.statut == "NORMAL"
    ).all()

    for article, stock in low_stock_items:
        # Diffuser l'alerte via le service d'événements
        await event_service.broadcast_low_stock_alert(
            article_id=article.id,
            nom_article=article.nom,
            quantite_disponible=float(stock.quantite_disponible),
            unité=article.unite_mesure.value
        )


class AlertResponse(BaseModel):
    mission_id: int
    reference: str
    type_alerte: str
    message: str
    gravite: str
    date_alerte: datetime


@router.get("/fuel-siphoning", response_model=List[AlertResponse])
@require_role(["admin", "dispatcher"])
async def check_fuel_siphoning_alerts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Vérifie les alertes de siphonnage de carburant (US-20).
    Alerte si l'écart consommation réelle vs théorique > 10%.
    """
    # Récupérer les missions en route ou livrées dans les 7 derniers jours
    date_limite = datetime.now(timezone.utc) - timedelta(days=7)

    missions_result = db.execute(
        select(MissionTransport).where(
            MissionTransport.statut.in_([StatutMission.EN_ROUTE, StatutMission.LIVRE]),
            MissionTransport.updated_at >= date_limite
        )
    )
    missions = missions_result.scalars().all()

    alerts = []

    for mission in missions:
        from app.models.transport import CamionFlotte, TicketCarburant
        from sqlalchemy import func
        # Consommation réelle basée sur les tickets de carburant du camion
        total_litres = db.query(func.sum(TicketCarburant.quantite_litres)).filter(
            TicketCarburant.camion_id == mission.camion_id
        ).scalar() or Decimal('0')
        consommation_reelle_litres = total_litres

        # Récupérer la conso théorique du camion
        camion = await db.get(CamionFlotte, mission.camion_id)

        if camion:
            ecart = calculer_ecart_carburant(
                consommation_reelle_litres,
                mission.distance_km,
                camion.conso_theorique_l_100
            )

            if ecart > SEUIL_ECART_CARBURANT:
                alerts.append(AlertResponse(
                    mission_id=mission.id,
                    reference=mission.reference,
                    type_alerte="SIPHONNAGE_CARBURANT",
                    message=f"Écart carburant de {ecart * 100:.1f}% détecté pour la mission {mission.reference}",
                    gravite="CRITIQUE" if ecart > Decimal("0.20") else "WARNING",
                    date_alerte=datetime.now(timezone.utc)
                ))

    return alerts


@router.get("/credit-limit")
@require_role(["admin", "finance"])
async def check_credit_limit_alerts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Vérifie les alertes de limite de crédit dépassée.
    """
    from app.models.tiers import Tiers

    tiers_result = db.execute(select(Tiers).where(Tiers.statut == "ACTIF"))
    all_tiers = tiers_result.scalars().all()

    alerts = []

    for tier in all_tiers:
        encours = await calculer_encours_client(db, tier.id)

        if encours["bloque"]:
            alerts.append({
                "tiers_id": tier.id,
                "raison_sociale": tier.raison_sociale,
                "type_alerte": "LIMITE_CREDIT_DEPASSEE",
                "message": f"Limite crédit dépassée pour {tier.raison_sociale}",
                "gravite": "CRITIQUE",
                "encours_xaf": encours["encours_xaf"],
                "limite_xaf": encours["limite_credit_xaf"],
                "date_alerte": datetime.now(timezone.utc)
            })
        elif encours["alerte"]:
            alerts.append({
                "tiers_id": tier.id,
                "raison_sociale": tier.raison_sociale,
                "type_alerte": "LIMITE_CREDIT_APPROCHE",
                "message": f"Limite crédit proche pour {tier.raison_sociale} ({encours['taux_occupation']:.1f}%)",
                "gravite": "WARNING",
                "encours_xaf": encours["encours_xaf"],
                "limite_xaf": encours["limite_credit_xaf"],
                "date_alerte": datetime.now(timezone.utc)
            })

    return alerts


@router.post("/check-all-alerts")
@require_role(["admin"])
async def trigger_all_alert_checks(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Déclenche manuellement la vérification de toutes les alertes et leur diffusion.
    Destiné aux tests ou aux tâches périodiques.
    """
    await check_and_broadcast_fuel_alerts(db)
    await check_and_broadcast_credit_alerts(db)
    await check_and_broadcast_low_stock_alerts(db)

    return {
        "message": "Vérification de toutes les alertes terminée",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
