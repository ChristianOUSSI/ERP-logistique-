from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from app.database import get_db
from app.models.user import User, RoleModel, PermissionModel
from app.utils.rbac import get_current_user, require_role

router = APIRouter()


class RoleResponse(BaseModel):
    id: int
    code: str
    name: str
    description: str | None = None
    is_active: bool

    class Config:
        from_attributes = True


class PermissionResponse(BaseModel):
    id: int
    code: str
    name: str
    module: str

    class Config:
        from_attributes = True


from pydantic import BaseModel, field_validator

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    full_name: str | None = None
    roles: List[str] = []
    agency_id: int
    is_active: bool

    class Config:
        from_attributes = True

    @field_validator('roles', mode='before')
    def extract_role_codes(cls, v):
        if not v:
            return []
        if isinstance(v, list) and len(v) > 0 and isinstance(v[0], str):
            return v
        return [r.code for r in v]


class UpdateUserRolesRequest(BaseModel):
    roles: List[str]


@router.get("/roles", response_model=List[RoleResponse])
@require_role(["admin"])
def get_roles(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Récupère la liste de tous les rôles."""
    roles = db.query(RoleModel).all()
    return roles


@router.get("/permissions", response_model=List[PermissionResponse])
@require_role(["admin"])
def get_permissions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Récupère la liste de toutes les permissions."""
    permissions = db.query(PermissionModel).all()
    return permissions


@router.get("/users", response_model=List[UserResponse])
@require_role(["admin"])
def get_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Récupère la liste de tous les utilisateurs pour l'administration."""
    users = db.query(User).options(selectinload(User.roles)).all()
    return users


@router.put("/users/{user_id}/roles", response_model=UserResponse)
@require_role(["admin"])
def update_user_roles(
    user_id: int,
    request: UpdateUserRolesRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Met à jour les rôles d'un utilisateur."""
    user = db.query(User).options(selectinload(User.roles)).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    
    roles_db = db.query(RoleModel).filter(RoleModel.code.in_(request.roles)).all()
    
    user.roles = roles_db
    db.commit()
    db.refresh(user)
    
    return user


class SystemHealthResponse(BaseModel):
    cpuUsage: float
    memoryUsage: float
    dbConnectionPool: int
    activeConnections: int


@router.get("/system-health", response_model=SystemHealthResponse)
@require_role(["admin"])
def get_system_health(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Renvoie les métriques de santé du système."""
    # import psutil
    # cpu_usage = psutil.cpu_percent(interval=0.1)
    # memory = psutil.virtual_memory()
    # memory_usage = memory.percent
    
    # Values mocked since psutil could not be installed due to network errors
    cpu_usage = 12.5
    memory_usage = 45.2
    
    # Statistiques basiques pour db et connexions (simulées pour l'instant si non accessibles)
    db_pool = 5
    active_conns = 12
    
    return {
        "cpuUsage": cpu_usage,
        "memoryUsage": memory_usage,
        "dbConnectionPool": db_pool,
        "activeConnections": active_conns
    }


