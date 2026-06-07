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
)
from app.models.finance import (
    Facture,
    Encaissement,
    GrilleTarifaire,
    StatutFacture,
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
    "Facture",
    "Encaissement",
    "GrilleTarifaire",
    "StatutFacture",
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
]
