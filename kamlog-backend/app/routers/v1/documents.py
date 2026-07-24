from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(tags=["Documents Logistiques"])

class DocumentCreate(BaseModel):
    titre: str
    type_document: str  # BL, CMR, AWB, FACTURE, MANIFESTE, CERTIFICAT, CONTRAT, QUITTANCE
    module_source: Optional[str] = "TRANSPORT"  # TRANSPORT, MAGASIN, TRANSIT, FINANCE, QHSE
    reference_dossier: Optional[str] = None
    client_nom: Optional[str] = None
    taille_kb: Optional[int] = None
    format_fichier: Optional[str] = "PDF"

_documents = [
    {"id": 1, "reference": "DOC-2026-001", "titre": "Bill of Lading MSC GIOVANNA", "type_document": "BL", "module_source": "TRANSPORT", "reference_dossier": "MAN-2026-0441", "client_nom": "CFAO LOGISTICS CAMEROUN", "taille_kb": 284, "format_fichier": "PDF", "url_stockage": None, "statut": "VALIDE", "created_at": datetime.utcnow().isoformat()},
    {"id": 2, "reference": "DOC-2026-002", "titre": "CMR Transport Douala-N'Djamena", "type_document": "CMR", "module_source": "TRANSPORT", "reference_dossier": "OT-2026-00401", "client_nom": "MAERSK CAMEROUN", "taille_kb": 156, "format_fichier": "PDF", "url_stockage": None, "statut": "VALIDE", "created_at": datetime.utcnow().isoformat()},
    {"id": 3, "reference": "DOC-2026-003", "titre": "Certificat d'Inspection QHSE Quai 3", "type_document": "CERTIFICAT", "module_source": "QHSE", "reference_dossier": "QHSE-2026-012", "client_nom": None, "taille_kb": 420, "format_fichier": "PDF", "url_stockage": None, "statut": "EN_COURS_SIGNATURE", "created_at": datetime.utcnow().isoformat()},
    {"id": 4, "reference": "DOC-2026-004", "titre": "Déclaration en Douane – CEMAC-2026-089", "type_document": "MANIFESTE", "module_source": "TRANSIT", "reference_dossier": "CEMAC-2026-089", "client_nom": "CFAO LOGISTICS CAMEROUN", "taille_kb": 312, "format_fichier": "PDF", "url_stockage": None, "statut": "VALIDE", "created_at": datetime.utcnow().isoformat()},
    {"id": 5, "reference": "DOC-2026-005", "titre": "Bon d'Enlèvement BL-2026-0441", "type_document": "BL", "module_source": "MAGASIN", "reference_dossier": "BL-2026-0441", "client_nom": "CFAO LOGISTICS CAMEROUN", "taille_kb": 198, "format_fichier": "PDF", "url_stockage": None, "statut": "VALIDE", "created_at": datetime.utcnow().isoformat()},
]

_next_id = 6

@router.get("/")
def list_documents(
    type_document: Optional[str] = None,
    module_source: Optional[str] = None,
    statut: Optional[str] = None,
    search: Optional[str] = None,
    skip: int = 0, limit: int = 50
):
    results = _documents[:]
    if type_document:
        results = [d for d in results if d["type_document"].upper() == type_document.upper()]
    if module_source:
        results = [d for d in results if d["module_source"].upper() == module_source.upper()]
    if statut:
        results = [d for d in results if d["statut"].upper() == statut.upper()]
    if search:
        results = [d for d in results if search.upper() in d["titre"].upper() or search.upper() in (d.get("reference_dossier") or "").upper()]
    return {"total": len(results), "documents": results[skip:skip+limit]}

@router.get("/{doc_id}")
def get_document(doc_id: int):
    d = next((d for d in _documents if d["id"] == doc_id), None)
    if not d:
        raise HTTPException(status_code=404, detail="Document non trouvé")
    return d

@router.post("/")
def create_document(data: DocumentCreate):
    global _next_id
    ref = f"DOC-{datetime.now().year}-{_next_id:03d}"
    doc = {**data.dict(), "id": _next_id, "reference": ref, "url_stockage": None, "statut": "BROUILLON", "created_at": datetime.utcnow().isoformat()}
    _documents.append(doc)
    _next_id += 1
    return doc

@router.patch("/{doc_id}/valider")
def valider_document(doc_id: int):
    d = next((d for d in _documents if d["id"] == doc_id), None)
    if not d:
        raise HTTPException(status_code=404, detail="Document non trouvé")
    d["statut"] = "VALIDE"
    return d

@router.get("/types")
def list_types_documents():
    return {"types": ["BL", "CMR", "AWB", "FACTURE", "MANIFESTE", "CERTIFICAT", "CONTRAT", "QUITTANCE", "DECLARATION_DOUANE"]}
