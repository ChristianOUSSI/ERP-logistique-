from fastapi import APIRouter, status, Depends, HTTPException
from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Dict, Any, Optional, List
from datetime import datetime
import logging
from sqlalchemy.orm import Session
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from app.database import get_db
from app.models.user import User, Role, RoleModel, PermissionModel
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

class PermissionSchema(BaseModel):
    id: int
    code: str
    name: str
    module: str
    model_config = ConfigDict(from_attributes=True)

class RoleSchema(BaseModel):
    id: int
    code: str
    name: str
    description: Optional[str] = None
    is_active: bool
    permissions: List[PermissionSchema]
    model_config = ConfigDict(from_attributes=True)

class RoleCreate(BaseModel):
    code: str
    name: str
    description: Optional[str] = None
    permissions: List[str] = []

class RoleUpdate(BaseModel):
    permissions: List[str]

class UserRoleUpdate(BaseModel):
    role: str

@router.get("/roles", response_model=List[RoleSchema])
async def get_roles(db: Session = Depends(get_db)):
    """Retrieve all roles dynamically from database"""
    result = await db.execute(select(RoleModel).options(selectinload(RoleModel.permissions)))
    roles = result.scalars().all()
    return roles

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
async def get_all_users(db: Session = Depends(get_db)):
    """Retrieve all users"""
    result = await db.execute(select(User))
    users = result.scalars().all()
    return users

@router.post("/users", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(user_in: UserCreate, db: Session = Depends(get_db)):
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


@router.get("/permissions", response_model=List[PermissionSchema])
async def get_permissions(db: Session = Depends(get_db)):
    """Retrieve all system permissions"""
    result = await db.execute(select(PermissionModel))
    permissions = result.scalars().all()
    return permissions

@router.post("/roles", response_model=RoleSchema, status_code=status.HTTP_201_CREATED)
async def create_role(role_in: RoleCreate, db: Session = Depends(get_db)):
    """Create a new role with its permissions"""
    result = await db.execute(select(RoleModel).where(RoleModel.code == role_in.code))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Role code already exists")
    
    permissions = []
    if role_in.permissions:
        perm_result = await db.execute(select(PermissionModel).where(PermissionModel.code.in_(role_in.permissions)))
        permissions = perm_result.scalars().all()
    
    db_role = RoleModel(
        code=role_in.code,
        name=role_in.name,
        description=role_in.description,
        is_active=True,
        permissions=permissions
    )
    db.add(db_role)
    await db.commit()
    await db.refresh(db_role)
    
    result = await db.execute(
        select(RoleModel)
        .options(selectinload(RoleModel.permissions))
        .where(RoleModel.id == db_role.id)
    )
    return result.scalar_one()

@router.put("/roles/{role_code}", response_model=RoleSchema)
async def update_role_permissions(role_code: str, role_in: RoleUpdate, db: Session = Depends(get_db)):
    """Update role permissions"""
    result = await db.execute(
        select(RoleModel)
        .options(selectinload(RoleModel.permissions))
        .where(RoleModel.code == role_code)
    )
    db_role = result.scalar_one_or_none()
    if not db_role:
        raise HTTPException(status_code=404, detail="Role not found")
    
    if role_in.permissions:
        perm_result = await db.execute(select(PermissionModel).where(PermissionModel.code.in_(role_in.permissions)))
        new_permissions = perm_result.scalars().all()
        db_role.permissions = new_permissions
    else:
        db_role.permissions = []
        
    await db.commit()
    await db.refresh(db_role)
    return db_role

@router.put("/users/{user_id}/role", response_model=UserResponse)
async def update_user_role(user_id: int, user_role_in: UserRoleUpdate, db: Session = Depends(get_db)):
    """Assign role to a user"""
    role_result = await db.execute(select(RoleModel).where(RoleModel.code == user_role_in.role))
    if not role_result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Role code not found")
        
    result = await db.execute(select(User).where(User.id == user_id))
    db_user = result.scalar_one_or_none()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
        
    db_user.role = user_role_in.role
    await db.commit()
    await db.refresh(db_user)
    return db_user
