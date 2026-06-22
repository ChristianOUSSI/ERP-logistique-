# scripts/seed_magasin_data.py - Script pour initialiser les données du module K-Magasin
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from sqlalchemy.orm import Session
from app.database import engine, get_db
from app.models.magasin import (
    Magasin, Incoterm, TypeConteneur, Transaction,
    CategorieArticle, StatutStock
)


def seed_magasins(db: Session):
    """Crée les magasins prédéfinis (MAG 3, DNW1, DNW2)"""
    magasins_data = [
        {
            "code": "MAG3",
            "nom": "Magasin 3",
            "adresse": "Zone Portuaire",
            "ville": "Douala",
            "pays": "Cameroun",
            "telephone": "+237 233 000 000",
            "email": "mag3@kamlog.cm",
            "est_actif": True
        },
        {
            "code": "DNW1",
            "nom": "Depot Nord West 1",
            "adresse": "Zone Portuaire",
            "ville": "Douala",
            "pays": "Cameroun",
            "telephone": "+237 233 000 001",
            "email": "dnw1@kamlog.cm",
            "est_actif": True
        },
        {
            "code": "DNW2",
            "nom": "Depot Nord West 2",
            "adresse": "Zone Portuaire",
            "ville": "Douala",
            "pays": "Cameroun",
            "telephone": "+237 233 000 002",
            "email": "dnw2@kamlog.cm",
            "est_actif": True
        }
    ]
    
    for mag_data in magasins_data:
        existing = db.query(Magasin).filter(Magasin.code == mag_data["code"]).first()
        if not existing:
            magasin = Magasin(**mag_data)
            db.add(magasin)
            print(f"✅ Magasin {mag_data['code']} créé")
        else:
            print(f"ℹ️ Magasin {mag_data['code']} existe déjà")
    
    db.commit()
    print("\n✅ Magasins initialisés avec succès")


def seed_incoterms(db: Session):
    """Crée tous les incoterms"""
    incoterms_data = [
        {"code": "EXW", "nom": "Ex Works", "description": "Le vendeur met les marchandises à disposition dans ses locaux"},
        {"code": "FCA", "nom": "Free Carrier", "description": "Le vendeur remet les marchandises au transporteur désigné"},
        {"code": "FAS", "nom": "Free Alongside Ship", "description": "Le vendeur met les marchandises le long du navire"},
        {"code": "FOB", "nom": "Free On Board", "description": "Le vendeur met les marchandises à bord du navire"},
        {"code": "CPT", "nom": "Carriage Paid To", "description": "Le vendeur paie le transport jusqu'au lieu de destination"},
        {"code": "CIP", "nom": "Carriage and Insurance Paid To", "description": "Le vendeur paie le transport et l'assurance"},
        {"code": "CFR", "nom": "Cost and Freight", "description": "Le vendeur paie le coût et le fret jusqu'au port de destination"},
        {"code": "CIF", "nom": "Cost, Insurance and Freight", "description": "Le vendeur paie le coût, l'assurance et le fret"},
        {"code": "DAP", "nom": "Delivered At Place", "description": "Le vendeur livre les marchandises au lieu de destination"},
        {"code": "DPU", "nom": "Delivered at Place Unloaded", "description": "Le vendeur livre et décharge les marchandises"},
        {"code": "DDP", "nom": "Delivered Duty Paid", "description": "Le vendeur livre avec droits de douane payés"}
    ]
    
    for inc_data in incoterms_data:
        existing = db.query(Incoterm).filter(Incoterm.code == inc_data["code"]).first()
        if not existing:
            incoterm = Incoterm(**inc_data)
            db.add(incoterm)
            print(f"✅ Incoterm {inc_data['code']} créé")
        else:
            print(f"ℹ️ Incoterm {inc_data['code']} existe déjà")
    
    db.commit()
    print("\n✅ Incoterms initialisés avec succès")


