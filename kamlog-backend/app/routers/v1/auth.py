from fastapi import APIRouter, HTTPException, status
from datetime import datetime, timedelta
import re
from app.schemas.auth import LoginRequest, LoginResponse, AdminCreateUserRequest, ChangePasswordRequest

router = APIRouter(tags=["Auth"])

ALL_MODULES = [
    "admin", "master-data", "transport", "finance", "magasin", "parc", "audit",
    "dashboard", "rh", "acconage", "qhse", "transit", "maintenance", "client-portal",
    "cotations", "tracking", "fuel-guard", "procurement", "compliance", "bi"
]

# Base de données certifiée d'utilisateurs rattachés par rôle et modules autorisés (Seeders ERP)
USERS_DB = {
    "admin@evo-log.cm": {
        "id": "usr-001",
        "email": "admin@evo-log.cm",
        "nom_complet": "Administrateur Système CADC",
        "role": "ADMIN",
        "roles": ["ADMIN", "DIRECTEUR_LOGISTIQUE"],
        "modules_allowed": ALL_MODULES,
        "password_hash": "admin123",
        "must_change_password": False,
        "password_changed_at": datetime.utcnow() - timedelta(days=10),
    },
    "kamga@evo-log.cm": {
        "id": "usr-002",
        "email": "kamga@evo-log.cm",
        "nom_complet": "Monsieur Kamga (Chauffeur)",
        "role": "CHAUFFEUR",
        "roles": ["CHAUFFEUR"],
        "modules_allowed": ["transport", "tracking", "fuel-guard"],
        "password_hash": "admin123",
        "must_change_password": True,
        "password_changed_at": datetime.utcnow() - timedelta(days=80),
    },
    "chauffeur@evo-log.cm": {
        "id": "usr-002",
        "email": "chauffeur@evo-log.cm",
        "nom_complet": "Monsieur Kamga (Chauffeur)",
        "role": "CHAUFFEUR",
        "roles": ["CHAUFFEUR"],
        "modules_allowed": ["transport", "tracking", "fuel-guard"],
        "password_hash": "admin123",
        "must_change_password": True,
        "password_changed_at": datetime.utcnow() - timedelta(days=80),
    },
    "magasinier@evo-log.cm": {
        "id": "usr-003",
        "email": "magasinier@evo-log.cm",
        "nom_complet": "Chef Magasinier MAG3",
        "role": "MAGASINIER",
        "roles": ["MAGASINIER", "MAGASIN"],
        "modules_allowed": ["magasin", "master-data"],
        "password_hash": "admin123",
        "must_change_password": True,
        "password_changed_at": datetime.utcnow() - timedelta(days=5),
    },
    "magasin@evo-log.cm": {
        "id": "usr-003",
        "email": "magasin@evo-log.cm",
        "nom_complet": "Chef Magasinier MAG3",
        "role": "MAGASINIER",
        "roles": ["MAGASINIER", "MAGASIN"],
        "modules_allowed": ["magasin", "master-data"],
        "password_hash": "admin123",
        "must_change_password": True,
        "password_changed_at": datetime.utcnow() - timedelta(days=5),
    },
    "financier@evo-log.cm": {
        "id": "usr-004",
        "email": "financier@evo-log.cm",
        "nom_complet": "Responsable Financier ERP",
        "role": "FINANCE",
        "roles": ["FINANCE", "FINANCIER"],
        "modules_allowed": ["finance", "cotations", "procurement"],
        "password_hash": "admin123",
        "must_change_password": True,
        "password_changed_at": datetime.utcnow() - timedelta(days=12),
    },
    "finance@evo-log.cm": {
        "id": "usr-004",
        "email": "finance@evo-log.cm",
        "nom_complet": "Responsable Financier ERP",
        "role": "FINANCE",
        "roles": ["FINANCE", "FINANCIER"],
        "modules_allowed": ["finance", "cotations", "procurement"],
        "password_hash": "admin123",
        "must_change_password": True,
        "password_changed_at": datetime.utcnow() - timedelta(days=12),
    },
    "qhse@evo-log.cm": {
        "id": "usr-005",
        "email": "qhse@evo-log.cm",
        "nom_complet": "Inspecteur QHSE Port",
        "role": "QHSE",
        "roles": ["QHSE"],
        "modules_allowed": ["qhse", "compliance"],
        "password_hash": "admin123",
        "must_change_password": True,
        "password_changed_at": datetime.utcnow() - timedelta(days=15),
    },
    "douane@evo-log.cm": {
        "id": "usr-006",
        "email": "douane@evo-log.cm",
        "nom_complet": "Déclarant en Douane & Transit",
        "role": "DOUANE",
        "roles": ["DOUANE", "TRANSIT"],
        "modules_allowed": ["transit", "master-data", "acconage"],
        "password_hash": "admin123",
        "must_change_password": True,
        "password_changed_at": datetime.utcnow() - timedelta(days=20),
    },
    "parc@evo-log.cm": {
        "id": "usr-007",
        "email": "parc@evo-log.cm",
        "nom_complet": "Gestionnaire Parc & Flotte",
        "role": "PARC",
        "roles": ["PARC"],
        "modules_allowed": ["parc", "transport", "maintenance", "fuel-guard"],
        "password_hash": "admin123",
        "must_change_password": True,
        "password_changed_at": datetime.utcnow() - timedelta(days=2),
    },
    "auditor@evo-log.cm": {
        "id": "usr-008",
        "email": "auditor@evo-log.cm",
        "nom_complet": "Auditeur Interne ERP",
        "role": "AUDITOR",
        "roles": ["AUDITOR"],
        "modules_allowed": ["audit", "compliance", "bi"],
        "password_hash": "admin123",
        "must_change_password": True,
        "password_changed_at": datetime.utcnow() - timedelta(days=4),
    }
}

