# app/routers/transport.py  Router Transport
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.transport import (
    CamionFlotte, ChauffeurProfil, MissionTransport, TicketCarburant,
    VehiculeDocument, ChauffeurDocument, PanneVehicule, ControleHSE,
    StatutCamion, StatutPanne
)
from app.models.user import User
from app.schemas.transport import (
    CamionFlotteCreate, CamionFlotteUpdate, CamionResponse,
    ChauffeurProfilCreate, ChauffeurProfilUpdate, ChauffeurResponse,
    MissionCreate, MissionUpdate, MissionResponse,
    VehiculeDocumentCreate, VehiculeDocumentResponse,
    PanneVehiculeCreate, PanneVehiculeResponse, PanneVehiculeUpdate,
    ChauffeurDocumentCreate, ChauffeurDocumentResponse
)
from pydantic import BaseModel
from decimal import Decimal

class TicketCarburantBase(BaseModel):
    camion_id: int
    chauffeur_id: int
    quantite_litres: float
    prix_unitaire: float
    montant_total: float
    date_plein: str
    kilometrage: int
    station_service: str | None = None
    notes: str | None = None

class TicketCarburantCreate(TicketCarburantBase):
    pass

class TicketCarburantResponse(TicketCarburantBase):
    id: int
    class Config:
        from_attributes = True

from app.routers.auth import get_current_user
from app.utils.rbac import require_role, require_permission
from app.services.transport_service import (
    CamionFlotteService, ChauffeurProfilService, MissionTransportService,
    BandeLivraisonService, calculer_ecart_carburant,
    PanneVehiculeService, AlertesService
)

router = APIRouter(tags=["Transport"])


