# scripts/seed_data.py — Seed Data EVO-LOG ERP
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from datetime import datetime, timedelta
from sqlalchemy import select
from sqlalchemy.exc import OperationalError, ProgrammingError
from sqlalchemy.orm import selectinload
from app.database import SessionLocal, engine
from app.models.agency import Agency
from app.models.user import User, RoleModel, PermissionModel
from app.models.tiers import Tiers, Article, Declaration, Mission
from app.utils.security import get_password_hash, verify_password
from app.utils.logger import logger

DEFAULT_SEED_PASSWORD = os.getenv("DEFAULT_SEED_PASSWORD", "admin123")

ALL_MODULES = [
    "admin", "master-data", "transport", "finance", "magasin", "parc", "audit",
    "dashboard", "rh", "acconage", "qhse", "transit", "maintenance", "client-portal",
    "cotations", "tracking", "fuel-guard", "procurement", "compliance", "bi"
]

from app.models.organization import Organization

def seed_organization() -> int:
    """Crée l'organisation par défaut pour la multi-tenance SaaS (EVO-LOG). Retourne son ID."""
    try:
        with SessionLocal() as session:
            result = session.execute(select(Organization).where(Organization.code == "EVO-CADC"))
            existing = result.scalar_one_or_none()
            if existing:
                logger.info(f"[SUCCESS] Default Organization already exists (id={existing.id}), skipping")
                return existing.id

            org = Organization(
                code="EVO-CADC",
                name="EVO-LOG SaaS Platform Default Tenant",
                slug="evo-cadc",
                plan="ENTERPRISE",
                status="ACTIVE",
                max_users=100,
                allowed_modules=["*"],
                is_active=True
            )
            session.add(org)
            session.commit()
            session.refresh(org)
            logger.info(f"[SUCCESS] Organization seeded successfully (id={org.id})")
            return org.id
    except (OperationalError, ProgrammingError) as exc:
        logger.info(f"[WARNING] Skipping organization seed: {exc}")
        return 0

def seed_agency(org_id: int = 1) -> int:
    """Crée l'agence par défaut (multi-tenancy). Retourne son ID."""
    try:
        with SessionLocal() as session:
            result = session.execute(select(Agency).where(Agency.code == "KAM-DLA"))
            existing = result.scalar_one_or_none()
            if existing:
                if not existing.organization_id and org_id:
                    existing.organization_id = org_id
                    session.commit()
                logger.info(f"[SUCCESS] Agency already exists (id={existing.id}), skipping")
                return existing.id

            agency = Agency(
                organization_id=org_id if org_id > 0 else None,
                code="KAM-DLA",
                nom="EVO-LOG - Agence de Douala",
                adresse="Port de Douala, Zone Industrielle",
                ville="Douala",
                pays="Cameroun",
                is_active=True,
            )
            session.add(agency)
            session.commit()
            session.refresh(agency)
            logger.info(f"[SUCCESS] Agency seeded successfully (id={agency.id})")
            return agency.id
    except (OperationalError, ProgrammingError) as exc:
        logger.info(f"[WARNING] Skipping agency seed: {exc}")
        return 0

def seed_rbac():
    """Crée les permissions et rôles par défaut. Idempotent."""
    try:
        with SessionLocal() as session:
            roles_data = [
                ("ADMIN", "Administrateur Système", "Accès total à tous les modules", ALL_MODULES),
                ("MAGASINIER", "Chef Magasinier MAG3", "Gestion entrepôt et tiers", ["magasin", "master-data"]),
                ("CHAUFFEUR", "Chauffeur Routier Port", "Espace chauffeur et transport", ["transport", "tracking", "fuel-guard"]),
                ("QHSE", "Inspecteur QHSE Port", "Contrôle qualité et conformité", ["qhse", "compliance"]),
                ("FINANCE", "Responsable Financier ERP", "Comptabilité et cotations", ["finance", "cotations", "procurement"]),
                ("DOUANE", "Déclarant en Douane & Transit", "Gestion douanière et acconage", ["transit", "master-data", "acconage"]),
                ("PARC", "Gestionnaire Parc & Flotte", "Gestion parc et garages", ["parc", "transport", "maintenance", "fuel-guard"]),
                ("AUDITOR", "Auditeur Interne ERP", "Rapports et audit", ["audit", "compliance", "bi"]),
            ]

            for code, name, desc, mods in roles_data:
                result = session.execute(select(RoleModel).where(RoleModel.code == code))
                role = result.scalar_one_or_none()
                if not role:
                    role = RoleModel(code=code, name=name, description=desc, modules_allowed=mods, is_active=True)
                    session.add(role)
                else:
                    role.modules_allowed = mods
            session.commit()
            logger.info("[SUCCESS] RBAC roles seeded successfully")
    except (OperationalError, ProgrammingError) as exc:
        logger.info(f"[WARNING] Skipping RBAC seed: {exc}")

