# app/routers/alerts.py  Router Alertes KAMLOG
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from datetime import datetime, timedelta

from app.database import get_db
from app.models.transport import MissionTransport, StatutMission
from app.routers.auth import get_current_user
from app.models.user import User
from app.utils.rbac import require_role
from app.services.transport_service import calculer_ecart_carburant, SEUIL_ECART_CARBURANT

router = APIRouter()


class AlertResponse(BaseModel):
    mission_id: int
    reference: str
    type_alerte: str
    message: str
    gravite: str
    date_alerte: datetime


from pydantic import BaseModel


@router.get("/fuel-siphoning", response_model=List[AlertResponse])
@require_role([User.Role.ADMIN, User.Role.DISPATCHER])
async def check_fuel_siphoning_alerts(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Vérifie les alertes de siphonnage de carburant (US-20).
    Alerte si l'écart consommation réelle vs théorique > 10%.
    """
    # Récupérer les missions en route ou livrées dans les 7 derniers jours
    date_limite = datetime.utcnow() - timedelta(days=7)
    
    missions_result = await db.execute(
        select(MissionTransport).where(
            MissionTransport.statut.in_([StatutMission.EN_ROUTE, StatutMission.LIVRE]),
            MissionTransport.updated_at >= date_limite
        )
    )
    missions = missions_result.scalars().all()
    
    alerts = []
    
    for mission in missions:
        # Simuler une consommation réelle (en production, viendrait des données IoT)
        # Pour l'instant, on utilise une valeur fictive pour démonstration
        consommation_reelle_litres = mission.distance_km * 0.5  # 0.5 L/km
        
        # Récupérer la conso théorique du camion
        from app.models.transport import CamionFlotte
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
                    date_alerte=datetime.utcnow()
                ))
    
    return alerts


@router.get("/credit-limit")
@require_role([User.Role.ADMIN, User.Role.FINANCE])
async def check_credit_limit_alerts(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Vérifie les alertes de limite de crédit dépassée.
    """
    from app.services.finance_service import calculer_encours_client
    from app.models.tiers import Tiers
    
    tiers_result = await db.execute(select(Tiers).where(Tiers.statut == "ACTIF"))
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
                "date_alerte": datetime.utcnow()
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
                "date_alerte": datetime.utcnow()
            })
    
    return alerts
