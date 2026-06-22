# app/repositories/__init__.py - Exports des repositories
from app.repositories.base_repository import BaseRepository
from app.repositories.magasin_repository import MagasinRepository
from app.repositories.tiers_repository import TiersRepository
from app.repositories.parc_repository import ZoneParcRepository, EmplacementParcRepository, StockPhysiqueParcRepository
from app.repositories.finance_repository import FactureRepository, EncaissementRepository, GrilleTarifaireRepository
from app.repositories.transport_repository import CamionFlotteRepository, ChauffeurProfilRepository, MissionTransportRepository, BandeLivraisonRepository
from app.repositories.goods_declaration_repository import GoodsDeclarationRepository
from app.repositories.removal_slip_repository import RemovalSlipRepository
from app.repositories.reception_mag3_repository import ReceptionMag3Repository
from app.repositories.suppliers_repository import SupplierRepository

__all__ = [
    "BaseRepository",
    "MagasinRepository",
    "TiersRepository",
    "ZoneParcRepository",
    "EmplacementParcRepository",
    "StockPhysiqueParcRepository",
    "FactureRepository",
    "EncaissementRepository",
    "GrilleTarifaireRepository",
    "CamionFlotteRepository",
    "ChauffeurProfilRepository",
    "MissionTransportRepository",
    "BandeLivraisonRepository",
    "GoodsDeclarationRepository",
    "RemovalSlipRepository",
    "ReceptionMag3Repository",
    "SupplierRepository"
]