def seed_users(agency_id: int):
    """Crée les 8 utilisateurs réels de l'ERP. Idempotent."""
    try:
        with SessionLocal() as session:
            users_data = [
                {
                    "email": "admin@evo-log.cm",
                    "username": "admin",
                    "full_name": "Administrateur Système CADC",
                    "role": "ADMIN",
                    "modules_allowed": ALL_MODULES,
                    "must_change_password": False,
                },
                {
                    "email": "magasinier@evo-log.cm",
                    "username": "magasinier",
                    "full_name": "Chef Magasinier MAG3",
                    "role": "MAGASINIER",
                    "modules_allowed": ["magasin", "master-data"],
                    "must_change_password": True,
                },
                {
                    "email": "kamga@evo-log.cm",
                    "username": "kamga",
                    "full_name": "Monsieur Kamga (Chauffeur)",
                    "role": "CHAUFFEUR",
                    "modules_allowed": ["transport", "tracking", "fuel-guard"],
                    "must_change_password": True,
                },
                {
                    "email": "qhse@evo-log.cm",
                    "username": "qhse",
                    "full_name": "Inspecteur QHSE Port",
                    "role": "QHSE",
                    "modules_allowed": ["qhse", "compliance"],
                    "must_change_password": True,
                },
                {
                    "email": "financier@evo-log.cm",
                    "username": "financier",
                    "full_name": "Responsable Financier ERP",
                    "role": "FINANCE",
                    "modules_allowed": ["finance", "cotations", "procurement"],
                    "must_change_password": True,
                },
                {
                    "email": "douane@evo-log.cm",
                    "username": "douane",
                    "full_name": "Déclarant en Douane & Transit",
                    "role": "DOUANE",
                    "modules_allowed": ["transit", "master-data", "acconage"],
                    "must_change_password": True,
                },
                {
                    "email": "parc@evo-log.cm",
                    "username": "parc",
                    "full_name": "Gestionnaire Parc & Flotte",
                    "role": "PARC",
                    "modules_allowed": ["parc", "transport", "maintenance", "fuel-guard"],
                    "must_change_password": True,
                },
                {
                    "email": "auditor@evo-log.cm",
                    "username": "auditor",
                    "full_name": "Auditeur Interne ERP",
                    "role": "AUDITOR",
                    "modules_allowed": ["audit", "compliance", "bi"],
                    "must_change_password": True,
                },
            ]

            created = 0
            for u in users_data:
                result = session.execute(select(User).options(selectinload(User.roles)).where(User.email == u["email"]))
                user = result.scalar_one_or_none()
                if user:
                    logger.info(f"  → User {u['email']} already exists. Syncing modules.")
                    user.modules_allowed = u.get("modules_allowed", [])
                    user.must_change_password = u.get("must_change_password", True)
                    continue

                logger.info(f"  -> Creating User {u['email']}")
                user = User(
                    email=u["email"],
                    username=u["username"],
                    password_hash=get_password_hash(DEFAULT_SEED_PASSWORD),
                    full_name=u["full_name"],
                    agency_id=agency_id if agency_id else None,
                    modules_allowed=u.get("modules_allowed", []),
                    must_change_password=u.get("must_change_password", True),
                    is_active=True,
                )

                role_result = session.execute(select(RoleModel).where(RoleModel.code == u["role"]))
                role_db = role_result.unique().scalar_one_or_none()
                if role_db:
                    user.roles.append(role_db)

                session.add(user)
                created += 1

            session.commit()
            logger.info(f"[SUCCESS] Users seeded: {created} created")
    except (OperationalError, ProgrammingError) as exc:
        logger.info(f"[WARNING] Skipping users seed: {exc}")

