# app/utils/rbac.py - Middleware RBAC KAMLOG (UNIFIÉ & ASYNCHRONE)
import inspect
from functools import wraps
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from sqlalchemy import select
from sqlalchemy.orm import Session
from sqlalchemy.orm import selectinload
from typing import List, Optional, Set
from app.models.user import User, RoleModel
from app.models.agency import Agency
from app.database import get_db
from app.config import settings

from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi import Request

security = HTTPBearer(auto_error=False)

def get_current_user(
    request: Request,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """Récupère l'utilisateur actuel à partir du token JWT (Cookie ou Header)."""
    try:
        token = None
        if credentials:
            token = credentials.credentials
        elif "access_token" in request.cookies:
            token = request.cookies.get("access_token")
            
        if not token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Non authentifié (token manquant)"
            )
            
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        
        # Vérification Blacklist JWT
        from app.utils.redis_client import is_token_blacklisted
        jti = payload.get("jti")
        if jti and is_token_blacklisted(jti):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token révoqué"
            )
            
        user_id_str = payload.get("sub")
        if user_id_str is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token invalide"
            )
        try:
            # Rétrocompatibilité : si sub est le nom d'utilisateur, on le cherche
            if user_id_str.isdigit():
                user = db.query(User).filter(User.id == int(user_id_str)).first()
            else:
                user = db.query(User).filter(User.username == user_id_str).first()
        except (ValueError, TypeError):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token invalide (subject invalide)"
            )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token invalide"
        )
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Utilisateur non trouvé"
        )
    
    return user


def get_user_permissions(user: User) -> Set[str]:
    """Helper to extract all permissions from all roles."""
    perms = set()
    if user.roles:
        for role in user.roles:
            if role.permissions:
                for p in role.permissions:
                    perms.add(p.code)
    return perms


def get_user_agency_plan(user: User, db: Session) -> Optional[str]:
    """Get the plan of the user's agency."""
    if user.agency:
        return user.agency.plan.value if hasattr(user.agency.plan, 'value') else str(user.agency.plan)
    return None


# Plan hierarchy: BASIC < PROFESSIONAL < ENTERPRISE
PLAN_HIERARCHY = {
    'BASIC': 0,
    'PROFESSIONAL': 1,
    'ENTERPRISE': 2
}


def get_plan_level(plan: str) -> int:
    """Get the numeric level of a plan for comparison."""
    return PLAN_HIERARCHY.get(plan, -1)


def require_plan(min_plan: str):
    """Decorator to require a minimum plan level."""
    def decorator(func):
        if inspect.iscoroutinefunction(func):
            @wraps(func)
            async def wrapper(*args, **kwargs):
                current_user: User = kwargs.get("current_user")
                db: Session = kwargs.get("db")
                if not current_user:
                    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required")
                user_plan = get_user_agency_plan(current_user, db)
                if not user_plan:
                    raise HTTPException(
                        status_code=status.HTTP_403_FORBIDDEN,
                        detail="User agency plan not found"
                    )

                user_level = get_plan_level(user_plan)
                required_level = get_plan_level(min_plan)

                if user_level < required_level:
                    raise HTTPException(
                        status_code=status.HTTP_403_FORBIDDEN,
                        detail=f"Insufficient plan level. Required: {min_plan}, Current: {user_plan}"
                    )
                return await func(*args, **kwargs)
            return _setup_signature(func, wrapper)
        else:
            @wraps(func)
            def wrapper(*args, **kwargs):
                current_user: User = kwargs.get("current_user")
                db: Session = kwargs.get("db")
                if not current_user:
                    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required")

                user_plan = get_user_agency_plan(current_user, db)
                if not user_plan:
                    raise HTTPException(
                        status_code=status.HTTP_403_FORBIDDEN,
                        detail="User agency plan not found"
                    )

                user_level = get_plan_level(user_plan)
                required_level = get_plan_level(min_plan)

                if user_level < required_level:
                    raise HTTPException(
                        status_code=status.HTTP_403_FORBIDDEN,
                        detail=f"Insufficient plan level. Required: {min_plan}, Current: {user_plan}"
                    )
                return func(*args, **kwargs)
            return _setup_signature(func, wrapper)
    return decorator


