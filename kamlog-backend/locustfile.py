from locust import HttpUser, task, between
import random
import uuid
import time
import math

class TelematicsAndBillingUser(HttpUser):
    wait_time = between(0.1, 1.0) # Simulation d'envois fréquents
    
    def on_start(self):
        # Initialiser des identifiants factices pour le load testing
        self.tracker_id = f"TRK-{uuid.uuid4().hex[:8]}"
        self.tenant_id = f"TENANT-{random.randint(1, 100)}"
        
        # Position initiale
        self.lat = 4.0511 + random.uniform(-0.05, 0.05)
        self.lng = 9.7679 + random.uniform(-0.05, 0.05)

    @task(3)
    def send_telematics(self):
        """Simule un GPS envoyant sa position en temps réel."""
        # Déplacer un peu
        self.lat += random.uniform(-0.001, 0.001)
        self.lng += random.uniform(-0.001, 0.001)
        
        payload = {
            "gps_tracker_id": self.tracker_id,
            "latitude": self.lat,
            "longitude": self.lng,
            "vitesse_kmh": random.uniform(20.0, 80.0),
            "heading": random.uniform(0, 360)
        }
        
        self.client.post("/api/v1/telematics/ingest", json=payload, headers={"X-Tenant-ID": self.tenant_id})

    @task(1)
    def view_live_map(self):
        """Simule un dispatcher consultant la Live Map."""
        self.client.get("/api/v1/telematics/live-gps", headers={"X-Tenant-ID": self.tenant_id})
        
    @task(1)
    def create_facture(self):
        """Simule la création d'une facture à la volée (high volume billing)."""
        payload = {
            "numero_facture": f"FAC-{int(time.time())}-{random.randint(1000, 9999)}",
            "tiers_id": random.randint(1, 10),
            "montant_ht_xaf": float(random.randint(10000, 500000)),
            "montant_tva": float(random.randint(1925, 96250)),
            "montant_ttc_xaf": float(random.randint(11925, 596250))
        }
        # Note: ceci échouera probablement 404/401 si non authentifié, mais teste la charge de l'API / Metering
        self.client.post("/api/v1/finance/factures", json=payload, headers={"X-Tenant-ID": self.tenant_id})
