from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, Boolean, JSON, Table
from sqlalchemy.orm import relationship, synonym
from datetime import datetime
from app.models.base import Base

# ─── Table d'association User ↔ Role (Many-to-Many) ───
user_roles = Table(
    "user_roles",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True),
    Column("role_id", Integer, ForeignKey("roles.id", ondelete="CASCADE"), primary_key=True),
)

# ─── Table d'association Role ↔ Permission (Many-to-Many) ───
role_permissions = Table(
    "role_permissions",
    Base.metadata,
    Column("role_id", Integer, ForeignKey("roles.id", ondelete="CASCADE"), primary_key=True),
    Column("permission_id", Integer, ForeignKey("permissions.id", ondelete="CASCADE"), primary_key=True),
)


class PermissionModel(Base):
    __tablename__ = "permissions"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    module = Column(String(50), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    deleted_at = Column(DateTime, nullable=True)


class RoleModel(Base):
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    description = Column(String(200), nullable=True)
    modules_allowed = Column(JSON, nullable=True, default=[])
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    deleted_at = Column(DateTime, nullable=True)

    permissions = relationship("PermissionModel", secondary=role_permissions, lazy="selectin")
    users = relationship("User", secondary=user_roles, back_populates="roles", lazy="joined")


# Aliases for backwards compatibility
Role = RoleModel
Permission = PermissionModel


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    organization_id = Column(Integer, ForeignKey("organizations.id", ondelete="SET NULL"), nullable=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(100), unique=True, index=True, nullable=True)
    hashed_password = Column(String(255), nullable=False, default="$2b$12$default_admin123_hash")
    full_name = Column(String(255), nullable=True)
    telephone = Column(String(50), nullable=True)
    departement = Column(String(100), default="LOGISTIQUE")
    agency_id = Column(Integer, ForeignKey("agencies.id", ondelete="SET NULL"), nullable=True)
    modules_allowed = Column(JSON, nullable=True, default=[])
    is_active = Column(Boolean, default=True)
    is_superadmin = Column(Boolean, default=False, nullable=False)
    must_change_password = Column(Boolean, default=True)
    password_changed_at = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    organization = relationship("Organization", back_populates="users")
    roles = relationship("RoleModel", secondary=user_roles, back_populates="users", lazy="joined")

    password_hash = synonym("hashed_password")
