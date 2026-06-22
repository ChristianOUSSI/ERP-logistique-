# app/utils/rbac.py - Middleware RBAC KAMLOG (UNIFIÉ)
from functools import wraps
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.user import Role, User
from app.database import get_db
from app.config import settings

security = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """Récupère l'utilisateur actuel à partir du token JWT."""
    try:
        token = credentials.credentials
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        user_id: int = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token invalide"
            )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token invalide"
        )
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Utilisateur non trouvé"
        )
    
    return user


def require_role(allowed_roles: list[Role]):
    """Décorateur pour vérifier les rôles autorisés."""
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, current_user, **kwargs):
            if current_user.role not in allowed_roles:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Role {current_user.role} not authorized. Required: {allowed_roles}"
                )
            return await func(*args, current_user=current_user, **kwargs)
        return wrapper
    return decorator


def require_permission(permission: str):
    """Décorateur pour vérifier les permissions granulaires (UNIFIÉ)."""
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, current_user: User = Depends(get_current_user), **kwargs):
            if not current_user:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Authentication required"
                )
            
            # Les admins ont toutes les permissions
            if current_user.role == Role.ADMIN:
                return await func(*args, current_user=current_user, **kwargs)
            
            # Vérification basée sur le rôle et la permission
            module, action = permission.split(":")
            
            # Mapping des permissions par rôle (SOURCE DE VÉRITÉ UNIQUE)
            ROLE_PERMISSIONS = {
                Role.ADMIN: ["*"],
                Role.DISPATCHER: ["parc:read", "transport:read", "transport:write", "tiers:read", "magasin:create", "magasin:read", "magasin:update"],
                Role.FINANCE: ["finance:read", "finance:write", "tiers:read", "magasin:read"],
                Role.GATE_AGENT: ["parc:read", "parc:gate", "magasin:read"],
                Role.DOUANE: ["documents:read", "documents:write", "magasin:read"],
            }
            
            user_permissions = ROLE_PERMISSIONS.get(current_user.role, [])
            
            if "*" not in user_permissions and permission not in user_permissions:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Permission {permission} not granted to role {current_user.role}"
                )
            
            return await func(*args, current_user=current_user, **kwargs)
        return wrapper
    return decorator


# Définition des permissions par module
MODULE_PERMISSIONS = {
    "tiers": [Role.ADMIN, Role.DISPATCHER, Role.FINANCE],
    "transport": [Role.ADMIN, Role.DISPATCHER],
    "finance": [Role.ADMIN, Role.FINANCE],
    "parc": [Role.ADMIN, Role.GATE_AGENT, Role.DISPATCHER],
    "documents": [Role.ADMIN, Role.DISPATCHER, Role.FINANCE, Role.DOUANE],
}


def check_module_permission(module: str):
    """Vérifie si l'utilisateur a accès à un module."""
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, current_user, **kwargs):
            allowed = MODULE_PERMISSIONS.get(module, [])
            if current_user.role not in allowed:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Access denied to module {module}"
                )
            return await func(*args, current_user=current_user, **kwargs)
        return wrapper
    return decorator
