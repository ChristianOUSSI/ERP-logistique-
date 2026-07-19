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
    ChauffeurDocumentCreate, ChauffeurDocumentResponse,
    HistoriqueCouplageResponse
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
    PanneVehiculeService, AlertesService, AnalyticsService
)
from app.services.whatsapp import WhatsAppService

router = APIRouter(tags=["Transport"])


@router.get("/kpis")
@require_permission("transport:read")
def get_transport_kpis(
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
    
    # Vrai calcul du carburant consommé via les tickets
    total_fuel_consumed = db.query(func.sum(TicketCarburant.quantite_litres)).scalar() or 0
    
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
def get_fuel_tickets(db: Session = Depends(get_db)):
    """Récupère les tickets de carburant"""
    return db.query(TicketCarburant).all()

@router.post("/fuel", response_model=TicketCarburantResponse, status_code=status.HTTP_201_CREATED)
@require_permission("transport:write")
def create_fuel_ticket(ticket: TicketCarburantCreate, db: Session = Depends(get_db)):
    """Créer un ticket de carburant"""
    db_ticket = TicketCarburant(**ticket.dict())
    db.add(db_ticket)
    db.commit()
    db.refresh(db_ticket)
    return db_ticket


# ─── Camions ─────────────────────────────────────────────
@router.get("/camions", response_model=List[CamionResponse])
@require_permission("transport:read")
def list_camions(
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
def get_camion(
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
def create_camion(
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
def update_camion(
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
def delete_camion(
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
def mettre_en_maintenance(
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
def mettre_disponible(
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
def list_chauffeurs(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Liste tous les chauffeurs."""
    return ChauffeurProfilService.get_all_chauffeurs(db, skip, limit)


@router.get("/chauffeurs/{chauffeur_id}", response_model=ChauffeurResponse)
@require_permission("transport:read")
def get_chauffeur(
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
def list_chauffeurs_disponibles(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Liste les chauffeurs disponibles (sans mission active)."""
    return ChauffeurProfilService.get_chauffeurs_disponibles(db)


@router.post("/chauffeurs", response_model=ChauffeurResponse, status_code=status.HTTP_201_CREATED)
@require_role(["admin", "dispatcher"])
@require_permission("transport:write")
def create_chauffeur(
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
def update_chauffeur(
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
def delete_chauffeur(
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
def list_missions(
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
def get_mission(
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
def get_missions_by_chauffeur(
    chauffeur_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Récupère les missions d'un chauffeur."""
    return MissionTransportService.get_missions_by_chauffeur(db, chauffeur_id)


@router.get("/missions/client/{client_id}", response_model=List[MissionResponse])
@require_permission("transport:read")
def get_missions_by_client(
    client_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Récupère l'historique des missions d'un client."""
    return MissionTransportService.get_missions_by_client(db, client_id)


@router.post("/missions", response_model=MissionResponse, status_code=status.HTTP_201_CREATED)
@require_role(["admin", "dispatcher"])
@require_permission("transport:write")
def create_mission(
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
def update_mission(
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
def delete_mission(
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
def demarrer_mission(
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
def terminer_mission(
    mission_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Termine une mission (TERMINEE)."""
    mission = MissionTransportService.terminer_mission(db, mission_id)
    if not mission:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Mission introuvable")
    return mission


class StatutUpdate(BaseModel):
    statut: str

@router.patch("/missions/{mission_id}/statut", response_model=MissionResponse)
@require_role(["admin", "dispatcher", "chauffeur"])
@require_permission("transport:write")
def update_mission_statut(
    mission_id: int,
    update_data: StatutUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Met à jour le statut d'une mission et broadcast via WebSocket."""
    from app.services.events import event_service, EventType
    from datetime import datetime, timezone
    import asyncio

    # Récupérer et mettre à jour la mission via le service existant
    # Le service devrait être étendu, ou on met à jour directement.
    # Pour le moment, on utilise l'attribut statut si possible.
    mission = db.query(MissionTransport).filter(MissionTransport.id == mission_id).first()
    if not mission:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Mission introuvable")

    mission.statut = update_data.statut
    db.commit()
    db.refresh(mission)

    # Broadcast l'événement en temps réel via le service d'événements
    asyncio.create_task(event_service.broadcast_mission_status_update(
        mission_id=mission.id,
        new_status=update_data.statut
    ))

    # WhatsApp Integration
    if update_data.statut in ["EN_ROUTE", "LIVREE", "EN_CHARGEMENT"]:
        from app.models.tiers import Tiers
        tiers = db.query(Tiers).filter(Tiers.id == mission.tiers_id).first()
        client_phone = tiers.telephone if tiers and tiers.telephone else ""
        if client_phone:
            message = f"Bonjour, votre mission de transport #{mission.reference} vient de passer au statut: {update_data.statut}."
            WhatsAppService.send_message(client_phone, message)

    return mission


@router.post("/calculer-ecart-carburant")
@require_permission("transport:read")
def calculer_ecart_carburant_endpoint(
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
def get_gps_positions(db: Session = Depends(get_db)):
    # Vraie récupération depuis la table des positions GPS
    from app.models.transport import PositionGPS
    from sqlalchemy import desc
    camions = db.query(CamionFlotte).all()
    positions = []
    
    for c in camions:
        if c.actif:
            latest_pos = db.query(PositionGPS).filter(
                PositionGPS.camion_id == c.id
            ).order_by(desc(PositionGPS.timestamp)).first()
            
            if latest_pos:
                positions.append({
                    "id": c.id,
                    "immatriculation": c.immatriculation,
                    "statut": c.statut,
                    "chauffeur": c.chauffeur_actuel.nom if hasattr(c, 'chauffeur_actuel') and c.chauffeur_actuel else "Non assigné",
                    "lat": float(latest_pos.latitude),
                    "lng": float(latest_pos.longitude)
                })
    return positions

# ─── Documents Véhicule ────────────────────────────────────────

@router.post("/camions/{camion_id}/documents", response_model=VehiculeDocumentResponse, status_code=status.HTTP_201_CREATED)
@require_permission("transport:write")
def add_vehicule_document(camion_id: int, doc_data: VehiculeDocumentCreate, db: Session = Depends(get_db)):
    doc = VehiculeDocument(**doc_data.model_dump(), cree_par="system")
    db.add(doc)
    db.commit()
    db.refresh(doc)
    return doc

@router.get("/camions/{camion_id}/documents", response_model=List[VehiculeDocumentResponse])
@require_permission("transport:read")
def get_vehicule_documents(camion_id: int, db: Session = Depends(get_db)):
    return db.query(VehiculeDocument).filter(VehiculeDocument.vehicule_id == camion_id).all()

@router.put("/camions/{camion_id}/associer-remorque", response_model=CamionResponse)
@require_permission("transport:write")
def associer_remorque(camion_id: int, remorque_id: int, db: Session = Depends(get_db)):
    from app.models.transport import TypeMateriel, HistoriqueCouplage
    camion = db.query(CamionFlotte).filter(CamionFlotte.id == camion_id).first()
    if not camion or camion.type_materiel != TypeMateriel.TRACTEUR:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Tracteur introuvable ou invalide")
    
    remorque = db.query(CamionFlotte).filter(CamionFlotte.id == remorque_id).first()
    if not remorque or remorque.type_materiel not in [TypeMateriel.REMORQUE, TypeMateriel.SEMI_REMORQUE]:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Remorque introuvable ou invalide")
        
    # Vérifier si le tracteur avait déjà une remorque
    if camion.remorque_id:
        if camion.remorque_id == remorque_id:
            return camion
        # Clôturer l'historique précédent
        ancien_hist = db.query(HistoriqueCouplage).filter(
            HistoriqueCouplage.tracteur_id == camion.id,
            HistoriqueCouplage.remorque_id == camion.remorque_id,
            HistoriqueCouplage.date_dissociation == None
        ).first()
        if ancien_hist:
            ancien_hist.date_dissociation = datetime.now(timezone.utc)

    # Vérifier si la remorque était liée à un autre tracteur
    autre_tracteur = db.query(CamionFlotte).filter(CamionFlotte.remorque_id == remorque_id).first()
    if autre_tracteur:
        autre_tracteur.remorque_id = None
        # Clôturer son historique
        ancien_hist_remorque = db.query(HistoriqueCouplage).filter(
            HistoriqueCouplage.tracteur_id == autre_tracteur.id,
            HistoriqueCouplage.remorque_id == remorque_id,
            HistoriqueCouplage.date_dissociation == None
        ).first()
        if ancien_hist_remorque:
            ancien_hist_remorque.date_dissociation = datetime.now(timezone.utc)

    camion.remorque_id = remorque_id
    
    # Nouvel historique
    nouvel_hist = HistoriqueCouplage(tracteur_id=camion.id, remorque_id=remorque.id)
    db.add(nouvel_hist)
    
    db.commit()
    db.refresh(camion)
    return camion

@router.put("/camions/{camion_id}/dissocier-remorque", response_model=CamionResponse)
@require_permission("transport:write")
def dissocier_remorque(camion_id: int, db: Session = Depends(get_db)):
    from app.models.transport import HistoriqueCouplage
    camion = db.query(CamionFlotte).filter(CamionFlotte.id == camion_id).first()
    if not camion:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Camion introuvable")
        
    if camion.remorque_id:
        hist = db.query(HistoriqueCouplage).filter(
            HistoriqueCouplage.tracteur_id == camion.id,
            HistoriqueCouplage.remorque_id == camion.remorque_id,
            HistoriqueCouplage.date_dissociation == None
        ).first()
        if hist:
            hist.date_dissociation = datetime.now(timezone.utc)
            
        camion.remorque_id = None
        db.commit()
        db.refresh(camion)
        
    return camion

@router.get("/camions/{camion_id}/historique-couplage", response_model=List[HistoriqueCouplageResponse])
@require_permission("transport:read")
def get_historique_couplage(camion_id: int, db: Session = Depends(get_db)):
    from app.models.transport import HistoriqueCouplage
    historiques = db.query(HistoriqueCouplage).filter(
        (HistoriqueCouplage.tracteur_id == camion_id) | (HistoriqueCouplage.remorque_id == camion_id)
    ).order_by(HistoriqueCouplage.date_association.desc()).all()
    
    result = []
    for h in historiques:
        # Resolve license plates
        tracteur_imm = h.tracteur.immatriculation if h.tracteur else None
        remorque_imm = h.remorque.immatriculation if h.remorque else None
        
        hist_dict = {
            "id": h.id,
            "tracteur_id": h.tracteur_id,
            "remorque_id": h.remorque_id,
            "date_association": h.date_association,
            "date_dissociation": h.date_dissociation,
            "tracteur_immatriculation": tracteur_imm,
            "remorque_immatriculation": remorque_imm
        }
        result.append(hist_dict)
        
    return result


# ─── Documents Chauffeur ───────────────────────────────────────

@router.post("/chauffeurs/{chauffeur_id}/documents", response_model=ChauffeurDocumentResponse, status_code=status.HTTP_201_CREATED)
@require_permission("transport:write")
def add_chauffeur_document(chauffeur_id: int, doc_data: ChauffeurDocumentCreate, db: Session = Depends(get_db)):
    doc = ChauffeurDocument(**doc_data.model_dump(), cree_par="system")
    db.add(doc)
    db.commit()
    db.refresh(doc)
    return doc

@router.get("/chauffeurs/{chauffeur_id}/documents", response_model=List[ChauffeurDocumentResponse])
@require_permission("transport:read")
def get_chauffeur_documents(chauffeur_id: int, db: Session = Depends(get_db)):
    return db.query(ChauffeurDocument).filter(ChauffeurDocument.chauffeur_id == chauffeur_id).all()

# ─── Pannes & Maintenance ──────────────────────────────────────

@router.post("/camions/{camion_id}/pannes", response_model=PanneVehiculeResponse, status_code=status.HTTP_201_CREATED)
@require_permission("transport:write")
def declarer_panne(camion_id: int, panne_data: PanneVehiculeCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
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
def get_pannes(camion_id: int, db: Session = Depends(get_db)):
    return db.query(PanneVehicule).filter(PanneVehicule.vehicule_id == camion_id).all()

@router.put("/camions/{camion_id}/pannes/{panne_id}", response_model=PanneVehiculeResponse)
@require_permission("transport:write")
def update_panne(camion_id: int, panne_id: int, panne_update: PanneVehiculeUpdate, db: Session = Depends(get_db)):
    panne = PanneVehiculeService.update_panne(db, camion_id, panne_id, panne_update)
    if not panne:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Panne introuvable")
    return panne

@router.put("/camions/{camion_id}/debloquer", response_model=CamionResponse)
@require_permission("transport:write")
def debloquer_camion(camion_id: int, db: Session = Depends(get_db)):
    try:
        camion = CamionFlotteService.mettre_disponible(db, camion_id)
        if not camion:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Camion introuvable")
        return camion
    except ValueError as e:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, str(e))

@router.post("/camions/{camion_id}/hse-block")
@require_permission("transport:write")
def bloquer_hse(camion_id: int, motif: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
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
def livrer_mission(mission_id: int, payload: LivrerMissionPayload, db: Session = Depends(get_db)):
    """E-POD: Valide la livraison et déclenche la facturation automatique."""
    try:
        mission = MissionTransportService.valider_livraison(db, mission_id, payload.signature, payload.nom_receptionnaire)
        return {"message": "Livraison validée, facture générée automatiquement.", "mission_id": mission.id}
    except ValueError as e:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, str(e))

@router.get("/alertes/documents")
@require_permission("transport:read")
def get_alertes_documents(db: Session = Depends(get_db)):
    """Retourne la liste des documents expirant dans moins de 30 jours."""
    return AlertesService.get_expiring_documents(db)
