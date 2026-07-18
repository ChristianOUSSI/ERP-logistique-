# app/services/import_export_service.py - Service d'import/export de données maîtresses
import csv
import io
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from decimal import Decimal

from app.models.magasin import Article, UniteMesure
from app.schemas.magasin import ArticleCreate
from app.services.magasin_service import ArticleService
from app.exceptions import BusinessRuleViolationError
from app.utils.logger import get_logger

logger = get_logger(__name__)


class ImportExportService:
    """Service pour l'import et l'export de données maîtresses"""

    @staticmethod
    def export_articles_to_csv(db: Session) -> str:
        """
        Exporte tous les articles vers un format CSV.

        Args:
            db: Session de base de données

        Returns:
            Contenu CSV sous forme de string
        """
        articles = ArticleService.get_all_articles(db)
        output = io.StringIO()
        writer = csv.writer(output)

        # En-tête
        writer.writerow([
            'code_article', 'nom', 'description', 'poids_unitaire', 'volume_unitaire',
            'unite_mesure', 'valeur_unitaire', 'est_actif'
        ])

        # Données
        for article in articles:
            writer.writerow([
                article.code_article,
                article.nom,
                article.description or '',
                float(article.poids_unitaire) if article.poids_unitaire else '',
                float(article.volume_unitaire) if article.volume_unitaire else '',
                article.unite_mesure.value if hasattr(article.unite_mesure, 'value') else str(article.unite_mesure),
                float(article.valeur_unitaire) if article.valeur_unitaire else '',
                article.est_actif
            ])

        return output.getvalue()

    @staticmethod
    def import_articles_from_csv(db: Session, csv_content: str, user_id: int) -> Dict[str, Any]:
        """
        Importe des articles depuis un contenu CSV.

        Args:
            db: Session de base de données
            csv_content: Contenu du fichier CSV
            user_id: ID de l'utilisateur effectuant l'import

        Returns:
            Rapport de l'import avec succès et erreurs
        """
        results = {
            "success": [],
            "errors": [],
            "total_processed": 0,
            "total_success": 0,
            "total_errors": 0
        }

        try:
            # Lire le CSV
            csv_file = io.StringIO(csv_content)
            reader = csv.DictReader(csv_file)

            for row_num, row in enumerate(reader, start=2):  # start at 2 because header is row 1
                results["total_processed"] += 1
                try:
                    # Valider et convertir les données
                    article_data = ArticleCreate(
                        code_article=row['code_article'].strip(),
                        nom=row['nom'].strip(),
                        description=row.get('description', '').strip() or None,
                        poids_unitaire=Decimal(row['poids_unitaire']) if row.get('poids_unitaire') else None,
                        volume_unitaire=Decimal(row['volume_unitaire']) if row.get('volume_unitaire') else None,
                        unite_mesure=row['unite_mesure'].strip() if row.get('unite_mesure') else UniteMesure.UDB,
                        valeur_unitaire=Decimal(row['valeur_unitaire']) if row.get('valeur_unitaire') else None,
                        est_actif=row.get('est_actif', 'true').lower() in ('true', '1', 'yes')
                    )

                    # Créer l'article
                    article = ArticleService.create_article(db, article_data)
                    results["success"].append({
                        "row": row_num,
                        "code_article": article.code_article,
                        "message": "Article créé avec succès"
                    })
                    results["total_success"] += 1

                except Exception as e:
                    results["errors"].append({
                        "row": row_num,
                        "data": row,
                        "message": str(e)
                    })
                    results["total_errors"] += 1

        except Exception as e:
            logger.error(f"Erreur lors de l'import CSV: {str(e)}")
            raise BusinessRuleViolationError(f"Erreur lors de l'import CSV: {str(e)}")

        return results

    @staticmethod
    def export_clients_to_csv(db: Session) -> str:
        """
        Exporte tous les clients vers un format CSV.
        """
        from app.services.magasin_service import ClientMagasinService
        clients = ClientMagasinService.get_all_clients(db)
        output = io.StringIO()
        writer = csv.writer(output)

        writer.writerow([
            'code', 'nom', 'adresse', 'ville', 'pays', 'telephone', 'email', 'est_actif'
        ])

        for client in clients:
            writer.writerow([
                client.code,
                client.nom,
                client.adresse or '',
                client.ville or '',
                client.pays or '',
                client.telephone or '',
                client.email or '',
                client.est_actif
            ])

        return output.getvalue()

    @staticmethod
    def import_clients_from_csv(db: Session, csv_content: str, user_id: int) -> Dict[str, Any]:
        """
        Importe des clients depuis un contenu CSV.
        """
        from app.services.magasin_service import ClientMagasinService
        from app.schemas.magasin import ClientMagasinCreate

        results = {
            "success": [],
            "errors": [],
            "total_processed": 0,
            "total_success": 0,
            "total_errors": 0
        }

        try:
            csv_file = io.StringIO(csv_content)
            reader = csv.DictReader(csv_file)

            for row_num, row in enumerate(reader, start=2):
                results["total_processed"] += 1
                try:
                    client_data = ClientMagasinCreate(
                        code=row['code'].strip(),
                        nom=row['nom'].strip(),
                        adresse=row.get('adresse', '').strip() or None,
                        ville=row.get('ville', '').strip() or None,
                        pays=row.get('pays', '').strip() or None,
                        telephone=row.get('telephone', '').strip() or None,
                        email=row.get('email', '').strip() or None,
                        est_actif=row.get('est_actif', 'true').lower() in ('true', '1', 'yes')
                    )

                    client = ClientMagasinService.create_client(db, client_data)
                    results["success"].append({
                        "row": row_num,
                        "code": client.code,
                        "message": "Client créé avec succès"
                    })
                    results["total_success"] += 1

                except Exception as e:
                    results["errors"].append({
                        "row": row_num,
                        "data": row,
                        "message": str(e)
                    })
                    results["total_errors"] += 1

        except Exception as e:
            logger.error(f"Erreur lors de l'import CSV clients: {str(e)}")
            raise BusinessRuleViolationError(f"Erreur lors de l'import CSV clients: {str(e)}")

        return results

    @staticmethod
    def export_magasins_to_csv(db: Session) -> str:
        """
        Exporte tous les magasins vers un format CSV.
        """
        from app.services.magasin_service import MagasinService
        magasins = MagasinService.get_all_magasins(db)
        output = io.StringIO()
        writer = csv.writer(output)

        writer.writerow([
            'code', 'nom', 'adresse', 'ville', 'pays', 'telephone', 'email',
            'capacite_max_m3', 'est_actif'
        ])

        for magasin in magasins:
            writer.writerow([
                magasin.code,
                magasin.nom,
                magasin.adresse or '',
                magasin.ville or '',
                magasin.pays or '',
                magasin.telephone or '',
                magasin.email or '',
                float(magasin.capacite_max_m3) if magasin.capacite_max_m3 else '',
                magasin.est_actif
            ])

        return output.getvalue()

    @staticmethod
    def import_magasins_from_csv(db: Session, csv_content: str, user_id: int) -> Dict[str, Any]:
        """
        Importe des magasins depuis un contenu CSV.
        """
        from app.services.magasin_service import MagasinService
        from app.schemas.magasin import MagasinCreate

        results = {
            "success": [],
            "errors": [],
            "total_processed": 0,
            "total_success": 0,
            "total_errors": 0
        }

        try:
            csv_file = io.StringIO(csv_content)
            reader = csv.DictReader(csv_file)

            for row_num, row in enumerate(reader, start=2):
                results["total_processed"] += 1
                try:
                    magasin_data = MagasinCreate(
                        code=row['code'].strip(),
                        nom=row['nom'].strip(),
                        adresse=row.get('adresse', '').strip() or None,
                        ville=row.get('ville', '').strip() or None,
                        pays=row.get('pays', '').strip() or None,
                        telephone=row.get('telephone', '').strip() or None,
                        email=row.get('email', '').strip() or None,
                        capacite_max_m3=Decimal(row['capacite_max_m3']) if row.get('capacite_max_m3') else None,
                        est_actif=row.get('est_actif', 'true').lower() in ('true', '1', 'yes')
                    )

                    magasin = MagasinService.create_magasin(db, magasin_data)
                    results["success"].append({
                        "row": row_num,
                        "code": magasin.code,
                        "message": "Magasin créé avec succès"
                    })
                    results["total_success"] += 1

                except Exception as e:
                    results["errors"].append({
                        "row": row_num,
                        "data": row,
                        "message": str(e)
                    })
                    results["total_errors"] += 1

        except Exception as e:
            logger.error(f"Erreur lors de l'import CSV magasins: {str(e)}")
            raise BusinessRuleViolationError(f"Erreur lors de l'import CSV magasins: {str(e)}")

        return results


# Instance globale du service d'import/export
import_export_service = ImportExportService()