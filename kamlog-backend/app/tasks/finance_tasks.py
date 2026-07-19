from celery import shared_task
from app.database import SessionLocal
from app.models.transport import MissionTransport
from app.models.finance import Facture, FactureLigne, StatutFacture
from app.tasks.email_tasks import send_email_async
import logging
import uuid
from decimal import Decimal

logger = logging.getLogger(__name__)

@shared_task
def generate_invoice_for_mission_async(mission_id: int):
    """
    Tâche Celery qui génère automatiquement une facture lorsqu'une mission est terminée.
    C'est la 'Colle' entre le module Transport et Finance.
    """
    db = SessionLocal()
    try:
        mission = db.query(MissionTransport).filter(MissionTransport.id == mission_id).first()
        if not mission:
            logger.error(f"Mission {mission_id} introuvable pour la facturation.")
            return False
            
        if not mission.tiers_id:
            logger.warning(f"Mission {mission_id} sans client (tiers_id) associé. Facturation ignorée.")
            return False
            
        # Vérifier si une facture existe déjà pour cette mission
        existing_facture = db.query(Facture).filter(Facture.mission_id == mission_id).first()
        if existing_facture:
            logger.info(f"Facture déjà existante pour la mission {mission_id}.")
            return False
            
        # Générer une facture
        numero = f"FAC-AUTO-{uuid.uuid4().hex[:6].upper()}"
        
        # On va créer une facture
        nouvelle_facture = Facture(
            numero_facture=numero,
            tiers_id=mission.tiers_id,
            mission_id=mission.id,
            statut=StatutFacture.BROUILLON,
            montant_ht_xaf=Decimal("0.00"),
            montant_tva=Decimal("0.00"),
            montant_ttc_xaf=Decimal("0.00")
        )
        db.add(nouvelle_facture)
        db.flush() # Pour avoir l'ID
        
        # Ajouter une ligne de facturation standard
        # En réalité, on irait chercher le contrat/grille tarifaire.
        tarif_standard = Decimal("150000.00")
        ligne = FactureLigne(
            facture_id=nouvelle_facture.id,
            code_prestation="TRANSP_DEFAUT",
            quantite=Decimal("1.00"),
            prix_unitaire_applique=tarif_standard,
            montant_ligne_ht=tarif_standard
        )
        db.add(ligne)
        
        nouvelle_facture.montant_ht_xaf = tarif_standard
        nouvelle_facture.montant_tva = tarif_standard * Decimal("0.1925")
        nouvelle_facture.montant_ttc_xaf = nouvelle_facture.montant_ht_xaf + nouvelle_facture.montant_tva
        
        db.commit()
        logger.info(f"Facture {numero} générée automatiquement pour la mission {mission_id}.")
        
        # Envoyer un email de notification (Event chaining)
        # Assuming we can find the client's email, for now use a dummy or dispatch
        send_email_async.delay(
            f"Nouvelle Facture Générée: {numero}",
            ["comptabilite@kamlog.cm"],
            f"La facture {numero} a été générée automatiquement pour la mission {mission.reference or mission.id}."
        )
        
        return True
    except Exception as e:
        db.rollback()
        logger.error(f"Erreur lors de la facturation automatique pour mission {mission_id}: {e}")
        return False
    finally:
        db.close()
