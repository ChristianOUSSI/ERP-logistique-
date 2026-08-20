"""
Database seeder - Initializes the database with test data
Creates 8 operational accounts as specified in CLAUDE.md
"""
from sqlalchemy.orm import Session
from datetime import datetime
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from app.core.database import engine, SessionLocal, Base
from app.core.security import get_password_hash
from app.models.user import User, Role, Permission
from app.models.agency import Agency
from app.models.tiers import Client, Fournisseur
from app.models.transport import Camion, Conducteur
from app.models.finance import Compte
from app.models.magasin import Stock, Entrepot


def seed_agencies(db: Session):
    """Create initial agencies"""
    agencies = [
        Agency(code="HQ", name="Siège Douala", city="Douala", is_headquarters=True),
        Agency(code="KRI", name="Agence Kribi", city="Kribi"),
        Agency(code="BAO", name="Agence Bafoussam", city="Bafoussam"),
    ]
    
    for agency in agencies:
        if not db.query(Agency).filter(Agency.code == agency.code).first():
            db.add(agency)
    
    db.commit()
    print("✓ Agencies seeded")


def seed_roles(db: Session):
    """Create initial roles with permissions"""
    roles_data = [
        {
            "name": "ADMIN",
            "description": "Administrateur système avec accès complet",
            "modules_allowed": "all"
        },
        {
            "name": "MAGASINIER",
            "description": "Gestionnaire de stock et entrepôt",
            "modules_allowed": "magasin,inventory"
        },
        {
            "name": "DISPATCHER",
            "description": "Responsable dispatch transport",
            "modules_allowed": "transport,dispatch"
        },
        {
            "name": "QHSE",
            "description": "Responsable qualité hygiène sécurité environnement",
            "modules_allowed": "qhse,incidents,reports"
        },
        {
            "name": "FINANCIER",
            "description": "Responsable comptabilité et finance",
            "modules_allowed": "finance,accounting,invoice"
        },
        {
            "name": "DOUANE",
            "description": "Responsable dédouanement et transit",
            "modules_allowed": "transit,customs,declaration"
        },
        {
            "name": "PARC",
            "description": "Responsable gestion parc automobile",
            "modules_allowed": "parc,maintenance,vehicles"
        },
        {
            "name": "AUDITOR",
            "description": "Auditeur système",
            "modules_allowed": "audit,reports,monitoring"
        }
    ]
    
    for role_data in roles_data:
        if not db.query(Role).filter(Role.name == role_data["name"]).first():
            db.add(Role(**role_data))
    
    db.commit()
    print("✓ Roles seeded")


def seed_users(db: Session):
    """Create 8 operational accounts with default password admin123"""
    default_password = get_password_hash("admin123")
    
    users_data = [
        {
            "username": "admin",
            "email": "admin@evolog.cm",
            "full_name": "Administrateur Système",
            "password": default_password,
            "is_superuser": True,
            "role": "ADMIN"
        },
        {
            "username": "magasinier",
            "email": "magasinier@evolog.cm",
            "full_name": "Jean Dupont",
            "password": default_password,
            "role": "MAGASINIER"
        },
        {
            "username": "dispatcher",
            "email": "dispatcher@evolog.cm",
            "full_name": "Marie Koulibaly",
            "password": default_password,
            "role": "DISPATCHER"
        },
        {
            "username": "qhse",
            "email": "qhse@evolog.cm",
            "full_name": "Paul Nguessan",
            "password": default_password,
            "role": "QHSE"
        },
        {
            "username": "financier",
            "email": "financier@evolog.cm",
            "full_name": "Sophie Mensah",
            "password": default_password,
            "role": "FINANCIER"
        },
        {
            "username": "douane",
            "email": "douane@evolog.cm",
            "full_name": "Kofi Annan",
            "password": default_password,
            "role": "DOUANE"
        },
        {
            "username": "parc",
            "email": "parc@evolog.cm",
            "full_name": "Amadou Diallo",
            "password": default_password,
            "role": "PARC"
        },
        {
            "username": "auditor",
            "email": "auditor@evolog.cm",
            "full_name": "Fatou Bensouda",
            "password": default_password,
            "role": "AUDITOR"
        }
    ]
    
    for user_data in users_data:
        role_name = user_data.pop("role")
        password = user_data.pop("password")
        
        if not db.query(User).filter(User.username == user_data["username"]).first():
            user = User(
                hashed_password=password,
                must_change_password=True,
                **user_data
            )
            db.add(user)
            db.flush()
            
            # Assign role
            role = db.query(Role).filter(Role.name == role_name).first()
            if role:
                user.roles.append(role)
    
    db.commit()
    print("✓ Users seeded (8 accounts with password: admin123)")


