# app/utils/rbac.py  Middleware RBAC KAMLOG
from functools import wraps
from fastapi import HTTPException, status, Depends
from app.models.user import Role


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
    """Décorateur pour vérifier les permissions granulaires."""
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, current_user, **kwargs):
            # Pour l'instant, on vérifie simplement si l'utilisateur est authentifié
            # TODO: Implémenter un système de permissions plus avancé avec une table de permissions
            if not current_user:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Authentication required"
                )
            
            # Les admins ont toutes les permissions
            if current_user.role == Role.ADMIN:
                return await func(*args, current_user=current_user, **kwargs)
            
            # Vérification basée sur le rôle et la permission
            # Format de permission: module:action (ex: parc:read, parc:write, parc:delete, parc:gate)
            module, action = permission.split(":")
            
            # Mapping des permissions par rôle
            ROLE_PERMISSIONS = {
                Role.ADMIN: ["*"],  # Admin a toutes les permissions
                Role.DISPATCHER: ["parc:read", "transport:read", "transport:write", "tiers:read"],
                Role.FINANCE: ["finance:read", "finance:write", "tiers:read"],
                Role.GATE_AGENT: ["parc:read", "parc:gate"],
                Role.DOUANE: ["documents:read", "documents:write"],
            }
            
            user_permissions = ROLE_PERMISSIONS.get(current_user.role, [])
            
            # Vérifier si l'utilisateur a la permission spécifique ou l'accès complet au module
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
