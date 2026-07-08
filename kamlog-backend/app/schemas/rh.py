from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import date, datetime

class EmployeBase(BaseModel):
    matricule: str
    nom: str
    prenom: str
    email: Optional[EmailStr] = None
    telephone: Optional[str] = None
    departement: Optional[str] = None
    poste: Optional[str] = None
    date_embauche: date
    statut: Optional[str] = "ACTIF"

class EmployeCreate(EmployeBase):
    pass

class EmployeUpdate(BaseModel):
    nom: Optional[str] = None
    prenom: Optional[str] = None
    email: Optional[EmailStr] = None
    telephone: Optional[str] = None
    departement: Optional[str] = None
    poste: Optional[str] = None
    statut: Optional[str] = None

class EmployeResponse(EmployeBase):
    id: int
    user_id: Optional[int] = None
    class Config:
        from_attributes = True

class CongeBase(BaseModel):
    type_conge: str
    date_debut: date
    date_fin: date
    motif: Optional[str] = None

class CongeCreate(CongeBase):
    employe_id: int

class CongeUpdate(BaseModel):
    statut: str

class CongeResponse(CongeBase):
    id: int
    employe_id: int
    statut: str
    class Config:
        from_attributes = True

class FichePaieBase(BaseModel):
    periode: str
    salaire_base: float
    primes: float = 0
    deductions: float = 0
    net_a_payer: float

class FichePaieCreate(FichePaieBase):
    employe_id: int

class FichePaieResponse(FichePaieBase):
    id: int
    employe_id: int
    date_generation: datetime
    statut: str
    class Config:
        from_attributes = True
