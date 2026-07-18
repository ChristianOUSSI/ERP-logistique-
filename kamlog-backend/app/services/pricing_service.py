# app/services/pricing_service.py
from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import select, and_
from app.models.rate_table import RateTable, RateRule, PricingBasis, TransportMode
import logging

logger = logging.getLogger(__name__)

class PricingService:
    def __init__(self, db: Session):
        self.db = db

    def calculate_freight_cost(
        self,
        origin_zone: str,
        destination_zone: str,
        transport_mode: TransportMode,
        weight_kg: float = 0.0,
        volume_cbm: float = 0.0,
        pallets: int = 0,
        containers_20: int = 0,
        containers_40: int = 0,
        distance_km: float = 0.0,
        client_id: Optional[int] = None
    ) -> Dict[str, Any]:
        """
        Calcule le coût de transport basé sur les grilles tarifaires configurées.
        Privilégie les grilles spécifiques au client si `client_id` est fourni.
        """
        
        # 1. Identifier la table de tarification applicable
        rate_table_query = select(RateTable).where(RateTable.is_active == True)
        
        if client_id:
            # Chercher une grille spécifique au client
            client_rate_table = self.db.execute(
                rate_table_query.where(RateTable.client_id == client_id)
            ).scalar_first()
            
            rate_table = client_rate_table
        else:
            rate_table = None

        if not rate_table:
            # Fallback sur une grille standard (client_id is null)
            rate_table = self.db.execute(
                rate_table_query.where(RateTable.client_id.is_(None))
            ).scalar_first()

        if not rate_table:
            logger.warning(f"Aucune grille tarifaire trouvée pour le calcul.")
            return {"status": "error", "message": "Aucune grille tarifaire disponible", "cost": 0.0}

        # 2. Chercher la règle correspondante
        rules_query = select(RateRule).where(
            and_(
                RateRule.rate_table_id == rate_table.id,
                RateRule.origin_zone == origin_zone,
                RateRule.destination_zone == destination_zone,
                RateRule.transport_mode == transport_mode
            )
        )
        
        rules = self.db.execute(rules_query).scalars().all()
        
        if not rules:
            return {"status": "error", "message": "Aucune règle tarifaire correspondante", "cost": 0.0}

        # 3. Calculer le coût pour chaque règle applicable et prendre le meilleur prix (ou une logique métier spécifique)
        calculated_costs = []
        for rule in rules:
            cost = self._apply_rule(rule, weight_kg, volume_cbm, pallets, containers_20, containers_40, distance_km)
            if cost is not None:
                calculated_costs.append({
                    "rule_id": rule.id,
                    "basis": rule.basis,
                    "cost": cost,
                    "currency": rate_table.currency
                })

        if not calculated_costs:
             return {"status": "error", "message": "Règles tarifaires incompatibles avec les quantités fournies", "cost": 0.0}

        # On prend le tarif le plus bas (logique à adapter si on veut faire de l'optimisation ou un cumul)
        best_rate = min(calculated_costs, key=lambda x: x["cost"])
        
        return {
            "status": "success",
            "rate_table_id": rate_table.id,
            "best_rate": best_rate,
            "all_applicable_rates": calculated_costs
        }

    def _apply_rule(
        self,
        rule: RateRule,
        weight_kg: float,
        volume_cbm: float,
        pallets: int,
        containers_20: int,
        containers_40: int,
        distance_km: float
    ) -> Optional[float]:
        """
        Applique une règle tarifaire spécifique aux quantités données.
        """
        quantity = 0.0
        
        if rule.basis == PricingBasis.PER_KG:
            quantity = weight_kg
        elif rule.basis == PricingBasis.PER_CBM:
            quantity = volume_cbm
        elif rule.basis == PricingBasis.PER_PALLET:
            quantity = pallets
        elif rule.basis == PricingBasis.PER_CONTAINER_20:
            quantity = containers_20
        elif rule.basis == PricingBasis.PER_CONTAINER_40:
            quantity = containers_40
        elif rule.basis == PricingBasis.DISTANCE_KM:
            quantity = distance_km
        elif rule.basis == PricingBasis.FLAT_FEE:
            quantity = 1.0

        if quantity <= 0 and rule.basis != PricingBasis.FLAT_FEE:
            return None # Cette règle ne s'applique pas s'il n'y a pas la quantité correspondante
            
        # Check tiers if min/max are defined
        if rule.min_value is not None and quantity < rule.min_value:
            return None
        if rule.max_value is not None and quantity > rule.max_value:
            return None

        calculated_cost = quantity * rule.unit_price
        
        if rule.minimum_charge is not None and calculated_cost < rule.minimum_charge:
            return rule.minimum_charge
            
        return calculated_cost
