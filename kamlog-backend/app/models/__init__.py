# app/models/__init__.py - Import all models for SQLAlchemy metadata registration
from app.models.base import Base
from app.models.agency import Agency
from app.models.user import User, Role, RoleModel, Permission, PermissionModel, user_roles, role_permissions
from app.models.tiers import Tiers, Article, Declaration, Mission
from app.models.new_k_modules import CotationDevis, ElectronicPOD, FuelTankSensor, PurchaseOrder, ComplianceAudit