def seed_types_conteneur(db: Session):
    """Crée tous les types de conteneurs"""
    types_conteneur_data = [
        {"code": "20DRY", "nom": "20' Dry", "description": "Conteneur sec 20 pieds", "longueur": "20'", "type_conteneur": "Dry"},
        {"code": "40DRY", "nom": "40' Dry", "description": "Conteneur sec 40 pieds", "longueur": "40'", "type_conteneur": "Dry"},
        {"code": "40HC", "nom": "40' High Cube", "description": "Conteneur haut 40 pieds", "longueur": "40'", "type_conteneur": "High Cube"},
        {"code": "40RF", "nom": "40' Reefer", "description": "Conteneur réfrigéré 40 pieds", "longueur": "40'", "type_conteneur": "Reefer"},
        {"code": "20OT", "nom": "Open Top", "description": "Conteneur toit ouvert", "longueur": "20'", "type_conteneur": "Open Top"},
        {"code": "40FR", "nom": "Flat Rack", "description": "Conteneur plateau", "longueur": "40'", "type_conteneur": "Flat Rack"},
        {"code": "20TK", "nom": "Tank", "description": "Conteneur citerne", "longueur": "20'", "type_conteneur": "Tank"},
        {"code": "40VT", "nom": "Ventilated", "description": "Conteneur ventilé", "longueur": "40'", "type_conteneur": "Ventilated"},
        {"code": "20INS", "nom": "Insulated", "description": "Conteneur isolé", "longueur": "20'", "type_conteneur": "Insulated"}
    ]
    
    for tc_data in types_conteneur_data:
        existing = db.query(TypeConteneur).filter(TypeConteneur.code == tc_data["code"]).first()
        if not existing:
            type_conteneur = TypeConteneur(**tc_data)
            db.add(type_conteneur)
            print(f"✅ Type conteneur {tc_data['code']} créé")
        else:
            print(f"ℹ️ Type conteneur {tc_data['code']} existe déjà")
    
    db.commit()
    print("\n✅ Types de conteneur initialisés avec succès")


def seed_transactions(db: Session):
    """Crée les transactions principales"""
    transactions_data = [
        {"code_transaction": "KC34", "nom": "Création profil client", "description": "Création d'un nouveau profil client", "interface": "client_create", "role_requis": "ADMIN"},
        {"code_transaction": "KM24", "nom": "Réception marchandise", "description": "Réception de marchandises dans un magasin", "interface": "reception_create", "role_requis": "MAGASINIER"},
        {"code_transaction": "KM01", "nom": "Visualisation stock par client", "description": "Visualisation du stock par client", "interface": "stock_by_client", "role_requis": "MAGASINIER"},
        {"code_transaction": "KM22", "nom": "Visualisation stock général", "description": "Visualisation du stock général tous magasins", "interface": "stock_general", "role_requis": "MAGASINIER"},
        {"code_transaction": "KM32", "nom": "Taux d'occupation magasin", "description": "Visualisation du taux d'occupation des magasins", "interface": "magasin_occupation", "role_requis": "MAGASINIER"},
        {"code_transaction": "KT10", "nom": "Déclaration conteneur", "description": "Déclaration des conteneurs à venir", "interface": "declaration_create", "role_requis": "TRANSITAIRE"},
        {"code_transaction": "KT32", "nom": "Lecture marchandises à arriver", "description": "Consultation des marchandises déclarées", "interface": "declaration_read", "role_requis": "MAGASINIER"},
        {"code_transaction": "KA01", "nom": "Création article", "description": "Création d'un nouvel article", "interface": "article_create", "role_requis": "ADMIN"},
        {"code_transaction": "KA02", "nom": "Recherche article", "description": "Recherche d'articles par code ou nom", "interface": "article_search", "role_requis": "MAGASINIER"},
        {"code_transaction": "KO01", "nom": "Annulation opération", "description": "Annulation d'une opération par numéro d'OT", "interface": "operation_cancel", "role_requis": "ADMIN"}
    ]
    
    for trans_data in transactions_data:
        existing = db.query(Transaction).filter(Transaction.code_transaction == trans_data["code_transaction"]).first()
        if not existing:
            transaction = Transaction(**trans_data)
            db.add(transaction)
            print(f"✅ Transaction {trans_data['code_transaction']} créée")
        else:
            print(f"ℹ️ Transaction {trans_data['code_transaction']} existe déjà")
    
    db.commit()
    print("\n✅ Transactions initialisées avec succès")


def main():
    """Fonction principale pour exécuter tous les seeds"""
    print("🚀 Début de l'initialisation des données K-Magasin...\n")
    
    # Créer les tables si elles n'existent pas
    from app.models.magasin import Base
    Base.metadata.create_all(bind=engine)
    
    # Obtenir une session de base de données
    db = next(get_db())
    
    try:
        seed_magasins(db)
        seed_incoterms(db)
        seed_types_conteneur(db)
        seed_transactions(db)
        
        print("\n🎉 Initialisation des données K-Magasin terminée avec succès!")
        
    except Exception as e:
        print(f"\n❌ Erreur lors de l'initialisation: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()
