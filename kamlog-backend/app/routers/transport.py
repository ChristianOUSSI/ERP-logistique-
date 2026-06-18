# app/routers/transport.py  Router Transport
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.transport import CamionFlotte, ChauffeurProfil, MissionTransport
from app.models.user import User
from app.schemas.transport import (
    CamionFlotteCreate, CamionFlotteUpdate, CamionResponse,
    ChauffeurProfilCreate, ChauffeurProfilUpdate, ChauffeurResponse,
    MissionCreate, MissionUpdate, MissionResponse
)
from app.routers.auth import get_current_user
from app.utils.rbac import require_role, require_permission
from app.services.transport_service import (
    CamionFlotteService, ChauffeurProfilService, MissionTransportService,
    BandeLivraisonService, calculer_ecart_carburant
)

router = APIRouter(tags=["Transport"])


# ─── Camions ─────────────────────────────────────────────
@router.get("/camions", response_model=List[CamionResponse])
@require_permission("transport:read")
async def list_camions(
    skip: int = 0,
    limit: int = 100,
    statut: str | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Liste tous les camions de la flotte."""
    if statut == "DISPONIBLE":
        return CamionFlotteService.get_camions_disponibles(db)
    return CamionFlotteService.get_all_camions(db, skip, limit)


@router.get("/camions/{camion_id}", response_model=CamionResponse)
@require_permission("transport:read")
async def get_camion(
    camion_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Récupère un camion par ID."""
    camion = CamionFlotteService.get_camion(db, camion_id)
    if not camion:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Camion introuvable")
    return camion


@router.post("/camions", response_model=CamionResponse, status_code=status.HTTP_201_CREATED)
@require_role([User.Role.ADMIN, User.Role.DISPATCHER])
@require_permission("transport:write")
async def create_camion(
    camion_data: CamionFlotteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Ajoute un camion à la flotte."""
    # Vérifier si l'immatriculation existe déjà
    existing = CamionFlotteService.get_all_camions(db)
    for camion in existing:
        if camion.immatriculation == camion_data.immatriculation:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Immatriculation already exists"
            )
    
    return CamionFlotteService.create_camion(db, camion_data, current_user.username)


@router.put("/camions/{camion_id}", response_model=CamionResponse)
@require_role([User.Role.ADMIN, User.Role.DISPATCHER])
@require_permission("transport:write")
async def update_camion(
    camion_id: int,
    camion_data: CamionFlotteUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Met à jour un camion."""
    camion = CamionFlotteService.update_camion(db, camion_id, camion_data)
    if not camion:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Camion introuvable")
    return camion


@router.delete("/camions/{camion_id}", status_code=status.HTTP_204_NO_CONTENT)
@require_role([User.Role.ADMIN])
@require_permission("transport:delete")
async def delete_camion(
    camion_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Supprime un camion."""
    success = CamionFlotteService.delete_camion(db, camion_id)
    if not success:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Camion introuvable")
    return None


@router.post("/camions/{camion_id}/maintenance", response_model=CamionResponse)
@require_role([User.Role.ADMIN, User.Role.DISPATCHER])
@require_permission("transport:write")
async def mettre_en_maintenance(
    camion_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Met le camion en maintenance."""
    camion = CamionFlotteService.mettre_en_maintenance(db, camion_id)
    if not camion:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Camion introuvable")
    return camion


@router.post("/camions/{camion_id}/disponible", response_model=CamionResponse)
@require_role([User.Role.ADMIN, User.Role.DISPATCHER])
@require_permission("transport:write")
async def mettre_disponible(
    camion_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Met le camion disponible."""
    camion = CamionFlotteService.mettre_disponible(db, camion_id)
    if not camion:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Camion introuvable")
    return camion


# ─── Chauffeurs ─────────────────────────────────────────────
@router.get("/chauffeurs", response_model=List[ChauffeurResponse])
@require_permission("transport:read")
async def list_chauffeurs(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Liste tous les chauffeurs."""
    return ChauffeurProfilService.get_all_chauffeurs(db, skip, limit)


@router.get("/chauffeurs/{chauffeur_id}", response_model=ChauffeurResponse)
@require_permission("transport:read")
async def get_chauffeur(
    chauffeur_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Récupère un chauffeur par ID."""
    chauffeur = ChauffeurProfilService.get_chauffeur(db, chauffeur_id)
    if not chauffeur:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Chauffeur introuvable")
    return chauffeur


@router.get("/chauffeurs/disponibles", response_model=List[ChauffeurResponse])
@require_permission("transport:read")
async def list_chauffeurs_disponibles(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Liste les chauffeurs disponibles (sans mission active)."""
    return ChauffeurProfilService.get_chauffeurs_disponibles(db)


@router.post("/chauffeurs", response_model=ChauffeurResponse, status_code=status.HTTP_201_CREATED)
@require_role([User.Role.ADMIN, User.Role.DISPATCHER])
@require_permission("transport:write")
async def create_chauffeur(
    chauffeur_data: ChauffeurProfilCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Ajoute un chauffeur."""
    # Vérifier si le numéro de permis existe déjà
    existing = ChauffeurProfilService.get_all_chauffeurs(db)
    for chauffeur in existing:
        if chauffeur.numero_permis == chauffeur_data.numero_permis:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Permit number already exists"
            )
    
    return ChauffeurProfilService.create_chauffeur(db, chauffeur_data, current_user.username)


@router.put("/chauffeurs/{chauffeur_id}", response_model=ChauffeurResponse)
@require_role([User.Role.ADMIN, User.Role.DISPATCHER])
@require_permission("transport:write")
async def update_chauffeur(
    chauffeur_id: int,
    chauffeur_data: ChauffeurProfilUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Met à jour un chauffeur."""
    chauffeur = ChauffeurProfilService.update_chauffeur(db, chauffeur_id, chauffeur_data)
    if not chauffeur:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Chauffeur introuvable")
    return chauffeur


@router.delete("/chauffeurs/{chauffeur_id}", status_code=status.HTTP_204_NO_CONTENT)
@require_role([User.Role.ADMIN])
@require_permission("transport:delete")
async def delete_chauffeur(
    chauffeur_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Supprime un chauffeur."""
    success = ChauffeurProfilService.delete_chauffeur(db, chauffeur_id)
    if not success:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Chauffeur introuvable")
    return None


# ─── Missions ───────────────────────────────────────────────
@router.get("/missions", response_model=List[MissionResponse])
@require_permission("transport:read")
async def list_missions(
    skip: int = 0,
    limit: int = 100,
    statut: str | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Liste toutes les missions de transport."""
    if statut == "actives":
        return MissionTransportService.get_missions_actives(db)
    return MissionTransportService.get_all_missions(db, skip, limit)


@router.get("/missions/{mission_id}", response_model=MissionResponse)
@require_permission("transport:read")
async def get_mission(
    mission_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Récupère une mission par son ID."""
    mission = MissionTransportService.get_mission(db, mission_id)
    
    if not mission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Mission not found"
        )
    
    return mission


@router.get("/missions/chauffeur/{chauffeur_id}", response_model=List[MissionResponse])
@require_permission("transport:read")
async def get_missions_by_chauffeur(
    chauffeur_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Récupère les missions d'un chauffeur."""
    return MissionTransportService.get_missions_by_chauffeur(db, chauffeur_id)


@router.post("/missions", response_model=MissionResponse, status_code=status.HTTP_201_CREATED)
@require_role([User.Role.ADMIN, User.Role.DISPATCHER])
@require_permission("transport:write")
async def create_mission(
    mission_data: MissionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Crée une nouvelle mission de transport."""
    try:
        return MissionTransportService.create_mission(db, mission_data, current_user.username)
    except ValueError as e:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, str(e))


@router.put("/missions/{mission_id}", response_model=MissionResponse)
@require_role([User.Role.ADMIN, User.Role.DISPATCHER])
@require_permission("transport:write")
async def update_mission(
    mission_id: int,
    mission_data: MissionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Met à jour une mission."""
    mission = MissionTransportService.update_mission(db, mission_id, mission_data)
    if not mission:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Mission introuvable")
    return mission


@router.delete("/missions/{mission_id}", status_code=status.HTTP_204_NO_CONTENT)
@require_role([User.Role.ADMIN])
@require_permission("transport:delete")
async def delete_mission(
    mission_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Supprime une mission."""
    success = MissionTransportService.delete_mission(db, mission_id)
    if not success:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Mission introuvable")
    return None


@router.post("/missions/{mission_id}/demarrer", response_model=MissionResponse)
@require_role([User.Role.ADMIN, User.Role.DISPATCHER])
@require_permission("transport:write")
async def demarrer_mission(
    mission_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Démarre une mission (EN_ROUTE)."""
    mission = MissionTransportService.demarrer_mission(db, mission_id)
    if not mission:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Mission introuvable")
    return mission


@router.post("/missions/{mission_id}/terminer", response_model=MissionResponse)
@require_role([User.Role.ADMIN, User.Role.DISPATCHER])
@require_permission("transport:write")
async def terminer_mission(
    mission_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Termine une mission (TERMINEE)."""
    mission = MissionTransportService.terminer_mission(db, mission_id)
    if not mission:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Mission introuvable")
    return mission


@router.post("/calculer-ecart-carburant")
@require_permission("transport:read")
async def calculer_ecart_carburant_endpoint(
    consommation_reelle_litres: float,
    distance_km: float,
    consommation_theorique_l_100: float,
):
    """Calcule l'écart de consommation de carburant."""
    from decimal import Decimal
    ecart = calculer_ecart_carburant(
        Decimal(str(consommation_reelle_litres)),
        Decimal(str(distance_km)),
        Decimal(str(consommation_theorique_l_100))
    )
    return {
        "ecart_taux": float(ecart),
        "alerte_siphonnage": ecart > Decimal('0.10')
    }
