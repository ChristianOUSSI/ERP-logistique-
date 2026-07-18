# app/routers/ws.py
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from typing import List, Dict, Set
import json
from datetime import datetime, timezone
from app.routers.auth import get_current_user
from app.models.user import User
import asyncio
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

class ConnectionManager:
    def __init__(self):
        # Store connections with user info for targeted broadcasting
        self.active_connections: List[Dict] = []
        # Track connections by user ID for targeted notifications
        self.user_connections: Dict[int, Set[WebSocket]] = {}
        # Track connections by event types for subscription-based broadcasting
        self.event_subscriptions: Dict[str, Set[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, user: User = None):
        await websocket.accept()
        connection_info = {
            "websocket": websocket,
            "user": user,
            "connected_at": datetime.now(timezone.utc),
            "subscriptions": set()  # Event types this connection is subscribed to
        }
        self.active_connections.append(connection_info)

        # Track by user ID if authenticated
        if user and user.id:
            if user.id not in self.user_connections:
                self.user_connections[user.id] = set()
            self.user_connections[user.id].add(websocket)

        logger.info(f"WebSocket connected. User: {user.id if user else 'Anonymous'}, Total connections: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        # Remove from active connections
        self.active_connections = [conn for conn in self.active_connections if conn["websocket"] != websocket]

        # Remove from user connections
        for user_id, connections in self.user_connections.items():
            if websocket in connections:
                connections.discard(websocket)
                if not connections:
                    del self.user_connections[user_id]
                break

        # Remove from event subscriptions
        for event_type, connections in self.event_subscriptions.items():
            connections.discard(websocket)

        logger.info(f"WebSocket disconnected. Total connections: {len(self.active_connections)}")

    async def subscribe_to_event(self, websocket: WebSocket, event_type: str):
        """Subscribe a connection to specific event types"""
        if event_type not in self.event_subscriptions:
            self.event_subscriptions[event_type] = set()
        self.event_subscriptions[event_type].add(websocket)

        # Also track in connection info
        for conn in self.active_connections:
            if conn["websocket"] == websocket:
                conn["subscriptions"].add(event_type)
                break

        logger.debug(f"WebSocket subscribed to event type: {event_type}")

    async def unsubscribe_from_event(self, websocket: WebSocket, event_type: str):
        """Unsubscribe a connection from specific event types"""
        if event_type in self.event_subscriptions:
            self.event_subscriptions[event_type].discard(websocket)

        # Also update connection info
        for conn in self.active_connections:
            if conn["websocket"] == websocket:
                conn["subscriptions"].discard(event_type)
                break

    async def broadcast_to_subscribers(self, event_type: str, message: dict):
        """Broadcast message to all connections subscribed to an event type"""
        if event_type not in self.event_subscriptions:
            return

        message_str = json.dumps(message)
        disconnected = set()

        for websocket in self.event_subscriptions[event_type]:
            try:
                await websocket.send_text(message_str)
            except Exception as e:
                logger.warning(f"Failed to send message to websocket: {e}")
                disconnected.add(websocket)

        # Clean up disconnected websockets
        for websocket in disconnected:
            self.event_subscriptions[event_type].discard(websocket)
            self.disconnect(websocket)

    async def broadcast_to_user(self, user_id: int, message: dict):
        """Broadcast message to all connections of a specific user"""
        if user_id not in self.user_connections:
            return

        message_str = json.dumps(message)
        disconnected = set()

        for websocket in self.user_connections[user_id]:
            try:
                await websocket.send_text(message_str)
            except Exception as e:
                logger.warning(f"Failed to send message to user {user_id} websocket: {e}")
                disconnected.add(websocket)

        # Clean up disconnected websockets
        for websocket in disconnected:
            self.user_connections[user_id].discard(websocket)
            if not self.user_connections[user_id]:
                del self.user_connections[user_id]
            self.disconnect(websocket)

    async def broadcast(self, message: dict):
        """Broadcast message to all connected clients"""
        message_str = json.dumps(message)
        disconnected = []

        for connection in self.active_connections:
            websocket = connection["websocket"]
            try:
                await websocket.send_text(message_str)
            except Exception as e:
                logger.warning(f"Failed to broadcast message: {e}")
                disconnected.append(websocket)

        # Clean up disconnected websockets
        for websocket in disconnected:
            self.disconnect(websocket)

manager = ConnectionManager()

@router.websocket("/events")
async def websocket_endpoint(websocket: WebSocket, token: str = None):
    """WebSocket endpoint for real-time events"""
    # Authenticate user if token provided
    user = None
    if token:
        try:
            # In a real app, you'd validate the JWT token here
            # For now, we'll accept connections without strict auth in development
            # TODO: Implement proper JWT validation
            pass
        except Exception as e:
            logger.warning(f"WebSocket token validation failed: {e}")

    await manager.connect(websocket, user)

    try:
        # Send welcome message
        await websocket.send_text(json.dumps({
            "type": "CONNECT",
            "message": "Connecté au système temps réel KAMLOG",
            "severity": "INFO",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "user_id": user.id if user else None
        }))

        # Keep connection alive and handle incoming messages
        while True:
            # Wait for messages from client (like subscriptions, ping/pong, etc.)
            data = await websocket.receive_text()

            try:
                message = json.loads(data)
                await self._handle_client_message(websocket, message, user)
            except json.JSONDecodeError:
                await websocket.send_text(json.dumps({
                    "type": "ERROR",
                    "message": "Invalid JSON format",
                    "severity": "ERROR",
                    "timestamp": datetime.now(timezone.utc).isoformat()
                }))
            except Exception as e:
                logger.error(f"Error handling client message: {e}")
                await websocket.send_text(json.dumps({
                    "type": "ERROR",
                    "message": "Error processing message",
                    "severity": "ERROR",
                    "timestamp": datetime.now(timezone.utc).isoformat()
                }))

    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        manager.disconnect(websocket)

async def _handle_client_message(self, websocket: WebSocket, message: dict, user: User):
    """Handle messages received from clients"""
    message_type = message.get("type")

    if message_type == "SUBSCRIBE":
        # Client wants to subscribe to specific event types
        event_types = message.get("event_types", [])
        for event_type in event_types:
            await manager.subscribe_to_event(websocket, event_type)

        await websocket.send_text(json.dumps({
            "type": "SUBSCRIBED",
            "message": f"Subscribed to event types: {', '.join(event_types)}",
            "severity": "INFO",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }))

    elif message_type == "UNSUBSCRIBE":
        # Client wants to unsubscribe from specific event types
        event_types = message.get("event_types", [])
        for event_type in event_types:
            await manager.unsubscribe_from_event(websocket, event_type)

        await websocket.send_text(json.dumps({
            "type": "UNSUBSCRIBED",
            "message": f"Unsubscribed from event types: {', '.join(event_types)}",
            "severity": "INFO",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }))

    elif message_type == "PING":
        # Respond to ping with pong to keep connection alive
        await websocket.send_text(json.dumps({
            "type": "PONG",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }))

    else:
        await websocket.send_text(json.dumps({
            "type": "ERROR",
            "message": f"Unknown message type: {message_type}",
            "severity": "WARNING",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }))
