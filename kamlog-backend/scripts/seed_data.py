# scripts/seed_data.py  Seed Data KAMLOG
import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import AsyncSessionLocal, engine
from app.models.agency import Agency
from app.models.user import User, Role
from app.models.tiers import Tiers, StatutTiers
from app.models.transport import CamionFlotte, ChauffeurProfil, TypeVehicule
from app.utils.security import get_password_hash


async def seed_agency() -> int:
    """Crée l'agence par défaut (multi-tenancy). Retourne son ID."""
    async with AsyncSessionLocal() as session:
        # Vérifier si l'agence existe déjà
        result = await session.execute(select(Agency).where(Agency.code == "KAM-DLA"))
        existing = result.scalar_one_or_none()
        if existing:
            print(f"✅ Agency already exists (id={existing.id}), skipping")
            return existing.id

        agency = Agency(
            code="KAM-DLA",
            nom="KAMLOG - Agence de Douala",
            adresse="Port de Douala, Zone Industrielle",
            ville="Douala",
            pays="Cameroun",
            telephone="+237 233 40 00 00",
            email="agence.douala@kamlog.cm",
            is_active=True,
        )
        session.add(agency)
        await session.commit()
        await session.refresh(agency)
        print(f"✅ Agency seeded successfully (id={agency.id})")
        return agency.id


async def seed_users(agency_id: int):
    """Crée les utilisateurs par défaut. Idempotent : ignore les doublons."""
    async with AsyncSessionLocal() as session:
        users_data = [
            {
                "email": "admin@kamlog.cm",
                "username": "admin",
                "password": "admin123",
                "full_name": "Administrateur Système",
                "role": Role.ADMIN,
            },
            {
                "email": "dispatcher@kamlog.cm",
                "username": "dispatcher",
                "password": "dispatcher123",
                "full_name": "Chef Dispatch",
                "role": Role.DISPATCHER,
            },
            {
                "email": "finance@kamlog.cm",
                "username": "finance",
                "password": "finance123",
                "full_name": "Comptable",
                "role": Role.FINANCE,
            },
            {
                "email": "douane@kamlog.cm",
                "username": "douane",
                "password": "douane123",
                "full_name": "Agent Douane",
                "role": Role.DOUANE,
            },
            {
                "email": "gate@kamlog.cm",
                "username": "gate",
                "password": "gate123",
                "full_name": "Agent Guérite",
                "role": Role.GATE_AGENT,
            },
        ]

        created = 0
        for u in users_data:
            # Vérifier si l'utilisateur existe déjà
            result = await session.execute(select(User).where(User.email == u["email"]))
            if result.scalar_one_or_none():
                print(f"  → User {u['email']} already exists, skipping")
                continue

            user = User(
                email=u["email"],
                username=u["username"],
                password_hash=get_password_hash(u["password"]),
                full_name=u["full_name"],
                role=u["role"],
                agency_id=agency_id,
                is_active=True,
            )
            session.add(user)
            created += 1

        await session.commit()
        print(f"✅ Users seeded: {created} created, {len(users_data) - created} already existed")


async def seed_tiers():
    """Crée les clients de test. Idempotent."""
    async with AsyncSessionLocal() as session:
        clients_data = [
            {
                "code_tiers": "CLI001",
                "raison_sociale": "SABC - Société Africaine de Brasserie",
                "niu": "1234567890123",
                "rccm": "CM/DLA/2023/B/1234",
                "email": "contact@sabc.cm",
                "telephone": "+237 233 42 34 56",
                "ville": "Douala",
                "pays": "Cameroun",
                "statut": StatutTiers.ACTIF,
                "autorise_transport": True,
                "autorise_transit": True,
                "autorise_acconage": True,
                "limite_credit_xaf": 50000000,
            },
            {
                "code_tiers": "CLI002",
                "raison_sociale": "TOTAL Cameroun",
                "niu": "1234567890124",
                "rccm": "CM/DLA/2023/B/5678",
                "email": "logistique@total.cm",
                "telephone": "+237 233 42 78 90",
                "ville": "Douala",
                "pays": "Cameroun",
                "statut": StatutTiers.ACTIF,
                "autorise_transport": True,
                "autorise_magasinage": True,
                "limite_credit_xaf": 100000000,
            },
            {
                "code_tiers": "CLI003",
                "raison_sociale": "CIMENCAM",
                "niu": "1234567890125",
                "rccm": "CM/DLA/2023/B/9012",
                "email": "transport@cimencam.cm",
                "telephone": "+237 233 43 21 09",
                "ville": "Douala",
                "pays": "Cameroun",
                "statut": StatutTiers.ACTIF,
                "autorise_transport": True,
                "autorise_acconage": True,
                "limite_credit_xaf": 75000000,
            },
        ]

        created = 0
        for c in clients_data:
            result = await session.execute(select(Tiers).where(Tiers.code_tiers == c["code_tiers"]))
            if result.scalar_one_or_none():
                print(f"  → Tiers {c['code_tiers']} already exists, skipping")
                continue
            session.add(Tiers(**c))
            created += 1

        await session.commit()
        print(f"✅ Tiers seeded: {created} created")


