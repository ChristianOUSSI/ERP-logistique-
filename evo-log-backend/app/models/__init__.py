# app/models/__init__.py - Import all models for SQLAlchemy metadata registration
from app.models.base import Base
from app.models.organization import Organization
from app.models.agency import Agency
from app.models.user import User, Role, RoleModel, Permission, PermissionModel, user_roles, role_permissions
from app.models.tiers import Tiers, Declaration
from app.models.magasin import Article, Mouvement, Stock
from app.models.new_k_modules import CotationDevis, ElectronicPOD, FuelTankSensor, PurchaseOrder, ComplianceAudit
from app.models.transport import (
    Vehicle, Driver, Mission, Maintenance, MaintenanceTypeEnum,
    MissionDocument
)
from app.models.rh import (
    Employee, EmployeeContract, EmployeeDocument, AttendanceRecord, LeaveRequest, LeaveBalance,
    PayrollRecord, PerformanceReview,
    JobPosition, JobApplication,
    TrainingProgram, EmployeeTraining,
    BenefitPlan, BenefitEnrollment,
    EmployeeSelfServicePreferences
)
from app.models.ai_forecasting import ForecastModel, ForecastAccuracy, ForecastTypeEnum
from app.models.multicurrency import Currency, CurrencyExchangeRate
from app.models.invoice_ohada import InvoiceOhada, InvoiceOhadaLine
from app.models.documentai import DocumentAIModel, ProcessedDocument, DocumentTemplate, DocumentTypeEnum, ProcessingStatusEnum
from app.models.douane import DeclarationEnDouane, LicenceImportation, CertificatOrigine, DeclarationExportation, BordereauSuivi
from app.models.api_key import APIKey
from app.models.acconage import (
    VesselCall, VesselHold, StevedoringGang, EquipmentAllocation, StevedoringOperation,
    WeighbridgeTicket, DrayageOperation, IncidentReport,
    VesselCallStatus, OperationType, EquipmentType, OperationStatus, IncidentType
)
from app.models.port_operations import (
    PortGatePass, PortHusbandryChecklist, QuayTallyLog, StatementOfFactsData,
    ShiftTypeEnum, GatePassStatusEnum, DrayageStatusEnum
)