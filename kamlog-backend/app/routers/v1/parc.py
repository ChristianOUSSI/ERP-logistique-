from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
import uuid

router = APIRouter(tags=["Parc Automobile"])

class VehiculeCreate(BaseModel):
    immatriculation: str
    marque: str
    modele: str
    type_vehicule: str  # TRACTEUR, CAMION, REMORQUE, UTILITAIRE
    capacite_tonnes: Optional[float] = None
    annee: Optional[int] = 2020
    zone_affectation: Optional[str] = "PORT DOUALA"
    chauffeur_id: Optional[str] = None

class WorkOrderCreate(BaseModel):
    vehicule_immat: str
    type_travaux: str  # VIDANGE, PNEUS, FREINAGE, CARROSSERIE, REVISION
    description: str
    priorite: Optional[str] = "NORMALE"  # URGENTE, HAUTE, NORMALE
    cout_estime_xaf: Optional[float] = None

class ZoneCreate(BaseModel):
    nom: str
    type_zone: str  # PARKING, ZONE_CHARGEMENT, ATELIER, CARBURANT
    capacite_vehicules: int

_vehicules = [
    {"id": 1, "immatriculation": "DLA-TRK-001", "marque": "VOLVO", "modele": "FH16 750", "type_vehicule": "TRACTEUR", "capacite_tonnes": 40, "annee": 2022, "zone_affectation": "PORT DOUALA", "chauffeur_id": "DRV-001", "statut": "EN_MISSION", "kilometrage": 245000},
    {"id": 2, "immatriculation": "DLA-TRK-002", "marque": "MERCEDES", "modele": "Actros 1845", "type_vehicule": "TRACTEUR", "capacite_tonnes": 35, "annee": 2021, "zone_affectation": "PORT DOUALA", "chauffeur_id": "DRV-002", "statut": "DISPONIBLE", "kilometrage": 312000},
    {"id": 3, "immatriculation": "DLA-TRK-007", "marque": "DAF", "modele": "XF 510", "type_vehicule": "TRACTEUR", "capacite_tonnes": 40, "annee": 2019, "zone_affectation": "PARC LOGISTIQUE", "chauffeur_id": "DRV-003", "statut": "MAINTENANCE", "kilometrage": 478000},
    {"id": 4, "immatriculation": "DLA-REM-015", "marque": "FRUEHAUF", "modele": "Porte-conteneur 40ft", "type_vehicule": "REMORQUE", "capacite_tonnes": 30, "annee": 2020, "zone_affectation": "YARD PORT", "chauffeur_id": None, "statut": "DISPONIBLE", "kilometrage": 0},
    {"id": 5, "immatriculation": "DLA-UTL-003", "marque": "TOYOTA", "modele": "Land Cruiser 200", "type_vehicule": "UTILITAIRE", "capacite_tonnes": 1.5, "annee": 2023, "zone_affectation": "PORT DOUALA", "chauffeur_id": "DRV-005", "statut": "DISPONIBLE", "kilometrage": 45000},
]

_work_orders = [
    {"id": 1, "reference": "WO-2026-001", "vehicule_immat": "DLA-TRK-007", "type_travaux": "VIDANGE", "description": "Vidange moteur + filtre huile + filtre gasoil", "priorite": "HAUTE", "cout_estime_xaf": 150000, "statut": "EN_COURS", "created_at": datetime.utcnow().isoformat()},
    {"id": 2, "reference": "WO-2026-002", "vehicule_immat": "DLA-TRK-001", "type_travaux": "PNEUS", "description": "Remplacement 4 pneumatiques avant – usure 90%", "priorite": "URGENTE", "cout_estime_xaf": 480000, "statut": "EN_ATTENTE", "created_at": datetime.utcnow().isoformat()},
]

_zones = [
    {"id": 1, "nom": "PARKING PRINCIPAL", "type_zone": "PARKING", "capacite_vehicules": 30, "occupe": 22, "statut": "PARTIELLEMENT_PLEIN"},
    {"id": 2, "nom": "ZONE CHARGEMENT QUAI 3", "type_zone": "ZONE_CHARGEMENT", "capacite_vehicules": 8, "occupe": 3, "statut": "DISPONIBLE"},
    {"id": 3, "nom": "ATELIER MECANIQUE", "type_zone": "ATELIER", "capacite_vehicules": 5, "occupe": 1, "statut": "DISPONIBLE"},
    {"id": 4, "nom": "STATION CARBURANT", "type_zone": "CARBURANT", "capacite_vehicules": 4, "occupe": 0, "statut": "DISPONIBLE"},
]

_next_v_id = 6
_next_wo_id = 3

