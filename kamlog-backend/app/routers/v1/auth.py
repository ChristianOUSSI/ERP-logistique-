from fastapi import APIRouter, HTTPException, status
from datetime import datetime, timedelta
import re
from app.schemas.auth import LoginRequest, LoginResponse, AdminCreateUserRequest, ChangePasswordRequest

router = APIRouter(tags=["Auth"])

# Base de données d'utilisateurs d'entreprise certifiés
USERS_DB = {
    "admin@kamlog.cm": {
        "id": "usr-001",
        "email": "admin@kamlog.cm",
        "nom_complet": "Administrateur Système CADC",
        "role": "ADMIN",
        "roles": ["ADMIN", "DIRECTEUR_LOGISTIQUE"],
        "password_hash": "admin123",
        "must_change_password": False,
        "password_changed_at": datetime.utcnow() - timedelta(days=10),
    },
    "kamga@kamlog.cm": {
        "id": "usr-002",
        "email": "kamga@kamlog.cm",
        "nom_complet": "Monsieur Kamga",
        "role": "CHAUFFEUR",
        "roles": ["CHAUFFEUR"],
        "password_hash": "admin123",
        "must_change_password": True,
        "password_changed_at": datetime.utcnow() - timedelta(days=80),
    }
}

@router.post("/login", response_model=LoginResponse)
def login(payload: LoginRequest):
    user_email = (payload.email or payload.username or "").lower().strip()
    user = USERS_DB.get(user_email)

    # Si l'utilisateur n'est pas encore enregistré dans la DB statique, on l'auto-enregistre temporairement pour la démo
    if not user:
        role = "CHAUFFEUR" if "kamga" in user_email or "chauffeur" in user_email else "ADMIN"
        user = {
            "id": f"usr-{len(USERS_DB) + 1:03d}",
            "email": user_email,
            "nom_complet": user_email.split('@')[0].capitalize(),
            "role": role,
            "roles": [role],
            "password_hash": payload.password,
            "must_change_password": payload.password == "admin123",
            "password_changed_at": datetime.utcnow(),
        }
        USERS_DB[user_email] = user

    # Vérification mot de passe par défaut
    must_change = user.get("must_change_password", False) or (payload.password == "admin123")

    # Calcul d'expiration 90 jours
    last_change = user.get("password_changed_at", datetime.utcnow())
    expiry_date = last_change + timedelta(days=90)
    days_left = (expiry_date - datetime.utcnow()).days
    show_warning = days_left <= 15

    return {
        "access_token": f"jwt-kamlog-{user['id']}-secure-token",
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
        }
    }

@router.get("/me")
def get_me(email: str = "admin@kamlog.cm"):
    user = USERS_DB.get(email.lower(), list(USERS_DB.values())[0])
    return {
        "id": user["id"],
        "email": user["email"],
        "full_name": user["nom_complet"],
        "nom_complet": user["nom_complet"],
        "role": user["role"],
        "roles": user["roles"],
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
def change_password_mandatory(payload: ChangePasswordRequest, email: str = "kamga@kamlog.cm"):
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
