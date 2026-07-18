# app/services/collaboration_service.py - Service de collaboration en temps réel
from typing import Dict, Set, List, Optional, Any
from datetime import datetime
import json
import asyncio
from collections import defaultdict

from fastapi import WebSocket
from app.models.user import User
from app.utils.logger import get_logger

logger = get_logger(__name__)


class CollaborationManager:
    """Gestionnaire de collaboration en temps réel pour l'édition d'entités"""

    def __init__(self):
        # Sessions d'édition actifs par type d'entité et ID d'entité
        self.active_sessions: Dict[str, Dict[str, Any]] = defaultdict(dict)
        # Utilisateurs actuellement en train d'entité
        self.user_editing: Dict[int, Set[str]] = defaultdict(set)  # user_id -> set of session_ids
        # Historique des opérations pour chaque session (pour la résolution de conflits)
        self.operation_history: Dict[str, List[Dict]] = defaultdict(list)
        # Verrous pour prévenir les modifications simultanées conflictuelles
        self.edit_locks: Dict[str, asyncio.Lock] = defaultdict(asyncio.Lock)

    async def join_edit_session(self, websocket: WebSocket, entity_type: str, entity_id: str, user: User):
        """
        Fait rejoindre un utilisateur à une session d'édition collaborative.

        Args:
            websocket: Connection WebSocket de l'utilisateur
            entity_type: Type d'entité (article, declaration, commande, etc.)
            entity_id: ID de l'entité being edited
            user: Utilisateur rejoignant la session
        """
        session_id = f"{entity_type}:{entity_id}"

        # Accepter la connexion WebSocket si ce n'est pas déjà fait
        if websocket.client_state.name != "CONNECTED":
            await websocket.accept()

        # Initialiser la session si elle n'existe pas
        if session_id not in self.active_sessions:
            self.active_sessions[session_id] = {
                "entity_type": entity_type,
                "entity_id": entity_id,
                "participants": {},  # user_id -> websocket
                "last_update": datetime.now(),
                "version": 0,
                "data": {}  # Dernier état connu de l'entité
            }
            self.operation_history[session_id] = []

        # Ajouter l'utilisateur aux participants
        self.active_sessions[session_id]["participants"][user.id] = websocket
        self.user_editing[user.id].add(session_id)

        # Mettre à jour le timestamp de dernière activité
        self.active_sessions[session_id]["last_update"] = datetime.now()

        logger.info(
            f"User {user.id} ({user.username}) joined edit session for {session_id}. "
            f"Participants: {len(self.active_sessions[session_id]['participants'])}"
        )

        # Notifier l'utilisateur de l'état actuel de la session
        await websocket.send_text(json.dumps({
            "type": "SESSION_JOINED",
            "session_id": session_id,
            "entity_type": entity_type,
            "entity_id": entity_id,
            "participants_count": len(self.active_sessions[session_id]["participants"]),
            "version": self.active_sessions[session_id]["version"],
            "timestamp": datetime.now().isoformat()
        }))

        # Notifier les autres participants qu'un nouvel utilisateur a rejoint
        await self._notify_participants(session_id, {
            "type": "USER_JOINED",
            "user_id": user.id,
            "username": user.username,
            "participants_count": len(self.active_sessions[session_id]["participants"]),
            "timestamp": datetime.now().isoformat()
        }, exclude_user=user.id)

    async def leave_edit_session(self, websocket: WebSocket, entity_type: str, entity_id: str, user: User):
        """
        Fait quitter un utilisateur d'une session d'édition collaborative.

        Args:
            websocket: Connection WebSocket de l'utilisateur
            entity_type: Type d'entité
            entity_id: ID de l'entité
            user: Utilisateur quittant la session
        """
        session_id = f"{entity_type}:{entity_id}"

        if session_id in self.active_sessions:
            # Retirer l'utilisateur des participants
            if user.id in self.active_sessions[session_id]["participants"]:
                del self.active_sessions[session_id]["participants"][user.id]

            # Retirer de l'historique d'édition de l'utilisateur
            if user.id in self.user_editing:
                self.user_editing[user.id].discard(session_id)
                if not self.user_editing[user.id]:
                    del self.user_editing[user.id]

            # Mettre à jour le timestamp de dernière activité
            self.active_sessions[session_id]["last_update"] = datetime.now()

            logger.info(
                f"User {user.id} ({user.username}) left edit session for {session_id}. "
                f"Participants remaining: {len(self.active_sessions[session_id]['participants'])}"
            )

            # Notifier les autres participants qu'un utilisateur a quitté
            if self.active_sessions[session_id]["participants"]:
                await self._notify_participants(session_id, {
                    "type": "USER_LEFT",
                    "user_id": user.id,
                    "username": user.username,
                    "participants_count": len(self.active_sessions[session_id]["participants"]),
                    "timestamp": datetime.now().isoformat()
                })

            # Fermer la session si plus de participants
            if not self.active_sessions[session_id]["participants"]:
                await self._close_edit_session(session_id)

    async def apply_edit_operation(self, entity_type: str, entity_id: str, user: User, operation: Dict[str, Any]) -> Dict[str, Any]:
        """
        Applique une opération d'édition à une entité en mode collaboratif.

        Args:
            entity_type: Type d'entité
            entity_id: ID de l'entité
            user: Utilisateur appliquant l'opération
            operation: Opération à appliquer (doit contenir 'type' et 'data')

        Returns:
            Résultat de l'application de l'opération
        """
        session_id = f"{entity_type}:{entity_id}"

        if session_id not in self.active_sessions:
            return {
                "success": False,
                "error": f"No active edit session for {session_id}"
            }

        # Vérifier que l'utilisateur est bien dans la session
        if user.id not in self.active_sessions[session_id]["participants"]:
            return {
                "success": False,
                "error": f"User {user.id} is not participating in edit session for {session_id}"
            }

        # Utiliser un verrou pour prévenir les conditions de course
        async with self.edit_locks[session_id]:
            try:
                # Générer un ID d'opération unique
                operation_id = f"{session_id}:{self.active_sessions[session_id]['version'] + 1}:{user.id}"

                # Préparer l'opération pour l'historique
                recorded_operation = {
                    "operation_id": operation_id,
                    "user_id": user.id,
                    "username": user.username,
                    "timestamp": datetime.now().isoformat(),
                    "operation_type": operation.get("type"),
                    "operation_data": operation.get("data", {}),
                    "entity_type": entity_type,
                    "entity_id": entity_id
                }

                # Appliquer l'opération (logique métier spécifique à chaque type d'entité)
                # Dans une implémentation réelle, cela appellerait les services métiers appropriés
                # Pour maintenant, on simule juste la mise à jour de l'état
                success = await self._apply_operation_to_entity(entity_type, entity_id, operation)

                if success:
                    # Incrémenter la version
                    self.active_sessions[session_id]["version"] += 1
                    self.active_sessions[session_id]["last_update"] = datetime.now()

                    # Ajouter à l'historique des opérations
                    self.operation_history[session_id].append(recorded_operation)

                    # Limiter l'historique pour éviter une croissance illimitée
                    if len(self.operation_history[session_id]) > 1000:
                        self.operation_history[session_id] = self.operation_history[session_id][-500:]

                    # Notifier tous les participants (y compris l'utilisateur qui a fait la modification)
                    await self._notify_participants(session_id, {
                        "type": "OPERATION_APPLIED",
                        "operation_id": operation_id,
                        "user_id": user.id,
                        "username": user.username,
                        "operation_type": operation.get("type"),
                        "entity_type": entity_type,
                        "entity_id": entity_id,
                        "new_version": self.active_sessions[session_id]["version"],
                        "timestamp": datetime.now().isoformat()
                    })

                    logger.info(
                        f"Operation {operation_id} applied by user {user.id} on {session_id}. "
                        f"New version: {self.active_sessions[session_id]['version']}"
                    )

                    return {
                        "success": True,
                        "operation_id": operation_id,
                        "new_version": self.active_sessions[session_id]["version"],
                        "timestamp": datetime.now().isoformat()
                    }
                else:
                    return {
                        "success": False,
                        "error": "Failed to apply operation to entity"
                    }

            except Exception as e:
                logger.error(f"Error applying edit operation: {str(e)}")
                return {
                    "success": False,
                    "error": f"Error applying operation: {str(e)}"
                }

    async def get_session_state(self, entity_type: str, entity_id: str) -> Dict[str, Any]:
        """
        Récupère l'état actuel d'une session d'édition.

        Args:
            entity_type: Type d'entité
            entity_id: ID de l'entité

        Returns:
            État de la session
        """
        session_id = f"{entity_type}:{entity_id}"

        if session_id not in self.active_sessions:
            return {
                "exists": False,
                "error": f"No active edit session for {session_id}"
            }

        session = self.active_sessions[session_id]
        return {
            "exists": True,
            "session_id": session_id,
            "entity_type": session["entity_type"],
            "entity_id": session["entity_id"],
            "version": session["version"],
            "participants_count": len(session["participants"]),
            "participants": [
                {"user_id": uid, "username": await self._get_username(uid)}
                for uid in session["participants"].keys()
            ],
            "last_update": session["last_update"].isoformat(),
            "operation_count": len(self.operation_history.get(session_id, []))
        }

    async def get_operation_history(self, entity_type: str, entity_id: str, since_version: int = None) -> List[Dict]:
        """
        Récupère l'historique des opérations pour une session d'édition.

        Args:
            entity_type: Type d'entité
            entity_id: ID de l'entité
            since_version: Retourner seulement les opérations depuis cette version (exclusive)

        Returns:
            Liste des opérations
        """
        session_id = f"{entity_type}:{entity_id}"
        history = self.operation_history.get(session_id, [])

        if since_version is not None:
            # Filtrer les opérations depuis la version spécifiée
            # Dans une implémentation plus sophistiquée, on stockerait la version avec chaque opération
            # Pour maintenant, on retourne tout l'historique (à améliorer)
            return history

        return history

    async def resolve_conflict(self, entity_type: str, entity_id: str, proposed_operation: Dict[str, Any]) -> Dict[str, Any]:
        """
        Tente de résoudre un conflit potentiel avant d'appliquer une opération.
        Implémente une stratégie simple de "last write wins" avec notification.

        Args:
            entity_type: Type d'entité
            entity_id: ID de l'entité
            proposed_operation: Opération proposée

        Returns:
            Résultat de la résolution de conflit
        """
        session_id = f"{entity_type}:{entity_id}"

        if session_id not in self.active_sessions:
            return {
                "can_proceed": True,
                "conflict": False,
                "message": "No active session, can proceed"
            }

        # Vérifier si quelqu'un d'autre a modifié l'entité récemment
        session = self.active_sessions[session_id]
        last_update = session["last_update"]
        time_since_update = (datetime.now() - last_update).total_seconds()

        # Si la dernière modification remonte à moins de 2 secondes, considérer comme potentiel conflit
        if time_since_update < 2 and session["participants"]:
            other_users = [uid for uid in session["participants"].keys()]
            return {
                "can_proceed": True,  # On autorise quand même mais on warn
                "conflict": True,
                "message": f"Entity was recently modified by others ({len(other_users)} other user(s))",
                "last_update": last_update.isoformat(),
                "suggested_action": "review_changes_before_applying"
            }

        return {
            "can_proceed": True,
            "conflict": False,
            "message": "No recent conflicts detected"
        }

    async def _notify_participants(self, session_id: str, message: Dict[str, Any], exclude_user: int = None):
        """
        Notifie tous les participants d'une session d'un message.

        Args:
            session_id: ID de la session
            message: Message à envoyer
            exclude_user: ID d'utilisateur à exclure de la notification (optionnel)
        """
        if session_id not in self.active_sessions:
            return

        message_str = json.dumps(message)
        disconnected = []

        for user_id, websocket in self.active_sessions[session_id]["participants"].items():
            if exclude_user is not None and user_id == exclude_user:
                continue

            try:
                if websocket.client_state.name == "CONNECTED":
                    await websocket.send_text(message_str)
                else:
                    disconnected.append(user_id)
            except Exception as e:
                logger.warning(f"Failed to send message to user {user_id} in session {session_id}: {str(e)}")
                disconnected.append(user_id)

        # Nettoyer les connexions interrompues
        for user_id in disconnected:
            if user_id in self.active_sessions[session_id]["participants"]:
                del self.active_sessions[session_id]["participants"][user_id]
                self.user_editing[user_id].discard(session_id)
                if not self.user_editing[user_id]:
                    del self.user_editing[user_id]

    async def _close_edit_session(self, session_id: str):
        """
        Ferme une session d'édition et nettoie les ressources associées.

        Args:
            session_id: ID de la session à fermer
        """
        if session_id in self.active_sessions:
            session = self.active_sessions[session_id]
            logger.info(f"Closing edit session {session_id} due to inactivity or no participants")

            # Notifier les participants restants (s'il y en avait encore)
            if session["participants"]:
                await self._notify_participants(session_id, {
                    "type": "SESSION_CLOSED",
                    "reason": "no_participants",
                    "timestamp": datetime.now().isoformat()
                })

            # Nettoyer
            del self.active_sessions[session_id]
            if session_id in self.operation_history:
                del self.operation_history[session_id]
            if session_id in self.edit_locks:
                del self.edit_locks[session_id]

    async def _apply_operation_to_entity(self, entity_type: str, entity_id: str, operation: Dict[str, Any]) -> bool:
        """
        Applique une opération métier à une entité.
        C'est un stub - en production, cela appellerait les services appropriés.

        Args:
            entity_type: Type d'entité
            entity_id: ID de l'entité
            operation: Opération à appliquer

        Returns:
            True si l'opération a réussi, False sinon
        """
        # Cette méthode devrait appeler les services métiers appropriés
        # Pour une implémentation de démonstration, on retourne juste True
        # Dans une vraie implémentation, on ferait quelque chose comme :
        #
        # if entity_type == "article":
        #     return await ArticleService.apply_operation(db, entity_id, operation)
        # elif entity_type == "declaration":
        #     return await DeclarationService.apply_operation(db, entity_id, operation)
        # etc.

        logger.info(
            f"Applying operation {operation.get('type')} to {entity_type}:{entity_id} "
            f"(stub implementation - would call business service in production)"
        )

        # Simuler un délai de traitement
        await asyncio.sleep(0.1)

        return True  # Stub - toujours retourner succès

    async def _get_username(self, user_id: int) -> str:
        """
        Récupère le nom d'utilisateur pour un ID donné.
        C'est un stub - en production, cela interrogerait la base de données.

        Args:
            user_id: ID de l'utilisateur

        Returns:
            Nom d'utilisateur
        """
        # Stub - en production, on interrogerait la base de données
        # Pour maintenant, retourner un placeholder
        return f"user_{user_id}"


# Instance globale du gestionnaire de collaboration
collaboration_manager = CollaborationManager()