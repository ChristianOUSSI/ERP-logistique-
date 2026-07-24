from fastapi import APIRouter, HTTPException
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel

router = APIRouter(prefix="", tags=["Finance"])

_invoices = [
    {
        "id": 1,
        "numero_facture": "FAC-2026-0881",
        "mission_ref": "MIS-2026-000",
        "client": "SABC CAMEROUN",
        "montant_ht_xaf": 12500000.0,
        "tva_xaf": 2406250.0,
        "montant_ttc_xaf": 14906250.0,
        "statut": "PAYE",
        "date_emission": datetime.utcnow().isoformat()
    },
    {
        "id": 2,
        "numero_facture": "FAC-2026-0882",
        "mission_ref": "MIS-2026-001",
        "client": "TOTALENERGIES LOGISTICS",
        "montant_ht_xaf": 8400000.0,
        "tva_xaf": 1617000.0,
        "montant_ttc_xaf": 10017000.0,
        "statut": "PARTIEL",
        "date_emission": datetime.utcnow().isoformat()
    }
]

def create_automatic_invoice_from_mission(mission_ref: str, client: str, montant_ht: float) -> dict:
    """Générateur automatique de facture d'après ePOD (19.25% TVA CEMAC)"""
    new_id = len(_invoices) + 1
    numero = f"FAC-2026-AUTO-{new_id:04d}"
    tva = round(montant_ht * 0.1925, 2)
    ttc = round(montant_ht + tva, 2)

    invoice = {
        "id": new_id,
        "numero_facture": numero,
        "mission_ref": mission_ref,
        "client": client,
        "montant_ht_xaf": montant_ht,
        "tva_xaf": tva,
        "montant_ttc_xaf": ttc,
        "statut": "BROUILLON_AUTOMATIQUE",
        "date_emission": datetime.utcnow().isoformat(),
        "source": "E_POD_TRANSPORT_AUTOMATION"
    }
    _invoices.append(invoice)
    return invoice

@router.get("")
@router.get("/")
@router.get("/invoices")
def list_invoices():
    return {"items": _invoices, "total": len(_invoices)}

@router.post("/invoices/generate-from-mission")
def generate_invoice_manual(mission_ref: str, client: str, montant_ht: float):
    inv = create_automatic_invoice_from_mission(mission_ref, client, montant_ht)
    return {"message": "Facture générée avec succès", "invoice": inv}

@router.get("/kpis")
def get_finance_kpis():
    return {
        "chiffre_affaires_mois_xaf": sum(i["montant_ttc_xaf"] for i in _invoices),
        "encaissements_valides_xaf": sum(i["montant_ttc_xaf"] for i in _invoices if i["statut"] == "PAYE"),
        "factures_brouillon_auto": len([i for i in _invoices if i["statut"] == "BROUILLON_AUTOMATIQUE"]),
        "marge_brute_globale_pct": 26.8
    }