@router.get("/")
def get_parc_dashboard():
    total = len(_vehicules)
    en_mission = len([v for v in _vehicules if v["statut"] == "EN_MISSION"])
    maintenance = len([v for v in _vehicules if v["statut"] == "MAINTENANCE"])
    disponible = len([v for v in _vehicules if v["statut"] == "DISPONIBLE"])
    return {
        "kpis": {
            "total_vehicules": total,
            "en_mission": en_mission,
            "en_maintenance": maintenance,
            "disponibles": disponible,
            "taux_disponibilite_pct": round(disponible / total * 100, 1) if total else 0,
            "work_orders_ouverts": len([wo for wo in _work_orders if wo["statut"] in ["EN_ATTENTE", "EN_COURS"]]),
        },
        "vehicules_en_maintenance": [v for v in _vehicules if v["statut"] == "MAINTENANCE"],
        "work_orders_urgents": [wo for wo in _work_orders if wo["priorite"] == "URGENTE"],
    }

@router.get("/vehicules")
def list_vehicules(statut: Optional[str] = None, type_vehicule: Optional[str] = None, skip: int = 0, limit: int = 50):
    results = _vehicules[:]
    if statut:
        results = [v for v in results if v["statut"].upper() == statut.upper()]
    if type_vehicule:
        results = [v for v in results if v["type_vehicule"].upper() == type_vehicule.upper()]
    return {"total": len(results), "vehicules": results[skip:skip+limit]}

@router.get("/vehicules/{vehicule_id}")
def get_vehicule(vehicule_id: int):
    v = next((v for v in _vehicules if v["id"] == vehicule_id), None)
    if not v:
        raise HTTPException(status_code=404, detail="Véhicule non trouvé")
    return v

@router.post("/vehicules")
def create_vehicule(data: VehiculeCreate):
    global _next_v_id
    vehicule = {**data.dict(), "id": _next_v_id, "statut": "DISPONIBLE", "kilometrage": 0}
    _vehicules.append(vehicule)
    _next_v_id += 1
    return vehicule

@router.patch("/vehicules/{vehicule_id}/statut")
def update_vehicule_statut(vehicule_id: int, statut: str):
    v = next((v for v in _vehicules if v["id"] == vehicule_id), None)
    if not v:
        raise HTTPException(status_code=404, detail="Véhicule non trouvé")
    v["statut"] = statut.upper()
    return v

@router.get("/work-orders")
def list_work_orders(statut: Optional[str] = None, priorite: Optional[str] = None, skip: int = 0, limit: int = 50):
    results = _work_orders[:]
    if statut:
        results = [wo for wo in results if wo["statut"].upper() == statut.upper()]
    if priorite:
        results = [wo for wo in results if wo["priorite"].upper() == priorite.upper()]
    return {"total": len(results), "work_orders": results[skip:skip+limit]}

@router.post("/work-orders")
def create_work_order(data: WorkOrderCreate):
    global _next_wo_id
    ref = f"WO-{datetime.now().year}-{_next_wo_id:03d}"
    wo = {**data.dict(), "id": _next_wo_id, "reference": ref, "statut": "EN_ATTENTE", "created_at": datetime.utcnow().isoformat()}
    _work_orders.append(wo)
    _next_wo_id += 1
    return wo

@router.patch("/work-orders/{wo_id}/statut")
def update_work_order_statut(wo_id: int, statut: str):
    wo = next((w for w in _work_orders if w["id"] == wo_id), None)
    if not wo:
        raise HTTPException(status_code=404, detail="Work Order non trouvé")
    wo["statut"] = statut.upper()
    return wo

@router.get("/zones")
def list_zones(type_zone: Optional[str] = None):
    results = _zones[:]
    if type_zone:
        results = [z for z in results if z["type_zone"].upper() == type_zone.upper()]
    return {"total": len(results), "zones": results}

@router.get("/gate")
def gate_control():
    """Contrôle porte/barrière d'accès du parc"""
    return {
        "acces_actifs": 3,
        "derniers_passages": [
            {"vehicule": "DLA-TRK-001", "direction": "SORTIE", "heure": "08:42", "chauffeur": "Jean-Marc MVONDO"},
            {"vehicule": "DLA-UTL-003", "direction": "ENTREE", "heure": "09:15", "chauffeur": "Paul KAMGA"},
            {"vehicule": "DLA-TRK-002", "direction": "ENTREE", "heure": "09:58", "chauffeur": "Martin EBANG"},
        ],
        "barriere_statut": "OPERATIONNELLE"
    }

@router.get("/yard-map")
def yard_map():
    """Carte du parc / yard avec positions véhicules"""
    return {
        "zones": _zones,
        "vehicules_positions": [
            {**v, "position_x": 100 + v["id"] * 50, "position_y": 80 + v["id"] * 30}
            for v in _vehicules
        ]
    }
