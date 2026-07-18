from sqlalchemy.orm import Session
from typing import Optional
from decimal import Decimal
from app.models.parc import EmplacementParc, StatutEmplacement, ZoneParc

class WMSService:
    @staticmethod
    def suggerer_emplacement_put_away(
        db: Session, 
        poids_kg: float = 0.0, 
        volume_m3: float = 0.0,
        type_zone_preferee: str = None
    ) -> Optional[EmplacementParc]:
        """
        Moteur d'optimisation WMS pour suggérer le meilleur emplacement (Directed Put-away).
        Recherche un emplacement avec un statut libre ou partiellement occupé 
        qui a suffisamment de capacité pour le poids et le volume spécifiés.
        """
        # Construction de la requête de base
        query = db.query(EmplacementParc).join(ZoneParc)
        
        if type_zone_preferee:
            query = query.filter(ZoneParc.type_zone == type_zone_preferee)

        # On prend les emplacements non en maintenance
        query = query.filter(EmplacementParc.statut != StatutEmplacement.MAINTENANCE)

        # On parcourt les résultats pour vérifier les contraintes de capacité
        # C'est une heuristique simple (First Fit). Dans un système plus avancé,
        # on utiliserait une fonction de coût (ex: distance de la porte, regroupement des mêmes articles).
        emplacements = query.all()

        for emp in emplacements:
            poids = Decimal(str(poids_kg))
            volume = Decimal(str(volume_m3))
            
            # Vérifier la contrainte de poids
            if emp.capacite_maximale_kg:
                if emp.capacite_utilisee_kg + poids > emp.capacite_maximale_kg:
                    continue
            
            # Vérifier la contrainte de volume
            if emp.volume_max_m3:
                if emp.volume_utilise_m3 + volume > emp.volume_max_m3:
                    continue
                    
            # Si on arrive ici, l'emplacement est valide
            return emp
            
        return None

    @staticmethod
    def suggerer_stockage_magasin(
        db: Session,
        magasin_id: int,
        poids_kg: float = 0.0,
        volume_m3: float = 0.0
    ):
        """
        Suggère un emplacement libre (StorageSlot) dans un magasin donné (WMS Indoor).
        """
        from app.models.storage_slot import StorageSlot
        
        query = db.query(StorageSlot).filter(
            StorageSlot.magasin_id == magasin_id,
            StorageSlot.is_active == True,
            StorageSlot.is_occupied == False
        )
        
        slots = query.all()
        for slot in slots:
            # Vérifier capacité
            if slot.max_weight_kg and poids_kg > slot.max_weight_kg:
                continue
            if slot.max_volume_cbm and volume_m3 > slot.max_volume_cbm:
                continue
            
            # Simple "First Fit", on pourrait optimiser la distance à l'entrée
            return slot
            
        return None
