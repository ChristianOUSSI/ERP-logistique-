# app/routers/ws.py
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import List
import json
from datetime import datetime

router = APIRouter()

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        message_str = json.dumps(message)
        for connection in self.active_connections:
            try:
                await connection.send_text(message_str)
            except Exception:
                pass

manager = ConnectionManager()

@router.websocket("/events")
async def websocket_endpoint(websocket: WebSocket, token: str = None):
    # En production, valider le token ici
    await manager.connect(websocket)
    try:
        await websocket.send_text(json.dumps({
            "message": "Connecté au système temps réel KAMLOG",
            "severity": "INFO",
            "timestamp": datetime.utcnow().isoformat()
        }))
        while True:
            # Maintenir la connexion active
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)
