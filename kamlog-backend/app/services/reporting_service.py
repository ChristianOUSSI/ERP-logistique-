# app/services/reporting_service.py - Service de génération de rapports avancés
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, or_, desc, text
from datetime import datetime, timedelta
from decimal import Decimal
import json
import csv
import io

from app.models.magasin import (
    Article, Magasin, ClientMagasin, Declaration, Reception, Stock, Commande,
    BandeLivraison, OrdreTransfert
)
from app.models.user import User
from app.models.audit import AuditLog
from app.services.magasin_service import (
    ArticleService, DeclarationService, ReceptionService, StockService,
    CommandeService
)
from app.utils.logger import get_logger

logger = get_logger(__name__)


class ReportBuilder:
    """Classe pour construire des rapports personnalisés"""

    def __init__(self, db: Session):
        self.db = db
        self.filters = {}
        self.columns = []
        self.sort_by = None
        self.sort_desc = False
        self.limit = None
        self.offset = 0

    def set_filter(self, field: str, value: Any, operator: str = "eq"):
        """Définit un filtre pour le rapport"""
        self.filters[field] = {"value": value, "operator": operator}
        return self

    def add_column(self, field: str, label: str, format_func=None):
        """Ajoute une colonne au rapport"""
        self.columns.append({
            "field": field,
            "label": label,
            "format": format_func
        })
        return self

    def set_sort(self, field: str, descending: bool = False):
        """Définit le tri du rapport"""
        self.sort_by = field
        self.sort_desc = descending
        return self

    def set_pagination(self, limit: int, offset: int = 0):
        """Définit la pagination du rapport"""
        self.limit = limit
        self.offset = offset
        return self

    def build_query(self, base_query):
        """Construit la requête SQL avec les filtres, tri et pagination"""
        query = base_query

        # Appliquer les filtres
        for field, filter_info in self.filters.items():
            value = filter_info["value"]
            operator = filter_info["operator"]

            if operator == "eq":
                query = query.filter(field == value)
            elif operator == "ne":
                query = query.filter(field != value)
            elif operator == "gt":
                query = query.filter(field > value)
            elif operator == "lt":
                query = query.filter(field < value)
            elif operator == "gte":
                query = query.filter(field >= value)
            elif operator == "lte":
                query = query.filter(field <= value)
            elif operator == "like":
                query = query.filter(field.like(f"%{value}%"))
            elif operator == "ilike":
                query = query.filter(field.ilike(f"%{value}%"))
            elif operator == "in":
                query = query.filter(field.in_(value))
            elif operator == "not_in":
                query = query.filter(~field.in_(value))

        # Appliquer le tri
        if self.sort_by:
            if self.sort_desc:
                query = query.order_by(desc(self.sort_by))
            else:
                query = query.order_by(self.sort_by)

        # Appliquer la pagination
        if self.limit is not None:
            query = query.offset(self.offset).limit(self.limit)

        return query

    def execute(self, base_query):
        """Exécute le rapport et retourne les résultats"""
        query = self.build_query(base_query)
        results = query.all()
        return results

    def to_dict_list(self, results):
        """Convertit les résultats en liste de dictionnaires"""
        if not results:
            return []

        # Si les résultats sont des tuples, convertir en dict basé sur les colonnes
        if isinstance(results[0], tuple):
            # Assumer que les colonnes correspondent à l'ordre des champs sélectionnés
            # Cette approche nécessite d'être améliorée pour être plus robuste
            return [dict(zip([col["field"] for col in self.columns], row)) for row in results]
        else:
            # Résultats déjà sous forme d'objets ORM
            return [row.__dict__ for row in results]


