# scripts/seed_client_portal.py — Script de génération de données de démonstration B2B Portal
import sys
import os
from datetime import datetime, timedelta
from decimal import Decimal

# Ajuster le chemin Python pour inclure kamlog-backend
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'kamlog-backend')))

from app.database import SessionLocal
from app.models.agency import Agency
from app.models.tiers import Tiers, StatutTiers
from app.models.transport import MissionTransport, StatutMission, StatutCamion, CamionFlotte, ChauffeurProfil, TypeVehicule
from app.models.finance import Facture, StatutFacture, ModePaiement
from app.models.magasin import Declaration, StatutDeclaration
from app.models.bill_of_loading import BillOfLoading, ContainerDetail, GoodsDetail


def seed_client_portal_data():
    db = SessionLocal()
    print("[SEED] Initialisation des donnees B2B Client Portal KAMLOG ERP...")

    try:

        # 1. Agence Principale
        agency = db.query(Agency).filter(Agency.code == "DLA-01").first()
        if not agency:
            agency = Agency(nom="KAMLOG Douala Port Agency", code="DLA-01", is_active=True, ville="Douala", pays="Cameroun")
            db.add(agency)
            db.flush()


        # 2. Client Tiers principal (CFAO Logistics / Bolloré Africa)
        client = db.query(Tiers).filter(Tiers.code_tiers == "CL-CFAO").first()
        if not client:
            client = Tiers(
                raison_sociale="CFAO LOGISTICS CAMEROUN",
                code_tiers="CL-CFAO",
                niu="M082612345678A",
                email="contact@cfao-logistics.cm",
                telephone="+237 699 00 11 22",
                adresse="Zone Portuaire, Douala",
                statut=StatutTiers.ACTIF
            )
            db.add(client)
            db.flush()


        # 3. Flotte & Chauffeurs
        camion = db.query(CamionFlotte).filter(CamionFlotte.immatriculation == "LT-802-AA").first()
        if not camion:
            camion = CamionFlotte(
                immatriculation="LT-802-AA",
                type_vehicule=TypeVehicule.PORTE_CONTENEUR,
                marque="Mercedes-Benz",
                modele="Actros 3344",
                charge_utile_kg=Decimal("35000.00"),
                statut=StatutCamion.DISPONIBLE
            )
            db.add(camion)
            db.flush()


        chauffeur = db.query(ChauffeurProfil).filter(ChauffeurProfil.nom == "EKANI").first()
        if not chauffeur:
            chauffeur = ChauffeurProfil(
                nom="EKANI",
                prenom="Jean-Paul",
                telephone="+237 677 88 99 00",
                numero_permis="CE-884920",
                categorie_permis="CE"
            )
            db.add(chauffeur)
            db.flush()


        # 4. Expéditions / Missions de Transport
        missions = [
            {
                "reference": "OT-2026-00401",
                "origine": "Port Autonome de Douala (PAD)",
                "destination": "Entrepôt CFAO Bassa, Douala",
                "distance_km": Decimal("25.5"),
                "nature_fret": "2 Conteneurs 40ft (Pièces Automobiles)",
                "statut": StatutMission.EN_ROUTE,
                "date_chargement_prevue": datetime.utcnow() - timedelta(hours=3),
                "date_livraison_souhaitee": datetime.utcnow() + timedelta(hours=2),
                "camion_id": camion.id,
                "chauffeur_id": chauffeur.id,
                "tiers_id": client.id
            },
            {
                "reference": "OT-2026-00402",
                "origine": "Kribi Container Terminal (KCT)",
                "destination": "Magasin Mag3 Bonabéri",
                "distance_km": Decimal("180.0"),
                "nature_fret": "Marchandises Générales sous Douane",
                "statut": StatutMission.LIVRE,
                "date_chargement_prevue": datetime.utcnow() - timedelta(days=2),
                "date_livraison_souhaitee": datetime.utcnow() - timedelta(days=1),
                "camion_id": camion.id,
                "chauffeur_id": chauffeur.id,
                "tiers_id": client.id
            }
        ]


        for m_data in missions:
            existing = db.query(MissionTransport).filter(MissionTransport.reference == m_data["reference"]).first()
            if not existing:
                m = MissionTransport(**m_data)
                db.add(m)

        # 5. Factures Client
        factures = [
            {
                "numero_facture": "FAC-2026-0891",
                "montant_ht_xaf": Decimal("4500000.00"),
                "montant_tva": Decimal("866250.00"),
                "montant_ttc_xaf": Decimal("5366250.00"),
                "statut": StatutFacture.PAYEE,
                "date_emission": datetime.utcnow() - timedelta(days=10),
                "date_echeance": datetime.utcnow() + timedelta(days=20),
                "tiers_id": client.id
            },
            {
                "numero_facture": "FAC-2026-0904",
                "montant_ht_xaf": Decimal("1800000.00"),
                "montant_tva": Decimal("346500.00"),
                "montant_ttc_xaf": Decimal("2146500.00"),
                "statut": StatutFacture.VALIDEE_NON_PAYEE,
                "date_emission": datetime.utcnow() - timedelta(days=2),
                "date_echeance": datetime.utcnow() + timedelta(days=28),
                "tiers_id": client.id
            }
        ]


        for f_data in factures:
            existing = db.query(Facture).filter(Facture.numero_facture == f_data["numero_facture"]).first()
            if not existing:
                f = Facture(**f_data)
                db.add(f)

        db.commit()
        print("[SUCCESS] Donnees de demonstration B2B Portal creees avec succes !")
    except Exception as ex:
        db.rollback()
        print(f"[ERROR] Erreur lors du seed B2B Portal : {ex}")
    finally:
        db.close()



if __name__ == "__main__":
    seed_client_portal_data()
