# scripts/seed_data.py  Seed Data KAMLOG
import os

from sqlalchemy import select
from app.database import SessionLocal, engine
from app.models.agency import Agency
from app.models.user import User, Role, RoleModel, PermissionModel
from sqlalchemy.orm import selectinload
from app.models.tiers import Tiers, StatutTiers
from app.models.transport import CamionFlotte, ChauffeurProfil, TypeVehicule
from app.models.magasin import Magasin, Article, Stock, UniteMesure, CategorieArticle, StatutStock
from app.utils.security import get_password_hash


def seed_agency() -> int:
    """Crée l'agence par défaut (multi-tenancy). Retourne son ID."""
    with SessionLocal() as session:
        # Vérifier si l'agence existe déjà
        result = session.execute(select(Agency).where(Agency.code == "KAM-DLA"))
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
        session.commit()
        session.refresh(agency)
        print(f"✅ Agency seeded successfully (id={agency.id})")
        return agency.id


def seed_users(agency_id: int):
    """Crée les utilisateurs par défaut. Idempotent : ignore les doublons."""
    with SessionLocal() as session:
        users_data = [
            {
                "email": "admin@kamlog.cm",
                "username": "admin",
                "password": os.getenv("ADMIN123_PASSWORD", "admin123"),
                "full_name": "Administrateur Système",
                "role": Role.ADMIN,
            },
            {
                "email": "dispatcher@kamlog.cm",
                "username": "dispatcher",
                "password": os.getenv("DISPATCHER123_PASSWORD", "dispatcher123"),
                "full_name": "Chef Dispatch",
                "role": Role.DISPATCHER,
            },
            {
                "email": "finance@kamlog.cm",
                "username": "finance",
                "password": os.getenv("FINANCE123_PASSWORD", "finance123"),
                "full_name": "Comptable",
                "role": Role.FINANCE,
            },
            {
                "email": "douane@kamlog.cm",
                "username": "douane",
                "password": os.getenv("DOUANE123_PASSWORD", "douane123"),
                "full_name": "Agent Douane",
                "role": Role.DOUANE,
            },
            {
                "email": "gate@kamlog.cm",
                "username": "gate",
                "password": os.getenv("GATE123_PASSWORD", "gate123"),
                "full_name": "Agent Guérite",
                "role": Role.GATE_AGENT,
            },
            {
                "email": "magasin@kamlog.cm",
                "username": "magasin",
                "password": os.getenv("MAGASIN123_PASSWORD", "magasin123"),
                "full_name": "Chef Magasinier",
                "role": Role.MAGASIN,
            },
            {
                "email": "auditor@kamlog.cm",
                "username": "auditor",
                "password": os.getenv("AUDITOR123_PASSWORD", "auditor123"),
                "full_name": "Auditeur Interne",
                "role": Role.AUDITOR,
            },
        ]

        created = 0
        for u in users_data:
            # Vérifier si l'utilisateur existe déjà
            result = session.execute(select(User).options(selectinload(User.roles)).where(User.email == u["email"]))
            user = result.scalar_one_or_none()
            if user:
                print(f"  → User {u['email']} already exists.")
                # Assigner le rôle s'il n'en a pas
                role_result = session.execute(select(RoleModel).where(RoleModel.code == u["role"]))
                role_db = role_result.scalar_one_or_none()
                if role_db and role_db not in user.roles:
                    user.roles.append(role_db)
                    print(f"    → Role {u['role']} assigned to {u['email']}.")
                continue

            user = User(
                email=u["email"],
                username=u["username"],
                password_hash=get_password_hash(u["password"]),
                full_name=u["full_name"],
                agency_id=agency_id,
                is_active=True,
            )
            
            # Find the RoleModel and add it to user.roles
            role_result = session.execute(select(RoleModel).where(RoleModel.code == u["role"]))
            role_db = role_result.scalar_one_or_none()
            if role_db:
                user.roles.append(role_db)
                
            session.add(user)
            created += 1

        session.commit()
        print(f"✅ Users seeded: {created} created, {len(users_data) - created} already existed")


def seed_tiers():
    """Crée les clients de test. Idempotent."""
    with SessionLocal() as session:
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
            result = session.execute(select(Tiers).where(Tiers.code_tiers == c["code_tiers"]))
            if result.scalar_one_or_none():
                print(f"  → Tiers {c['code_tiers']} already exists, skipping")
                continue
            session.add(Tiers(**c))
            created += 1

        session.commit()
        print(f"✅ Tiers seeded: {created} created")