@router.get("/kpis")
@require_permission("transport:read")
async def get_transport_kpis(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Calcule les KPIs de transport côté serveur."""
    from sqlalchemy import func
    
    camions = db.query(CamionFlotte).all()
    active_vehicles = sum(1 for c in camions if c.actif)
    in_maintenance = sum(1 for c in camions if c.statut == "EN_MAINTENANCE")
    
    missions = db.query(MissionTransport).all()
    active_missions = sum(1 for m in missions if m.statut == "EN_ROUTE")
    completed_missions = sum(1 for m in missions if m.statut == "TERMINEE")
    
    # Simuler le carburant consommé pour le dashboard si l'API fuel n'est pas encore faite
    total_fuel_consumed = 0
    
    return {
        "activeVehicles": active_vehicles,
        "inMaintenance": in_maintenance,
        "activeMissions": active_missions,
        "completedMissions": completed_missions,
        "totalFuelConsumed": float(total_fuel_consumed)
    }

# ─── Fuel ───────────────────────────────────────────────
@router.get("/fuel", response_model=List[TicketCarburantResponse])
@require_permission("transport:read")
async def get_fuel_tickets(db: Session = Depends(get_db)):
    """Récupère les tickets de carburant"""
    return db.query(TicketCarburant).all()

@router.post("/fuel", response_model=TicketCarburantResponse, status_code=status.HTTP_201_CREATED)
@require_permission("transport:write")
async def create_fuel_ticket(ticket: TicketCarburantCreate, db: Session = Depends(get_db)):
    """Créer un ticket de carburant"""
    db_ticket = TicketCarburant(**ticket.dict())
    db.add(db_ticket)
    db.commit()
    db.refresh(db_ticket)
    return db_ticket


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
@require_role(["admin", "dispatcher"])
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
@require_role(["admin", "dispatcher"])
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
@require_role(["admin"])
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
@require_role(["admin", "dispatcher"])
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
@require_role(["admin", "dispatcher"])
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
@require_role(["admin", "dispatcher"])
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
@require_role(["admin", "dispatcher"])
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
@require_role(["admin"])
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


# ─── Missions ─────────────────────────────────────────────
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


@router.get("/missions/client/{client_id}", response_model=List[MissionResponse])
@require_permission("transport:read")
async def get_missions_by_client(
    client_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Récupère l'historique des missions d'un client."""
    return MissionTransportService.get_missions_by_client(db, client_id)


@router.post("/missions", response_model=MissionResponse, status_code=status.HTTP_201_CREATED)
@require_role(["admin", "dispatcher"])
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
@require_role(["admin", "dispatcher"])
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
@require_role(["admin"])
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
@require_role(["admin", "dispatcher"])
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
@require_role(["admin", "dispatcher"])
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

@router.get("/gps")
@require_permission("transport:read")
async def get_gps_positions(db: Session = Depends(get_db)):
    """Retourne les dernières positions GPS connues des camions."""
    # In a real app this would query a PostGIS database or an external telematics provider.
    # For now, we return dynamic simulated data so the frontend map is not hardcoded.
    import random
    
    camions = db.query(CamionFlotte).all()
    positions = []
    
    # Base coordinate (Douala, Cameroon)
    base_lat = 4.0511
    base_lng = 9.7679
    
    for c in camions:
        if c.actif:
            positions.append({
                "camion_id": c.id,
                "immatriculation": c.immatriculation,
                "statut": c.statut,
                "latitude": base_lat + (random.random() - 0.5) * 0.1,
                "longitude": base_lng + (random.random() - 0.5) * 0.1,
                "vitesse_kmh": random.randint(0, 80) if c.statut == "EN_ROUTE" else 0,
                "derniere_mise_a_jour": "Il y a quelques instants"
            })
            
    return positions

# ─── Documents Véhicule ────────────────────────────────────────

@router.post("/camions/{camion_id}/documents", response_model=VehiculeDocumentResponse, status_code=status.HTTP_201_CREATED)
@require_permission("transport:write")
async def add_vehicule_document(camion_id: int, doc_data: VehiculeDocumentCreate, db: Session = Depends(get_db)):
    doc = VehiculeDocument(**doc_data.model_dump(), cree_par="system")
    db.add(doc)
    db.commit()
    db.refresh(doc)
    return doc

@router.get("/camions/{camion_id}/documents", response_model=List[VehiculeDocumentResponse])
@require_permission("transport:read")
async def get_vehicule_documents(camion_id: int, db: Session = Depends(get_db)):
    return db.query(VehiculeDocument).filter(VehiculeDocument.vehicule_id == camion_id).all()

@router.put("/camions/{camion_id}/associer-remorque", response_model=CamionResponse)
@require_permission("transport:write")
async def associer_remorque(camion_id: int, remorque_id: int = None, db: Session = Depends(get_db)):
    camion = db.query(CamionFlotte).filter(CamionFlotte.id == camion_id).first()
    if not camion:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Camion introuvable")
    
    if remorque_id:
        remorque = db.query(CamionFlotte).filter(CamionFlotte.id == remorque_id).first()
        if not remorque:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Remorque introuvable")
    
    camion.remorque_id = remorque_id
    db.commit()
    db.refresh(camion)
    return camion

# ─── Documents Chauffeur ───────────────────────────────────────

@router.post("/chauffeurs/{chauffeur_id}/documents", response_model=ChauffeurDocumentResponse, status_code=status.HTTP_201_CREATED)
@require_permission("transport:write")
async def add_chauffeur_document(chauffeur_id: int, doc_data: ChauffeurDocumentCreate, db: Session = Depends(get_db)):
    doc = ChauffeurDocument(**doc_data.model_dump(), cree_par="system")
    db.add(doc)
    db.commit()
    db.refresh(doc)
    return doc

@router.get("/chauffeurs/{chauffeur_id}/documents", response_model=List[ChauffeurDocumentResponse])
@require_permission("transport:read")
async def get_chauffeur_documents(chauffeur_id: int, db: Session = Depends(get_db)):
    return db.query(ChauffeurDocument).filter(ChauffeurDocument.chauffeur_id == chauffeur_id).all()

# ─── Pannes & Maintenance ──────────────────────────────────────

@router.post("/camions/{camion_id}/pannes", response_model=PanneVehiculeResponse, status_code=status.HTTP_201_CREATED)
@require_permission("transport:write")
async def declarer_panne(camion_id: int, panne_data: PanneVehiculeCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    panne = PanneVehicule(**panne_data.model_dump(), declare_par=current_user.username, cree_par=current_user.username)
    db.add(panne)
    
    # Bloquer le camion en maintenance
    camion = db.query(CamionFlotte).filter(CamionFlotte.id == camion_id).first()
    if camion:
        camion.statut = StatutCamion.EN_MAINTENANCE
    
    db.commit()
    db.refresh(panne)
    return panne

@router.get("/camions/{camion_id}/pannes", response_model=List[PanneVehiculeResponse])
@require_permission("transport:read")
async def get_pannes(camion_id: int, db: Session = Depends(get_db)):
    return db.query(PanneVehicule).filter(PanneVehicule.vehicule_id == camion_id).all()

@router.put("/camions/{camion_id}/pannes/{panne_id}", response_model=PanneVehiculeResponse)
@require_permission("transport:write")
async def update_panne(camion_id: int, panne_id: int, panne_update: PanneVehiculeUpdate, db: Session = Depends(get_db)):
    panne = PanneVehiculeService.update_panne(db, camion_id, panne_id, panne_update)
    if not panne:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Panne introuvable")
    return panne

@router.put("/camions/{camion_id}/debloquer", response_model=CamionResponse)
@require_permission("transport:write")
async def debloquer_camion(camion_id: int, db: Session = Depends(get_db)):
    try:
        camion = CamionFlotteService.mettre_disponible(db, camion_id)
        if not camion:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Camion introuvable")
        return camion
    except ValueError as e:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, str(e))

@router.post("/camions/{camion_id}/hse-block")
@require_permission("transport:write")
async def bloquer_hse(camion_id: int, motif: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    camion = db.query(CamionFlotte).filter(CamionFlotte.id == camion_id).first()
    if not camion:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Camion introuvable")
    
    controle = ControleHSE(vehicule_id=camion_id, controleur=current_user.username, vehicule_bloque=True, motif_blocage=motif, cree_par=current_user.username)
    db.add(controle)
    
    # Créer l'entrée Maintenance auto
    panne = PanneVehicule(vehicule_id=camion_id, description=f"BLOCAGE HSE: {motif}", statut=StatutPanne.A_REPARER, declare_par=current_user.username, cree_par=current_user.username)
    db.add(panne)
    
    # Bloquer camion
    camion.statut = StatutCamion.BLOQUE_HSE
    db.commit()
    return {"message": "Véhicule bloqué et envoyé en maintenance avec succès"}

from pydantic import BaseModel as PydanticBaseModel

class LivrerMissionPayload(PydanticBaseModel):
    signature: str
    nom_receptionnaire: str

@router.post("/missions/{mission_id}/livrer")
@require_permission("transport:write")
async def livrer_mission(mission_id: int, payload: LivrerMissionPayload, db: Session = Depends(get_db)):
    """E-POD: Valide la livraison et déclenche la facturation automatique."""
    try:
        mission = MissionTransportService.valider_livraison(db, mission_id, payload.signature, payload.nom_receptionnaire)
        return {"message": "Livraison validée, facture générée automatiquement.", "mission_id": mission.id}
    except ValueError as e:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, str(e))

@router.get("/alertes/documents")
@require_permission("transport:read")
async def get_alertes_documents(db: Session = Depends(get_db)):
    """Retourne la liste des documents expirant dans moins de 30 jours."""
    return AlertesService.get_expiring_documents(db)
