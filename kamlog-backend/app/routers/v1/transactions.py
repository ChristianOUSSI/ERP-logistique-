from fastapi import APIRouter
from datetime import datetime

router = APIRouter(tags=["Transactions"])

@router.get("")
@router.get("/")
@router.get("/transactions")
@router.get("/magasin/transactions")
def list_transactions():
    return {
        "items": [
            {"id": "TRX-2026-001", "type": "ENTREE", "article": "Ciment ZLECAF", "quantite": 400, "date": datetime.utcnow().isoformat()},
            {"id": "TRX-2026-002", "type": "SORTIE", "article": "Huile Moteur 15W40", "quantite": 20, "date": datetime.utcnow().isoformat()}
        ],
        "total": 2
    }
