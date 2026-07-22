from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, Boolean, JSON, Table
from sqlalchemy.orm import relationship
from datetime import datetime
from app.models.base import Base

# ─── Table d'association User ↔ Role (Many-to-Many) ───
user_roles = Table(
    "user_roles",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True),
    Column("role_id", Integer, ForeignKey("roles.id", ondelete="CASCADE"), primary_key=True),
)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False, default="$2b$12$default_admin123_hash")
    full_name = Column(String(255), nullable=True)
    telephone = Column(String(50), nullable=True)
    departement = Column(String(100), default="LOGISTIQUE")
    is_active = Column(Boolean, default=True)
    must_change_password = Column(Boolean, default=True)
    password_changed_at = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    roles = relationship("Role", secondary=user_roles, back_populates="users", lazy="joined")


class Role(Base):
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False, index=True)
    description = Column(Text, nullable=True)
    permissions = Column(JSON, nullable=True, default=[])
    modules_allowed = Column(JSON, nullable=True, default=[])
    created_at = Column(DateTime, default=datetime.utcnow)

    users = relationship("User", secondary=user_roles, back_populates="roles", lazy="joined")