def require_professional_plan_or_higher(func):
    """Decorator to require professional plan or higher."""
    return require_plan("PROFESSIONAL")(func)


def require_enterprise_plan(func):
    """Decorator to require enterprise plan."""
    return require_plan("ENTERPRISE")(func)


def _setup_signature(func, wrapper):
    sig = inspect.signature(func)
    if "current_user" not in sig.parameters:
        new_params = list(sig.parameters.values())
        new_params.append(
            inspect.Parameter(
                "current_user",
                inspect.Parameter.KEYWORD_ONLY,
                default=Depends(get_current_user),
                annotation=User
            )
        )
        wrapper.__signature__ = sig.replace(parameters=new_params)
    else:
        wrapper.__signature__ = sig
    return wrapper

def require_role(allowed_roles: list[str]):
    def decorator(func):
        if inspect.iscoroutinefunction(func):
            @wraps(func)
            async def wrapper(*args, **kwargs):
                current_user: User = kwargs.get("current_user")
                if not current_user:
                    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required")
                user_role_codes = [r.code for r in current_user.roles] if current_user.roles else []
                if not any(role in allowed_roles for role in user_role_codes) and "admin" not in user_role_codes:
                    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Roles not authorized.")
                return await func(*args, **kwargs)
            return _setup_signature(func, wrapper)
        else:
            @wraps(func)
            def wrapper(*args, **kwargs):
                current_user: User = kwargs.get("current_user")
                if not current_user:
                    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required")
                user_role_codes = [r.code for r in current_user.roles] if current_user.roles else []
                if not any(role in allowed_roles for role in user_role_codes) and "admin" not in user_role_codes:
                    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Roles not authorized.")
                return func(*args, **kwargs)
            return _setup_signature(func, wrapper)
    return decorator


def require_permission(permission: str):
    def decorator(func):
        if inspect.iscoroutinefunction(func):
            @wraps(func)
            async def wrapper(*args, **kwargs):
                current_user: User = kwargs.get("current_user")
                if not current_user:
                    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required")
                user_role_codes = [r.code for r in current_user.roles] if current_user.roles else []
                if "admin" in user_role_codes:
                    return await func(*args, **kwargs)
                user_permissions = get_user_permissions(current_user)
                if "*" not in user_permissions and permission not in user_permissions:
                    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"Permission {permission} not granted")
                return await func(*args, **kwargs)
            return _setup_signature(func, wrapper)
        else:
            @wraps(func)
            def wrapper(*args, **kwargs):
                current_user: User = kwargs.get("current_user")
                if not current_user:
                    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required")
                user_role_codes = [r.code for r in current_user.roles] if current_user.roles else []
                if "admin" in user_role_codes:
                    return func(*args, **kwargs)
                user_permissions = get_user_permissions(current_user)
                if "*" not in user_permissions and permission not in user_permissions:
                    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"Permission {permission} not granted")
                return func(*args, **kwargs)
            return _setup_signature(func, wrapper)
    return decorator


def check_module_permission(module: str):
    def decorator(func):
        if inspect.iscoroutinefunction(func):
            @wraps(func)
            async def wrapper(*args, **kwargs):
                current_user: User = kwargs.get("current_user")
                if not current_user:
                    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required")
                user_role_codes = [r.code for r in current_user.roles] if current_user.roles else []
                if "admin" in user_role_codes:
                    return await func(*args, **kwargs)
                user_permissions = get_user_permissions(current_user)
                if "*" not in user_permissions and not any(p.startswith(f"{module}:") for p in user_permissions):
                    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"Access denied to module {module}")
                return await func(*args, **kwargs)
            return _setup_signature(func, wrapper)
        else:
            @wraps(func)
            def wrapper(*args, **kwargs):
                current_user: User = kwargs.get("current_user")
                if not current_user:
                    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required")
                user_role_codes = [r.code for r in current_user.roles] if current_user.roles else []
                if "admin" in user_role_codes:
                    return func(*args, **kwargs)
                user_permissions = get_user_permissions(current_user)
                if "*" not in user_permissions and not any(p.startswith(f"{module}:") for p in user_permissions):
                    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"Access denied to module {module}")
                return func(*args, **kwargs)
            return _setup_signature(func, wrapper)
    return decorator
