# app/services/sustainability_service.py - Service de suivi de durabilité et d'optimisation verte
from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, or_
from enum import Enum

from app.models.user import User
from app.models.magasin import Article, Stock, Commande, Declaration, Reception
from app.utils.logger import get_logger

logger = get_logger(__name__)


class TransportMode(str, Enum):
    """Modes de transport pour le calcul d'émissions"""
    TRUCK = "truck"
    RAIL = "rail"
    SHIP = "ship"
    AIR = "air"


class EmissionScope(str, Enum):
    """Scopes d'émissions selon le protocole GHG"""
    SCOPE_1 = "scope_1"  # Émissions directes
    SCOPE_2 = "scope_2"  # Émissions indirectes liées à l'énergie
    SCOPE_3 = "scope_3"  # Autres émissions indirectes


class SustainabilityService:
    """Service pour le suivi de la durabilité, l'empreinte carbone et l'optimisation verte"""

    # Facteurs d'émission moyens (kg CO2e par unité) - valeurs simplifiées pour démonstration
    EMISSION_FACTORS = {
        TransportMode.TRUCK: 0.15,  # kg CO2e par tonne-km
        TransportMode.RAIL: 0.02,   # kg CO2e par tonne-km
        TransportMode.SHIP: 0.008,  # kg CO2e par tonne-km
        TransportMode.AIR: 0.5      # kg CO2e par tonne-km
    }

    # Facteurs d'émission pour l'entreposage (kg CO2e par m3-jour)
    WAREHOUSE_EMISSION_FACTOR = 0.05

    def __init__(self):
        # En production, ces données seraient stockées dans une base de données dédiée
        self.carbon_records: List[Dict] = []  # Historique des enregistrements de carbone
        self.shipments: List[Dict] = []       # Historique des expéditions
        self.energy_consumption: List[Dict] = []  # Consommation énergétique des entrepôts

    def record_carbon_emission(self, source: str, amount_kg_co2e: float,
                             scope: EmissionScope, description: str = None,
                             metadata: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Enregistre une émission de carbone.

        Args:
            source: Source de l'émission (ex: "transport", "entreposage", "production")
            amount_kg_co2e: Quantité d'émission en kg CO2 équivalent
            scope: Scope de l'émission selon le protocole GHG
            description: Description de l'activité générant les émissions
            metadata: Métadonnées additionnelles

        Returns:
            Enregistrement créé
        """
        record = {
            "id": f"carbon_{len(self.carbon_records) + 1}",
            "timestamp": datetime.now().isoformat(),
            "source": source,
            "amount_kg_co2e": amount_kg_co2e,
            "scope": scope.value,
            "description": description or "",
            "metadata": metadata or {}
        }

        self.carbon_records.append(record)
        logger.info(f"Carbon emission recorded: {amount_kg_co2e} kg CO2e from {source} (scope {scope.value})")

        return record

    def calculate_transport_emissions(self, distance_km: float, weight_tonnes: float,
                                    transport_mode: TransportMode) -> float:
        """
        Calcule les émissions de carbone pour un transport donné.

        Args:
            distance_km: Distance en kilomètres
            weight_tonnes: Poids en tonnes
            transport_mode: Mode de transport utilisé

        Returns:
            Émissions en kg CO2e
        """
        if transport_mode not in self.EMISSION_FACTORS:
            raise ValueError(f"Unsupported transport mode: {transport_mode}")

        tonne_km = distance_km * weight_tonnes
        emissions_kg_co2e = tonne_km * self.EMISSION_FACTORS[transport_mode]

        # Enregistrer automatiquement l'émission
        self.record_carbon_emission(
            source=f"transport_{transport_mode.value}",
            amount_kg_co2e=emissions_kg_co2e,
            scope=EmissionScope.SCOPE_3,
            description=f"Transport de {weight_tonnes} tonnes sur {distance_km} km par {transport_mode.value}",
            metadata={
                "distance_km": distance_km,
                "weight_tonnes": weight_tonnes,
                "transport_mode": transport_mode.value
            }
        )

        return emissions_kg_co2e

    def calculate_warehouse_emissions(self, volume_m3: float, days: float) -> float:
        """
        Calcule les émissions de carbone liées à l'entreposage.

        Args:
            volume_m3: Volume entreposé en mètres cubes
            days: Nombre de jours d'entreposage

        Returns:
            Émissions en kg CO2e
        """
        emissions_kg_co2e = volume_m3 * days * self.WAREHOUSE_EMISSION_FACTOR

        # Enregistrer automatiquement l'émission
        self.record_carbon_emission(
            source="warehouse_storage",
            amount_kg_co2e=emissions_kg_co2e,
            scope=EmissionScope.SCOPE_1,
            description=f"Entreposage de {volume_m3} m3 pendant {days} jours",
            metadata={
                "volume_m3": volume_m3,
                "days": days
            }
        )

        return emissions_kg_co2e

    def record_shipment(self, origin: str, destination: str, weight_tonnes: float,
                      transport_mode: TransportMode, distance_km: float = None,
                      departed_at: datetime = None, arrived_at: datetime = None) -> Dict[str, Any]:
        """
        Enregistre une expédition et calcule ses émissions associées.

        Args:
            origin: Lieu de départ
            destination: Destination
            weight_tonnes: Poids de l'expédition en tonnes
            transport_mode: Mode de transport utilisé
            distance_km: Distance en kilomètres (calculée approximativement si non fournie)
            departed_at: Heure de départ
            arrived_at: Heure d'arrivée

        Returns:
            Enregistrement de l'expédition avec calcul des émissions
        """
        if departed_at is None:
            departed_at = datetime.now()
        if arrived_at is None:
            arrived_at = departed_at + timedelta(hours=distance_km / 50)  # Estimation simplifiée

        if distance_km is None:
            # Estimation simplifiée de la distance basée sur les lieux
            # En production, on utiliserait un service de calcul de distance réel
            distance_km = 1000  # Valeur par défaut pour démonstration

        # Calculer les émissions de transport
        transport_emissions = self.calculate_transport_emissions(distance_km, weight_tonnes, transport_mode)

        # Calculer les émissions de manutention (chargement/déchargement)
        handling_emissions = weight_tonnes * 0.5  # 0.5 kg CO2e par tonne pour manutention
        self.record_carbon_emission(
            source=f"handling_{transport_mode.value}",
            amount_kg_co2e=handling_emissions,
            scope=EmissionScope.SCOPE_3,
            description=f"Manutention de {weight_tonnes} tonnes pour {transport_mode.value}",
            metadata={
                "weight_tonnes": weight_tonnes,
                "transport_mode": transport_mode.value,
                "operation": "loading_unloading"
            }
        )

        shipment_record = {
            "id": f"shipment_{len(self.shipments) + 1}",
            "origin": origin,
            "destination": destination,
            "weight_tonnes": weight_tonnes,
            "transport_mode": transport_mode.value,
            "distance_km": distance_km,
            "departed_at": departed_at.isoformat(),
            "arrived_at": arrived_at.isoformat(),
            "transport_emissions_kg_co2e": transport_emissions,
            "handling_emissions_kg_co2e": handling_emissions,
            "total_emissions_kg_co2e": transport_emissions + handling_emissions,
            "timestamp": datetime.now().isoformat()
        }

        self.shipments.append(shipment_record)
        logger.info(f"Shipment recorded: {weight_tonnes} tonnes from {origin} to {destination} via {transport_mode.value}")

        return shipment_record

    def get_carbon_footprint(self, start_date: datetime = None,
                           end_date: datetime = None,
                           scope: EmissionScope = None,
                           source: str = None) -> Dict[str, Any]:
        """
        Calcule l'empreinte carbone sur une période donnée.

        Args:
            start_date: Date de début de la période (optionnel)
            end_date: Date de fin de la période (optionnel)
            scope: Filtrer par scope d'émission (optionnel)
            source: Filtrer par source d'émission (optionnel)

        Returns:
            Résumé de l'empreinte carbone
        """
        records = self.carbon_records

        # Filtrer par période
        if start_date:
            records = [r for r in records if datetime.fromisoformat(r["timestamp"]) >= start_date]
        if end_date:
            records = [r for r in records if datetime.fromisoformat(r["timestamp"]) <= end_date]

        # Filtrer par scope
        if scope:
            records = [r for r in records if r["scope"] == scope.value]

        # Filtrer par source
        if source:
            records = [r for r in records if r["source"] == source]

        # Calculer les totaux
        total_emissions = sum(r["amount_kg_co2e"] for r in records)

        # Grouper par scope
        by_scope = {}
        for r in records:
            scope_val = r["scope"]
            if scope_val not in by_scope:
                by_scope[scope_val] = 0
            by_scope[scope_val] += r["amount_kg_co2e"]

        # Grouper par source
        by_source = {}
        for r in records:
            source_val = r["source"]
            if source_val not in by_source:
                by_source[source_val] = 0
            by_source[source_val] += r["amount_kg_co2e"]

        # Grouper par période (par jour)
        by_day = {}
        for r in records:
            day = datetime.fromisoformat(r["timestamp"]).date().isoformat()
            if day not in by_day:
                by_day[day] = 0
            by_day[day] += r["amount_kg_co2e"]

        return {
            "period": {
                "start": start_date.isoformat() if start_date else None,
                "end": end_date.isoformat() if end_date else None
            },
            "total_emissions_kg_co2e": total_emissions,
            "total_emissions_tonnes_co2e": total_emissions / 1000,
            "by_scope": by_scope,
            "by_source": by_source,
            "by_day": [{"date": day, "emissions_kg_co2e": emissions} for day, emissions in sorted(by_day.items())],
            "record_count": len(records),
            "timestamp": datetime.now().isoformat()
        }

    def get_transportation_efficiency_report(self, start_date: datetime = None,
                                           end_date: datetime = None) -> Dict[str, Any]:
        """
        Génère un rapport d'efficacité des transports.

        Args:
            start_date: Date de début (optionnel)
            end_date: Date de fin (optionnel)

        Returns:
            Rapport d'efficacité des transports
        """
        shipments = self.shipments

        # Filtrer par période
        if start_date:
            shipments = [s for s in shipments if datetime.fromisoformat(s["departed_at"]) >= start_date]
        if end_date:
            shipments = [s for s in shipments if datetime.fromisoformat(s["arrived_at"]) <= end_date]

        if not shipments:
            return {
                "message": "No shipments found for the specified period",
                "period": {
                    "start": start_date.isoformat() if start_date else None,
                    "end": end_date.isoformat() if end_date else None
                }
            }

        # Calculer les métriques par mode de transport
        by_mode = {}
        for shipment in shipments:
            mode = shipment["transport_mode"]
            if mode not in by_mode:
                by_mode[mode] = {
                    "count": 0,
                    "total_weight_tonnes": 0,
                    "total_distance_km": 0,
                    "total_emissions_kg_co2e": 0,
                    "total_tonne_km": 0
                }
            by_mode[mode]["count"] += 1
            by_mode[mode]["total_weight_tonnes"] += shipment["weight_tonnes"]
            by_mode[mode]["total_distance_km"] += shipment["distance_km"]
            by_mode[mode]["total_emissions_kg_co2e"] += shipment["total_emissions_kg_co2e"]
            by_mode[mode]["total_tonne_km"] += shipment["distance_km"] * shipment["weight_tonnes"]

        # Calculer l'efficacité (émissions par tonne-km)
        efficiency_report = {}
        for mode, stats in by_mode.items():
            if stats["total_tonne_km"] > 0:
                efficiency_kg_co2e_per_tonne_km = stats["total_emissions_kg_co2e"] / stats["total_tonne_km"]
            else:
                efficiency_kg_co2e_per_tonne_km = 0

            efficiency_report[mode] = {
                "shipment_count": stats["count"],
                "total_weight_tonnes": stats["total_weight_tonnes"],
                "total_distance_km": stats["total_distance_km"],
                "total_emissions_kg_co2e": stats["total_emissions_kg_co2e"],
                "total_tonne_km": stats["total_tonne_km"],
                "efficiency_kg_co2e_per_tonne_km": efficiency_kg_co2e_per_tonne_km,
                "efficiency_tonnes_co2e_per_tonne_km": efficiency_kg_co2e_per_tonne_km / 1000
            }

        return {
            "period": {
                "start": start_date.isoformat() if start_date else None,
                "end": end_date.isoformat() if end_date else None
            },
            "transportation_efficiency": efficiency_report,
            "most_efficient_mode": min(efficiency_report.items(), key=lambda x: x[1]["efficiency_kg_co2e_per_tonne_km"])[0] if efficiency_report else None,
            "least_efficient_mode": max(efficiency_report.items(), key=lambda x: x[1]["efficiency_kg_co2e_per_tonne_km"])[0] if efficiency_report else None,
            "timestamp": datetime.now().isoformat()
        }

    def suggest_green_route(self, origin: str, destination: str, weight_tonnes: float) -> Dict[str, Any]:
        """
        Suggère l'itinéraire le plus vert pour une expédition donnée.

        Args:
            origin: Lieu de départ
            destination: Destination
            weight_tonnes: Poids de l'expédition en tonnes

        Returns:
            Suggestion d'itinéraire vert avec comparaison des émissions
        """
        # En production, on utiliserait un vrai service de calcul d'itinéraire avec données géographiques
        # Pour cette démonstration, on simule quelques options

        # Distance estimée (simplifiée)
        base_distance = 1000  # km

        routes = [
            {
                "mode": TransportMode.SHIP,
                "distance_km": base_distance * 1.2,  # Les voies maritimes peuvent être plus longues
                "description": "Route maritime directe"
            },
            {
                "mode": TransportMode.RAIL,
                "distance_km": base_distance * 1.1,  # Le rail peut nécessiter des détours
                "description": "Route ferroviaire"
            },
            {
                "mode": TransportMode.TRUCK,
                "distance_km": base_distance,
                "description": "Route routière directe"
            }
        ]

        # Calculer les émissions pour chaque route
        route_options = []
        for route in routes:
            emissions = self.calculate_transport_emissions(route["distance_km"], weight_tonnes, route["mode"])
            route_options.append({
                "mode": route["mode"].value,
                "description": route["description"],
                "distance_km": route["distance_km"],
                "emissions_kg_co2e": emissions,
                "emissions_tonnes_co2e": emissions / 1000
            })

        # Trier par émissions (plus vert d'abord)
        route_options.sort(key=lambda x: x["emissions_kg_co2e"])

        best_route = route_options[0] if route_options else None

        return {
            "origin": origin,
            "destination": destination,
            "weight_tonnes": weight_tonnes,
            "recommended_route": best_route,
            "all_options": route_options,
            "timestamp": datetime.now().isoformat()
        }

    def get_sustainability_dashboard(self) -> Dict[str, Any]:
        """
        Génère un tableau de bord de durabilité avec les métriques clés.

        Returns:
            Tableau de bord de durabilité
        """
        # Empreinte carbone totale (derniers 30 jours)
        thirty_days_ago = datetime.now() - timedelta(days=30)
        carbon_30d = self.get_carbon_footprint(start_date=thirty_days_ago)

        # Efficacité des transports (derniers 30 jours)
        transport_efficiency = self.get_transportation_efficiency_report(start_date=thirty_days_ago)

        # Consommation énergétique des entrepôts (simplifiée)
        # En production, on récupérerait cela depuis les données réelles des entrepôts
        warehouse_energy_kwh = 15000  # Valeur simulée pour démonstration
        warehouse_emissions = warehouse_energy_kwh * 0.05  # Facteur d'émission simplifié

        return {
            "timestamp": datetime.now().isoformat(),
            "carbon_footprint_30d": {
                "total_emissions_kg_co2e": carbon_30d.get("total_emissions_kg_co2e", 0),
                "total_emissions_tonnes_co2e": carbon_30d.get("total_emissions_tonnes_co2e", 0),
                "by_scope": carbon_30d.get("by_scope", {}),
                "record_count": carbon_30d.get("record_count", 0)
            },
            "transportation": {
                "total_shipments_30d": len([s for s in self.shipments if datetime.fromisoformat(s["timestamp"]) >= thirty_days_ago]),
                "efficiency_by_mode": transport_efficiency.get("transportation_efficiency", {}),
                "most_efficient_mode": transport_efficiency.get("most_efficient_mode"),
                "least_efficient_mode": transport_efficiency.get("least_efficient_mode")
            },
            "warehouse": {
                "estimated_energy_consumption_kwh": warehouse_energy_kwh,
                "estimated_emissions_kg_co2e": warehouse_emissions,
                "estimated_emissions_tonnes_co2e": warehouse_emissions / 1000
            },
            "sustainability_score": self._calculate_sustainability_score()
        }

    def _calculate_sustainability_score(self) -> float:
        """
        Calcule un score de durabilité global (0-100, où 100 est idéal).
        C'est une simplification - en production, cela serait basé sur des métriques réelles et des objectifs.

        Returns:
            Score de durabilité entre 0 et 100
        """
        # Pour cette démonstration, on retourne un score basé sur quelques heuristiques simples
        # En réalité, cela nécessiterait des données réelles et des objectifs définis

        score = 75.0  # Score de base

        # Ajuster basé sur les émissions récentes
        seven_days_ago = datetime.now() - timedelta(days=7)
        recent_emissions = self.get_carbon_footprint(start_date=seven_days_ago)
        weekly_emissions_tonnes = recent_emissions.get("total_emissions_tonnes_co2e", 0)

        # Pénaliser les émissions élevées (seuil arbitraire pour démonstration)
        if weekly_emissions_tonnes > 10:  # Plus de 10 tonnes CO2e par semaine
            score -= min(20, (weekly_emissions_tonnes - 10) * 2)  # Jusqu'à -20 points
        elif weekly_emissions_tonnes < 5:  # Moins de 5 tonnes CO2e par semaine
            score += min(10, (5 - weekly_emissions_tonnes) * 2)  # Jusqu'à +10 points

        # S'assurer que le score reste entre 0 et 100
        return max(0, min(100, score))


# Instance globale du service de durabilité
sustainability_service = SustainabilityService()