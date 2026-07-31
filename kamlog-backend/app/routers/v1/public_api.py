from fastapi import APIRouter, HTTPException, Query
from typing import Optional

router = APIRouter(tags=["Public API"])

@router.get("/tracking/{reference}")
def public_tracking(reference: str):
    """Endpoint public de tracking expéditions (sans authentification)"""
    # Simulation tracking
    demo_data = {
        "OT-2026-00401": {
            "reference": "OT-2026-00401",
            "statut": "EN_LIVRAISON",
            "origine": "Port de Douala",
            "destination": "N'Djamena (Tchad)",
            "chauffeur": "Jean-Marc MVONDO",
            "vehicule": "DLA-TRK-001",
            "derniere_position": {"lat": 7.353, "lng": 13.578, "ville": "Ngaoundéré"},
            "progression_pct": 68,
            "heure_estimee_arrivee": "2026-08-16T14:00:00",
        }
    }
    if reference in demo_data:
        return demo_data[reference]
    return {
        "reference": reference,
        "statut": "INFORMATION_INDISPONIBLE",
        "message": "Aucune donnée de tracking disponible pour cette référence"
    }

@router.get("/status")
def public_status():
    """Status public de l'API EVO-LOG"""
    return {
        "service": "EVO-LOG ERP API",
        "status": "operational",
        "version": "1.0.0",
        "uptime": "99.9%",
        "region": "Douala, Cameroun",
        "modules_actifs": ["transport", "magasin", "finance", "rh", "transit", "qhse", "maintenance"],
    }

@router.get("/cotation-publique")
def public_cotation(
    origine: Optional[str] = "Douala",
    destination: Optional[str] = "N'Djamena",
    type_conteneur: Optional[str] = "40HC",
    poids_tonnes: Optional[float] = 25
):
    """Simulateur de cotation fret public"""
    tarif_base = 2500000  # XAF
    if "tchad" in destination.lower() or "ndjaména" in destination.lower():
        tarif_base = 4800000
    elif "gabon" in destination.lower() or "libreville" in destination.lower():
        tarif_base = 3200000
    elif "congo" in destination.lower():
        tarif_base = 2800000
    
    if type_conteneur == "40HC":
        tarif_base *= 1.15
    elif type_conteneur == "20DRY":
        tarif_base *= 0.7
    
    return {
        "simulation": True,
        "origine": origine,
        "destination": destination,
        "type_conteneur": type_conteneur,
        "poids_tonnes": poids_tonnes,
        "tarif_estime_xaf": round(tarif_base),
        "tarif_estime_eur": round(tarif_base / 655.957),
        "devise": "XAF",
        "delai_estime_jours": 4 if "tchad" in destination.lower() else 3,
        "note": "Tarif indicatif. Contactez-nous pour un devis définitif.",
    }
