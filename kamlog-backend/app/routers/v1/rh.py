from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Response
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr

router = APIRouter(prefix="", tags=["Ressources Humaines"])

class EmployeCreate(BaseModel):
    matricule: str
    nom: str
    prenom: str
    email: EmailStr
    telephone: Optional[str] = "+237 699 00 11 22"
    poste: str
    departement: str
    date_embauche: Optional[str] = "2024-01-15"
    type_contrat: Optional[str] = "CDI" # CDI, CDD, Stage, Prestation
    salaire_base_xaf: Optional[float] = 450000.0
    statut: Optional[str] = "ACTIF"

class CongeCreate(BaseModel):
    employe_id: int
    type_conge: str # ANNUEL, MALADIE, MATERNITE, EXCEPTIONNEL
    date_debut: str
    date_fin: str
    motif: Optional[str] = None

class PaieCreate(BaseModel):
    employe_id: int
    periode: str # Ex: 2026-07
    salaire_base_xaf: float
    primes_xaf: Optional[float] = 0.0
    cotisations_cnps_xaf: Optional[float] = 0.0

# Initial Seed Data for Employees (Cameroonian Port Logistics Staff)
_employes = [
    {
        "id": 1,
        "matricule": "EMP-2024-001",
        "nom": "MVONDO",
        "prenom": "Jean-Marc",
        "email": "mvondo@evo-log.cm",
        "telephone": "+237 677 12 34 56",
        "poste": "Responsable Operations Portuaires",
        "departement": "ACCONAGE",
        "date_embauche": "2022-03-01",
        "type_contrat": "CDI",
        "salaire_base_xaf": 850000.0,
        "statut": "ACTIF"
    },
    {
        "id": 2,
        "matricule": "EMP-2024-002",
        "nom": "NGUEMA",
        "prenom": "Paul",
        "email": "nguema@evo-log.cm",
        "telephone": "+237 699 88 77 66",
        "poste": "Chauffeur Poids Lourds Senior",
        "departement": "TRANSPORT",
        "date_embauche": "2023-01-10",
        "type_contrat": "CDI",
        "salaire_base_xaf": 420000.0,
        "statut": "ACTIF"
    },
    {
        "id": 3,
        "matricule": "EMP-2024-003",
        "nom": "EBANG",
        "prenom": "Clarisse",
        "email": "ebang@evo-log.cm",
        "telephone": "+237 655 44 33 22",
        "poste": "Chef de Magasin WMS",
        "departement": "LOGISTIQUE",
        "date_embauche": "2023-06-15",
        "type_contrat": "CDI",
        "salaire_base_xaf": 650000.0,
        "statut": "ACTIF"
    },
    {
        "id": 4,
        "matricule": "EMP-2024-004",
        "nom": "KAMGA",
        "prenom": "Alain",
        "email": "kamga@evo-log.cm",
        "telephone": "+237 670 99 88 11",
        "poste": "Déclarant en Douane Agrée",
        "departement": "TRANSIT",
        "date_embauche": "2021-11-01",
        "type_contrat": "CDI",
        "salaire_base_xaf": 780000.0,
        "statut": "ACTIF"
    }
]

_conges = [
    {
        "id": 1,
        "employe_id": 1,
        "type_conge": "ANNUEL",
        "date_debut": "2026-08-01",
        "date_fin": "2026-08-15",
        "motif": "Congé annuel légal",
        "statut": "APPROUVE"
    }
]

_paies = [
    {
        "id": 1,
        "employe_id": 1,
        "periode": "2026-06",
        "salaire_base_xaf": 850000.0,
        "primes_xaf": 150000.0,
        "cotisations_cnps_xaf": 35000.0,
        "net_a_payer": 965000.0,
        "created_at": datetime.utcnow().isoformat()
    }
]

@router.get("/employes")
@router.get("/employes/")
def list_employes():
    return {"items": _employes, "total": len(_employes)}

@router.post("/employes")
def create_employe(payload: EmployeCreate):
    new_id = len(_employes) + 1
    item = {
        "id": new_id,
        **payload.dict(),
    }
    _employes.append(item)
    return item

@router.post("/employes/import-excel")
async def import_employes_excel(file: UploadFile = File(...)):
    """Importe une liste d'employés depuis un fichier CSV ou Excel."""
    try:
        content = await file.read()
        lines = content.decode("utf-8", errors="ignore").splitlines()
        imported_count = 0
        for line in lines[1:]: # Skip header
            parts = line.split(",") if "," in line else line.split(";")
            if len(parts) >= 4:
                new_item = {
                    "id": len(_employes) + 1,
                    "matricule": f"EMP-IMP-00{len(_employes)+1}",
                    "nom": parts[0].strip(),
                    "prenom": parts[1].strip() if len(parts) > 1 else "",
                    "email": parts[2].strip() if len(parts) > 2 else f"emp{len(_employes)+1}@evo-log.cm",
                    "telephone": "+237 600 00 00 00",
                    "poste": parts[3].strip() if len(parts) > 3 else "Agent Logistique",
                    "departement": "LOGISTIQUE",
                    "date_embauche": datetime.utcnow().strftime("%Y-%m-%d"),
                    "type_contrat": "CDI",
                    "salaire_base_xaf": 350000.0,
                    "statut": "ACTIF"
                }
                _employes.append(new_item)
                imported_count += 1
        return {"status": "success", "imported_count": imported_count, "total_employes": len(_employes)}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erreur d'importation : {str(e)}")

@router.get("/employes/export-excel")
def export_employes_csv():
    """Génère et télécharge le fichier CSV/Excel de la liste des employés EVO-LOG."""
    header = "Matricule;Nom;Prénom;Email;Téléphone;Poste;Département;Date Embauche;Type Contrat;Salaire Base (XAF);Statut\n"
    rows = [
        f"{e['matricule']};{e['nom']};{e['prenom']};{e['email']};{e['telephone']};{e['poste']};{e['departement']};{e['date_embauche']};{e['type_contrat']};{e['salaire_base_xaf']};{e['statut']}"
        for e in _employes
    ]
    csv_data = header + "\n".join(rows)
    return Response(content=csv_data, media_type="text/csv", headers={"Content-Disposition": "attachment; filename=employes_EVO-LOG.csv"})

@router.get("/conges")
def list_conges():
    return {"items": _conges, "total": len(_conges)}

@router.post("/conges")
def create_conge(payload: CongeCreate):
    item = {
        "id": len(_conges) + 1,
        **payload.dict(),
        "statut": "EN_ATTENTE"
    }
    _conges.append(item)
    return item

@router.put("/conges/{conge_id}")
def update_conge_statut(conge_id: int, statut: str):
    for c in _conges:
        if c["id"] == conge_id:
            c["statut"] = statut
            return c
    raise HTTPException(status_code=404, detail="Congé introuvable")

@router.get("/paie")
def list_paie():
    return {"items": _paies, "total": len(_paies)}

@router.post("/paie")
def create_paie(payload: PaieCreate):
    net = payload.salaire_base_xaf + (payload.primes_xaf or 0.0) - (payload.cotisations_cnps_xaf or 0.0)
    item = {
        "id": len(_paies) + 1,
        **payload.dict(),
        "net_a_payer": net,
        "created_at": datetime.utcnow().isoformat()
    }
    _paies.append(item)
    return item
