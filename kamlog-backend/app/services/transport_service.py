# app/services/transport_service.py  Règles Métier K-Transport
from decimal import Decimal
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.transport import CamionFlotte, ChauffeurProfil, MissionTransport, StatutMission
from app.schemas.transport import MissionCreate


# Seuil alerte siphonnage carburant (10%)
SEUIL_ECART_CARBURANT = Decimal('0.10')


async def valider_creation_mission(
    db: AsyncSession,
    data: MissionCreate,
) -> None:
    """
    Règles métier AVANT création mission :
    1. Camion non déjà EN_ROUTE / EN_CHARGEMENT
    2. Chauffeur non déjà assigné à une mission active
    3. Cohérence type_camion / type_marchandise
    """
    # Règle 1 : camion disponible
    camion = await db.get(CamionFlotte, data.camion_id)
    if not camion:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Camion introuvable")
    if camion.statut in ('EN_ROUTE', 'EN_CHARGEMENT', 'EN_LIVRAISON'):
        raise HTTPException(
            status.HTTP_403_FORBIDDEN,
            f"Camion {camion.immatriculation} déjà en mission  statut : {camion.statut}"
        )

    # Règle 2 : chauffeur disponible
    mission_active = await db.execute(
        select(MissionTransport).where(
            MissionTransport.chauffeur_id == data.chauffeur_id,
            MissionTransport.statut.in_([
                StatutMission.EN_CHARGEMENT,
                StatutMission.EN_ROUTE,
                StatutMission.EN_LIVRAISON,
            ])
        )
    )
    if mission_active.scalar_one_or_none():
        raise HTTPException(
            status.HTTP_403_FORBIDDEN,
            "Chauffeur déjà affecté à une mission en cours"
        )

    # Règle 3 : cohérence type camion / marchandise
    _verifier_coherence_type(camion.type_vehicule, data.type_marchandise)


def _verifier_coherence_type(type_vehicule: str, type_marchandise: str) -> None:
    """Vérifie la compatibilité camion/marchandise selon les règles KAMLOG."""
    INCOMPATIBLES = {
        'BENNE_VRAC': {'CONTENEUR_20', 'CONTENEUR_40'},
        'PORTE_CONTENEUR': {'VRAC', 'CONVENTIONNEL'},
        'CITERNE': {'CONTENEUR_20', 'CONTENEUR_40', 'VRAC_SOLIDE'},
    }
    interdits = INCOMPATIBLES.get(type_vehicule, set())
    if type_marchandise in interdits:
        raise HTTPException(
            status.HTTP_422_UNPROCESSABLE_ENTITY,
            f'Incohérence : {type_vehicule} incompatible avec {type_marchandise}'
        )


def calculer_ecart_carburant(
    consommation_reelle_litres: Decimal,
    distance_km: Decimal,
    consommation_theorique_l_100: Decimal,
) -> Decimal:
    """Retourne le taux d'écart. Si > 10% → alerte siphonnage."""
    theorique = (distance_km / 100) * consommation_theorique_l_100
    if theorique == 0:
        return Decimal('0')
    return (consommation_reelle_litres - theorique).abs() / theorique
