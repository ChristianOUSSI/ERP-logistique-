# app/models  Import tous les modèles
from app.models.base import Base, BaseModel
from app.models.audit import AuditLog
from app.models.user import User, RoleModel, PermissionModel
from app.models.tiers import Tiers, StatutTiers
from app.models.marchandises import (
    Marchandise,
    TypeMarchandise,
    UniteMesureFacturation,
)
from app.models.escales import Escale, StatutEscale
from app.models.dossier import (
    DossierOperationnel,
    ContenuDossierMarchandise,
    RegimeDouane,
    StatutDossier,
    TypeServiceConcerne,
)
from app.models.transport import (
    CamionFlotte,
    ChauffeurProfil,
    MissionTransport,
    TypeVehicule,
    StatutMission,
    StatutCamion,
)
from app.models.finance import (
    Facture,
    FactureLigne,
    Encaissement,
    EcritureComptable,
    GrilleTarifaire,
    StatutFacture,
    ModePaiement,
    Avoir,
)
from app.models.parc import (
    ZoneParc,
    EmplacementParc,
    StockPhysiqueParc,
    MouvementParc,
    StatutEmplacement,
    TypeZoneParc,
    TypeMouvementParc,
    ReparationAtelier,
)
from app.models.planning import (
    PlanningGlobal,
    PlanningRessource,
    PlanningCotation,
    DepartementKamlog,
    StatutPlan,
)
from app.models.documents_sortants import (
    DocumentSortant,
    TypeDocument,
)
from app.models.magasin import (
    Magasin,
    ClientMagasin,
    Article,
    Declaration,
    LigneDeclaration,
    Reception,
    LigneReception,
    Stock,
    Commande,
    LigneCommande,
    BandeLivraison,
    LigneBandeLivraison,
    UniteMesure,
    StatutDeclaration,
    StatutReception,
    StatutCommande,
)
from app.models.gateway import (
    Passerelle,
    CommandeFacture,
    CommandeLivraison,
    ReceptionStock,
    FacturePaiement,
    MissionFacture,
)
from app.models.goods_declaration import (
    GoodsDeclaration,
    LigneGoodsDeclaration,
    StatutGoodsDeclaration,
)
from app.models.removal_slip import (
    RemovalSlip,
    StatutRemovalSlip,
)
from app.models.reception_mag3 import (
    ReceptionMag3,
    StatutReceptionMag3,
)
from app.models.suppliers import (
    Supplier,
    SupplierProfile,
    StatutSupplier,
    CategorieSupplier,
)
from app.models.agency import Agency
from app.models.idempotency import IdempotencyKey
from app.models.notification import (
    Notification,
    NotificationDestination,
    TypeNotification,
    PrioriteNotification,
    StatutNotification,
)

__all__ = [
    "Base",
    "BaseModel",
    "AuditLog",
    "User",
    "RoleModel",
    "PermissionModel",
    # ── Core ──
    "Tiers",
    "StatutTiers",
    "Marchandise",
    "TypeMarchandise",
    "UniteMesureFacturation",
    # ── Opérations ──
    "Escale",
    "StatutEscale",
    "DossierOperationnel",
    "ContenuDossierMarchandise",
    "RegimeDouane",
    "StatutDossier",
    "TypeServiceConcerne",
    # ── Transport ──
    "CamionFlotte",
    "ChauffeurProfil",
    "MissionTransport",
    "TypeVehicule",
    "StatutMission",
    "StatutCamion",
    # ── Finance ──
    "Facture",
    "FactureLigne",
    "Encaissement",
    "EcritureComptable",
    "GrilleTarifaire",
    "StatutFacture",
    "ModePaiement",
    "Avoir",
    # ── Parc ──
    "ZoneParc",
    "EmplacementParc",
    "StockPhysiqueParc",
    "MouvementParc",
    "StatutEmplacement",
    "TypeZoneParc",
    "TypeMouvementParc",
    "ReparationAtelier",
    # ── Planning ──
    "PlanningGlobal",
    "PlanningRessource",
    "PlanningCotation",
    "DepartementKamlog",
    "StatutPlan",
    # ── Documents Sortants ──
    "DocumentSortant",
    "TypeDocument",
    # ── Magasin ──
    "Magasin",
    "ClientMagasin",
    "Article",
    "Declaration",
    "LigneDeclaration",
    "Reception",
    "LigneReception",
    "Stock",
    "Commande",
    "LigneCommande",
    "BandeLivraison",
    "LigneBandeLivraison",
    "UniteMesure",
    "StatutDeclaration",
    "StatutReception",
    "StatutCommande",
    # ── Gateway ──
    "Passerelle",
    "CommandeFacture",
    "CommandeLivraison",
    "ReceptionStock",
    "FacturePaiement",
    "MissionFacture",
    # ── Misc ──
    "GoodsDeclaration",
    "LigneGoodsDeclaration",
    "StatutGoodsDeclaration",
    "RemovalSlip",
    "StatutRemovalSlip",
    "ReceptionMag3",
    "StatutReceptionMag3",
    "Supplier",
    "SupplierProfile",
    "StatutSupplier",
    "CategorieSupplier",
    "Agency",
    "IdempotencyKey",
    "Notification",
    "NotificationDestination",
    "TypeNotification",
    "PrioriteNotification",
    "StatutNotification",
]
