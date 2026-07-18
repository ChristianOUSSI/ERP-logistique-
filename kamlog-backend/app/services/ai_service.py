# app/services/ai_service.py - Service d'intelligence artificielle pour requêtes en langage naturel et ML
import re
import statistics
import math
from typing import List, Dict, Any, Optional, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import text, and_, or_
from datetime import datetime, timedelta
from decimal import Decimal

from app.models.magasin import (
    Article, Magasin, ClientMagasin, Declaration, Reception, Stock, Commande
)
from app.models.user import User
from app.schemas.magasin import (
    ArticleCreate, ArticleUpdate, DeclarationCreate, ReceptionCreate
)
from app.services.magasin_service import (
    ArticleService, DeclarationService, ReceptionService, StockService
)
from app.services.advanced_analytics_service import advanced_analytics_service
from app.utils.logger import get_logger

logger = get_logger(__name__)


class AIService:
    """Service pour les fonctionnalités d'IA : requêtes en langage naturel, traitement de documents, ML"""

    @staticmethod
    def process_natural_language_query(db: Session, query: str, user: User) -> Dict[str, Any]:
        """
        Traite une requête en langage naturel et retourne les résultats appropriés.

        Args:
            db: Session de base de données
            query: Requête en langage naturel
            user: Utilisateur faisant la requête

        Returns:
            Dict contenant le type de réponse et les données
        """
        query_lower = query.lower().strip()

        # Requêtes sur les stocks
        if any(keyword in query_lower for keyword in ['stock', 'inventaire', 'disponible', 'quantité']):
            return AIService._handle_stock_query(db, query_lower, user)

        # Requêtes sur les articles
        elif any(keyword in query_lower for keyword in ['article', 'produit', 'référence', 'sku']):
            return AIService._handle_article_query(db, query_lower, user)

        # Requêtes sur les commandes
        elif any(keyword in query_lower for keyword in ['commande', 'order', 'achat', 'vente']):
            return AIService._handle_order_query(db, query_lower, user)

        # Requêtes sur les déclarations / BL
        elif any(keyword in query_lower for keyword in ['déclaration', 'bl', 'bill of lading', 'livraison']):
            return AIService._handle_declaration_query(db, query_lower, user)

        # Requêtes sur les mouvements / historique
        elif any(keyword in query_lower for keyword in ['mouvement', 'historique', 'historique', 'trace']):
            return AIService._handle_movement_query(db, query_lower, user)

        # Requêtes analytiques
        elif any(keyword in query_lower for keyword in ['statistique', 'analyse', 'rapport', 'tableau de bord', 'kpi', 'prévision', 'prédire']):
            return AIService._handle_analytics_query(db, query_lower, user)

        # Requêtes de prévision avancée
        elif any(keyword in query_lower for keyword in ['prévoir', 'prédiction', 'forecast', 'tendance', 'saisonnalité']):
            return AIService._handle_forecasting_query(db, query_lower, user)

        # Requêtes d'optimisation
        elif any(keyword in query_lower for keyword in ['optimiser', 'réduction', 'stock de sécurité', 'point de commande']):
            return AIService._handle_optimization_query(db, query_lower, user)

        # Requêtes d'aide
        elif any(keyword in query_lower for keyword in ['aide', 'help', 'comment', 'comment faire']):
            return AIService._handle_help_query()

        else:
            return {
                "type": "text",
                "message": "Je n'ai pas compris votre requête. Essayez de reformuler ou demandez de l'aide.",
                "suggestions": [
                    "Montre moi le stock des articles",
                    "Quel est l'article avec la référence ART-202607-001 ?",
                    "Quelles commandes sont en attente ?",
                    "Montre moi les déclarations du client X",
                    "Quel est le stock total par magasin ?",
                    "Prévoir la demande pour l'article ART-202607-001",
                    "Calculer le stock de sécurité pour l'article ART-202607-001 magasin Douala",
                    "Détecter les anomalies dans les mouvements de stock",
                    "Aide"
                ]
            }

    @staticmethod
    def _handle_forecasting_query(db: Session, query: str, user: User) -> Dict[str, Any]:
        """Gère les requêtes liées à la prévision de la demande"""
        # Extraire les paramètres de la requête
        article_match = re.search(r'(?:article|produit|référence|sku)\s+(?:[«»"]*)([^«»"\s]+)(?:[«»"]*)', query)
        magasin_match = re.search(r'(?:dans|au|au sein de)\s+(?:le\s+)?magasin\s+([a-zA-Z0-9\-_]+)', query)
        horizon_match = re.search(r'(?:sur|pendant|pour)\s+(\d+)\s+(?:jour|jours|semaine|semaines|mois)', query)

        article_filter = None
        magasin_filter = None
        horizon_days = 30  # défaut

        if article_match:
            article_code = article_match.group(1)
            article = db.query(Article).filter(Article.code_article == article_code).first()
            if article:
                article_filter = article.id

        if magasin_match:
            magasin_code = magasin_match.group(1)
            magasin = db.query(Magasin).filter(Magasin.code == magasin_code).first()
            if magasin:
                magasin_filter = magasin.id

        if horizon_match:
            horizon_value = int(horizon_match.group(1))
            horizon_unit = horizon_match.group(0).split()[-1]  # dernier mot
            if horizon_unit.startswith('jour'):
                horizon_days = horizon_value
            elif horizon_unit.startswith('semaine'):
                horizon_days = horizon_value * 7
            elif horizon_unit.startswith('mois'):
                horizon_days = horizon_value * 30

        if article_filter:
            try:
                # Générer le rapport de prévision
                forecast_report = advanced_analytics_service.generate_demand_forecast_report(
                    db=db,
                    article_id=article_filter,
                    magasin_id=magasin_filter,
                    horizon_days=horizon_days
                )

                return {
                    "type": "forecast",
                    "title": f"Prévision de la demande pour {forecast_report['article_code']}",
                    "article": {
                        "code": forecast_report["article_code"],
                        "nom": forecast_report["article_name"]
                    },
                    "forecast_horizon_days": forecast_report["forecast_horizon_days"],
                    "forecast_method": forecast_report["forecast_method"],
                    "confidence_level": forecast_report["confidence_level"],
                    "historical_data": forecast_report["historical_data"],
                    "forecast": forecast_report["forecast"],
                    "summary": forecast_report["summary"],
                    "generation_date": forecast_report["generation_date"]
                }
            except Exception as e:
                logger.error(f"Erreur lors de la génération de prévision: {str(e)}")
                return {
                    "type": "error",
                    "message": f"Erreur lors de la génération de la prévision: {str(e)}"
                }
        else:
            return {
                "type": "text",
                "message": "Précisez quel article vous souhaitez prévoir (par référence, nom, ou description).",
                "suggestions": [
                    "Prévoir la demande pour l'article ART-202607-001",
                    "Prévoir la demande pour l'article ART-202607-001 magasin Douala sur 15 jours",
                    "Prévoir la tendance pour les 60 prochains jours"
                ]
            }

    @staticmethod
    def _handle_optimization_query(db: Session, query: str, user: User) -> Dict[str, Any]:
        """Gère les requêtes liées à l'optimisation des stocks"""
        # Extraire les paramètres de la requête
        article_match = re.search(r'(?:article|produit|référence|sku)\s+(?:[«»"]*)([^«»"\s]+)(?:[«»"]*)', query)
        magasin_match = re.search(r'(?:dans|au|au sein de)\s+(?:le\s+)?magasin\s+([a-zA-Z0-9\-_]+)', query)
        service_match = re.search(r'(?:service|niveau\s+de\s+service)\s+(?:[«»"]*)([0-9.]+)(?:[«»"]*)', query)
        leadtime_match = re.search(r'(?:délai|lead\s*time|approvisionnement)\s+(?:[«»"]*)([0-9]+)(?:[«»"]*)\s*(?:jour|jours)', query)

        article_filter = None
        magasin_filter = None
        service_level = 0.95  # défaut
        lead_time_days = 7    # défaut

        if article_match:
            article_code = article_match.group(1)
            article = db.query(Article).filter(Article.code_article == article_code).first()
            if article:
                article_filter = article.id

        if magasin_match:
            magasin_code = magasin_match.group(1)
            magasin = db.query(Magasin).filter(Magasin.code == magasin_code).first()
            if magasin:
                magasin_filter = magasin.id

        if service_match:
            try:
                service_level = float(service_match.group(1))
                # S'assurer que c'est entre 0 et 1
                service_level = max(0.5, min(0.99, service_level))
            except ValueError:
                pass  # Garder la valeur par défaut

        if leadtime_match:
            try:
                lead_time_days = int(leadtime_match.group(1))
                # S'assurer que c'est positif
                lead_time_days = max(1, lead_time_days)
            except ValueError:
                pass  # Garder la valeur par défaut

        if article_filter and magasin_filter:
            try:
                # Calculer le stock de sécurité et le point de commande
                safety_stock_report = advanced_analytics_service.calculate_safety_stock(
                    db=db,
                    article_id=article_filter,
                    magasin_id=magasin_filter,
                    service_level=service_level,
                    lead_time_days=lead_time_days
                )

                return {
                    "type": "optimization",
                    "title": f"Optimisation du stock pour {safety_stock_report['article_code']}",
                    "article": {
                        "code": safety_stock_report["article_code"],
                        "nom": db.query(Article).filter(Article.id == article_filter).first().nom
                    },
                    "magasin": {
                        "code": safety_stock_report["magasin_code"],
                        "nom": db.query(Magasin).filter(Magasin.id == magasin_filter).first().nom
                    },
                    "parameters": {
                        "service_level": safety_stock_report["service_level"],
                        "lead_time_days": safety_stock_report["lead_time_days"]
                    },
                    "recommendations": {
                        "average_daily_demand": safety_stock_report["average_daily_demand"],
                        "demand_standard_deviation": safety_stock_report["demand_standard_deviation"],
                        "safety_stock": safety_stock_report["safety_stock"],
                        "reorder_point": safety_stock_report["reorder_point"],
                        "current_stock": safety_stock_report["current_stock"],
                        "stock_to_order": max(0, safety_stock_report["reorder_point"] - safety_stock_report["current_stock"])
                    },
                    "analysis_date": safety_stock_report["calculation_date"]
                }
            except Exception as e:
                logger.error(f"Erreur lors du calcul d'optimisation: {str(e)}")
                return {
                    "type": "error",
                    "message": f"Erreur lors du calcul d'optimisation: {str(e)}"
                }
        else:
            return {
                "type": "text",
                "message": "Précisez l'article et le magasin pour lesquels vous souhaitez optimiser le stock.",
                "suggestions": [
                    "Optimiser le stock de l'article ART-202607-001 magasin Douala",
                    "Calculer le stock de sécurité pour l'article ART-202607-001 avec niveau de service 95%",
                    "Déterminer le point de commande pour l'article ART-202607-001 magasin Douala délai 10 jours"
                ]
            }

    # Les méthodes existantes restent inchangées pour maintenir la compatibilité
    @staticmethod
    def _handle_stock_query(db: Session, query: str, user: User) -> Dict[str, Any]:
        """Gère les requêtes liées aux stocks"""
        # Extraire les paramètres de la requête
        magasin_filter = None
        article_filter = None

        # Recherche de filtre magasin
        magasin_match = re.search(r'(?:dans|au|au sein de)\s+(?:le\s+)?magasin\s+([a-zA-Z0-9\-_]+)', query)
        if magasin_match:
            magasin_code = magasin_match.group(1)
            magasin = db.query(Magasin).filter(Magasin.code == magasin_code).first()
            if magasin:
                magasin_filter = magasin.id

        # Recherche de filtre article
        article_match = re.search(r'article\s+(?:[«»"]*)([^«»"\s]+)(?:[«»"]*)', query)
        if article_match:
            article_code = article_match.group(1)
            article = db.query(Article).filter(Article.code_article == article_code).first()
            if article:
                article_filter = article.id

        # Si demande de stock total
        if any(keyword in query for keyword in ['total', 'global', 'somme']):
            if magasin_filter:
                stocks = StockService.get_stocks_by_magasin(db, magasin_filter)
                total_udb = sum(s.quantite_udb for s in stocks)
                magasin_name = db.query(Magasin).filter(Magasin.id == magasin_filter).first().nom
                return {
                    "type": "metric",
                    "title": f"Stock total dans le magasin {magasin_name}",
                    "value": f"{total_udb:.2f} UDB",
                    "detail": f"{len(stocks)} articles en stock"
                }
            else:
                # Stock global par agence de l'utilisateur
                from app.models.agency import Agency
                agency = db.query(Agency).join(User).filter(User.id == user.id).first()
                if agency:
                    # Cette requête nécessiterait une jointure plus complexe, simplifions
                    stocks = db.query(Stock).join(Magasin).join(Agency).filter(Agency.id == agency.id).all()
                    total_udb = sum(s.quantite_udb for s in stocks)
                    return {
                        "type": "metric",
                        "title": f"Stock total de l'agence {agency.nom}",
                        "value": f"{total_udb:.2f} UDB",
                        "detail": f"{len(stocks)} emplacements de stock"
                    }

        # Sinon, retourner les stocks détaillés
        if magasin_filter:
            stocks = StockService.get_stocks_by_magasin(db, magasin_filter)
            magasin_name = db.query(Magasin).filter(Magasin.id == magasin_filter).first().nom
        elif article_filter:
            stocks = StockService.get_stocks_by_article(db, article_filter)
            article_name = db.query(Article).filter(Article.id == article_filter).first().nom
        else:
            # Stocks de l'agence de l'utilisateur (simplifié)
            stocks = db.query(Stock).limit(50).all()  # Limite pour éviter les surcharges
            magasin_name = "Tous les magasins"

        if not stocks:
            return {
                "type": "text",
                "message": "Aucun stock trouvé correspondant à vos critères."
            }

        # Formatage des résultats
        stock_details = []
        for stock in stocks[:20]:  # Limiter à 20 résultats pour la lisibilité
            article = db.query(Article).filter(Article.id == stock.article_id).first()
            magasin = db.query(Magasin).filter(Magasin.id == stock.magasin_id).first()
            stock_details.append({
                "article_code": article.code_article if article else "N/A",
                "article_name": article.nom if article else "N/A",
                "magasin": magasin.nom if magasin else "N/A",
                "quantite_udb": float(stock.quantite_udb),
                "quantite_disponible": float(stock.quantite_disponible),
                "emplacement": stock.emplacement or "Non spécifié"
            })

        return {
            "type": "table",
            "title": f"Stock - {magasin_name if 'magasin_name' in locals() else 'Résultats'}",
            "headers": ["Article", "Description", "Magasin", "Qté UDB", "Disponible", "Emplacement"],
            "rows": [
                [
                    s["article_code"],
                    s["article_name"][:30] + "..." if len(s["article_name"]) > 30 else s["article_name"],
                    s["magasin"],
                    f"{s['quantite_udb']:.2f}",
                    f"{s['quantite_disponible']:.2f}",
                    s["emplacement"]
                ] for s in stock_details
            ],
            "total_rows": len(stock_details),
            "has_more": len(stocks) > 20
        }

    @staticmethod
    def _handle_article_query(db: Session, query: str, user: User) -> Dict[str, Any]:
        """Gère les requêtes liées aux articles"""
        # Recherche d'article spécifique
        article_match = re.search(r'article\s+(?:[«»"]*)([^«»"\s]+)(?:[«»"]*)|référence\s+(?:[«»"]*)([^«»"\s]+)(?:[«»"]*)|sku\s+(?:[«»"]*)([^«»"\s]+)(?:[«»"]*)', query)

        if article_match:
            # Prendre le premier groupe non None
            article_code = next((g for g in article_match.groups() if g is not None), None)
            if article_code:
                article = db.query(Article).filter(Article.code_article == article_code).first()
                if article:
                    # Récupérer le stock total
                    total_stock = StockService.get_total_stock_by_article(db, article.id)

                    # Récupérer les stocks par magasin
                    stocks_by_mag = db.query(Stock, Magasin.nom).join(Magasin).filter(Stock.article_id == article.id).all()

                    stock_by_location = [
                        {"magasin": magasin_nom, "quantite": float(stock.quantite_udb)}
                        for stock, magasin_nom in stocks_by_mag
                    ]

                    return {
                        "type": "article_detail",
                        "article": {
                            "code": article.code_article,
                            "nom": article.nom,
                            "description": article.description or "N/A",
                            "poids_unitaire": float(article.poids_unitaire) if article.poids_unitaire else None,
                            "volume_unitaire": float(article.volume_unitaire) if article.volume_unitaire else None,
                            "unite_mesure": article.unite_mesure.value if hasattr(article.unite_mesure, 'value') else str(article.unite_mesure),
                            "est_actif": article.est_actif
                        },
                        "stock_total_udb": float(total_stock),
                        "stock_par_magasin": stock_by_location
                    }
                else:
                    return {
                        "type": "text",
                        "message": f"Aucun article trouvé avec la référence '{article_code}'."
                    }

        # Recherche par nom/description
        search_term_match = re.search(r'(?:article|produit)\s+(?:appelé|nommé|containing|contenant\s+)[«»"]*([^«»"\s][^«»"]*?)[«»"]*', query)
        if search_term_match:
            search_term = search_term_match.group(1)
            articles = ArticleService.search_articles(db, search_term)

            if articles:
                article_list = []
                for article in articles[:10]:  # Limiter à 10 résultats
                    total_stock = StockService.get_total_stock_by_article(db, article.id)
                    article_list.append({
                        "code": article.code_article,
                        "nom": article.nom,
                        "stock_total": float(total_stock),
                        "actif": article.est_actif
                    })

                    return {
                        "type": "table",
                        "title": f"Articles contenant '{search_term}'",
                        "headers": ["Code", "Nom", "Stock Total (UDB)", "Actif"],
                        "rows": [
                            [
                                a["code"],
                                a["nom"][:30] + "..." if len(a["nom"]) > 30 else a["nom"],
                                f"{a['stock_total']:.2f}",
                                "Oui" if a["actif"] else "Non"
                            ] for a in article_list
                        ],
                        "total_rows": len(article_list),
                        "has_more": len(articles) > 10
                    }

        return {
            "type": "text",
            "message": "Précisez quel article vous recherchez (par référence, nom, ou description).",
            "suggestions": [
                "Article ART-202607-001",
                "Produit contenant 'acier'",
                "Référence BULK-001"
            ]
        }

    # Les autres méthodes restent inchangées (_handle_order_query, _handle_declaration_query, etc.)
    # Pour préserver l'espace, je ne les répète pas ici, mais elles restent disponibles

    @staticmethod
    def _handle_order_query(db: Session, query: str, user: User) -> Dict[str, Any]:
        """Gère les requêtes liées aux commandes"""
        # Recherche de commandes par statut
        statut_map = {
            'en preparation': 'EN_PREPARATION',
            'en attente': 'ATTENTE',
            'validee': 'VALIDEE',
            'payee': 'PAYEE',
            'livree': 'LIVREE',
            'annulee': 'ANNULEE'
        }

        statut_filter = None
        for fr_key, enum_value in statut_map.items():
            if fr_key in query:
                statut_filter = enum_value
                break

        # Recherche de commande spécifique
        cmd_match = re.search(r'commande\s+(?:[«»"]*)([^«»"\s]+)(?:[«»"]*)|numero\s+(?:[«»"]*)([^«»"\s]+)(?:[«»"]*)|cmd\s+(?:[«»"]*)([^«»"\s]+)(?:[«»"]*)', query)

        if cmd_match:
            cmd_numero = next((g for g in cmd_match.groups() if g is not None), None)
            if cmd_numero:
                commande = db.query(Commande).filter(Commande.numero_commande == cmd_numero).first()
                if commande:
                    client = db.query(ClientMagasin).filter(ClientMagasin.id == commande.client_id).first()
                    lignes_count = len(commande.lignes) if commande.lignes else 0

                    return {
                        "type": "order_detail",
                        "commande": {
                            "numero": commande.numero_commande,
                            "date": commande.date_commande.isoformat() if commande.date_commande else None,
                            "client": client.nom if client else "N/A",
                            "statut": commande.statut.value if hasattr(commande.statut, 'value') else str(commande.statut),
                            "montant_total": float(sum(
                                ligne.quantite_demandee * (ligne.prix_unitaire or Decimal("0"))
                                for ligne in commande.lignes
                            )) if commande.lignes else 0.0,
                            "lignes_count": lignes_count
                        }
                    }
                else:
                    return {
                        "type": "text",
                        "message": f"Aucune commande trouvée avec le numéro '{cmd_numero}'."
                    }

        # Requêtes sur les commandes par statut
        if statut_filter:
            commandes = db.query(Commande).filter(Commande.statut == statut_filter).limit(20).all()

            if commandes:
                commande_list = []
                for cmd in commandes:
                    client = db.query(ClientMagasin).filter(ClientMagasin.id == cmd.client_id).first()
                    montant_total = float(sum(
                        ligne.quantite_demandee * (ligne.prix_unitaire or Decimal("0"))
                        for ligne in cmd.lignes
                    )) if cmd.lignes else 0.0

                    commande_list.append({
                        "numero": cmd.numero_commande,
                        "client": client.nom if client else "N/A",
                        "date": cmd.date_commande.strftime("%d/%m/%Y") if cmd.date_commande else "N/A",
                        "statut": cmd.statut.value if hasattr(cmd.statut, 'value') else str(cmd.statut),
                        "montant": f"{montant_total:.2f}"
                    })

                    return {
                        "type": "table",
                        "title": f"Commandes avec statut '{statut_filter}'",
                        "headers": ["Numéro", "Client", "Date", "Statut", "Montant (MFCFA)"],
                        "rows": [
                            [
                                c["numero"],
                                c["client"],
                                c["date"],
                                c["statut"],
                                c["montant"]
                            ] for c in commande_list
                        ],
                        "total_rows": len(commande_list)
                    }

        return {
            "type": "text",
            "message": "Précisez quelle commande vous recherchez (par numéro, statut, ou client).",
            "suggestions": [
                "Commande CMD-202607-0001",
                "Commandes en préparation",
                "Commandes payées"
            ]
        }

    @staticmethod
    def _handle_declaration_query(db: Session, query: str, user: User) -> Dict[str, Any]:
        """Gère les requêtes liées aux déclarations/BL"""
        # Recherche de déclaration spécifique
        bl_match = re.search(r'(?:déclaration|bl)\s+(?:[«»"]*)([^«»"\s]+)(?:[«»"]*)|numero\s+(?:[«»"]*)([^«»"\s]+)(?:[«»"]*)|bl\s+(?:[«»"]*)([^«»"\s]+)(?:[«»"]*)', query)

        if bl_match:
            bl_numero = next((g for g in bl_match.groups() if g is not None), None)
            if bl_numero:
                declaration = db.query(Declaration).filter(Declaration.numero_bl == bl_numero).first()
                if declaration:
                    client = db.query(ClientMagasin).filter(ClientMagasin.id == declaration.client_id).first()

                    # Calculer le total déclaré
                    total_declare_udb = sum(
                        ligne.quantite_udb for ligne in declaration.lignes
                    ) if declaration.lignes else 0.0

                    # Calculer le total reçu
                    total_recu_udb = sum(
                        ligne.quantite_udb for reception in declaration.receptions
                        for ligne in reception.lignes
                    ) if declaration.receptions else 0.0

                    return {
                        "type": "declaration_detail",
                        "declaration": {
                            "numero_bl": declaration.numero_bl,
                            "date": declaration.date_declaration.isoformat() if declaration.date_declaration else None,
                            "client": client.nom if client else "N/A",
                            "statut": declaration.statut.value if hasattr(declaration.statut, 'value') else str(declaration.statut),
                            "total_declare_udb": float(total_declare_udb),
                            "total_recu_udb": float(total_recu_udb),
                            "reste_a_recevoir_udb": float(total_declare_udb - total_recu_udb),
                            "lignes_count": len(declaration.lignes) if declaration.lignes else 0
                        }
                    }
                else:
                    return {
                        "type": "text",
                        "message": f"Aucune déclaration trouvée avec le numéro '{bl_numero}'."
                    }

        # Recherche par client
        client_match = re.search(r'(?:pour|du|de\s+le\s+client)\s+([«»"]*)([^«»"\s]+)(?:[«»"]*)', query)
        if client_match:
            client_ref = client_match.group(2)
            client = db.query(ClientMagasin).filter(
                or_(
                    ClientMagasin.code == client_ref,
                    ClientMagasin.nom.ilike(f"%{client_ref}%")
                )
            ).first()

            if client:
                declarations = DeclarationService.get_declarations_by_client(db, client.id)

                if declarations:
                    decl_list = []
                    for decl in declarations[:10]:  # Limiter à 10
                        total_declare = sum(l.quantite_udb for l in decl.lignes) if decl.lignes else 0.0
                        total_recu = sum(
                            ligne.quantite_udb for reception in decl.receptions
                            for ligne in reception.lignes
                        ) if decl.receptions else 0.0

                        decl_list.append({
                            "numero_bl": decl.numero_bl,
                            "date": decl.date_declaration.strftime("%d/%m/%Y") if decl.date_declaration else "N/A",
                            "statut": decl.statut.value if hasattr(decl.statut, 'value') else str(decl.statut),
                            "declare_udb": f"{total_declare:.2f}",
                            "recu_udb": f"{total_recu:.2f}",
                            "reste": f"{total_declare - total_recu:.2f}"
                        })

                        return {
                            "type": "table",
                            "title": f"Déclarations pour le client {client.nom}",
                            "headers": ["Numéro BL", "Date", "Statut", "Déclaré (UDB)", "Reçu (UDB)", "Reste (UDB)"],
                            "rows": [
                                [
                                    d["numero_bl"],
                                    d["date"],
                                    d["statut"],
                                    d["declare_udb"],
                                    d["recu_udb"],
                                    d["reste"]
                                ] for d in decl_list
                            ],
                            "total_rows": len(decl_list),
                            "has_more": len(declarations) > 10
                        }

        return {
            "type": "text",
            "message": "Précisez quelle déclaration vous recherchez (par numéro BL, client, ou date).",
            "suggestions": [
                "Déclaration BL-2026-0001",
                "Déclarations pour le client ABC",
                "Déclarations du mois en cours"
            ]
        }

    @staticmethod
    def _handle_movement_query(db: Session, query: str, user: User) -> Dict[str, Any]:
        """Gère les requêtes liées aux mouvements/historique"""
        # Pour simplifier, on retourne les réceptions récentes
        réceptions_recentes = db.query(Reception).order_by(Reception.date_reception.desc()).limit(10).all()

        if réceptions_recentes:
            mouvement_list = []
            for rec in réceptions_recentes:
                déclaration = db.query(Declaration).filter(Declaration.id == rec.declaration_id).first()
                client = db.query(ClientMagasin).filter(ClientMagasin.id == déclaration.client_id).first() if déclaration else None
                magasin = db.query(Magasin).filter(Magasin.id == rec.magasin_id).first()

                mouvement_list.append({
                    "numero_reception": rec.numero_reception,
                    "date": rec.date_reception.strftime("%d/%m/%Y %H:%M"),
                    "declaration_bl": déclaration.numero_bl if déclaration else "N/A",
                    "client": client.nom if client else "N/A",
                    "magasin": magasin.nom if magasin else "N/A",
                    "statut": rec.statut.value if hasattr(rec.statut, 'value') else str(rec.statut)
                })

                return {
                    "type": "table",
                    "title": "Dernières réceptions",
                    "headers": ["Numéro Réception", "Date", "Déclaration BL", "Client", "Magasin", "Statut"],
                    "rows": [
                        [
                            m["numero_reception"],
                            m["date"],
                            m["declaration_bl"],
                            m["client"],
                            m["magasin"],
                            m["statut"]
                        ] for m in mouvement_list
                    ]
                }

        return {
            "type": "text",
            "message": "Aucun mouvement trouvé dans l'historique récent."
        }

    @staticmethod
    def _handle_analytics_query(db: Session, query: str, user: User) -> Dict[str, Any]:
        """Gère les requêtes analytiques"""
        # Statistiques de base sur les stocks
        total_articles = db.query(Article).filter(Article.est_actif == True).count()
        total_magasins = db.query(Magasin).filter(Magasin.est_actif == True).count()

        # Valeur totale du stock (simplifiée - faudrait joindre avec les prix)
        total_stock_udb = db.query(
            db.func.sum(Stock.quantite_udb)
        ).scalar() or 0

        # Mouvements récents (derniers 7 jours)
        semaine_derniere = datetime.now() - timedelta(days=7)
        mouvements_semaine = db.query(Reception).filter(
            Reception.date_reception >= semaine_derniere
        ).count()

        # Commandes en attente
        commandes_en_attente = db.query(Commande).filter(
            Commande.statut.in_(['EN_PREPARATION', 'VALIDEE', 'PAYEE'])
        ).count()

        return {
            "type": "analytics",
            "title": "Tableau de bord exécutif",
            "metrics": [
                {
                    "label": "Articles actifs",
                    "value": total_articles,
                    "icon": "inventory_2"
                },
                {
                    "label": "Magasins actifs",
                    "value": total_magasins,
                    "icon": "store"
                },
                {
                    "label": "Stock total (UDB)",
                    "value": f"{total_stock_udb:.2f}",
                    "icon": "stock"
                },
                {
                    "label": "Mouvements (7j)",
                    "value": mouvements_semaine,
                    "icon": "timeline"
                },
                {
                    "label": "Commandes actives",
                    "value": commandes_en_attente,
                    "icon": "shopping_cart"
                }
            ],
            "charts": [
                {
                    "type": "pie",
                    "title": "Répartition du stock par magasin",
                    "data": AIService._get_stock_by_magasin_chart_data(db)
                },
                {
                    "type": "bar",
                    "title": "Mouvements par jour (7 derniers jours)",
                    "data": AIService._get_daily_movements_chart_data(db)
                }
            ]
        }

    @staticmethod
    def _get_stock_by_magasin_chart_data(db: Session) -> List[Dict[str, Any]]:
        """Prépare les données pour le graphique de répartition du stock par magasin"""
        résultats = db.query(
            Magasin.nom,
            db.func.sum(Stock.quantite_udb)
        ).join(Stock).filter(
            Magasin.est_actif == True,
            Stock.quantite_udb > 0
        ).group_by(Magasin.nom).all()

        return [
            {"magasin": nom, "stock": float(stock) if stock else 0}
            for nom, stock in résultats
        ]

    @staticmethod
    def _get_daily_movements_chart_data(db: Session) -> List[Dict[str, Any]]:
        """Prépare les données pour le graphique des mouvements quotidiens"""
        sept_jours = datetime.now() - timedelta(days=7)

        # Requête simplifiée - en production, on ferait un GROUP BY par date
        mouvements = db.query(Reception).filter(
            Reception.date_reception >= sept_jours
        ).all()

        # Grouper par date (simplifié)
        par_date = {}
        for mov in movements:
            date_str = mov.date_reception.strftime("%Y-%m-%d")
            par_date[date_str] = par_date.get(date_str, 0) + 1

        return [
            {"date": date, "mouvements": count}
            for date, count in sorted(par_date.items())
        ]

    @staticmethod
    def _handle_tiers_query(db: Session, query: str, user: User) -> Dict[str, Any]:
        """Gère les requêtes liées aux clients/fournisseurs"""
        # Recherche de client spécifique
        client_match = re.search(r'(?:client|fournisseur|tiers)\s+(?:[«»"]*)([^«»"\s]+)(?:[«»"]*)|nom\s+(?:[«»"]*)([^«»"\s]+)(?:[«»"]*)', query)

        if client_match:
            client_ref = next((g for g in client_match.groups() if g is not None), None)
            if client_ref:
                client = db.query(ClientMagasin).filter(
                    or_(
                        ClientMagasin.code == client_ref,
                        ClientMagasin.nom.ilike(f"%{client_ref}%")
                    )
                ).first()

                if client:
                    # Statistiques du client
                    declarations_count = len(DeclarationService.get_declarations_by_client(db, client.id))
                    commandes_count = db.query(Commande).filter(Commande.client_id == client.id).count()

                    return {
                        "type": "client_detail",
                        "client": {
                            "code": client.code,
                            "nom": client.nom,
                            "adresse": client.adresse or "N/A",
                            "ville": client.ville or "N/A",
                            "email": client.email or "N/A",
                            "telephone": client.telephone or "N/A",
                            "est_actif": client.est_actif
                        },
                        "statistiques": {
                            "declarations_total": declarations_count,
                            "commandes_total": commandes_count
                        }
                    }
                else:
                    return {
                        "type": "text",
                        "message": f"Aucun client/fournisseur trouvé avec la référence '{client_ref}'."
                    }

        return {
            "type": "text",
            "message": "Précisez quel client ou fournisseur vous recherchez.",
            "suggestions": [
                "Client ABC LOGISTICS",
                "Fournisseur portant le nom 'DUPORT'",
                "Tiers avec code TIER-001"
            ]
        }

    @staticmethod
    def _handle_help_query() -> Dict[str, Any]:
        """Fournit de l'aide sur l'utilisation des requêtes en langage naturel"""
        return {
            "type": "help",
            "title": "Aide pour les requêtes en langage naturel",
            "sections": [
                {
                    "title": "Requêtes sur les stocks",
                    "examples": [
                        "Montre moi le stock des articles",
                        "Quel est le stock total dans le magasin Douala Port Autonome ?",
                        "Montre moi les stocks de l'article ART-202607-001",
                        "Stock par marchandise"
                    ]
                },
                {
                    "title": "Requêtes sur les articles",
                    "examples": [
                        "Article ART-202607-001",
                        "Produit contenant 'acier'",
                        "Liste tous les articles actifs"
                    ]
                },
                {
                    "title": "Requêtes sur les commandes",
                    "examples": [
                        "Commande CMD-202607-0001",
                        "Commandes en préparation",
                        "Commandes payées ce mois"
                    ]
                },
                {
                    "title": "Requêtes sur les déclarations/BL",
                    "examples": [
                        "Déclaration BL-2026-0001",
                        "Déclarations pour le client ABC LOGISTICS",
                        "Montre moi les BL en attente de réception"
                    ]
                },
                {
                    "title": "Requêtes analytiques",
                    "examples": [
                        "Tableau de bord",
                        "Statistiques du mois",
                        "Analyse des rotations lentes",
                        "Prévoir la demande pour l'article ART-202607-001",
                        "Optimiser le stock de l'article ART-202607-001 magasin Douala"
                    ]
                }
            ],
            "tips": [
                "Utilisez des guillemets pour les références exactes : \"ART-202607-001\"",
                "Vous pouvez combiner des critères : 'stock article ART-202607-001 magasin Douala'",
                "Les commandes vocales fonctionnent aussi : 'Ok KAMLOG, montre moi le stock'",
                "Essayez les nouvelles fonctionnalités de prévision : 'Prévoir la demande pour...'",
                "Essayez l'optimisation : 'Optimiser le stock de...'"
            ]
        }

    @staticmethod
    def process_document_ocr(file_content: bytes, file_type: str) -> Dict[str, Any]:
        """
        Traite un document uploadé avec OCR pour extraire les données structurées.
        C'est un stub - en production, on utiliserait Tesseract, Google Vision AI, ou Azure Form Recognizer.

        Args:
            file_content: Contenu du fichier en bytes
            file_type: Type de fichier (pdf, jpg, png, etc.)

        Returns:
            Dict contenant les données extraites et la confiance
        """
        logger.info(f"Processing document OCR: {len(file_content)} bytes, type: {file_type}")

        # Stub - en production, implémenter une vraie solution OCR
        if file_type.lower() in ['pdf', 'jpg', 'jpeg', 'png', 'tiff']:
            # Simulation de résultats OCR pour un BL
            return {
                "success": True,
                "document_type": "bill_of_lading",
                "confidence": 0.85,
                "extracted_data": {
                    "numero_bl": "BL-202607-1234",
                    "expediteur": "PORT OF DOUALA CORP.",
                    "destinataire": "ABC LOGISTICS LTD",
                    "notify_party": "XYZ IMPORTS",
                    "navire": "MV DOUALA EXPRESS",
                    "date_embarquement": "2026-07-15",
                    "date_arrivee_prevue": "2026-07-22",
                    "lieu_chargement": "PORT DE DOUALA",
                    "lieu_dechargement": "PORT DE LAGOS",
                    "marchandise": "ACIER LAMINÉ À CHAUD",
                    "quantite": 25.5,
                    "unite": "TONNES",
                    "numero_conteneur": "DCLU1234567",
                    "scelle": "SEAL987654",
                    "fret": "PREPAID",
                    "nombre_originals": 3
                },
                "text_preview": "BILL OF LADING\nN°: BL-202607-1234\nSHIPPER: PORT OF DOUALA CORP.\nCONSIGNEE: ABC LOGISTICS LTD\n...\nDESCRIPTION: ACIER LAMINÉ À CHAUD\nQUANTITY: 25.5 TONNES\n..."
            }
        else:
            return {
                "success": False,
                "error": f"Type de fichier non supporté pour l'OCR: {file_type}",
                "supported_types": ["PDF", "JPG", "JPEG", "PNG", "TIFF"]
            }

    @staticmethod
    def suggest_query_completions(partial_query: str) -> List[str]:
        """
        Suggest query completions based on partial input (for autocomplete).

        Args:
            partial_query: Requête partielle saisie par l'utilisateur

        Returns:
            Liste de suggestions de complétion
        """
        partial_lower = partial_query.lower().strip()
        suggestions = []

        # Suggestions basées sur les mots-clés reconnus
        keyword_map = {
            'stock': [
                'stock total',
                'stock par magasin',
                'stock article',
                'quantité disponible',
                'inventaire'
            ],
            'article': [
                'article référence',
                'produit contenant',
                'liste articles',
                'article actif',
                'prévision demande',
                'optimisation stock'
            ],
            'commande': [
                'commande numéro',
                'commandes en préparation',
                'commandes payées',
                'suivi commande'
            ],
            'déclaration': [
                'déclaration bl',
                'bl numéro',
                'déclarations client',
                'suivi bl'
            ],
            'client': [
                'client nom',
                'fournisseur code',
                'tiers activité',
                'historique client'
            ],
            'statistique': [
                'tableau de bord',
                'kpi stock',
                'mouvements période',
                'analyse rotation',
                'prévision',
                'optimisation'
            ],
            'prévoir': [
                'prévision demande',
                'prévision tendance',
                'forecast article'
            ],
            'optimiser': [
                'optimisation stock',
                'stock sécurité',
                'point commande',
                'réduction coûts'
            ]
        }

        # Correspondance exacte de début de mot
        for keyword, completions in keyword_map.items():
            if keyword.startswith(partial_lower):
                suggestions.extend([f"{keyword} {comp}" for comp in completions])
            elif partial_lower in keyword:
                suggestions.extend(completions)

        # Suggestions spécifiques si on voit déjà un début de phrase
        if partial_lower.startswith('montre moi'):
            rest = partial_lower[10:].strip()
            if 'stock' in rest:
                suggestions.extend([
                    'montre moi le stock total',
                    'montre moi le stock par article',
                    'montre moi les stocks faibles'
                ])
            elif 'article' in rest:
                suggestions.extend([
                    'montre moi les articles actifs',
                    'montre moi les articles par catégorie'
                ])

        # Déduplication et limitation
        suggestions = list(dict.fromkeys(suggestions))  # Supprime les doublons en preservant l'ordre
        return suggestions[:10]  # Retourner max 10 suggestions


# Instance globale du service IA
ai_service = AIService()