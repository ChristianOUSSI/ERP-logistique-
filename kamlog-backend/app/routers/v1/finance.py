from fastapi import APIRouter
from datetime import datetime

router = APIRouter(prefix="", tags=["Finance"])

_invoices = [
    {
        "id": 1,
        "numero_facture": "FAC-2026-0881",
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
        "client": "TOTALENERGIES LOGISTICS",
        "montant_ht_xaf": 8400000.0,
        "tva_xaf": 1617000.0,
        "montant_ttc_xaf": 10017000.0,
        "statut": "PARTIEL",
        "date_emission": datetime.utcnow().isoformat()
    }
]

@router.get("")
@router.get("/")
@router.get("/invoices")
def list_invoices():
    return {"items": _invoices, "total": len(_invoices)}

@router.get("/kpis")
def get_finance_kpis():
    return {
        "chiffre_affaires_mois_xaf": 142500000.0,
        "encaissements_valides_xaf": 124000000.0,
        "creances_en_souffrance_xaf": 18500000.0,
        "marge_brute_globale_pct": 24.5
    }