def seed_comptes_ohada(db: Session):
    """Create OHADA compliant chart of accounts"""
    comptes_data = [
        # Actif
        {"numero": "101", "nom": "Capital", "type_compte": "actif"},
        {"numero": "21", "nom": "Immobilisations corporelles", "type_compte": "actif"},
        {"numero": "31", "nom": "Stocks de matières premières", "type_compte": "actif"},
        {"numero": "41", "nom": "Clients", "type_compte": "actif"},
        {"numero": "52", "nom": "Banque", "type_compte": "actif"},
        {"numero": "57", "nom": "Caisse", "type_compte": "actif"},
        
        # Passif
        {"numero": "16", "nom": "Emprunts et dettes", "type_compte": "passif"},
        {"numero": "40", "nom": "Fournisseurs", "type_compte": "passif"},
        {"numero": "42", "nom": "Personnel", "type_compte": "passif"},
        {"numero": "44", "nom": "État", "type_compte": "passif"},
        
        # Charges
        {"numero": "60", "nom": "Achats consommés", "type_compte": "charge"},
        {"numero": "61", "nom": "Services extérieurs", "type_compte": "charge"},
        {"numero": "62", "nom": "Autres services", "type_compte": "charge"},
        {"numero": "63", "nom": "Charges de personnel", "type_compte": "charge"},
        {"numero": "66", "nom": "Charges financières", "type_compte": "charge"},
        
        # Produits
        {"numero": "70", "nom": "Ventes de marchandises", "type_compte": "produit"},
        {"numero": "72", "nom": "Production immobilisée", "type_compte": "produit"},
        {"numero": "75", "nom": "Autres produits", "type_compte": "produit"},
        {"numero": "76", "nom": "Produits financiers", "type_compte": "produit"},
    ]
    
    for compte_data in comptes_data:
        if not db.query(Compte).filter(Compte.numero == compte_data["numero"]).first():
            db.add(Compte(**compte_data))
    
    db.commit()
    print("✓ OHADA comptes seeded")


def seed_transport_data(db: Session):
    """Create sample transport data"""
    camions = [
        {"immatriculation": "CE-123-A", "marque": "Mercedes", "modele": "Actros", "annee": 2022, "capacite_tonnage": 25},
        {"immatriculation": "CE-456-B", "marque": "Volvo", "modele": "FH", "annee": 2021, "capacite_tonnage": 30},
        {"immatriculation": "CE-789-C", "marque": "Scania", "modele": "R450", "annee": 2023, "capacite_tonnage": 28},
    ]
    
    for camion_data in camions:
        if not db.query(Camion).filter(Camion.immatriculation == camion_data["immatriculation"]).first():
            db.add(Camion(**camion_data))
    
    conducteurs = [
        {"nom": "Martin", "prenom": "Pierre", "numero_permis": "CM-2023-001", "telephone": "699123456"},
        {"nom": "Kouassi", "prenom": "Yao", "numero_permis": "CM-2023-002", "telephone": "699234567"},
        {"nom": "Diallo", "prenom": "Ibrahim", "numero_permis": "CM-2023-003", "telephone": "699345678"},
    ]
    
    for conducteur_data in conducteurs:
        if not db.query(Conducteur).filter(Conducteur.numero_permis == conducteur_data["numero_permis"]).first():
            db.add(Conducteur(**conducteur_data))
    
    db.commit()
    print("✓ Transport data seeded")


def seed_magasin_data(db: Session):
    """Create sample warehouse data"""
    entrepots = [
        {"code": "E001", "nom": "Entrepôt Principal Douala", "ville": "Douala", "capacite": 5000},
        {"code": "E002", "nom": "Entrepôt Kribi", "ville": "Kribi", "capacite": 3000},
    ]
    
    for entrepot_data in entrepots:
        if not db.query(Entrepot).filter(Entrepot.code == entrepot_data["code"]).first():
            db.add(Entrepot(**entrepot_data))
    
    stocks = [
        {"code_article": "ART-001", "designation": "Ciment 50kg", "categorie": "Construction", "unite_mesure": "sac", "quantite_disponible": 500, "prix_unitaire": 6500},
        {"code_article": "ART-002", "designation": "Fer à béton 12mm", "categorie": "Construction", "unite_mesure": "tonne", "quantite_disponible": 50, "prix_unitaire": 500000},
        {"code_article": "ART-003", "designation": "Sable de rivière", "categorie": "Construction", "unite_mesure": "m3", "quantite_disponible": 200, "prix_unitaire": 15000},
    ]
    
    for stock_data in stocks:
        if not db.query(Stock).filter(Stock.code_article == stock_data["code_article"]).first():
            db.add(Stock(**stock_data))
    
    db.commit()
    print("✓ Magasin data seeded")


def seed_tiers_data(db: Session):
    """Create sample clients and suppliers"""
    clients = [
        {"code": "CLI-001", "name": "Société Camerounaise de Construction", "city": "Douala", "credit_limit": 50000000},
        {"code": "CLI-002", "name": "Entreprise Générale du Bâtiment", "city": "Yaoundé", "credit_limit": 30000000},
    ]
    
    for client_data in clients:
        if not db.query(Client).filter(Client.code == client_data["code"]).first():
            db.add(Client(**client_data))
    
    fournisseurs = [
        {"code": "FOU-001", "name": "Cimencam", "city": "Douala"},
        {"code": "FOU-002", "name": "Société des Aciers du Cameroun", "city": "Kribi"},
    ]
    
    for fournisseur_data in fournisseurs:
        if not db.query(Fournisseur).filter(Fournisseur.code == fournisseur_data["code"]).first():
            db.add(Fournisseur(**fournisseur_data))
    
    db.commit()
    print("✓ Tiers data seeded")


def main():
    """Main seeding function"""
    print("🌱 Starting database seeding...")
    
    # Create all tables
    Base.metadata.create_all(bind=engine)
    print("✓ Database tables created")
    
    db = SessionLocal()
    try:
        seed_agencies(db)
        seed_roles(db)
        seed_users(db)
        seed_comptes_ohada(db)
        seed_transport_data(db)
        seed_magasin_data(db)
        seed_tiers_data(db)
        
        print("\n✅ Database seeding completed successfully!")
        print("📝 Default credentials:")
        print("   Username: admin")
        print("   Password: admin123")
        print("   (7 additional accounts available)")
        
    except Exception as e:
        print(f"❌ Error during seeding: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()