async def seed_camions():
    """Crée la flotte de camions de test. Idempotent."""
    async with AsyncSessionLocal() as session:
        camions_data = [
            {
                "immatriculation": "CE 123 AB",
                "type_vehicule": TypeVehicule.PORTE_CONTENEUR,
                "marque": "MAN",
                "modele": "TGS 33.400",
                "charge_utile_kg": 25000,
                "volume_reservoir_litres": 400,
                "conso_theorique_l_100": 35,
                "statut": "DISPONIBLE",
                "actif": True,
            },
            {
                "immatriculation": "CE 456 CD",
                "type_vehicule": TypeVehicule.BENNE_VRAC,
                "marque": "VOLVO",
                "modele": "FMX 400",
                "charge_utile_kg": 30000,
                "volume_reservoir_litres": 450,
                "conso_theorique_l_100": 40,
                "statut": "DISPONIBLE",
                "actif": True,
            },
            {
                "immatriculation": "CE 789 EF",
                "type_vehicule": TypeVehicule.PORTE_CONTENEUR,
                "marque": "SCANIA",
                "modele": "R500",
                "charge_utile_kg": 28000,
                "volume_reservoir_litres": 420,
                "conso_theorique_l_100": 38,
                "statut": "DISPONIBLE",
                "actif": True,
            },
        ]

        created = 0
        for c in camions_data:
            result = await session.execute(
                select(CamionFlotte).where(CamionFlotte.immatriculation == c["immatriculation"])
            )
            if result.scalar_one_or_none():
                print(f"  → Camion {c['immatriculation']} already exists, skipping")
                continue
            session.add(CamionFlotte(**c))
            created += 1

        await session.commit()
        print(f"✅ Camions seeded: {created} created")


async def seed_chauffeurs():
    """Crée les chauffeurs de test. Idempotent."""
    async with AsyncSessionLocal() as session:
        chauffeurs_data = [
            {
                "nom": "Mbarga",
                "prenom": "Jean",
                "numero_permis": "DLA-2023-001234",
                "categorie_permis": "C",
                "telephone": "+237 699 12 34 56",
                "actif": True,
            },
            {
                "nom": "Nkodo",
                "prenom": "Paul",
                "numero_permis": "DLA-2023-001235",
                "categorie_permis": "C",
                "telephone": "+237 677 98 76 54",
                "actif": True,
            },
            {
                "nom": "Mengue",
                "prenom": "Marie",
                "numero_permis": "DLA-2023-001236",
                "categorie_permis": "C",
                "telephone": "+237 655 43 21 09",
                "actif": True,
            },
        ]

        created = 0
        for c in chauffeurs_data:
            result = await session.execute(
                select(ChauffeurProfil).where(ChauffeurProfil.numero_permis == c["numero_permis"])
            )
            if result.scalar_one_or_none():
                print(f"  → Chauffeur {c['numero_permis']} already exists, skipping")
                continue
            session.add(ChauffeurProfil(**c))
            created += 1

        await session.commit()
        print(f"✅ Chauffeurs seeded: {created} created")


async def main():
    """Exécute tous les seeds dans le bon ordre."""
    print("🌱 Starting seed data...")

    try:
        # 1. Agency DOIT être créée en premier (les users en dépendent)
        agency_id = await seed_agency()
        # 2. Users (liés à l'agency)
        await seed_users(agency_id)
        # 3. Données métier (indépendantes)
        await seed_tiers()
        await seed_camions()
        await seed_chauffeurs()
        print("✅ All seed data completed successfully!")
    except Exception as e:
        print(f"❌ Error during seed: {e}")
        import traceback
        traceback.print_exc()
        raise
    finally:
        await engine.dispose()


if __name__ == "__main__":
    asyncio.run(main())
