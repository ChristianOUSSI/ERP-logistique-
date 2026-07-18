# app/routers/collaboration.py - Routes WebSocket pour la collaboration en temps réel
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, Query
from typing import Dict, Set
import json
from datetime import datetime
from app.routers.auth import get_current_user
from app.models.user import User
import asyncio
import logging

from app.services.collaboration_service import collaboration_manager

logger = logging.getLogger(__name__)

router = APIRouter()


@router.websocket("/collaborate")
async def collaboration_websocket_endpoint(
    websocket: WebSocket,
    token: str = Query(None),
    entity_type: str = Query(...),
    entity_id: str = Query(...)
):
    """
    WebSocket endpoint pour la collaboration en temps réel sur l'édition d'entités.

    Query Parameters:
    - token: JWT token pour l'authentification
    - entity_type: Type d'entité (article, declaration, commande, etc.)
    - entity_id: ID de l'entité à éditer collaborativement
    """
    # Authentifier l'utilisateur si token fourni
    user = None
    if token:
        try:
            # Dans une vraie app, vous valideriez le JWT token ici
            # Pour maintenant, on accepte les connexions sans auth stricte en développement
            # TODO: Implémenter une validation JWT appropriée
            user = User(id=1, username="test_user", email="test@example.com", is_active=True)  # Placeholder
            # En production, remplacer par une vraie validation:
            # user = await get_current_user_from_token(token)
        except Exception as e:
            logger.warning(f"WebSocket token validation failed: {e}")
            await websocket.close(code=4001, reason="Authentication failed")
            return
    else:
        # En mode développement, autoriser un utilisateur anonyme pour les tests
        user = User(id=0, username="anonymous", email="anonymous@example.com", is_active=True)

    if not user:
        await websocket.close(code=4001, reason="Authentication required")
        return

    # Connecter l'utilisateur au gestionnaire de collaboration
    await websocket.accept()

    try:
        # Envoyer un message de bienvenue
        await websocket.send_text(json.dumps({
            "type": "CONNECT",
            "message": f"Connecté à la session de collaboration pour {entity_type}:{entity_id}",
            "entity_type": entity_type,
            "entity_id": entity_id,
            "timestamp": datetime.now().isoformat()
        }))

        # Faire rejoindre l'utilisateur à la session d'édition
        await collaboration_manager.join_edit_session(websocket, entity_type, entity_id, user)

        # Maintenir la connexion active et traiter les messages entrants
        while True:
            # Attendre les messages venant du client (comme les opérations d'édition, ping/pong, etc.)
            data = await websocket.receive_text()

            try:
                message = json.loads(data)
                await collaboration_manager._handle_client_message(websocket, message, user, entity_type, entity_id)
            except json.JSONDecodeError:
                await websocket.send_text(json.dumps({
                    "type": "ERROR",
                    "message": "Invalid JSON format",
                    "timestamp": datetime.now().isoformat()
                }))
            except Exception as e:
                logger.error(f"Error handling client message: {e}")
                await websocket.send_text(json.dumps({
                    "type": "ERROR",
                    "message": "Error processing message",
                    "timestamp": datetime.now().isoformat()
                }))

    except WebSocketDisconnect:
        logger.info(f"WebSocket disconnected for user {user.id} on {entity_type}:{entity_id}")
        await collaboration_manager.leave_edit_session(websocket, entity_type, entity_id, user)
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        await collaboration_manager.leave_edit_session(websocket, entity_type, entity_id, user)


# Handler pour gérer les messages spécifiques à la collaboration
async def _handle_client_message(websocket: WebSocket, message: dict, user: User, entity_type: str, entity_id: str):
    """Handle messages received from clients for collaboration"""
    message_type = message.get("type")

    if message_type == "JOIN_SESSION":
        # Utilisateur veut rejoindre une session d'édition (redondant avec la connexion initiale mais utile pour rechanger d'entité)
        target_entity_type = message.get("entity_type", entity_type)
        target_entity_id = message.get("entity_id", entity_id)

        await collaboration_manager.join_edit_session(websocket, target_entity_type, target_entity_id, user)

        await websocket.send_text(json.dumps({
            "type": "SESSION_JOINED",
            "entity_type": target_entity_type,
            "entity_id": target_entity_id,
            "participants_count": len(collaboration_manager.active_sessions.get(f"{target_entity_type}:{target_entity_id}", {}).get("participants", {})),
            "timestamp": datetime.now().isoformat()
        }))

    elif message_type == "LEAVE_SESSION":
        # Utilisateur veut quitter la session d'édition
        target_entity_type = message.get("entity_type", entity_type)
        target_entity_id = message.get("entity_id", entity_id)

        await collaboration_manager.leave_edit_session(websocket, target_entity_type, target_entity_id, user)

        await websocket.send_text(json.dumps({
            "type": "SESSION_LEFT",
            "entity_type": target_entity_type,
            "entity_id": target_entity_id,
            "timestamp": datetime.now().isoformat()
        }))

    elif message_type == "APPLY_OPERATION":
        # Utilisateur veut appliquer une opération d'édition
        operation = message.get("operation", {})

        # Vérifier d'abord les conflits potentiels
        conflict_check = await collaboration_manager.resolve_conflict(entity_type, entity_id, operation)

        if not conflict_check["can_proceed"]:
            await websocket.send_text(json.dumps({
                "type": "OPERATION_REJECTED",
                "reason": conflict_check.get("message", "Conflict detected"),
                "conflict_info": conflict_check,
                "timestamp": datetime.now().isoformat()
            }))
            return

        # Appliquer l'opération
        result = await collaboration_manager.apply_edit_operation(entity_type, entity_id, user, operation)

        if result["success"]:
            await websocket.send_text(json.dumps({
                "type": "OPERATION_APPLIED",
                "operation_id": result.get("operation_id"),
                "new_version": result.get("new_version"),
                "timestamp": result.get("timestamp")
            }))
        else:
            await websocket.send_text(json.dumps({
                "type": "OPERATION_FAILED",
                "error": result.get("error", "Unknown error"),
                "timestamp": datetime.now().isoformat()
            }))

    elif message_type == "GET_SESSION_STATE":
        # Utilisateur veut connaître l'état actuel de la session
        state = await collaboration_manager.get_session_state(entity_type, entity_id)
        await websocket.send_text(json.dumps({
            "type": "SESSION_STATE",
            **state,
            "timestamp": datetime.now().isoformat()
        }))

    elif message_type == "GET_OPERATION_HISTORY":
        # Utilisateur veut récupérer l'historique des opérations
        since_version = message.get("since_version")
        history = await collaboration_manager.get_operation_history(entity_type, entity_id, since_version)
        await websocket.send_text(json.dumps({
            "type": "OPERATION_HISTORY",
            "entity_type": entity_type,
            "entity_id": entity_id,
            "history": history,
            "timestamp": datetime.now().isoformat()
        }))

    elif message_type == "PING":
        # Répondre au ping avec pong pour maintenir la connexion active
        await websocket.send_text(json.dumps({
            "type": "PONG",
            "timestamp": datetime.now().isoformat()
        }))

    else:
        await websocket.send_text(json.dumps({
            "type": "ERROR",
            "message": f"Unknown message type: {message_type}",
            "timestamp": datetime.now().isoformat()
        }))


# Attacher la méthode au gestionnaire (c'est un peu hacky mais fonctionne pour cette démonstration)
collaboration_manager._handle_client_message = _handle_client_message