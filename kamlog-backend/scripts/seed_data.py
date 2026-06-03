# scripts/seed_data.py — Seed Data KAMLOG
import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import AsyncSessionLocal, engine
from app.models.user import User, Role
from app.models.tiers import Tiers, StatutTiers
from app.models.transport import CamionFlotte, ChauffeurProfil, TypeVehicule
from app.utils.security import get_password_hash


async def seed_users():
    """Crée les utilisateurs par défaut."""
    async with AsyncSessionLocal() as session:
        users = [
            User(
                email="admin@kamlog.cm",
                username="admin",
                password_hash=get_password_hash("admin123"),
                full_name="Administrateur Système",
                role=Role.ADMIN,
                is_active=True,
            ),
            User(
                email="dispatcher@kamlog.cm",
                username="dispatcher",
                password_hash=get_password_hash("dispatcher123"),
                full_name="Chef Dispatch",
                role=Role.DISPATCHER,
                is_active=True,
            ),
            User(
                email="finance@kamlog.cm",
                username="finance",
                password_hash=get_password_hash("finance123"),
                full_name="Comptable",
                role=Role.FINANCE,
                is_active=True,
            ),
            User(
                email="douane@kamlog.cm",
                username="douane",
                password_hash=get_password_hash("douane123"),
                full_name="Agent Douane",
                role=Role.DOUANE,
                is_active=True,
            ),
            User(
                email="gate@kamlog.cm",
                username="gate",
                password_hash=get_password_hash("gate123"),
                full_name="Agent Guérite",
                role=Role.GATE_AGENT,
                is_active=True,
            ),
        ]
        
        for user in users:
            session.add(user)
        
        await session.commit()
        print("✅ Users seeded successfully")


async def seed_tiers():
    """Crée les clients de test."""
    async with AsyncSessionLocal() as session:
        clients = [
            Tiers(
                code_tiers="CLI001",
                raison_sociale="SABC - Société Africaine de Brasserie",
                niu="1234567890123",
                rccm="CM/DLA/2023/B/1234",
                email="contact@sabc.cm",
                telephone="+237 233 42 34 56",
                ville="Douala",
                pays="Cameroun",
                statut=StatutTiers.ACTIF,
                autorise_transport=True,
                autorise_transit=True,
                autorise_acconage=True,
                limite_credit_xaf=50000000,
            ),
            Tiers(
                code_tiers="CLI002",
                raison_sociale="TOTAL Cameroun",
                niu="1234567890124",
                rccm="CM/DLA/2023/B/5678",
                email="logistique@total.cm",
                telephone="+237 233 42 78 90",
                ville="Douala",
                pays="Cameroun",
                statut=StatutTiers.ACTIF,
                autorise_transport=True,
                autorise_magasinage=True,
                limite_credit_xaf=100000000,
            ),
            Tiers(
                code_tiers="CLI003",
                raison_sociale="CIMENCAM",
                niu="1234567890125",
                rccm="CM/DLA/2023/B/9012",
                email="transport@cimencam.cm",
                telephone="+237 233 43 21 09",
                ville="Douala",
                pays="Cameroun",
                statut=StatutTiers.ACTIF,
                autorise_transport=True,
                autorise_acconage=True,
                limite_credit_xaf=75000000,
            ),
        ]
        
        for client in clients:
            session.add(client)
        
        await session.commit()
        print("✅ Tiers seeded successfully")


async def seed_camions():
    """Crée la flotte de camions de test."""
    async with AsyncSessionLocal() as session:
        camions = [
            CamionFlotte(
                immatriculation="CE 123 AB",
                type_vehicule=TypeVehicule.PORTE_CONTENEUR,
                marque="MAN",
                modele="TGS 33.400",
                charge_utile_kg=25000,
                volume_reservoir_litres=400,
                conso_theorique_l_100=35,
                statut="DISPONIBLE",
                actif=True,
            ),
            CamionFlotte(
                immatriculation="CE 456 CD",
                type_vehicule=TypeVehicule.BENNE_VRAC,
                marque="VOLVO",
                modele="FMX 400",
                charge_utile_kg=30000,
                volume_reservoir_litres=450,
                conso_theorique_l_100=40,
                statut="DISPONIBLE",
                actif=True,
            ),
            CamionFlotte(
                immatriculation="CE 789 EF",
                type_vehicule=TypeVehicule.PORTE_CONTENEUR,
                marque="SCANIA",
                modele="R500",
                charge_utile_kg=28000,
                volume_reservoir_litres=420,
                conso_theorique_l_100=38,
                statut="DISPONIBLE",
                actif=True,
            ),
        ]
        
        for camion in camions:
            session.add(camion)
        
        await session.commit()
        print("✅ Camions seeded successfully")


async def seed_chauffeurs():
    """Crée les chauffeurs de test."""
    async with AsyncSessionLocal() as session:
        chauffeurs = [
            ChauffeurProfil(
                nom="Mbarga",
                prenom="Jean",
                numero_permis="DLA-2023-001234",
                categorie_permis="C",
                telephone="+237 699 12 34 56",
                actif=True,
            ),
            ChauffeurProfil(
                nom="Nkodo",
                prenom="Paul",
                numero_permis="DLA-2023-001235",
                categorie_permis="C",
                telephone="+237 677 98 76 54",
                actif=True,
            ),
            ChauffeurProfil(
                nom="Mengue",
                prenom="Marie",
                numero_permis="DLA-2023-001236",
                categorie_permis="C",
                telephone="+237 655 43 21 09",
                actif=True,
            ),
        ]
        
        for chauffeur in chauffeurs:
            session.add(chauffeur)
        
        await session.commit()
        print("✅ Chauffeurs seeded successfully")


async def main():
    """Exécute tous les seeds."""
    print("🌱 Starting seed data...")
    
    try:
        await seed_users()
        await seed_tiers()
        await seed_camions()
        await seed_chauffeurs()
        print("✅ All seed data completed successfully!")
    except Exception as e:
        print(f"❌ Error during seed: {e}")
        raise


if __name__ == "__main__":
    asyncio.run(main())
