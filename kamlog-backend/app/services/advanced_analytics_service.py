# app/services/advanced_analytics_service.py - Service d'analyse avancée et de prévision
import statistics
import math
from typing import List, Dict, Any, Optional, Tuple
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, or_, desc
from collections import defaultdict
import json

from app.models.magasin import (
    Article, Magasin, ClientMagasin, Declaration, Reception, Stock, Commande,
    BandeLivraison, OrdreTransfert
)
from app.models.user import User
from app.services.magasin_service import (
    ArticleService, DeclarationService, ReceptionService, StockService,
    CommandeService
)
from app.utils.logger import get_logger

logger = get_logger(__name__)


class AdvancedAnalyticsService:
    """Service pour l'analyse avancée, la prévision et l'optimisation"""

    @staticmethod
    def forecast_demand_exponential_smoothing(
        historical_data: List[float],
        alpha: float = 0.3,
        horizon: int = 7
    ) -> List[float]:
        """
        Prévision de la demande avec lissage exponentiel simple

        Args:
            historical_data: Liste des valeurs historiques (plus récent en dernier)
            alpha: Facteur de lissage (0 < alpha <= 1)
            horizon: Nombre de périodes à prédire

        Returns:
            Liste des valeurs prévues
        """
        if not historical_data or len(historical_data) < 2:
            # Retourner la moyenne si pas assez de données
            avg = statistics.mean(historical_data) if historical_data else 0
            return [avg] * horizon

        # Lissage exponentiel simple
        smoothed = [historical_data[0]]  # Première valeur

        for i in range(1, len(historical_data)):
            smoothed.append(alpha * historical_data[i] + (1 - alpha) * smoothed[i-1])

        # Prédire les périodes futures
        last_smoothed = smoothed[-1]
        forecast = [last_smoothed] * horizon

        return forecast

    @staticmethod
    def forecast_demand_linear_regression(
        historical_data: List[float],
        horizon: int = 7
    ) -> List[float]:
        """
        Prévision de la demande avec régression linéaire simple

        Args:
            historical_data: Liste des valeurs historiques (plus récent en dernier)
            horizon: Nombre de périodes à prédire

        Returns:
            Liste des valeurs prévues
        """
        if not historical_data or len(historical_data) < 2:
            avg = statistics.mean(historical_data) if historical_data else 0
            return [avg] * horizon

        # Préparer les données pour la régression linéaire
        n = len(historical_data)
        x_values = list(range(n))  # 0, 1, 2, ..., n-1
        y_values = historical_data

        # Calculer les coefficients de la régression linéaire: y = bx + a
        sum_x = sum(x_values)
        sum_y = sum(y_values)
        sum_xy = sum(x * y for x, y in zip(x_values, y_values))
        sum_x2 = sum(x * x for x in x_values)

        # Éviter la division par zéro
        denominator = n * sum_x2 - sum_x * sum_x
        if denominator == 0:
            # Retourner la moyenne si pas de variation
            avg = statistics.mean(historical_data)
            return [avg] * horizon

        b = (n * sum_xy - sum_x * sum_y) / denominator  # pente
        a = (sum_y - b * sum_x) / n  # ordonnée à l'origine

        # Prédire les périodes futures
        forecast = []
        for i in range(horizon):
            x_future = n + i  # Période future
            y_future = b * x_future + a
            forecast.append(max(0, y_future))  # Pas de valeurs négatives

        return forecast

    @staticmethod
    def analyze_stock_turnover(
        db: Session,
        article_id: int,
        months: int = 12
    ) -> Dict[str, Any]:
        """
        Analyse le taux de rotation du stock pour un article

        Args:
            db: Session de base de données
            article_id: ID de l'article
            months: Nombre de mois d'historique à analyser

        Returns:
            Dictionnaire avec les métriques de rotation du stock
        """
        try:
            # Date de début de l'analyse
            start_date = datetime.now() - timedelta(days=30 * months)

            # Récupérer l'article
            article = ArticleService.get_article_by_id(db, article_id)
            if not article:
                raise ValueError(f"Article {article_id} introuvable")

            # Récupérer les réceptions de l'article sur la période
            receptions = db.query(Reception).join(Declaration).filter(
                Declaration.article_id == article_id,
                Reception.date_reception >= start_date
            ).all()

            # Récupérer les expéditions (commandes) de l'article sur la période
            # On approximer les expéditions par les commandes validées
            commandes = db.query(Commande).join(Commande.lignes).filter(
                and_(
                    Commande.lignes.any(),
                    Commande.date_commande >= start_date
                )
            ).all()

            # Calculer la quantité totale reçue
            total_received = 0
            for réception in receptions:
                for ligne in réception.lignes:
                    if ligne.article_id == article_id:
                        total_received += float(ligne.quantite or 0)

            # Calculer la quantité totale expédiée (approximation)
            total_shipped = 0
            for commande in commandes:
                for ligne in commande.lignes:
                    if ligne.article_id == article_id:
                        total_shipped += float(ligne.quantite_demandee or 0)

            # Stock moyen (approximation basé sur le stock actuel et reçus)
            current_stock = StockService.get_stock(db, article_id=article_id)
            avg_stock = (current_stock.quantite_udb if current_stock else 0) + (total_received / 2)

            # Taux de rotation = Coût des marchandises vendues / Stock moyen
            # On approximera par la quantité expédiée / stock moyen
            turnover_rate = total_shipped / max(avg_stock, 1) if avg_stock > 0 else 0

            # Jours de stock moyen de l'article.

            # Calculer les jours de stock cover (DSC - Days of Supply Coverage)
            # DSC = (Stock moyen * 365) / Coût des marchandises vendues annuel
            # On approximera avec les données mensuelles disponibles
            monthly_shipped = total_shipped / max(months, 1)
            days_of_cover = (avg_stock * 30) / max(monthly_shipped, 1) if monthly_shipped > 0 else float('inf')

            return {
                "article_id": article_id,
                "article_code": article.code_article,
                "article_name": article.nom,
                "analysis_period_months": months,
                "total_received_period": total_received,
                "total_shipped_period": total_shipped,
                "average_stock": avg_stock,
                "turnover_rate": turnover_rate,
                "days_of_cover": days_of_cover,
                "receptions_count": len(receptions),
                "commandes_count": len(commandes),
                "analysis_date": datetime.now().isoformat()
            }

        except Exception as e:
            logger.error(f"Erreur lors de l'analyse de rotation du stock: {str(e)}")
            raise

    @staticmethod
    def calculate_safety_stock(
        db: Session,
        article_id: int,
        magasin_id: int,
        service_level: float = 0.95,
        lead_time_days: int = 7
    ) -> Dict[str, Any]:
        """
        Calcule le stock de sécurité pour un article dans un magasin

        Args:
            db: Session de base de données
            article_id: ID de l'article
            magasin_id: ID du magasin
            service_level: Niveau de service souhaité (0-1, ex: 0.95 pour 95%)
            lead_time_days: Délai de réapprovisionnement en jours

        Returns:
            Dictionnaire avec le stock de sécurité calculé
        """
        try:
            # Récupérer l'article et le magasin
            article = ArticleService.get_article_by_id(db, article_id)
            magasin = StockService.get_magasin(db, magasin_id)

            if not article:
                raise ValueError(f"Article {article_id} introuvable")
            if not magasin:
                raise ValueError(f"Magasin {magasin_id} introuvable")

            # Récupérer l'historique de la demande quotidienne
            # On utilise les expéditions (commandes) comme proxy de la demande
            start_date = datetime.now() - timedelta(days=90)  # 3 mois d'historique

            # Récupérer les commandes de l'article pour ce magasin
            # Cette requête nécessiterait une jointure plus complexe - on simplifie
            commandes = db.query(Commande).filter(
                Commande.date_commande >= start_date
            ).all()

            # Extraire les quantités quotidiennes demandées pour cet article
            daily_demand = []
            current_date = start_date
            end_date = datetime.now()

            while current_date <= end_date:
                date_str = current_date.strftime("%Y-%m-%d")
                day_total = 0

                for commande in commandes:
                    if commande.date_commande.strftime("%Y-%m-%d") == date_str:
                        for ligne in commande.lignes:
                            if ligne.article_id == article_id:
                                day_total += float(ligne.quantite_demandee or 0)

                daily_demand.append(day_total)
                current_date += timedelta(days=1)

            # Si pas de données, utiliser des valeurs par défaut
            if not daily_demand or all(d == 0 for d in daily_demand):
                avg_daily_demand = 0
                demand_std = 0
            else:
                avg_daily_demand = statistics.mean(daily_demand)
                demand_std = statistics.stdev(daily_demand) if len(daily_demand) > 1 else 0

            # Calculer le stock de sécurité
            # Formule: SS = Z * σ * √LT
            # Où Z est le facteur de service (de la loi normale)
            # σ est l'écart-type de la demande quotidienne
            # LT est le délai de réapprovisionnement en jours

            # Facteurs Z pour différents niveaux de service
            service_factors = {
                0.90: 1.28,
                0.95: 1.65,
                0.99: 2.33
            }

            # Interpolation linéaire pour les valeurs intermédiaires
            if service_level in service_factors:
                Z = service_factors[service_level]
            else:
                # Approximation simple
                Z = 1.28 + (service_level - 0.90) * (2.33 - 1.28) / (0.99 - 0.90)

            safety_stock = Z * demand_std * math.sqrt(lead_time_days)

            # Point de commande (reorder point)
            # ROP = (Demande moyenne quotidienne * Délai) + Stock de sécurité
            reorder_point = (avg_daily_demand * lead_time_days) + safety_stock

            return {
                "article_id": article_id,
                "article_code": article.code_article,
                "magasin_id": magasin_id,
                "magasin_code": magasin.code,
                "service_level": service_level,
                "lead_time_days": lead_time_days,
                "average_daily_demand": avg_daily_demand,
                "demand_standard_deviation": demand_std,
                "safety_stock": max(0, safety_stock),
                "reorder_point": max(0, reorder_point),
                "current_stock": StockService.get_stock(db, magasin_id=magasin_id, article_id=article_id).quantite_udb if StockService.get_stock(db, magasin_id=magasin_id, article_id=article_id) else 0,
                "analysis_period_days": len(daily_demand),
                "calculation_date": datetime.now().isoformat()
            }

        except Exception as e:
            logger.error(f"Erreur lors du calcul du stock de sécurité: {str(e)}")
            raise

    @staticmethod
    def detect_anomalies_in_stock_movements(
        db: Session,
        article_id: int,
        magasin_id: int,
        days: int = 30,
        sensitivity: float = 2.0
    ) -> Dict[str, Any]:
        """
        Détecte les anomalies dans les mouvements de stock

        Args:
            db: Session de base de données
            article_id: ID de l'article
            magasin_id: ID du magasin
            days: Nombre de jours d'historique à analyser
            sensitivity: Niveau de sensibilité (écart-type multiples)

        Returns:
            Dictionnaire avec les anomalies détectées
        """
        try:
            # Récupérer l'historique des mouvements de stock
            # On combinera les réceptions (entrées) et expéditions (sorties)
            start_date = datetime.now() - timedelta(days=days)

            # Réceptions (entrées)
            receptions = db.query(Reception).join(Declaration).filter(
                Declaration.article_id == article_id,
                Reception.date_reception >= start_date
            ).all()

            # Expéditions approximées par les commandes
            commandes = db.query(Commande).filter(
                Commande.date_commande >= start_date
            ).all()

            # Créer une série temporelle des mouvements nets quotidiens
            daily_net_movements = []
            current_date = start_date
            end_date = datetime.now()

            while current_date <= end_date:
                date_str = current_date.strftime("%Y-%m-%d")
                day_in = 0
                day_out = 0

                # Entrées (réceptions)
                for réception in receptions:
                    if réception.date_reception.strftime("%Y-%m-%d") == date_str:
                        for ligne in réception.lignes:
                            if ligne.article_id == article_id:
                                day_in += float(ligne.quantite or 0)

                # Sorties (approximation par commandes)
                for commande in commandes:
                    if commande.date_commande.strftime("%Y-%m-%d") == date_str:
                        for ligne in commande.lignes:
                            if ligne.article_id == article_id:
                                day_out += float(ligne.quantite_demandee or 0)

                net_movement = day_in - day_out  # Positif = entrée nette, négatif = sortie nette
                daily_net_movements.append({
                    "date": date_str,
                    "in": day_in,
                    "out": day_out,
                    "net": net_movement
                })

                current_date += timedelta(days=1)

            # Analyser les anomalies dans les mouvements nets
            net_values = [day["net"] for day in daily_net_movements]

            if len(net_values) < 2:
                return {
                    "anomalies_detected": False,
                    "message": "Pas assez de données pour détecter des anomalies",
                    "data_points": len(net_values)
                }

            # Calculer la moyenne et l'écart-type
            mean_net = statistics.mean(net_values)
            try:
                std_net = statistics.stdev(net_values)
            except statistics.StatisticsError:
                std_net = 0

            # Détecter les anomalies (valeurs au-delà de sensitivity écarts-types)
            anomalies = []
            threshold = sensitivity * std_net

            for i, day in enumerate(daily_net_movements):
                deviation = abs(day["net"] - mean_net)
                if deviation > threshold and std_net > 0:
                    anomalies.append({
                        "date": day["date"],
                        "net_movement": day["net"],
                        "deviation": deviation,
                        "threshold": threshold,
                        "type": "entry" if day["net"] > mean_net else "exit",
                        "severity": "high" if deviation > 2 * threshold else "medium"
                    })

            return {
                "anomalies_detected": len(anomalies) > 0,
                "anomalies_count": len(anomalies),
                "anomalies": anomalies,
                "statistics": {
                    "mean_net_movement": mean_net,
                    "std_net_movement": std_net,
                    "data_points": len(net_values),
                    "analysis_period_days": days
                },
                "sensitivity": sensitivity,
                "analysis_date": datetime.now().isoformat()
            }

        except Exception as e:
            logger.error(f"Erreur lors de la détection d'anomalies: {str(e)}")
            raise

    @staticmethod
    def generate_demand_forecast_report(
        db: Session,
        article_id: int,
        magasin_id: Optional[int] = None,
        horizon_days: int = 30
    ) -> Dict[str, Any]:
        """
        Génère un rapport de prévision de la demande pour un article

        Args:
            db: Session de base de données
            article_id: ID de l'article
            magasin_id: ID du magasin (optionnel, pour l'analyse par magasin)
            horizon_days: Nombre de jours à prédire

        Returns:
            Rapport complet de prévision de la demande
        """
        try:
            # Récupérer l'article
            article = ArticleService.get_article_by_id(db, article_id)
            if not article:
                raise ValueError(f"Article {article_id} introuvable")

            # Récupérer l'historique de la demande quotidienne
            start_date = datetime.now() - timedelta(days=90)  # 3 mois d'historique

            # Cette fonction nécessiterait une jointure complexe pour filtrer par magasin
            # On simplifie en récupérant la demande globale
            commandes = db.query(Commande).filter(
                Commande.date_commande >= start_date
            ).all()

            # Créer une série temporelle de la demande quotidienne
            daily_demand = []
            current_date = start_date
            end_date = datetime.now()

            while current_date <= end_date:
                date_str = current_date.strftime("%Y-%m-%d")
                day_total = 0

                for commande in commandes:
                    if commande.date_commande.strftime("%Y-%m-%d") == date_str:
                        for ligne in commande.lignes:
                            if ligne.article_id == article_id:
                                day_total += float(ligne.quantite_demandee or 0)

                daily_demand.append(day_total)
                current_date += timedelta(days=1)

            # Si pas de données suffisantes, retourner une prévision de base
            if len(daily_demand) < 7:
                avg_demand = statistics.mean(daily_demand) if daily_demand else 0
                forecast_values = [avg_demand] * horizon_days
                method_used = "moyenne_simple"
                confidence = "faible"
            else:
                # Utiliser le lissage exponentiel pour la prévision
                forecast_values = AdvancedAnalyticsService.forecast_demand_exponential_smoothing(
                    historical_data=daily_demand,
                    alpha=0.3,
                    horizon=horizon_days
                )
                method_used = "lissage_exponentiel"
                confidence = "moyenne" if len(daily_demand) >= 30 else "faible"

            # Calculer les intervalles de confiance simplifiés
            if len(daily_demand) >= 2:
                try:
                    demand_std = statistics.stdev(daily_demand)
                    confidence_interval = {
                        "lower": [max(0, f - demand_std) for f in forecast_values],
                        "upper": [f + demand_std for f in forecast_values]
                    }
                except statistics.StatisticsError:
                    confidence_interval = {
                        "lower": forecast_values.copy(),
                        "upper": forecast_values.copy()
                    }
            else:
                confidence_interval = {
                    "lower": forecast_values.copy(),
                    "upper": forecast_values.copy()
                }

            # Générer les dates de prévision
            forecast_dates = []
            forecast_date = datetime.now() + timedelta(days=1)
            for i in range(horizon_days):
                forecast_dates.append(forecast_date.strftime("%Y-%m-%d"))
                forecast_date += timedelta(days=1)

            # Préparer les données historiques pour le graphique
            historical_dates = []
            hist_date = start_date
            for i in range(len(daily_demand)):
                historical_dates.append(hist_date.strftime("%Y-%m-%d"))
                hist_date += timedelta(days=1)

            return {
                "article_id": article_id,
                "article_code": article.code_article,
                "article_name": article.nom,
                "magasin_id": magasin_id,
                "forecast_horizon_days": horizon_days,
                "forecast_method": method_used,
                "confidence_level": confidence,
                "historical_data": {
                    "dates": historical_dates[-30:],  # Derniers 30 jours pour le graphique
                    "values": daily_demand[-30:] if len(daily_demand) >= 30 else daily_demand
                },
                "forecast": {
                    "dates": forecast_dates,
                    "values": forecast_values,
                    "confidence_interval": confidence_interval
                },
                "summary": {
                    "average_historical_demand": statistics.mean(daily_demand) if daily_demand else 0,
                    "forecast_average": statistics.mean(forecast_values),
                    "trend": "croissante" if forecast_values[-1] > forecast_values[0] else "décroissante" if forecast_values[-1] < forecast_values[0] else "stable"
                },
                "generation_date": datetime.now().isoformat()
            }

        except Exception as e:
            logger.error(f"Erreur lors de la génération du rapport de prévision: {str(e)}")
            raise


# Instance globale du service d'analyse avancée
advanced_analytics_service = AdvancedAnalyticsService()