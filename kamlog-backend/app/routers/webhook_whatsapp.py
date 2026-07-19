# app/routers/webhook_whatsapp.py
from app.utils.rbac import require_role
from fastapi import APIRouter, Request, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from app.database import get_db
import logging
import json
import re
from datetime import datetime
from typing import List, Dict, Any

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/webhooks", tags=["Webhooks", "ChatOps"])

# In-memory store for Demo purposes
chatops_logs: List[Dict[str, Any]] = []

async def add_log(sender: str, message: str, is_bot: bool = False, action_detected: str = None):
    chatops_logs.append({
        "id": len(chatops_logs) + 1,
        "timestamp": datetime.now().isoformat(),
        "sender": sender,
        "message": message,
        "is_bot": is_bot,
        "action_detected": action_detected
    })
    # Garder seulement les 100 derniers
    if len(chatops_logs) > 100:
        chatops_logs.pop(0)

async def process_whatsapp_message(body: str, sender: str, db: Session):
    """
    Parse le message WhatsApp via un "Smart AI Parser" simulé.
    Il comprend des phrases naturelles et met à jour l'ERP.
    """
    try:
        body_lower = body.lower()
        action_detected = None
        bot_reply = ""
        
        # Log the user message
        
        # 1. Détection Intention : PANNE
        if "panne" in body_lower or "cassé" in body_lower or "problème" in body_lower:
            action_detected = "SIGNALEMENT_PANNE"
            # Cherche un motif ressemblant à une plaque ou ID de camion (ex: LT-1234)
            camion_match = re.search(r'[A-Z]{2}-\d{3,4}', body.upper())
            camion_ref = camion_match.group(0) if camion_match else "Inconnu"
            
            bot_reply = f"🚨 Incident enregistré pour le véhicule {camion_ref}. L'équipe K-Transport a été notifiée et un ordre de maintenance est ouvert."
            logger.info(f"ChatOps: Panne déclarée sur {camion_ref}")

        # 2. Détection Intention : LIVRAISON
        elif "livr" in body_lower or "arrivé" in body_lower or "décharg" in body_lower:
            action_detected = "VALIDATION_LIVRAISON"
            mission_match = re.search(r'TRN-\d+', body.upper())
            mission_ref = mission_match.group(0) if mission_match else "Inconnue"
            
            bot_reply = f"✅ Bien reçu ! La mission {mission_ref} est marquée comme LIVRÉE. La facture sera générée automatiquement par K-Finance."
            logger.info(f"ChatOps: Livraison validée pour {mission_ref}")
            
            # (Simulation d'appel DB)
            from app.models.transport import MissionTransport, StatutMission
            mission_id = mission_ref.replace("TRN-", "")
            if mission_id.isdigit():
                mission = db.query(MissionTransport).filter(MissionTransport.id == int(mission_id)).first()
                if mission:
                    mission.statut = StatutMission.LIVREE
                    db.commit()
                    from app.tasks.finance_tasks import generate_invoice_for_mission_async
                    generate_invoice_for_mission_async.delay(mission.id)
                    
        # 3. Détection Intention : CARBURANT
        elif "carburant" in body_lower or "essence" in body_lower or "gasoil" in body_lower or "plein" in body_lower:
            action_detected = "DEMANDE_CARBURANT"
            bot_reply = "⛽ Demande de recharge carburant reçue. Le bon de carburant dématérialisé a été envoyé sur ton téléphone."
            
        else:
            action_detected = "INCONNU"
            bot_reply = "🤖 Je suis K-Bot. Je n'ai pas compris. Tu peux me dire 'Je suis en panne avec LT-1234' ou 'Mission TRN-001 livrée'."

        add_log(sender, body, is_bot=False, action_detected=action_detected)
        add_log("K-Bot", bot_reply, is_bot=True, action_detected=action_detected)
            
    except Exception as e:
        logger.error(f"Erreur lors du traitement du message WhatsApp: {e}")
        add_log("K-Bot", "Erreur système lors du traitement du message.", is_bot=True)

@router.post("/whatsapp")
@require_role(["admin", "manager"])
async def whatsapp_webhook(request: Request, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    """
    Endpoint appelé par Twilio ou l'API Meta lors de la réception d'un message WhatsApp.
    """
    try:
        # Pour Twilio, les données sont souvent en Form Data
        try:
            form_data = await request.form()
            body = form_data.get("Body", "")
            sender = form_data.get("From", "")
        except:
            body = ""
            sender = ""
            
        # Si c'est du JSON (Simulation depuis le Frontend)
        if not body:
            try:
                json_data = await request.json()
                body = json_data.get("message", "")
                sender = json_data.get("sender", "Chauffeur_Inconnu")
            except Exception:
                pass
                
        if body:
            logger.info(f"Message WhatsApp reçu de {sender}: {body}")
            background_tasks.add_task(process_whatsapp_message, body, sender, db)
            
        return {"status": "success", "message": "Traitement en cours"}
    except Exception as e:
        logger.error(f"Webhook error: {e}")
        raise HTTPException(status_code=500, detail="Webhook processing failed")

@router.get("/chatops/logs")
async def get_chatops_logs():
    """Récupère l'historique des interactions ChatOps pour le tableau de bord."""
    return {"logs": chatops_logs}

