from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    must_change_password: bool = False
    password_expiry_days: int = 90
    days_until_expiry: int = 90
    show_expiry_warning: bool = False
    expiry_date: Optional[str] = None
    user: dict

class AdminCreateUserRequest(BaseModel):
    email: EmailStr
    nom_complet: str
    role: str = Field(..., description="Role principal (ex: CHAUFFEUR, ADMIN, RESPONSABLE_LOGISTIQUE)")
    roles: Optional[List[str]] = Field(default=["CHAUFFEUR"], description="Liste des roles rattachés")
    telephone: Optional[str] = None
    departement: Optional[str] = "LOGISTIQUE"

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=8, description="Mot de passe fort (minimum 8 caracteres)")
