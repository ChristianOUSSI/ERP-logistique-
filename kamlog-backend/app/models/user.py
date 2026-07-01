# app/models/user.py  Modèle User, Roles et Permissions pour Authentification & RBAC
import enum
from sqlalchemy import String, Boolean, Integer, ForeignKey, Table, Column
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import BaseModel


class Role(str, enum.Enum):
    ADMIN = "admin"
    DISPATCHER = "dispatcher"
    FINANCE = "finance"
    DOUANE = "douane"
    GATE_AGENT = "gate_agent"
    MAGASIN = "magasin"
    AUDITOR = "auditor"


# Table d'association Many-to-Many entre Rôles et Permissions
role_permissions = Table(
    "role_permissions",
    BaseModel.metadata,
    Column("role_id", Integer, ForeignKey("roles.id", ondelete="CASCADE"), primary_key=True),
    Column("permission_id", Integer, ForeignKey("permissions.id", ondelete="CASCADE"), primary_key=True)
)


class PermissionModel(BaseModel):
    __tablename__ = "permissions"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    code: Mapped[str] = mapped_column(String(50), unique=True, nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    module: Mapped[str] = mapped_column(String(50), nullable=False)
    
    roles = relationship("RoleModel", secondary=role_permissions, back_populates="permissions")


class RoleModel(BaseModel):
    __tablename__ = "roles"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    code: Mapped[str] = mapped_column(String(50), unique=True, nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str] = mapped_column(String(200), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    
    users = relationship("User", back_populates="role_rel")
    permissions = relationship("PermissionModel", secondary=role_permissions, back_populates="roles")


class User(BaseModel):
    __tablename__ = "users"
    
    Role = Role

    email: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    username: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[str] = mapped_column(String(200))
    
    # Rôle (clé étrangère vers la table roles sur la colonne code pour assurer la compatibilité descendante)
    role: Mapped[str] = mapped_column(String(50), ForeignKey("roles.code"), default="gate_agent")
    role_rel = relationship("RoleModel", back_populates="users", foreign_keys=[role])
    
    # Clé étrangère pour le multi-tenancy
    agency_id: Mapped[int] = mapped_column(Integer, ForeignKey("agencies.id"), nullable=False)
    agency = relationship("Agency", back_populates="users")

    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    
    # MFA fields
    mfa_enabled: Mapped[bool] = mapped_column(Boolean, default=False)
    mfa_secret: Mapped[str] = mapped_column(String(255), nullable=True)
    mfa_backup_codes: Mapped[str] = mapped_column(String(1000), nullable=True)  # JSON string
