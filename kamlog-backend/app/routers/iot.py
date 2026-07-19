# app/routers/iot.py - Routes API pour l'intégration IoT
from app.utils.rbac import require_role
from fastapi import APIRouter, Depends, HTTPException, Query, Body
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
from app.database import get_db
from app.utils.permissions import check_permission, get_current_user
from app.models.user import User

from app.services.iot_service import iot_service, SensorType, AlertLevel

router = APIRouter(prefix="/api/v1/iot", tags=["IoT"])


@router.post("/devices/register")
@require_role(["admin", "manager"])
def register_iot_device(
    device_id: str = Body(...),
    metadata: Dict[str, Any] = Body(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Enregistre un nouvel appareil IoT dans le système.
    Nécessite les permissions de création d'appareils IoT.
    """
    # Vérifier les permissions (à adapter selon votre système de permissions)
    # check_permission("iot:device:create")(current_user)

    success = iot_service.register_device(device_id, metadata)
    if not success:
        raise HTTPException(status_code=400, detail="Failed to register IoT device")

    return {
        "device_id": device_id,
        "message": "IoT device registered successfully",
        "registered_at": datetime.now().isoformat()
    }


@router.post("/devices/{device_id}/data")
@require_role(["admin", "manager"])
def ingest_sensor_data(
    device_id: str,
    sensor_type: str = Body(...),
    value: Any = Body(...),
    timestamp: Optional[str] = Body(None),
    metadata: Optional[Dict[str, Any]] = Body(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Ingère une lecture de capteur provenant d'un appareil IoT.
    """
    # Vérifier les permissions
    # check_permission("iot:data:ingest")(current_user)

    try:
        # Parser le type de capteur
        try:
            sensor_enum = SensorType(sensor_type.lower())
        except ValueError:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid sensor type. Supported types: {[st.value for st in SensorType]}"
            )

        # Parser le timestamp si fourni
        parsed_timestamp = None
        if timestamp:
            try:
                parsed_timestamp = datetime.fromisoformat(timestamp)
            except ValueError:
                raise HTTPException(status_code=400, detail="Invalid timestamp format. Use ISO format (YYYY-MM-DDTHH:MM:SS)")

        success = iot_service.ingest_sensor_data(
            device_id=device_id,
            sensor_type=sensor_enum,
            value=value,
            timestamp=parsed_timestamp,
            metadata=metadata
        )

        if not success:
            raise HTTPException(status_code=400, detail="Failed to ingest sensor data")

        return {
            "device_id": device_id,
            "sensor_type": sensor_type,
            "value": value,
            "timestamp": timestamp or datetime.now().isoformat(),
            "message": "Sensor data ingested successfully"
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/devices/{device_id}/data")
def get_device_sensor_data(
    device_id: str,
    sensor_type: Optional[str] = Query(None),
    start_time: Optional[str] = Query(None),
    end_time: Optional[str] = Query(None),
    limit: int = Query(100, le=1000),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Récupère les données de capteur pour un appareil donné.
    """
    # Vérifier les permissions
    # check_permission("iot:data:read")(current_user)

    try:
        # Parser le type de capteur si fourni
        parsed_sensor_type = None
        if sensor_type:
            try:
                parsed_sensor_type = SensorType(sensor_type.lower())
            except ValueError:
                raise HTTPException(
                    status_code=400,
                    detail=f"Invalid sensor type. Supported types: {[st.value for st in SensorType]}"
                )

        # Parser les timestamps si fournis
        parsed_start_time = None
        if start_time:
            try:
                parsed_start_time = datetime.fromisoformat(start_time)
            except ValueError:
                raise HTTPException(status_code=400, detail="Invalid start_time format. Use ISO format")

        parsed_end_time = None
        if end_time:
            try:
                parsed_end_time = datetime.fromisoformat(end_time)
            except ValueError:
                raise HTTPException(status_code=400, detail="Invalid end_time format. Use ISO format")

        data = iot_service.get_sensor_data(
            device_id=device_id,
            sensor_type=parsed_sensor_type,
            start_time=parsed_start_time,
            end_time=parsed_end_time,
            limit=limit
        )

        return {
            "device_id": device_id,
            "sensor_type": sensor_type,
            "data": data,
            "count": len(data),
            "timestamp": datetime.now().isoformat()
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/devices/{device_id}/latest/{sensor_type}")
def get_latest_sensor_reading(
    device_id: str,
    sensor_type: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Récupère la dernière lecture pour un type de capteur spécifique.
    """
    # Vérifier les permissions
    # check_permission("iot:data:read")(current_user)

    try:
        # Parser le type de capteur
        try:
            sensor_enum = SensorType(sensor_type.lower())
        except ValueError:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid sensor type. Supported types: {[st.value for st in SensorType]}"
            )

        reading = iot_service.get_latest_reading(device_id, sensor_enum)
        if not reading:
            raise HTTPException(status_code=404, detail="No sensor data found for this device and sensor type")

        return {
            "device_id": device_id,
            "sensor_type": sensor_type,
            "reading": reading,
            "timestamp": datetime.now().isoformat()
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/devices/{device_id}")
def get_device_metadata(
    device_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Récupère les métadonnées d'un appareil IoT.
    """
    # Vérifier les permissions
    # check_permission("iot:device:read")(current_user)

    metadata = iot_service.get_device_metadata(device_id)
    if not metadata:
        raise HTTPException(status_code=404, detail="IoT device not found")

    return {
        "device_id": device_id,
        "metadata": metadata,
        "timestamp": datetime.now().isoformat()
    }


@router.post("/devices/{device_id}/alert-rules")
@require_role(["admin", "manager"])
def add_alert_rule(
    device_id: str,
    sensor_type: str = Body(...),
    condition: str = Body(...),
    threshold: Any = Body(...),
    level: str = Body(...),
    message: str = Body(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Ajoute une règle d'alerte pour un appareil et un type de capteur.
    """
    # Vérifier les permissions
    # check_permission("iot:alert:create")(current_user)

    try:
        # Parser le type de capteur
        try:
            sensor_enum = SensorType(sensor_type.lower())
        except ValueError:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid sensor type. Supported types: {[st.value for st in SensorType]}"
            )

        # Parser le niveau d'alerte
        try:
            level_enum = AlertLevel(level.lower())
        except ValueError:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid alert level. Supported levels: {[al.value for al in AlertLevel]}"
            )

        success = iot_service.add_alert_rule(
            device_id=device_id,
            sensor_type=sensor_enum,
            condition=condition,
            threshold=threshold,
            level=level_enum,
            message=message
        )

        if not success:
            raise HTTPException(status_code=400, detail="Failed to add alert rule")

        return {
            "device_id": device_id,
            "sensor_type": sensor_type,
            "condition": condition,
            "threshold": threshold,
            "level": level,
            "message": message,
            "status": "Alert rule added successfully",
            "timestamp": datetime.now().isoformat()
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/devices/{device_id}/alerts")
def get_device_alerts(
    device_id: str,
    level: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Récupère les alertes actives pour un appareil donné.
    """
    # Vérifier les permissions
    # check_permission("iot:alert:read")(current_user)

    try:
        # Parser le niveau d'alerte si fourni
        parsed_level = None
        if level:
            try:
                parsed_level = AlertLevel(level.lower())
            except ValueError:
                raise HTTPException(
                    status_code=400,
                    detail=f"Invalid alert level. Supported levels: {[al.value for al in AlertLevel]}"
                )

        alerts = iot_service.get_active_alerts(device_id=device_id, level=parsed_level)

        return {
            "device_id": device_id,
            "alerts": alerts,
            "count": len(alerts),
            "timestamp": datetime.now().isoformat()
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/alerts")
def get_all_active_alerts(
    level: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Récupère toutes les alertes actives dans le système.
    """
    # Vérifier les permissions
    # check_permission("iot:alert:read")(current_user)

    try:
        # Parser le niveau d'alerte si fourni
        parsed_level = None
        if level:
            try:
                parsed_level = AlertLevel(level.lower())
            except ValueError:
                raise HTTPException(
                    status_code=400,
                    detail=f"Invalid alert level. Supported levels: {[al.value for al in AlertLevel]}"
                )

        alerts = iot_service.get_active_alerts(level=parsed_level)

        return {
            "alerts": alerts,
            "count": len(alerts),
            "timestamp": datetime.now().isoformat()
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.post("/alerts/{alert_id}/resolve")
@require_role(["admin", "manager"])
def resolve_alert(
    alert_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Marque une alerte comme résolue.
    """
    # Vérifier les permissions
    # check_permission("iot:alert:resolve")(current_user)

    success = iot_service.resolve_alert(alert_id)
    if not success:
        raise HTTPException(status_code=404, detail="Alert not found or already resolved")

    return {
        "alert_id": alert_id,
        "message": "Alert resolved successfully",
        "resolved_at": datetime.now().isoformat()
    }


@router.get("/devices/{device_id}/status")
def get_device_status(
    device_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Récupère le statut global d'un appareil IoT.
    """
    # Vérifier les permissions
    # check_permission("iot:device:read")(current_user)

    status = iot_service.get_device_status(device_id)
    if "error" in status:
        raise HTTPException(status_code=404, detail=status["error"])

    return {
        "device_id": device_id,
        "status": status,
        "timestamp": datetime.now().isoformat()
    }


@router.get("/devices")
def list_iot_devices(
    active_only: bool = Query(True),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Liste tous les appareils IoT enregistrés.
    """
    # Vérifier les permissions
    # check_permission("iot:device:read")(current_user)

    devices = []
    for device_id, metadata in iot_service.device_metadata.items():
        if active_only and not metadata.get("is_active", True):
            continue

        status = iot_service.get_device_status(device_id)
        devices.append({
            "device_id": device_id,
            "metadata": metadata,
            "status": status
        })

    return {
        "devices": devices,
        "count": len(devices),
        "timestamp": datetime.now().isoformat()
    }