from fastapi import APIRouter, HTTPException, status
from typing import List, Optional
from datetime import datetime
from app.schemas.auth import AdminCreateUserRequest
from app.routers.v1.auth import USERS_DB, ALL_MODULES

router = APIRouter(tags=["Admin"])

@router.get("/users")
def get_users():
    """Récupère la liste de tous les utilisateurs enregistrés dans le système."""
    return list(USERS_DB.values())

@router.post("/users")
def create_user(payload: AdminCreateUserRequest):
    """Permet à l'Administrateur de créer un nouvel utilisateur avec attribution explicite des modules_allowed."""
    email_clean = payload.email.lower().strip()
    if email_clean in USERS_DB:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Un utilisateur avec l'email {email_clean} existe déjà."
        )

    modules = payload.modules_allowed if payload.modules_allowed is not None else []
    if payload.role.upper() == "ADMIN" and not modules:
        modules = ALL_MODULES

    new_user = {
        "id": f"usr-{len(USERS_DB) + 1:03d}",
        "email": email_clean,
        "nom_complet": payload.nom_complet,
        "role": payload.role.upper(),
        "roles": payload.roles or [payload.role.upper()],
        "modules_allowed": modules,
        "departement": payload.departement or "LOGISTIQUE",
        "telephone": payload.telephone or "+237 600 00 00 00",
        "password_hash": "admin123",
        "must_change_password": True,
        "is_active": True,
        "password_changed_at": datetime.utcnow(),
    }
    USERS_DB[email_clean] = new_user

    return {
        "message": f"Compte créé avec succès pour {payload.nom_complet}.",
        "user": new_user,
        "default_password": "admin123"
    }

@router.get("/roles")
def get_roles():
    """Récupère la matrice des rôles et des accès aux modules."""
    return [
        {"id": "ADMIN", "name": "Administrateur Système", "modules": ALL_MODULES, "count": 1},
        {"id": "MAGASINIER", "name": "Chef Magasinier MAG3", "modules": ["magasin", "master-data"], "count": 1},
        {"id": "CHAUFFEUR", "name": "Chauffeur Routier Port", "modules": ["transport", "tracking", "fuel-guard"], "count": 1},
        {"id": "QHSE", "name": "Inspecteur QHSE Port", "modules": ["qhse", "compliance"], "count": 1},
        {"id": "FINANCE", "name": "Responsable Financier ERP", "modules": ["finance", "cotations", "procurement"], "count": 1},
        {"id": "DOUANE", "name": "Déclarant en Douane & Transit", "modules": ["transit", "master-data", "acconage"], "count": 1},
        {"id": "PARC", "name": "Gestionnaire Parc & Flotte", "modules": ["parc", "transport", "maintenance", "fuel-guard"], "count": 1},
        {"id": "AUDITOR", "name": "Auditeur Interne ERP", "modules": ["audit", "compliance", "bi"], "count": 1},
    ]

@router.get("/audit-logs")
def get_audit_logs():
    """Consulter les traces d'audit d'accès et d'administration."""
    return [
        {"id": "LOG-109", "action": "Création Compte Utilisateur", "user": "admin@kamlog.cm", "target": "kamga@kamlog.cm", "timestamp": "22/07/2026 01:15", "status": "SUCCESS"},
        {"id": "LOG-108", "action": "Changement Obligatoire Mot de Passe", "user": "kamga@kamlog.cm", "target": "kamga@kamlog.cm", "timestamp": "22/07/2026 01:05", "status": "SUCCESS"},
        {"id": "LOG-107", "action": "Connexion Réussie (NextAuth)", "user": "admin@kamlog.cm", "target": "Système ERP", "timestamp": "22/07/2026 00:45", "status": "SUCCESS"},
        {"id": "LOG-106", "action": "Modification Matrice RBAC", "user": "admin@kamlog.cm", "target": "Rôle MAGASINIER", "timestamp": "21/07/2026 23:30", "status": "SUCCESS"},
    ]
