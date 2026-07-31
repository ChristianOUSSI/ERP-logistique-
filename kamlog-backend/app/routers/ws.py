from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import List, Dict, Optional
import asyncio
import json
from datetime import datetime

router = APIRouter(tags=["WebSockets"])

# Gestionnaire de connexions WebSocket
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self.connection_meta: Dict[WebSocket, dict] = {}

    async def connect(self, websocket: WebSocket, client_id: Optional[str] = None):
        await websocket.accept()
        self.active_connections.append(websocket)
        self.connection_meta[websocket] = {
            "client_id": client_id or "anonymous",
            "connected_at": datetime.utcnow().isoformat()
        }

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
        if websocket in self.connection_meta:
            del self.connection_meta[websocket]

    async def send_personal_message(self, message: dict, websocket: WebSocket):
        try:
            await websocket.send_json(message)
        except Exception:
            self.disconnect(websocket)

    async def broadcast(self, message: dict):
        disconnected = []
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception:
                disconnected.append(connection)
        for ws in disconnected:
            self.disconnect(ws)

    async def broadcast_heartbeat(self):
        await self.broadcast({
            "type": "heartbeat",
            "timestamp": datetime.utcnow().isoformat(),
            "active_connections": len(self.active_connections)
        })


manager = ConnectionManager()


@router.websocket("/events")
async def websocket_events(websocket: WebSocket, token: Optional[str] = None):
    """WebSocket principal pour les événements temps réel EVO-LOG"""
    await manager.connect(websocket, client_id=token)
    try:
        # Envoyer message de bienvenue
        await manager.send_personal_message({
            "type": "connected",
            "message": "Connecté au flux événements EVO-LOG en temps réel",
            "timestamp": datetime.utcnow().isoformat(),
            "active_connections": len(manager.active_connections)
        }, websocket)

        while True:
            try:
                data = await asyncio.wait_for(websocket.receive_json(), timeout=30.0)
                # Echo back avec timestamp
                await manager.send_personal_message({
                    "type": "echo",
                    "data": data,
                    "timestamp": datetime.utcnow().isoformat()
                }, websocket)
            except asyncio.TimeoutError:
                # Envoyer heartbeat si pas de message
                await manager.send_personal_message({
                    "type": "heartbeat",
                    "timestamp": datetime.utcnow().isoformat()
                }, websocket)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        await manager.broadcast({
            "type": "user_disconnected",
            "client_id": token or "anonymous",
            "timestamp": datetime.utcnow().isoformat()
        })


@router.websocket("/missions")
async def websocket_missions(websocket: WebSocket, token: Optional[str] = None):
    """WebSocket pour le suivi des missions transport en temps réel"""
    await manager.connect(websocket, client_id=token)
    try:
        await manager.send_personal_message({
            "type": "connected",
            "channel": "missions",
            "message": "Connecté au canal missions transport",
            "timestamp": datetime.utcnow().isoformat()
        }, websocket)

        while True:
            try:
                data = await asyncio.wait_for(websocket.receive_json(), timeout=30.0)
                await manager.send_personal_message({
                    "type": "mission_update",
                    "data": data,
                    "timestamp": datetime.utcnow().isoformat()
                }, websocket)
            except asyncio.TimeoutError:
                await manager.send_personal_message({
                    "type": "heartbeat",
                    "channel": "missions",
                    "timestamp": datetime.utcnow().isoformat()
                }, websocket)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
