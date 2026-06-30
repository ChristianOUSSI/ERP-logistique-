from fastapi import APIRouter, status, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from typing import Dict, Any, Optional, List
from datetime import datetime
import logging
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.database import get_db
from app.models.user import User, Role
from app.utils.security import get_password_hash

router = APIRouter()
logger = logging.getLogger("admin_audit")

class AuditTraceCreate(BaseModel):
    user_id: Optional[str] = None
    action: str
    metadata: Dict[str, Any]
    timestamp: datetime

@router.post("/audit/operation-trace", status_code=status.HTTP_201_CREATED)
async def create_operation_trace(trace: AuditTraceCreate):
    """
    Captures T-Code executions and sensitive system actions for compliance.
    In production, this should integrate with a dedicated audit service and DB table.
    """
    # For now, we log the trace and return success to unblock the frontend
    logger.info(f"[AUDIT] User: {trace.user_id} | Action: {trace.action} | T-Code: {trace.metadata.get('tcode')}")
    return {"status": "success", "detail": "Operation trace logged"}

class RolePermissions(BaseModel):
    read: bool = True
    create: bool = False
    modify: bool = False
    delete: bool = False
    approve: bool = False

class RoleResponse(BaseModel):
    id: str
    name: str
    description: str
    permissions: RolePermissions
    isActive: bool = True

@router.get("/roles", response_model=List[RoleResponse])
async def get_roles():
    """Retrieve all roles"""
    return [
        RoleResponse(id="1", name=Role.ADMIN.value, description="System Administrator", permissions=RolePermissions(read=True, create=True, modify=True, delete=True, approve=True)),
        RoleResponse(id="2", name=Role.DISPATCHER.value, description="Transport Dispatcher", permissions=RolePermissions(read=True, create=True, modify=True, delete=False, approve=False)),
        RoleResponse(id="3", name=Role.FINANCE.value, description="Finance Manager", permissions=RolePermissions(read=True, create=True, modify=True, delete=False, approve=True)),
        RoleResponse(id="4", name=Role.DOUANE.value, description="Customs Officer", permissions=RolePermissions(read=True, create=False, modify=False, delete=False, approve=True)),
        RoleResponse(id="5", name=Role.GATE_AGENT.value, description="Gate Agent", permissions=RolePermissions(read=True, create=True, modify=False, delete=False, approve=False)),
    ]

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    role: str
    is_active: bool
    mfa_enabled: bool
    model_config = ConfigDict(from_attributes=True)

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    full_name: str
    role: str
    agency_id: int

@router.get("/users", response_model=List[UserResponse])
async def get_all_users(db: AsyncSession = Depends(get_db)):
    """Retrieve all users"""
    result = await db.execute(select(User))
    users = result.scalars().all()
    return users

@router.post("/users", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    """Create a new user"""
    # Check if user exists
    result = await db.execute(select(User).where(User.username == user_in.username))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Username already exists")
    
    result_email = await db.execute(select(User).where(User.email == user_in.email))
    if result_email.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email already exists")
        
    db_user = User(
        username=user_in.username,
        email=user_in.email,
        full_name=user_in.full_name,
        password_hash=get_password_hash(user_in.password),
        role=user_in.role,
        agency_id=user_in.agency_id,
        is_active=True,
        mfa_enabled=False
    )
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user