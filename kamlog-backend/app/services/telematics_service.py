# app/services/telematics_service.py
from datetime import datetime, timezone
import logging
from typing import Optional, Dict, Any, List
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.models.transport import CamionFlotte, PositionGPS, MissionTransport, StatutMission

logger = logging.getLogger(__name__)

class TelematicsService:
    def __init__(self, db: Session):
        self.db = db

    def ingest_gps_position(
        self,
        tracker_id: str,
        latitude: float,
        longitude: float,
        vitesse_kmh: float = 0.0,
        timestamp_str: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Reçoit et enregistre une position GPS envoyée par un tracker (webhook).
        Met à jour l'ETA de la mission en cours si applicable.
        """
        # Trouver le camion associé au tracker
        camion = self.db.execute(
            select(CamionFlotte).where(CamionFlotte.gps_tracker_id == tracker_id)
        ).scalar_first()

        if not camion:
            logger.error(f"Ingestion GPS: Tracker ID {tracker_id} non reconnu.")
            return {"status": "error", "message": "Tracker ID non trouvé"}

        # Déterminer le timestamp
        ts = datetime.now(timezone.utc)
        if timestamp_str:
            try:
                # Expecting ISO format
                ts = datetime.fromisoformat(timestamp_str.replace("Z", "+00:00"))
            except Exception as e:
                logger.warning(f"Timestamp GPS invalide ({timestamp_str}), utilisation de l'heure actuelle.")

        # Enregistrer la position
        new_position = PositionGPS(
            camion_id=camion.id,
            latitude=latitude,
            longitude=longitude,
            vitesse_kmh=vitesse_kmh,
            timestamp=ts
        )
        self.db.add(new_position)

        # Vérifier s'il y a une mission en cours pour ce camion pour générer des alertes
        mission_en_cours = self.db.execute(
            select(MissionTransport).where(
                MissionTransport.camion_id == camion.id,
                MissionTransport.statut.in_([StatutMission.EN_ROUTE, StatutMission.EN_LIVRAISON])
            )
        ).scalar_first()

        alert = None
        eta = None
        if mission_en_cours:
            # Ici on pourrait appeler une API externe (ex: Google Maps) pour calculer le vrai ETA.
            # Pour le MVP, on génère une alerte basique si la vitesse est 0 pendant qu'il est en route.
            if vitesse_kmh == 0:
                 alert = "Vehicule à l'arrêt pendant une mission."
                 
            # Note: Calcul ETA simulé
            eta = "Dans 2 heures" # Stub

        self.db.flush()

        return {
            "status": "success",
            "camion_id": camion.id,
            "mission_en_cours": mission_en_cours.id if mission_en_cours else None,
            "alert": alert,
            "eta": eta
        }

    def get_latest_positions(self) -> List[Dict[str, Any]]:
        """
        Récupère la dernière position de chaque camion actif pour l'affichage sur carte.
        """
        camions = self.db.execute(
            select(CamionFlotte).where(CamionFlotte.actif == True)
        ).scalars().all()

        results = []
        for camion in camions:
            pos = self.db.execute(
                select(PositionGPS)
                .where(PositionGPS.camion_id == camion.id)
                .order_by(PositionGPS.timestamp.desc())
            ).scalar_first()

            if pos:
                results.append({
                    "camion_id": camion.id,
                    "immatriculation": camion.immatriculation,
                    "latitude": pos.latitude,
                    "longitude": pos.longitude,
                    "vitesse_kmh": pos.vitesse_kmh,
                    "last_update": pos.timestamp.isoformat()
                })

        return results
