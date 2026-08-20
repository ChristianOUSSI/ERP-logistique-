"""
SQLAlchemy models for EVO-LOG backend - Simplified Version
Only core models included for production deployment
"""
from app.models.user import User, Role, Permission
from app.models.agency import Agency
from app.models.tiers import Tiers, Client, Fournisseur, Partenaire
from app.models.transport import Camion, Conducteur, Mission, Trajet
from app.models.finance import Facture, Paiement, Compte, EcritureComptable, LigneFactureSimple
from app.models.parc import Vehicule, Equipement, Maintenance
from app.models.magasin import Stock, MouvementStock, Entrepot
from app.models.transit import DossierTransit, DeclarationDouaniere
from app.models.audit import AuditLog
from app.models.tenant import Company, SubscriptionPlan, Subscription, Department, B2BPortal, TenantAuditLog

__all__ = [
    "User", "Role", "Permission",
    "Agency",
    "Tiers", "Client", "Fournisseur", "Partenaire",
    "Camion", "Conducteur", "Mission", "Trajet",
    "Facture", "Paiement", "Compte", "EcritureComptable", "LigneFactureSimple",
    "Vehicule", "Equipement", "Maintenance",
    "Stock", "MouvementStock", "Entrepot",
    "DossierTransit", "DeclarationDouaniere",
    "AuditLog",
    "Company", "SubscriptionPlan", "Subscription", "Department", "B2BPortal", "TenantAuditLog"
]