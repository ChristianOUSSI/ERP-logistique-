# app/utils/rbac.py - Middleware RBAC KAMLOG (UNIFIÉ & ASYNCHRONE)
import inspect
from functools import wraps
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from typing import List, Optional
from app.models.user import Role, User, RoleModel
from app.database import get_db
from app.config import settings

security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db)
) -> User:
    """Récupère l'utilisateur actuel à partir du token JWT de façon asynchrone."""
    try:
        token = credentials.credentials
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        user_id_str = payload.get("sub")
        if user_id_str is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token invalide"
            )
        try:
            user_id = int(user_id_str)
        except (ValueError, TypeError):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token invalide (subject non numérique)"
            )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token invalide"
        )
    
    result = await db.execute(
        select(User)
        .options(selectinload(User.role_rel).selectinload(RoleModel.permissions))
        .where(User.id == user_id)
    )
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Utilisateur non trouvé"
        )
    
    return user


def require_role(allowed_roles: list[Role]):
    """Décorateur pour vérifier les rôles autorisés."""
    def decorator(func):
        if inspect.iscoroutinefunction(func):
            @wraps(func)
            async def wrapper(*args, current_user: User = Depends(get_current_user), **kwargs):
                if current_user.role not in allowed_roles:
                    raise HTTPException(
                        status_code=status.HTTP_403_FORBIDDEN,
                        detail=f"Role {current_user.role} not authorized. Required: {allowed_roles}"
                    )
                return await func(*args, current_user=current_user, **kwargs)
            return wrapper
        else:
            @wraps(func)
            def wrapper(*args, current_user: User = Depends(get_current_user), **kwargs):
                if current_user.role not in allowed_roles:
                    raise HTTPException(
                        status_code=status.HTTP_403_FORBIDDEN,
                        detail=f"Role {current_user.role} not authorized. Required: {allowed_roles}"
                    )
                return func(*args, current_user=current_user, **kwargs)
            return wrapper
    return decorator


def require_permission(permission: str):
    """Décorateur pour vérifier les permissions granulaires (UNIFIÉ)."""
    def decorator(func):
        if inspect.iscoroutinefunction(func):
            @wraps(func)
            async def wrapper(*args, current_user: User = Depends(get_current_user), **kwargs):
                if not current_user:
                    raise HTTPException(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        detail="Authentication required"
                    )
                
                # Les admins ont toutes les permissions
                if current_user.role == Role.ADMIN or current_user.role == "admin":
                    return await func(*args, current_user=current_user, **kwargs)
                
                user_permissions = []
                if current_user.role_rel and current_user.role_rel.permissions:
                    user_permissions = [p.code for p in current_user.role_rel.permissions]
                
                if "*" not in user_permissions and permission not in user_permissions:
                    raise HTTPException(
                        status_code=status.HTTP_403_FORBIDDEN,
                        detail=f"Permission {permission} not granted to role {current_user.role}"
                    )
                
                return await func(*args, current_user=current_user, **kwargs)
            return wrapper
        else:
            @wraps(func)
            def wrapper(*args, current_user: User = Depends(get_current_user), **kwargs):
                if not current_user:
                    raise HTTPException(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        detail="Authentication required"
                    )
                
                # Les admins ont toutes les permissions
                if current_user.role == Role.ADMIN or current_user.role == "admin":
                    return func(*args, current_user=current_user, **kwargs)
                
                user_permissions = []
                if current_user.role_rel and current_user.role_rel.permissions:
                    user_permissions = [p.code for p in current_user.role_rel.permissions]
                
                if "*" not in user_permissions and permission not in user_permissions:
                    raise HTTPException(
                        status_code=status.HTTP_403_FORBIDDEN,
                        detail=f"Permission {permission} not granted to role {current_user.role}"
                    )
                
                return func(*args, current_user=current_user, **kwargs)
            return wrapper
    return decorator


# Définition des permissions par module
MODULE_PERMISSIONS = {
    "tiers": [Role.ADMIN, Role.DISPATCHER, Role.FINANCE, Role.MAGASIN],
    "transport": [Role.ADMIN, Role.DISPATCHER, Role.AUDITOR],
    "finance": [Role.ADMIN, Role.FINANCE, Role.AUDITOR],
    "parc": [Role.ADMIN, Role.GATE_AGENT, Role.DISPATCHER, Role.AUDITOR],
    "documents": [Role.ADMIN, Role.DISPATCHER, Role.FINANCE, Role.DOUANE, Role.MAGASIN, Role.AUDITOR],
    "magasin": [Role.ADMIN, Role.MAGASIN, Role.DISPATCHER, Role.AUDITOR],
    "audit": [Role.ADMIN, Role.AUDITOR],
}


def check_module_permission(module: str):
    """Vérifie si l'utilisateur a accès à un module."""
    def decorator(func):
        if inspect.iscoroutinefunction(func):
            @wraps(func)
            async def wrapper(*args, current_user: User = Depends(get_current_user), **kwargs):
                allowed = MODULE_PERMISSIONS.get(module, [])
                if current_user.role not in allowed:
                    raise HTTPException(
                        status_code=status.HTTP_403_FORBIDDEN,
                        detail=f"Access denied to module {module}"
                    )
                return await func(*args, current_user=current_user, **kwargs)
            return wrapper
        else:
            @wraps(func)
            def wrapper(*args, current_user: User = Depends(get_current_user), **kwargs):
                allowed = MODULE_PERMISSIONS.get(module, [])
                if current_user.role not in allowed:
                    raise HTTPException(
                        status_code=status.HTTP_403_FORBIDDEN,
                        detail=f"Access denied to module {module}"
                    )
                return func(*args, current_user=current_user, **kwargs)
            return wrapper
    return decorator
