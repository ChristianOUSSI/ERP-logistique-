# app/services/iot_service.py - Service d'intégration IoT pour capteurs de conteneurs, véhicules, équipements
from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, func, desc
import json
import asyncio
from enum import Enum

from app.models.user import User
from app.utils.logger import get_logger

logger = get_logger(__name__)


class SensorType(str, Enum):
    """Types de capteurs IoT supportés"""
    TEMPERATURE = "temperature"
    HUMIDITY = "humidity"
    PRESSURE = "pressure"
    GPS = "gps"
    ACCELEROMETER = "accelerometer"
    GYROSCOPE = "gyroscope"
    LIGHT = "light"
    VOLTAGE = "voltage"
    CURRENT = "current"
    DOOR_OPEN = "door_open"
    SHOCK = "shock"
    TILT = "tilt"


class AlertLevel(str, Enum):
    """Niveaux d'alerte pour les capteurs IoT"""
    INFO = "info"
    WARNING = "warning"
    ERROR = "error"
    CRITICAL = "critical"


class IoTService:
    """Service pour la gestion des données IoT provenant des capteurs"""

    def __init__(self):
        # En production, ceci serait connecté à une vraie base de données ou un time-series DB comme InfluxDB
        # Pour cette implémentation, on utilise des structures en mémoire simplifiées
        self.sensor_data: Dict[str, List[Dict]] = {}  # device_id -> list of readings
        self.device_metadata: Dict[str, Dict] = {}     # device_id -> metadata
        self.alert_rules: Dict[str, List[Dict]] = {}   # device_id -> list of alert rules
        self.active_alerts: Dict[str, List[Dict]] = {} # device_id -> list of active alerts

    def register_device(self, device_id: str, metadata: Dict[str, Any]) -> bool:
        """
        Enregistre un nouvel appareil IoT dans le système.

        Args:
            device_id: Identifiant unique de l'appareil
            metadata: Métadonnées de l'appareil (type, emplacement, associé à quel conteneur/véhicule, etc.)

        Returns:
            True si l'enregistrement réussit
        """
        try:
            self.device_metadata[device_id] = {
                "device_id": device_id,
                "registered_at": datetime.now().isoformat(),
                "last_seen": datetime.now().isoformat(),
                "is_active": True,
                **metadata
            }
            self.sensor_data[device_id] = []
            self.alert_rules[device_id] = []
            self.active_alerts[device_id] = []

            logger.info(f"IoT device registered: {device_id}")
            return True
        except Exception as e:
            logger.error(f"Failed to register IoT device {device_id}: {str(e)}")
            return False

    def ingest_sensor_data(self, device_id: str, sensor_type: SensorType, value: Any,
                         timestamp: datetime = None, metadata: Dict[str, Any] = None) -> bool:
        """
        Ingère une lecture de capteur provenant d'un appareil IoT.

        Args:
            device_id: Identifiant de l'appareil
            sensor_type: Type de capteur
            value: Valeur mesurée
            timestamp: Timestamp de la mesure (défaut: maintenant)
            metadata: Métadonnées additionnelles

        Returns:
            True si l'ingestion réussit
        """
        if timestamp is None:
            timestamp = datetime.now()

        if device_id not in self.device_metadata:
            logger.warning(f"Ingestion attempt for unknown device: {device_id}")
            # Optionnellement, on pourrait auto-enregistrer l'appareil
            return False

        # Mettre à jour le dernier vu
        self.device_metadata[device_id]["last_seen"] = timestamp.isoformat()

        # Créer la lecture
        reading = {
            "timestamp": timestamp.isoformat(),
            "sensor_type": sensor_type.value,
            "value": value,
            "metadata": metadata or {}
        }

        # Stocker la lecture
        if device_id not in self.sensor_data:
            self.sensor_data[device_id] = []
        self.sensor_data[device_id].append(reading)

        # Limiter l'historique pour éviter une croissance illimitée (garder les 1000 dernières lectures)
        if len(self.sensor_data[device_id]) > 1000:
            self.sensor_data[device_id] = self.sensor_data[device_id][-500:]

        # Vérifier les règles d'alerte
        self._check_alert_rules(device_id, sensor_type, value, timestamp)

        # Broadcast via WebSocket
        try:
            from app.routers.ws import manager
            import asyncio
            
            payload = {
                "type": "GPS_UPDATE" if sensor_type == SensorType.GPS else "SENSOR_UPDATE",
                "device_id": device_id,
                "sensor_type": sensor_type.value,
                "value": value,
                "timestamp": timestamp.isoformat()
            }
            
            # Use asyncio.create_task or equivalent to not block
            # Since this might be called in a sync route, we need a running loop or async context
            # We can use asyncio.run or schedule it if in an async context
            # Actually, FastAPI routes can be sync or async. The router uses `def`, so it's run in a threadpool.
            # We must be careful not to block. Let's create a new event loop or use existing.
            try:
                loop = asyncio.get_running_loop()
                loop.create_task(manager.broadcast_to_subscribers("GPS_UPDATE", payload))
            except RuntimeError:
                # No running event loop
                asyncio.run(manager.broadcast_to_subscribers("GPS_UPDATE", payload))
        except Exception as e:
            logger.error(f"Failed to broadcast IoT data: {str(e)}")

        logger.debug(f"Ingested sensor data from {device_id}: {sensor_type.value} = {value}")
        return True

    def get_sensor_data(self, device_id: str, sensor_type: SensorType = None,
                       start_time: datetime = None, end_time: datetime = None,
                       limit: int = 100) -> List[Dict]:
        """
        Récupère les données de capteur pour un appareil donné.

        Args:
            device_id: Identifiant de l'appareil
            sensor_type: Type de capteur spécifique (None pour filtré (optionnel))
            start_time: Timestamp de début (optionnel)
            end_time: Timestamp de fin (optionnel)
            limit: Nombre maximum de lectures à retourner

        Returns:
            Liste des lectures de capteur
        """
        if device_id not in self.sensor_data:
            return []

        readings = self.sensor_data[device_id]

        # Filtrer par type de capteur
        if sensor_type:
            readings = [r for r in readings if r["sensor_type"] == sensor_type.value]

        # Filtrer par plage de temps
        if start_time:
            readings = [r for r in readings if datetime.fromisoformat(r["timestamp"]) >= start_time]
        if end_time:
            readings = [r for r in readings if datetime.fromisoformat(r["timestamp"]) <= end_time]

        # Trier par timestamp (plus récent en premier) et limiter
        readings.sort(key=lambda x: x["timestamp"], reverse=True)
        return readings[:limit]

    def get_latest_reading(self, device_id: str, sensor_type: SensorType) -> Optional[Dict]:
        """
        Récupère la dernière lecture pour un type de capteur donné.

        Args:
            device_id: Identifiant de l'appareil
            sensor_type: Type de capteur

        Returns:
            Dernière lecture ou None si aucune donnée disponible
        """
        readings = self.get_sensor_data(device_id, sensor_type, limit=1)
        return readings[0] if readings else None

    def get_device_metadata(self, device_id: str) -> Optional[Dict]:
        """
        Récupère les métadonnées d'un appareil IoT.

        Args:
            device_id: Identifiant de l'appareil

        Returns:
            Métadonnées de l'appareil ou None si non trouvé
        """
        return self.device_metadata.get(device_id)

    def add_alert_rule(self, device_id: str, sensor_type: SensorType, condition: str,
                      threshold: Any, level: AlertLevel, message: str) -> bool:
        """
        Ajoute une règle d'alerte pour un appareil et un type de capteur.

        Args:
            device_id: Identifiant de l'appareil
            sensor_type: Type de capteur concerné
            condition: Type de condition ("gt", "lt", "eq", "gte", "lte", "ne", "change")
            threshold: Seuil pour déclencher l'alerte
            level: Niveau d'alerte
            message: Message d'alerte

        Returns:
            True si la règle a été ajoutée avec succès
        """
        if device_id not in self.device_metadata:
            return False

        rule = {
            "id": f"{device_id}_{sensor_type.value}_{len(self.alert_rules.get(device_id, []))}",
            "sensor_type": sensor_type.value,
            "condition": condition,
            "threshold": threshold,
            "level": level.value,
            "message": message,
            "created_at": datetime.now().isoformat(),
            "enabled": True
        }

        if device_id not in self.alert_rules:
            self.alert_rules[device_id] = []
        self.alert_rules[device_id].append(rule)

        logger.info(f"Added alert rule for {device_id}:{sensor_type.value} - {condition} {threshold}")
        return True

    def _check_alert_rules(self, device_id: str, sensor_type: SensorType, value: Any, timestamp: datetime):
        """
        Vérifie si une lecture de capteur déclenche une règle d'alerte.

        Args:
            device_id: Identifiant de l'appareil
            sensor_type: Type de capteur
            value: Valeur mesurée
            timestamp: Timestamp de la mesure
        """
        if device_id not in self.alert_rules:
            return

        for rule in self.alert_rules[device_id]:
            if not rule["enabled"] or rule["sensor_type"] != sensor_type.value:
                continue

            # Évaluer la condition
            triggered = False
            threshold = rule["threshold"]

            try:
                if rule["condition"] == "gt":
                    triggered = float(value) > float(threshold)
                elif rule["condition"] == "lt":
                    triggered = float(value) < float(threshold)
                elif rule["condition"] == "gte":
                    triggered = float(value) >= float(threshold)
                elif rule["condition"] == "lte":
                    triggered = float(value) <= float(threshold)
                elif rule["condition"] == "eq":
                    triggered = float(value) == float(threshold)
                elif rule["condition"] == "ne":
                    triggered = float(value) != float(threshold)
                elif rule["condition"] == "change":
                    # Pour détecter les changements, on comparerait avec la valeur précédente
                    # Pour simplifier, on considère que tout changement déclenche l'alerte
                    # En production, on garderait la dernière valeur connue
                    last_reading = self.get_latest_reading(device_id, sensor_type)
                    if last_reading and last_reading["timestamp"] != timestamp.isoformat():
                        triggered = True
            except (ValueError, TypeError):
                # Si la conversion en float échoue, on essaie une comparaison directe
                if rule["condition"] == "eq":
                    triggered = value == threshold
                elif rule["condition"] == "ne":
                    triggered = value != threshold

            if triggered:
                # Vérifier si cette alerte est déjà active (éviter les doublons)
                alert_key = f"{device_id}_{rule['id']}_{timestamp.timestamp()}"
                if device_id not in self.active_alerts:
                    self.active_alerts[device_id] = []

                # Vérifier si on a déjà une alerte similaire active récemment (dernière minute)
                recent_alerts = [
                    a for a in self.active_alerts[device_id]
                    if a.get("rule_id") == rule["id"]
                    and (datetime.now() - datetime.fromisoformat(a["timestamp"])).total_seconds() < 60
                ]

                if not recent_alerts:
                    alert = {
                        "id": alert_key,
                        "device_id": device_id,
                        "rule_id": rule["id"],
                        "sensor_type": sensor_type.value,
                        "value": value,
                        "threshold": threshold,
                        "condition": rule["condition"],
                        "level": rule["level"],
                        "message": rule["message"],
                        "timestamp": timestamp.isoformat()
                    }
                    self.active_alerts[device_id].append(alert)

                    logger.warning(
                        f"IoT Alert triggered for {device_id}: {sensor_type.value} = {value} "
                        f"({rule['condition']} {threshold}) - {rule['message']}"
                    )

                    # En production, on enverrait aussi une notification via WebSocket ou autre canal
                    # asyncio.create_task(self._send_alert_notification(alert))

    def get_active_alerts(self, device_id: str = None, level: AlertLevel = None) -> List[Dict]:
        """
        Récupère les alertes actives.

        Args:
            device_id: Filtrer par appareil (optionnel)
            level: Filtrer par niveau d'alerte (optionnel)

        Returns:
            Liste des alertes actives
        """
        alerts = []

        if device_id:
            if device_id in self.active_alerts:
                alerts.extend(self.active_alerts[device_id])
        else:
            for dev_alerts in self.active_alerts.values():
                alerts.extend(dev_alerts)

        # Filtrer par niveau si spécifié
        if level:
            alerts = [a for a in alerts if a["level"] == level.value]

        # Trier par timestamp (plus récent en premier)
        alerts.sort(key=lambda x: x["timestamp"], reverse=True)
        return alerts

    def resolve_alert(self, alert_id: str) -> bool:
        """
        Marque une alerte comme résolue.

        Args:
            alert_id: Identifiant de l'alerte à résoudre

        Returns:
            True si l'alerte a été trouvée et marquée comme résolue
        """
        for device_id, alerts in self.active_alerts.items():
            for i, alert in enumerate(alerts):
                if alert["id"] == alert_id:
                    # Marquer comme résolue en ajoutant un champ de résolution
                    self.active_alerts[device_id][i]["resolved"] = True
                    self.active_alerts[device_id][i]["resolved_at"] = datetime.now().isoformat()
                    logger.info(f"Alert {alert_id} resolved")
                    return True
        return False

    def get_device_status(self, device_id: str) -> Dict[str, Any]:
        """
        Récupère le statut global d'un appareil IoT.

        Args:
            device_id: Identifiant de l'appareil

        Returns:
            Statut de l'appareil
        """
        if device_id not in self.device_metadata:
            return {"error": "Device not found"}

        metadata = self.device_metadata[device_id]
        last_seen = datetime.fromisoformat(metadata["last_seen"])
        time_since_last_seen = (datetime.now() - last_seen).total_seconds()

        # Déterminer le statut basé sur le dernier vu
        if time_since_last_seen > 300:  # 5 minutes
            status = "offline"
        elif time_since_last_seen > 60:  # 1 minute
            status = "idle"
        else:
            status = "online"

        # Compter les alertes actives
        active_alerts_count = len(self.get_active_alerts(device_id))

        return {
            "device_id": device_id,
            "status": status,
            "last_seen": metadata["last_seen"],
            "seconds_since_last_seen": int(time_since_last_seen),
            "is_active": metadata.get("is_active", True),
            "active_alerts_count": active_alerts_count,
            "sensor_types": list(set(r["sensor_type"] for r in self.sensor_data.get(device_id, []))),
            "total_readings": len(self.sensor_data.get(device_id, [])),
            **{k: v for k, v in metadata.items() if k not in ["last_seen", "registered_at"]}
        }


# Instance globale du service IoT
iot_service = IoTService()