def seed_camions():
    """Crée la flotte de camions de test. Idempotent."""
    with SessionLocal() as session:
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
            result = session.execute(
                select(CamionFlotte).where(CamionFlotte.immatriculation == c["immatriculation"])
            )
            if result.scalar_one_or_none():
                print(f"  → Camion {c['immatriculation']} already exists, skipping")
                continue
            session.add(CamionFlotte(**c))
            created += 1

        session.commit()
        print(f"✅ Camions seeded: {created} created")


def seed_chauffeurs():
    """Crée les chauffeurs de test. Idempotent."""
    with SessionLocal() as session:
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
            result = session.execute(
                select(ChauffeurProfil).where(ChauffeurProfil.numero_permis == c["numero_permis"])
            )
            if result.scalar_one_or_none():
                print(f"  → Chauffeur {c['numero_permis']} already exists, skipping")
                continue
            session.add(ChauffeurProfil(**c))
            created += 1

        session.commit()
        print(f"✅ Chauffeurs seeded: {created} created")


def seed_magasin():
    """Crée les données pour le module K-Magasin (Magasin, Articles, Stocks). Idempotent."""
    with SessionLocal() as session:
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
            result = session.execute(select(Magasin).where(Magasin.code == m["code"]))
            mag = result.scalar_one_or_none()
            if not mag:
                mag = Magasin(**m)
                session.add(mag)
                session.flush()  # Pour avoir l'ID
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
            result = session.execute(select(Article).where(Article.code_article == a["code_article"]))
            art = result.scalar_one_or_none()
            if not art:
                art = Article(**a)
                session.add(art)
                session.flush()
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
                result = session.execute(
                    select(Stock).where(
                        (Stock.magasin_id == s["magasin_id"]) & 
                        (Stock.article_id == s["article_id"])
                    )
                )
                stk = result.scalar_one_or_none()
                if not stk:
                    session.add(Stock(**s))

        session.commit()
        print("✅ Magasins, Articles et Stocks seeded")


