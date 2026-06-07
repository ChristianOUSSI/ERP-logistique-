# app/utils/permissions.py - Système de permissions RBAC KAMLOG EM-ERP
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import List, Optional
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models.user import User, Role


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


def require_roles(allowed_roles: List[str]):
    """
    Décorateur pour vérifier que l'utilisateur a l'un des rôles autorisés.
    
    Args:
        allowed_roles: Liste des rôles autorisés (ex: ["admin", "dispatcher"])
    """
    def role_checker(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role.value not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Permissions insuffisantes. Rôles requis: {', '.join(allowed_roles)}"
            )
        return current_user
    return role_checker


def check_permission(permission: str):
    """
    Décorateur pour vérifier une permission spécifique.
    
    Args:
        permission: Permission à vérifier (ex: "magasin:create", "magasin:delete")
    """
    def permission_checker(current_user: User = Depends(get_current_user)) -> User:
        # Admin a toutes les permissions
        if current_user.role.value == "admin":
            return current_user
        
        # Définir les permissions par rôle
        role_permissions = {
            "dispatcher": [
                "magasin:create", "magasin:update", "magasin:read",
                "article:create", "article:update", "article:read",
                "declaration:create", "declaration:update", "declaration:read",
                "reception:create", "reception:update", "reception:read",
                "commande:create", "commande:update", "commande:read",
                "bande:create", "bande:update", "bande:read",
                "stock:read"
            ],
            "finance": [
                "magasin:read",
                "article:read",
                "commande:read",
                "stock:read"
            ],
            "douane": [
                "magasin:read",
                "article:read",
                "declaration:read",
                "reception:read"
            ],
            "gate_agent": [
                "magasin:read",
                "article:read",
                "reception:read",
                "bande:read",
                "stock:read"
            ]
        }
        
        user_permissions = role_permissions.get(current_user.role.value, [])
        
        if permission not in user_permissions:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Permission '{permission}' requise"
            )
        
        return current_user
    return permission_checker
