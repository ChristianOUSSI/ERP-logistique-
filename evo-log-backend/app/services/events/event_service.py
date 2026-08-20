"""
Event service for WebSocket and real-time notifications
"""
import logging
from typing import Dict, List
from datetime import datetime

logger = logging.getLogger(__name__)


class EventService:
    """Service for managing real-time events and WebSocket broadcasts"""
    
    def __init__(self):
        self.active_connections: Dict[str, List] = {}
        self.event_history: List[dict] = []
    
    async def broadcast_heartbeat(self):
        """Send heartbeat to all active WebSocket connections"""
        for user_id, connections in self.active_connections.items():
            for connection in connections:
                try:
                    await connection.send_json({"type": "heartbeat", "timestamp": datetime.utcnow().isoformat()})
                except Exception as e:
                    logger.error(f"Failed to send heartbeat to {user_id}: {e}")
    
    async def broadcast_event(self, event_type: str, data: dict, target_users: List[str] = None):
        """Broadcast event to specific users or all users"""
        event = {
            "type": event_type,
            "data": data,
            "timestamp": datetime.utcnow().isoformat()
        }
        
        self.event_history.append(event)
        
        if target_users:
            for user_id in target_users:
                if user_id in self.active_connections:
                    for connection in self.active_connections[user_id]:
                        try:
                            await connection.send_json(event)
                        except Exception as e:
                            logger.error(f"Failed to send event to {user_id}: {e}")
        else:
            for user_id, connections in self.active_connections.items():
                for connection in connections:
                    try:
                        await connection.send_json(event)
                    except Exception as e:
                        logger.error(f"Failed to send event to {user_id}: {e}")
    
    def add_connection(self, user_id: str, connection):
        """Add a WebSocket connection for a user"""
        if user_id not in self.active_connections:
            self.active_connections[user_id] = []
        self.active_connections[user_id].append(connection)
        logger.info(f"Added connection for user {user_id}")
    
    def remove_connection(self, user_id: str, connection):
        """Remove a WebSocket connection for a user"""
        if user_id in self.active_connections:
            self.active_connections[user_id].remove(connection)
            if not self.active_connections[user_id]:
                del self.active_connections[user_id]
            logger.info(f"Removed connection for user {user_id}")


# Global event service instance
event_service = EventService()