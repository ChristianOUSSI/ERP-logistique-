from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, selectinload
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, field_validator
from app.database import get_db
from app.models.user import User, RoleModel, PermissionModel
from app.utils.rbac import get_current_user, require_role

router = APIRouter()


class AuditLogResponse(BaseModel):
    id: int
    horodatage: datetime
    severite: str
    evenement: str
    admin_id: str
    cible: str
    details: Optional[str] = None

class DashboardKpisResponse(BaseModel):
    revenueDataWeek: List[dict]
    revenueDataMonth: List[dict]
    fleetData: List[dict]




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
    import psutil
    cpu_usage = psutil.cpu_percent(interval=0.1)
    memory = psutil.virtual_memory()
    memory_usage = memory.percent
    
    # Statistiques réelles pour db et connexions (en interrogeant SQLAlchemy)
    try:
        db_pool = db.get_bind().pool.size()
        active_conns = db.get_bind().pool.checkedin()
    except Exception:
        db_pool = 0
        active_conns = 0
    
    return {
        "cpuUsage": cpu_usage,
        "memoryUsage": memory_usage,
        "dbConnectionPool": db_pool,
        "activeConnections": active_conns
    }


@router.get("/dashboard/global-kpis", response_model=DashboardKpisResponse)
def get_global_dashboard_kpis(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retourne les KPIs consolidés pour le tableau de bord global, formatés pour les graphiques."""
    from app.models.finance import Facture, StatutFacture
    from app.models.transport import CamionFlotte, StatutCamion
    from sqlalchemy import and_, extract, func
    import datetime

    # Revenue Data Week: real group by day of the week (Monday to Sunday)
    today = datetime.today()
    start_of_week = today - datetime.timedelta(days=today.weekday())  # Monday
    end_of_week = start_of_week + datetime.timedelta(days=6)        # Sunday

    revenue_data = db.query(
        extract('dow', Facture.date_facture).label('day_of_week'),
        func.sum(Facture.montant_ttc_xaf).label('total')
    ).filter(
        Facture.statut == StatutFacture.PAYEE,
        Facture.date_facture >= start_of_week,
        Facture.date_facture <= end_of_week
    ).group_by(
        extract('dow', Facture.date_facture)
    ).all()

    # Map day_of_week (0=Sunday, 1=Monday, ..., 6=Saturday) to our order: Lun, Mar, Mer, Jeu, Ven, Sam, Dim
    revenueDataWeek = [{'name': name, 'value': 0} for name in ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']]
    for day in revenue_data:
        dow = int(day.day_of_week)
        if dow == 0:  # Sunday
            index = 6
        else:
            index = dow - 1
        revenueDataWeek[index]['value'] = float(day.total) if day.total else 0

    # Revenue Data Month: real group by week of the month (4 weeks)
    start_of_month = datetime(today.year, today.month, 1)
    # Calculate end of month
    if today.month == 12:
        end_of_month = datetime(today.year + 1, 1, 1) - datetime.timedelta(days=1)
    else:
        end_of_month = datetime(today.year, today.month + 1, 1) - datetime.timedelta(days=1)

    revenueDataMonth = []
    for week in range(1, 5):  # Weeks 1 to 4
        week_start = start_of_month + datetime.timedelta(days=(week-1)*7)
        week_end = min(week_start + datetime.timedelta(days=6), end_of_month)
        week_total = db.query(func.sum(Facture.montant_ttc_xaf)).filter(
            Facture.statut == StatutFacture.PAYEE,
            Facture.date_facture >= week_start,
            Facture.date_facture <= week_end
        ).scalar() or 0
        revenueDataMonth.append({
            'name': f'Sem {week}',
            'value': float(week_total)
        })

    # Fleet Data
    en_route = db.query(func.count(CamionFlotte.id)).filter(CamionFlotte.statut == StatutCamion.EN_ROUTE).scalar() or 0
    maintenance = db.query(func.count(CamionFlotte.id)).filter(CamionFlotte.statut == StatutCamion.EN_MAINTENANCE).scalar() or 0
    dispo = db.query(func.count(CamionFlotte.id)).filter(CamionFlotte.statut == StatutCamion.DISPONIBLE).scalar() or 0

    fleetData = [
        {'name': 'En Route', 'value': en_route, 'fill': '#00ACC1'},
        {'name': 'Maintenance', 'value': maintenance, 'fill': '#f59e0b'},
        {'name': 'Dispo', 'value': dispo, 'fill': '#10b981'},
    ]

    return {
        "revenueDataWeek": revenueDataWeek,
        "revenueDataMonth": revenueDataMonth,
        "fleetData": fleetData
    }
@router.get("/audit-logs")
@require_role(["admin"])
def get_audit_logs(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    limit: int = 100
):
    """Récupère les derniers logs d'audit du système."""
    try:
        from app.models.user import HTTPAuditLog
        from sqlalchemy import desc
        logs = db.query(HTTPAuditLog).order_by(desc(HTTPAuditLog.created_at)).limit(limit).all()
        
        result = []
        for log in logs:
            result.append({
                "id": log.id,
                "timestamp": log.created_at.isoformat() if log.created_at else "",
                "severity": "CRITICAL" if log.status_code and log.status_code >= 500 else "WARNING" if log.status_code and log.status_code >= 400 else "INFO",
                "event": log.method,
                "action": log.path,
                "admin": f"User {log.user_id}" if log.user_id else "Système",
                "target": log.client_ip,
                "details": f"Status: {log.status_code} - {log.user_agent}"
            })
        return result
    except ImportError:
        return []
