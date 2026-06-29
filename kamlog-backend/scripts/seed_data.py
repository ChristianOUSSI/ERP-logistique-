# scripts/seed_data.py  Seed Data KAMLOG
import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import AsyncSessionLocal, engine
from app.models.agency import Agency
from app.models.user import User, Role
from app.models.tiers import Tiers, StatutTiers
from app.models.transport import CamionFlotte, ChauffeurProfil, TypeVehicule
from app.models.magasin import Magasin, Article, Stock, UniteMesure, CategorieArticle, StatutStock
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
            {
                "email": "magasin@kamlog.cm",
                "username": "magasin",
                "password": "magasin123",
                "full_name": "Chef Magasinier",
                "role": Role.MAGASIN,
            },
            {
                "email": "auditor@kamlog.cm",
                "username": "auditor",
                "password": "auditor123",
                "full_name": "Auditeur Interne",
                "role": Role.AUDITOR,
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


async def seed_magasin():
    """Crée les données pour le module K-Magasin (Magasin, Articles, Stocks). Idempotent."""
    async with AsyncSessionLocal() as session:
        # 1. Magasins
        magasins_data = [
            {
                "code": "MAG-DLA-01",
                "nom": "Magasin Principal Port",
                "ville": "Douala",
            },
            {
                "code": "MAG-DLA-02",
                "nom": "Entrepôt Douane",
                "ville": "Douala",
            }
        ]
        
        magasins_map = {}
        for m in magasins_data:
            result = await session.execute(select(Magasin).where(Magasin.code == m["code"]))
            mag = result.scalar_one_or_none()
            if not mag:
                mag = Magasin(**m)
                session.add(mag)
                await session.flush()  # Pour avoir l'ID
            magasins_map[m["code"]] = mag

        # 2. Articles
        articles_data = [
            {
                "code_article": "ART-001",
                "nom": "Pièces de rechange Camion",
                "categorie": CategorieArticle.PIECES_DETACHEES,
                "unite_mesure": UniteMesure.UDB,
                "poids_unitaire": 5.0,
            },
            {
                "code_article": "ART-002",
                "nom": "Equipement de Protection Individuelle (EPI)",
                "categorie": CategorieArticle.EQUIPEMENT,
                "unite_mesure": UniteMesure.UNITE,
                "poids_unitaire": 1.5,
            },
            {
                "code_article": "ART-003",
                "nom": "Carburant Diesel (Fût)",
                "categorie": CategorieArticle.MATIERES_PREMIERES,
                "unite_mesure": UniteMesure.M3,
                "volume_unitaire": 0.2,
            }
        ]

        articles_map = {}
        for a in articles_data:
            result = await session.execute(select(Article).where(Article.code_article == a["code_article"]))
            art = result.scalar_one_or_none()
            if not art:
                art = Article(**a)
                session.add(art)
                await session.flush()
            articles_map[a["code_article"]] = art

        # 3. Stocks (Magasin Principal)
        mag_princ = magasins_map.get("MAG-DLA-01")
        if mag_princ:
            stocks_data = [
                {
                    "magasin_id": mag_princ.id,
                    "article_id": articles_map["ART-001"].id,
                    "quantite_disponible": 150,
                    "quantite_udb": 150,
                    "statut": StatutStock.NORMAL,
                },
                {
                    "magasin_id": mag_princ.id,
                    "article_id": articles_map["ART-002"].id,
                    "quantite_disponible": 300,
                    "quantite_udb": 300,
                    "statut": StatutStock.NORMAL,
                },
                {
                    "magasin_id": mag_princ.id,
                    "article_id": articles_map["ART-003"].id,
                    "quantite_disponible": 45,
                    "quantite_udb": 45,
                    "statut": StatutStock.NORMAL,
                }
            ]
            
            for s in stocks_data:
                result = await session.execute(
                    select(Stock).where(
                        (Stock.magasin_id == s["magasin_id"]) & 
                        (Stock.article_id == s["article_id"])
                    )
                )
                stk = result.scalar_one_or_none()
                if not stk:
                    session.add(Stock(**s))

        await session.commit()
        print("✅ Magasins, Articles et Stocks seeded")


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
        await seed_magasin()
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