def seed_rbac():
    """Crée les permissions et rôles par défaut. Idempotent."""
    with SessionLocal() as session:
        # 1. Définir toutes les permissions
        permissions_data = [
            # Parc
            ("parc:read", "Consulter le parc", "parc"),
            ("parc:write", "Modifier le parc", "parc"),
            ("parc:delete", "Supprimer du parc", "parc"),
            ("parc:gate", "Gérer la guérite du parc", "parc"),
            # Transport
            ("transport:read", "Consulter les transports", "transport"),
            ("transport:write", "Modifier les transports", "transport"),
            ("transport:create", "Créer un transport", "transport"),
            ("transport:update", "Modifier un transport", "transport"),
            ("transport:delete", "Supprimer un transport", "transport"),
            # Tiers
            ("tiers:read", "Consulter les tiers", "tiers"),
            ("tiers:write", "Modifier les tiers", "tiers"),
            ("tiers:delete", "Supprimer les tiers", "tiers"),
            # Magasin
            ("magasin:read", "Consulter les magasins", "magasin"),
            ("magasin:create", "Créer un magasin", "magasin"),
            ("magasin:update", "Modifier un magasin", "magasin"),
            ("magasin:delete", "Supprimer un magasin", "magasin"),
            ("magasin:validate", "Valider les opérations magasin", "magasin"),
            ("magasin:authorize", "Autoriser les sorties magasin", "magasin"),
            # Articles
            ("article:read", "Consulter les articles", "magasin"),
            ("article:create", "Créer un article", "magasin"),
            ("article:update", "Modifier un article", "magasin"),
            ("article:delete", "Supprimer un article", "magasin"),
            # Stock
            ("stock:read", "Consulter le stock", "magasin"),
            ("stock:write", "Gérer les mouvements de stock", "magasin"),
            # Réception
            ("reception:read", "Consulter les réceptions", "magasin"),
            ("reception:create", "Créer une réception", "magasin"),
            ("reception:update", "Modifier une réception", "magasin"),
            # Déclaration
            ("declaration:read", "Consulter les déclarations", "magasin"),
            ("declaration:create", "Créer une déclaration", "magasin"),
            ("declaration:update", "Modifier une déclaration", "magasin"),
            # Commande
            ("commande:read", "Consulter les commandes", "magasin"),
            ("commande:create", "Créer une commande", "magasin"),
            ("commande:update", "Modifier une commande", "magasin"),
            # Bande
            ("bande:read", "Consulter les bandes de livraison", "magasin"),
            ("bande:create", "Créer une bande de livraison", "magasin"),
            ("bande:update", "Modifier une bande de livraison", "magasin"),
            # Documents
            ("documents:read", "Consulter les documents", "documents"),
            ("documents:write", "Modifier les documents", "documents"),
            # Master data
            ("master-data:read", "Consulter les données de référence", "master-data"),
            ("master-data:create", "Créer des données de référence", "master-data"),
            ("master-data:update", "Modifier des données de référence", "master-data"),
            ("master-data:delete", "Supprimer des données de référence", "master-data"),
            # Finance
            ("finance:read", "Consulter les données financières", "finance"),
            ("finance:write", "Modifier les données financières", "finance"),
            ("finance:delete", "Supprimer les données financières", "finance"),
            ("finance:validate", "Valider les transactions financières", "finance"),
            # Purchase / Achats
            ("purchase:read", "Consulter les fiches de besoin", "purchase"),
            ("purchase:create", "Créer une fiche de besoin", "purchase"),
            ("purchase:update", "Modifier une fiche de besoin", "purchase"),
            ("purchase:delete", "Supprimer une fiche de besoin", "purchase"),
            ("purchase:submit", "Soumettre une fiche de besoin", "purchase"),
            ("purchase:approve", "Approuver une fiche de besoin", "purchase"),
            # Audit
            ("audit:read", "Consulter les traces d'audit", "audit"),
            ("audit:write", "Gérer les traces d'audit", "audit"),
            # Notifications
            ("notifications:create", "Créer des notifications", "notifications"),
            ("notifications:read_all", "Consulter toutes les notifications", "notifications"),
            # Admin
            ("admin", "Accès administration générale", "admin"),
        ]

        # Insérer les permissions
        permissions_map = {}
        for code, name, module in permissions_data:
            result = session.execute(select(PermissionModel).where(PermissionModel.code == code))
            perm = result.scalar_one_or_none()
            if not perm:
                perm = PermissionModel(code=code, name=name, module=module)
                session.add(perm)
                session.flush()
            permissions_map[code] = perm

        # 2. Définir les rôles par défaut
        roles_data = [
            ("admin", "Administrateur Système", "Accès total à tous les modules et configurations.", [
                c for c, _, _ in permissions_data
            ]),
            ("dispatcher", "Chef Dispatch", "Gestion du flux de véhicules et affectation des quais.", [
                "parc:read", "transport:read", "transport:write", "tiers:read", "magasin:create", "magasin:read", "magasin:update"
            ]),
            ("finance", "Comptable", "Facturation, dépenses et rapports financiers.", [
                "finance:read", "finance:write", "tiers:read", "magasin:read"
            ]),
            ("douane", "Agent Douane", "Gestion et validation des documents douaniers.", [
                "documents:read", "documents:write", "magasin:read"
            ]),
            ("gate_agent", "Agent Guérite", "Contrôle d'accès physique aux portes du parc.", [
                "parc:read", "parc:gate", "magasin:read"
            ]),
            ("magasin", "Chef Magasinier", "Gestion des stocks, articles et inventaires.", [
                "magasin:create", "magasin:read", "magasin:update", "magasin:delete",
                "magasin:validate", "magasin:authorize",
                "article:create", "article:read", "article:update", "article:delete",
                "stock:read", "stock:write",
                "reception:create", "reception:read", "reception:update",
                "declaration:create", "declaration:read", "declaration:update",
                "commande:create", "commande:read", "commande:update",
                "bande:create", "bande:read", "bande:update",
                "tiers:read", "documents:read", "master-data:read",
            ]),
            ("auditor", "Auditeur Interne", "Consultation globale et rapports d'audit.", [
                "audit:read", "audit:write",
                "magasin:read", "stock:read",
                "finance:read", "transport:read", "tiers:read",
                "documents:read", "parc:read",
            ]),
        ]

        for code, name, desc, perm_codes in roles_data:
            result = session.execute(
                select(RoleModel)
                .options(selectinload(RoleModel.permissions))
                .where(RoleModel.code == code)
            )
            role = result.scalar_one_or_none()

            role_perms = []
            for pc in perm_codes:
                if pc in permissions_map:
                    role_perms.append(permissions_map[pc])

            if not role:
                role = RoleModel(code=code, name=name, description=desc, is_active=True, permissions=role_perms)
                session.add(role)
            else:
                role.permissions = role_perms

        session.commit()
        print("✅ Permissions and Roles seeded successfully")


def main():
    """Exécute tous les seeds dans le bon ordre."""
    print("🌱 Starting seed data...")

    try:
        # 1. Agency DOIT être créée en premier (les users en dépendent)
        agency_id = seed_agency()
        # 2. Seed les permissions et les rôles dynamiques avant d'associer des users
        seed_rbac()
        # 3. Users (liés à l'agency)
        seed_users(agency_id)
        # 4. Données métier (indépendantes)
        seed_tiers()
        seed_camions()
        seed_chauffeurs()
        seed_magasin()
        print("✅ All seed data completed successfully!")
    except Exception as e:
        print(f"❌ Error during seed: {e}")
        import traceback
        traceback.print_exc()
        raise
    finally:
        engine.dispose()


if __name__ == "__main__":
    main()