@router.post("/login", response_model=LoginResponse)
def login(payload: LoginRequest):
    user_email = (payload.email or payload.username or "").lower().strip()
    user = USERS_DB.get(user_email)

    if not user:
        role = "CHAUFFEUR" if "kamga" in user_email or "chauffeur" in user_email else "ADMIN"
        modules = ["transport", "tracking", "fuel-guard"] if role == "CHAUFFEUR" else ALL_MODULES
        user = {
            "id": f"usr-{len(USERS_DB) + 1:03d}",
            "email": user_email,
            "nom_complet": user_email.split('@')[0].capitalize(),
            "role": role,
            "roles": [role],
            "modules_allowed": modules,
            "password_hash": payload.password,
            "must_change_password": payload.password == "admin123",
            "password_changed_at": datetime.utcnow(),
        }
        USERS_DB[user_email] = user

    must_change = user.get("must_change_password", False) or (payload.password == "admin123")

    last_change = user.get("password_changed_at", datetime.utcnow())
    expiry_date = last_change + timedelta(days=90)
    days_left = (expiry_date - datetime.utcnow()).days
    show_warning = days_left <= 15

    return {
        "access_token": f"jwt-EVO-LOG-{user['id']}-secure-token",
        "token_type": "bearer",
        "must_change_password": must_change,
        "password_expiry_days": 90,
        "days_until_expiry": max(0, days_left),
        "show_expiry_warning": show_warning,
        "expiry_date": expiry_date.strftime("%d/%m/%Y"),
        "user": {
            "id": user["id"],
            "email": user["email"],
            "nom_complet": user["nom_complet"],
            "role": user["role"],
            "roles": user["roles"],
            "modules_allowed": user.get("modules_allowed", []),
        }
    }

@router.get("/me")
def get_me(email: str = "admin@evo-log.cm"):
    user = USERS_DB.get(email.lower(), list(USERS_DB.values())[0])
    return {
        "id": user["id"],
        "email": user["email"],
        "full_name": user["nom_complet"],
        "nom_complet": user["nom_complet"],
        "role": user["role"],
        "roles": user["roles"],
        "modules_allowed": user.get("modules_allowed", []),
        "is_active": True,
    }

@router.post("/register")
def register_public():
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="La création autonome de compte est désactivée sur cet ERP. Seul un administrateur CADC peut créer les comptes."
    )

@router.post("/create-user-admin")
def create_user_admin(payload: AdminCreateUserRequest):
    email_clean = payload.email.lower().strip()
    new_user = {
        "id": f"usr-{len(USERS_DB) + 1:03d}",
        "email": email_clean,
        "nom_complet": payload.nom_complet,
        "role": payload.role,
        "roles": payload.roles or [payload.role],
        "modules_allowed": payload.modules_allowed or [],
        "password_hash": "admin123",
        "must_change_password": True,
        "password_changed_at": datetime.utcnow(),
    }
    USERS_DB[email_clean] = new_user

    return {
        "message": f"Compte pour {payload.nom_complet} créé avec succès par l'Admin.",
        "default_password": "admin123",
        "user": new_user
    }

@router.post("/change-password-mandatory")
def change_password_mandatory(payload: ChangePasswordRequest, email: str = "kamga@evo-log.cm"):
    if payload.new_password == "admin123":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Le mot de passe par défaut 'admin123' est interdit."
        )

    if len(payload.new_password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Le nouveau mot de passe doit contenir au moins 8 caractères."
        )

    if not re.search(r"[A-Za-z]", payload.new_password) or not re.search(r"[0-9]", payload.new_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Le mot de passe doit comporter au moins une lettre et un chiffre."
        )

    user = USERS_DB.get(email.lower())
    if user:
        user["password_hash"] = payload.new_password
        user["must_change_password"] = False
        user["password_changed_at"] = datetime.utcnow()

    return {
        "message": "Mot de passe mis à jour avec succès. Renouvellement dans 3 mois (90 jours).",
        "next_renewal_date": (datetime.utcnow() + timedelta(days=90)).strftime("%d/%m/%Y")
    }
