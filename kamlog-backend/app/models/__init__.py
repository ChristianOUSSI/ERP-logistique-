# app/models  Import tous les modèles
from app.models.base import Base, BaseModel
from app.models.audit import AuditLog
from app.models.user import User, Role
from app.models.tiers import Tiers, StatutTiers
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
    Encaissement,
    GrilleTarifaire,
    StatutFacture,
    Avoir,
)
from app.models.parc import (
    ZoneParc,
    EmplacementParc,
    StockPhysiqueParc,
    MouvementParc,
    StatutEmplacement,
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
from app.models.dossier import DossierOperationnel

__all__ = [
    "Base",
    "BaseModel",
    "AuditLog",
    "User",
    "Role",
    "Tiers",
    "StatutTiers",
    "CamionFlotte",
    "ChauffeurProfil",
    "MissionTransport",
    "TypeVehicule",
    "StatutMission",
    "StatutCamion",
    "Facture",
    "Encaissement",
    "GrilleTarifaire",
    "StatutFacture",
    "Avoir",
    "ZoneParc",
    "EmplacementParc",
    "StockPhysiqueParc",
    "MouvementParc",
    "StatutEmplacement",
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
    "Passerelle",
    "CommandeFacture",
    "CommandeLivraison",
    "ReceptionStock",
    "FacturePaiement",
    "MissionFacture",
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
    "DossierOperationnel",
]