def seed_tiers():
    """Crée les tiers de test. Idempotent."""
    try:
        with SessionLocal() as session:
            clients_data = [
                {"code": "CLI001", "nom": "SABC - Société Africaine de Brasserie", "type": "CLIENT", "email": "contact@sabc.cm", "telephone": "+237 233 42 34 56", "ville": "Douala", "is_active": True},
                {"code": "CLI002", "nom": "TOTAL Cameroun", "type": "CLIENT", "email": "logistique@total.cm", "telephone": "+237 233 42 78 90", "ville": "Douala", "is_active": True},
                {"code": "FOU001", "nom": "TRACTAFRIC Motors", "type": "FOURNISSEUR", "email": "sales@tractafric.cm", "telephone": "+237 233 44 55 66", "ville": "Douala", "is_active": True},
                {"code": "FOU002", "nom": "CAMRAIL S.A.", "type": "FOURNISSEUR", "email": "fret@camrail.net", "telephone": "+237 233 40 12 34", "ville": "Douala", "is_active": True},
            ]
            created = 0
            for c in clients_data:
                result = session.execute(select(Tiers).where(Tiers.code == c["code"]))
                if result.scalar_one_or_none():
                    continue
                session.add(Tiers(**c))
                created += 1
            session.commit()
            logger.info(f"[SUCCESS] Tiers seeded: {created} created")
    except (OperationalError, ProgrammingError) as exc:
        logger.info(f"[WARNING] Skipping tiers seed: {exc}")

def seed_missions():
    """Crée les missions de transport réelles."""
    try:
        with SessionLocal() as session:
            missions_data = [
                {
                    "reference": "MS-2026-07-001",
                    "type": "LIVRAISON",
                    "chauffeur_nom": "Monsieur Kamga",
                    "camion_immatriculation": "LT 002 TR",
                    "origine": "Douala (Port Autonome)",
                    "destination": "Yaoundé (Dépôt SABC)",
                    "client_nom": "SABC",
                    "distance_km": 250.0,
                    "statut": "EN_COURS"
                },
                {
                    "reference": "MS-2026-07-002",
                    "type": "LIVRAISON",
                    "chauffeur_nom": "Mbarga Jean",
                    "camion_immatriculation": "CE 123 AB",
                    "origine": "Douala (Dépôt SCDP)",
                    "destination": "Kribi (Station TOTAL)",
                    "client_nom": "TOTAL Cameroun",
                    "distance_km": 170.0,
                    "statut": "LIVREE"
                }
            ]
            created = 0
            for m in missions_data:
                result = session.execute(select(Mission).where(Mission.reference == m["reference"]))
                if result.scalar_one_or_none():
                    continue
                session.add(Mission(**m))
                created += 1
            session.commit()
            logger.info(f"[SUCCESS] Missions seeded: {created} created")
    except (OperationalError, ProgrammingError) as exc:
        logger.info(f"[WARNING] Skipping missions seed: {exc}")

from app.database import Base
import app.models

def seed_all(force_reset: bool = False):
    logger.info(f"Starting EVO-LOG SaaS Platform seed data script (force_reset={force_reset})...")
    try:
        if force_reset:
            Base.metadata.drop_all(bind=engine)
        Base.metadata.create_all(bind=engine)
        org_id = seed_organization()
        agency_id = seed_agency(org_id)
        seed_rbac()
        seed_users(agency_id)
        seed_tiers()
        seed_missions()
        logger.info("[SUCCESS] All EVO-LOG seed data completed successfully!")
        return {"status": "success", "message": "All EVO-LOG seed data completed successfully!"}
    except Exception as e:
        logger.error(f"[ERROR] Error during seed execution: {e}")
        return {"status": "error", "message": str(e)}

def main():
    seed_all(force_reset=True)

if __name__ == "__main__":
    main()