class ReportingService:
    """Service pour la génération de rapports avancés et personnalisés"""

    @staticmethod
    def create_stock_valuation_report(db: Session, filters: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Crée un rapport de valorisation du stock.

        Args:
            db: Session de base de données
            filters: Filtres optionnels (magasin_id, article_id, date_cutoff, etc.)

        Returns:
            Rapport de valorisation du stock
        """
        try:
            # Requête de base pour la valorisation du stock
            query = db.query(
                Article.id.label("article_id"),
                Article.code_article,
                Article.nom.label("article_nom"),
                Article.description,
                Article.poids_unitaire,
                Article.volume_unitaire,
                Magasin.id.label("magasin_id"),
                Magasin.code.label("magasin_code"),
                Magasin.nom.label("magasin_nom"),
                Stock.quantite_disponible,
                Stock.quantite_udb,
                (Stock.quantite_udb * Article.prix_unitaire).label("valeur_stock"),
                Article.prix_unitaire
            ).join(Stock, Article.id == Stock.article_id)\
             .join(Magasin, Stock.magasin_id == Magasin.id)\
             .filter(Article.est_actif == True, Magasin.est_actif == True, Stock.quantite_udb > 0)

            # Appliquer les filtres
            if filters:
                if filters.get("magasin_id"):
                    query = query.filter(Magasin.id == filters["magasin_id"])
                if filters.get("article_id"):
                    query = query.filter(Article.id == filters["article_id"])
                if filters.get("date_cutoff"):
                    # Filtrer par date de dernière mise à jour (si disponible)
                    pass
                if filters.get("valeur_minimale"):
                    query = query.filter((Stock.quantite_udb * Article.prix_unitaire) >= filters["valeur_minimale"])

            results = query.all()

            # Calculer les totaux
            total_quantite_udb = sum(float(r.quantite_udb) for r in results)
            total_valeur = sum(float(r.valeur_stock or 0) for r in results)

            # Grouper par magasin
            par_magasin = {}
            for r in results:
                magasin_nom = r.magasin_nom
                if magasin_nom not in par_magasin:
                    par_magasin[magasin_nom] = {"quantite_udb": 0, "valeur": 0, "articles": []}
                par_magasin[magasin_nom]["quantite_udb"] += float(r.quantite_udb)
                par_magasin[magasin_nom]["valeur"] += float(r.valeur_stock or 0)
                par_magasin[magasin_nom]["articles"].append({
                    "code": r.code_article,
                    "nom": r.article_nom,
                    "quantite_udb": float(r.quantite_udb),
                    "valeur": float(r.valeur_stock or 0)
                })

            # Grouper par article
            par_article = {}
            for r in results:
                article_code = r.code_article
                if article_code not in par_article:
                    par_article[article_code] = {"nom": r.article_nom, "quantite_udb": 0, "magasins": []}
                par_article[article_code]["quantite_udb"] += float(r.quantite_udb)
                par_article[article_code]["magasins"].append({
                    "magasin": r.magasin_nom,
                    "quantite_udb": float(r.quantite_udb),
                    "valeur": float(r.valeur_stock or 0)
                })

            return {
                "type": "stock_valuation",
                "title": "Rapport de Valorisation du Stock",
                "generated_at": datetime.now().isoformat(),
                "filters_applied": filters or {},
                "summary": {
                    "total_articles": len(set(r.article_id for r in results)),
                    "total_magasins": len(set(r.magasin_id for r in results)),
                    "total_quantite_udb": total_quantite_udb,
                    "total_valeur": total_valeur
                },
                "by_magasin": [
                    {
                        "magasin": magasin,
                        "quantite_udb": data["quantite_udb"],
                        "valeur": data["valeur"],
                        "article_count": len(data["articles"])
                    }
                    for magasin, data in par_magasin.items()
                ],
                "by_article": [
                    {
                        "article_code": code,
                        "article_nom": data["nom"],
                        "quantite_udb": data["quantite_udb"],
                        "magasin_count": len(data["magasins"])
                    }
                    for code, data in par_article.items()
                ],
                "details": [
                    {
                        "article_code": r.code_article,
                        "article_nom": r.article_nom,
                        "magasin": r.magasin_nom,
                        "magasin_code": r.magasin_code,
                        "quantite_udb": float(r.quantite_udb),
                        "quantite_disponible": float(r.quantite_disponible),
                        "prix_unitaire": float(r.prix_unitaire or 0),
                        "valeur_stock": float(r.valeur_stock or 0)
                    }
                    for r in results
                ]
            }

        except Exception as e:
            logger.error(f"Erreur lors de la génération du rapport de valorisation: {str(e)}")
            raise

    @staticmethod
    def create_mouvement_analysis_report(db: Session, start_date: datetime, end_date: datetime,
                                       filters: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Crée un rapport d'analyse des mouvements sur une période.

        Args:
            db: Session de base de données
            start_date: Date de début de la période
            end_date: Date de fin de la période
            filters: Filtres optionnels

        Returns:
            Rapport d'analyse des mouvements
        """
        try:
            # Requête pour les réceptions sur la période
            receptions_query = db.query(
                Reception.id.label("reception_id"),
                Reception.numero_reception,
                Reception.date_reception,
                Reception.magasin_id,
                Magasin.nom.label("magasin_nom"),
                Declaration.numero_bl,
                ClientMagasin.nom.label("client_nom"),
                func.count(Reception.lignes).label("lignes_count"),
                func.sum(func.coalesce(Reception.lignes.any(), 0)).label("total_lignes")
            ).join(Magasin, Reception.magasin_id == Magasin.id)\
             .outerjoin(Declaration, Reception.declaration_id == Declaration.id)\
             .outerjoin(ClientMagasin, Declaration.client_id == ClientMagasin.id)\
             .filter(Reception.date_reception >= start_date, Reception.date_reception <= end_date)

            # Requête pour les commandes sur la période
            commandes_query = db.query(
                Commande.id.label("commande_id"),
                Commande.numero_commande,
                Commande.date_commande,
                ClientMagasin.nom.label("client_nom"),
                Commande.statut,
                func.count(Commande.lignes).label("lignes_count")
            ).join(ClientMagasin, Commande.client_id == ClientMagasin.id)\
             .filter(Commande.date_commande >= start_date, Commande.date_commande <= end_date)

            # Appliquer les filtres aux receptions
            if filters:
                if filters.get("magasin_id"):
                    receptions_query = receptions_query.filter(Reception.magasin_id == filters["magasin_id"])
                    commandes_query = commandes_query.filter(Commande.client_id.in_(
                        db.query(ClientMagasin.id).join(Declaration).join(Reception)
                        .filter(Reception.magasin_id == filters["magasin_id"])
                    ))
                if filters.get("client_id"):
                    receptions_query = receptions_query.join(Declaration).filter(Declaration.client_id == filters["client_id"])
                    commandes_query = commandes_query.filter(Commande.client_id == filters["client_id"])

            receptions = receptions_query.all()
            commandes = commandes_query.all()

            # Analyser les tendances journalières
            receptions_par_jour = {}
            commandes_par_jour = {}

            for rec in receptions:
                jour = rec.date_reception.date().isoformat() if rec.date_reception else "unknown"
                receptions_par_jour[jour] = receptions_par_jour.get(jour, 0) + 1

            for cmd in commandes:
                jour = cmd.date_commande.date().isoformat() if cmd.date_commande else "unknown"
                commandes_par_jour[jour] = commandes_par_jour.get(jour, 0) + 1

            # Calculer les métriques
            total_receptions = len(receptions)
            total_commandes = len(commandes)
            total_articles_mouvement = len(set(
                ligne.article_id for rec in receptions
                for ligne in rec.lignes if hasattr(rec, 'lignes') and rec.lignes
            )) if receptions and hasattr(receptions[0], 'lignes') else 0

            return {
                "type": "mouvement_analysis",
                "title": f"Analyse des Mouvements ({start_date.strftime('%d/%m/%Y')} - {end_date.strftime('%d/%m/%Y')})",
                "period": {
                    "start": start_date.isoformat(),
                    "end": end_date.isoformat()
                },
                "filters_applied": filters or {},
                "summary": {
                    "total_receptions": total_receptions,
                    "total_commandes": total_commandes,
                    "total_articles_mouvement": total_articles_mouvement,
                    "receptions_par_jour_moyenne": total_receptions / max((end_date - start_date).days, 1),
                    "commandes_par_jour_moyenne": total_commandes / max((end_date - start_date).days, 1)
                },
                "tendances_journalieres": {
                    "receptions": [{"date": jour, "count": count} for jour, count in sorted(receptions_par_jour.items())],
                    "commandes": [{"date": jour, "count": count} for jour, count in sorted(commandes_par_jour.items())]
                },
                "receptions_details": [
                    {
                        "numero": r.numero_reception,
                        "date": r.date_reception.isoformat() if r.date_reception else None,
                        "magasin": r.magasin_nom,
                        "bl": r.numero_bl,
                        "client": r.client_nom,
                        "lignes_count": r.lignes_count
                    }
                    for r in receptions[:50]  # Limiter pour la taille de la réponse
                ],
                "commandes_details": [
                    {
                        "numero": c.numero_commande,
                        "date": c.date_commande.isoformat() if c.date_commande else None,
                        "client": c.client_nom,
                        "statut": c.statut.value if hasattr(c.statut, 'value') else str(c.statut),
                        "lignes_count": c.lignes_count
                    }
                    for c in commandes[:50]  # Limiter pour la taille de la réponse
                ]
            }

        except Exception as e:
            logger.error(f"Erreur lors de la génération du rapport d'analyse des mouvements: {str(e)}")
            raise

    @staticmethod
    def create_client_performance_report(db: Session, start_date: datetime, end_date: datetime) -> Dict[str, Any]:
        """
        Crée un rapport de performance des clients/fournisseurs.

        Args:
            db: Session de base de données
            start_date: Date de début
            end_date: Date de fin

        Returns:
            Rapport de performance des clients
        """
        try:
            # Requête pour agréger les données par client
            query = db.query(
                ClientMagasin.id.label("client_id"),
                ClientMagasin.code.label("client_code"),
                ClientMagasin.nom.label("client_nom"),
                ClientMagasin.ville.label("client_ville"),
                func.count(Declaration.id).label("declarations_count"),
                func.sum(func.coalesce(Declaration.lignes.any(), 0)).label("total_lignes_declarees"),
                func.count(Commande.id).label("commandes_count"),
                func.sum(func.coalesce(Commande.lignes.any(), 0)).label("total_lignes_commandees")
            ).outerjoin(Declaration, and_(
                Declaration.client_id == ClientMagasin.id,
                Declaration.date_declaration >= start_date,
                Declaration.date_declaration <= end_date
            ))\
             .outerjoin(Commande, and_(
                 Commande.client_id == ClientMagasin.id,
                 Commande.date_commande >= start_date,
                 Commande.date_commande <= end_date
             ))\
             .group_by(ClientMagasin.id, ClientMagasin.code, ClientMagasin.nom, ClientMagasin.ville)\
             .having(func.count(Declaration.id) > 0 or func.count(Commande.id) > 0)\
             .order_by(desc(func.count(Declaration.id) + func.count(Commande.id)))

            results = query.all()

            # Calculer les statistiques
            total_clients = len(results)
            clients_avec_declarations = len([r for r in results if r.declarations_count > 0])
            clients_avec_commandes = len([r for r in results if r.commandes_count > 0])

            return {
                "type": "client_performance",
                "title": f"Rapport de Performance des Clients ({start_date.strftime('%d/%m/%Y')} - {end_date.strftime('%d/%m/%Y')})",
                "period": {
                    "start": start_date.isoformat(),
                    "end": end_date.isoformat()
                },
                "summary": {
                    "total_clients_actifs": total_clients,
                    "clients_avec_declarations": clients_avec_declarations,
                    "clients_avec_commandes": clients_avec_commandes,
                    "taux_activite": (total_clients / max(total_clients, 1)) * 100
                },
                "clients": [
                    {
                        "client_id": r.client_id,
                        "client_code": r.client_code,
                        "client_nom": r.client_nom,
                        "client_ville": r.client_ville or "N/A",
                        "declarations_count": r.declarations_count,
                        "commandes_count": r.commandes_count,
                        "total_interactions": r.declarations_count + r.commandes_count
                    }
                    for r in results
                ]
            }

        except Exception as e:
            logger.error(f"Erreur lors de la génération du rapport de performance des clients: {str(e)}")
            raise

    @staticmethod
    def export_to_csv(data: List[Dict[str, Any]], filename: str) -> str:
        """
        Exporte des données vers un format CSV.

        Args:
            data: Liste de dictionnaires à exporter
            filename: Nom du fichier de sortie

        Returns:
            Contenu CSV sous forme de string
        """
        if not data:
            return ""

        output = io.StringIO()
        writer = csv.DictWriter(output, fieldnames=data[0].keys())
        writer.writeheader()
        writer.writerows(data)
        return output.getvalue()

    @staticmethod
    def export_to_json(data: Any) -> str:
        """
        Exporte des données vers un format JSON.

        Args:
            data: Données à exporter

        Returns:
            Contenu JSON sous forme de string
        """
        return json.dumps(data, default=str, indent=2)


# Instance globale du service de reporting
reporting_service = ReportingService()