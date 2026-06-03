# app/utils/rbac.py — Middleware RBAC KAMLOG
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
