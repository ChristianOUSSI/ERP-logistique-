#!/usr/bin/env python3
"""
KAMLOG EM-ERP - Seed Demo Data Script
Ce script peuple la base de données avec des milliers de données factices réalistes
pour les démonstrations commerciales.
"""
import os
import sys
import random
import uuid
from datetime import datetime, timedelta

# Ajouter le répertoire racine au PYTHONPATH
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from app.database import engine, SessionLocal, Base
from app.models.user import User
from app.models.tiers import Tiers, CategorieTiers
from app.models.transport import Camion, Chauffeur, MissionTransport, StatutMission
from app.models.finance import Facture, StatutFacture

# Liste de noms pour la génération
PRENOMS = ["Jean", "Paul", "Pierre", "Jacques", "Marie", "Sophie", "Luc", "Marc", "Antoine", "Thomas", "Ahmadou", "Fatou", "Moussa", "Amadou", "Oumar"]
NOMS = ["Kamga", "Ndiaye", "Traore", "Sow", "Diallo", "Mvondo", "Nguema", "Kouassi", "Kone", "Ouedraogo", "Ballo", "Diop", "Fall", "Mbaye"]
ENTREPRISES = ["Logistics SA", "TransPort CM", "Douala Fret", "Kribi Transit", "Global Shipping", "AfricTrafic", "CamerFret", "Negoce International", "Import-Export Pro", "Bolloré Africa"]
VILLES = ["Douala", "Yaoundé", "Kribi", "Garoua", "Maroua", "Bafoussam", "Bamenda", "Ngaoundéré", "Bertoua", "Ebolowa", "Ndjamena", "Bangui"]

def random_date(start_days_ago=30, end_days_ahead=30):
    now = datetime.now()
    delta = timedelta(days=random.randint(-start_days_ago, end_days_ahead))
    return now + delta

def seed_tiers(db: Session, count: int = 100):
    print(f"Génération de {count} Tiers...")
    tiers_list = []
    for i in range(count):
        is_company = random.choice([True, False])
        if is_company:
            nom = f"{random.choice(ENTREPRISES)} {random.randint(1, 100)}"
        else:
            nom = f"{random.choice(PRENOMS)} {random.choice(NOMS)}"
            
        t = Tiers(
            code=f"CLI-{str(uuid.uuid4())[:6].upper()}",
            nom=nom,
            categorie=random.choice([CategorieTiers.CLIENT, CategorieTiers.FOURNISSEUR, CategorieTiers.TRANSPORTEUR]),
            email=f"contact_{i}@{nom.replace(' ', '').lower()}.com",
            telephone=f"+237 6{random.randint(50000000, 99999999)}",
            ville=random.choice(VILLES)
        )
        db.add(t)
        tiers_list.append(t)
    db.commit()
    return tiers_list

def seed_transport(db: Session, count_camions=50, count_chauffeurs=50, count_missions=200, tiers_list=[]):
    print(f"Génération de {count_camions} camions et {count_chauffeurs} chauffeurs...")
    
    camions = []
    for i in range(count_camions):
        c = Camion(
            immatriculation=f"LT-{random.randint(100, 999)}-{random.choice(['AA', 'AB', 'AC'])}",
            marque=random.choice(["Mercedes", "Renault", "MAN", "Volvo", "Scania"]),
            modele="Tracteur",
            statut=random.choice(["DISPONIBLE", "EN_ROUTE", "MAINTENANCE"])
        )
        db.add(c)
        camions.append(c)
        
    chauffeurs = []
    for i in range(count_chauffeurs):
        ch = Chauffeur(
            nom=random.choice(NOMS),
            prenom=random.choice(PRENOMS),
            telephone=f"+237 6{random.randint(50000000, 99999999)}",
            statut="ACTIF"
        )
        db.add(ch)
        chauffeurs.append(ch)
        
    db.commit()
    
    print(f"Génération de {count_missions} missions de transport...")
    for i in range(count_missions):
        client = random.choice(tiers_list) if tiers_list else None
        m = MissionTransport(
            reference=f"TRN-2026-{i:04d}",
            client_id=client.id if client else None,
            camion_id=random.choice(camions).id if camions else None,
            chauffeur_id=random.choice(chauffeurs).id if chauffeurs else None,
            origine=random.choice(VILLES),
            destination=random.choice(VILLES),
            date_prevue=random_date(10, 10),
            statut=random.choice([s for s in StatutMission])
        )
        db.add(m)
    db.commit()

def main():
    print("Démarrage du script de Seeding KAMLOG EM-ERP...")
    db = SessionLocal()
    try:
        # Vider les tables existantes (Approuvé par l'utilisateur pour les démos)
        print("Nettoyage de la base de données...")
        Base.metadata.drop_all(bind=engine)
        Base.metadata.create_all(bind=engine)
        
        tiers = seed_tiers(db, 200)
        seed_transport(db, 50, 50, 500, tiers)
        
        print("✅ Base de données peuplée avec succès !")
    except Exception as e:
        print(f"❌ Erreur: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    main()
