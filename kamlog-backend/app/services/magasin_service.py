# app/services/magasin_service.py - Service métier pour le module K-magasin
from sqlalchemy.orm import Session, selectinload
from sqlalchemy import and_, or_
from typing import List, Optional
from decimal import Decimal
from datetime import datetime

from app.exceptions import (
    InsufficientStockError,
    InvalidConversionError,
    BusinessRuleViolationError
)
from app.utils.audit import AuditService
from app.utils.logger import get_logger
from app.services.gateway_service import gateway_service
from app.schemas.shared import CommandeFactureDTO, CommandeLivraisonDTO, ReceptionStockDTO
from app.models.magasin import (
    Magasin, ClientMagasin, Article, Declaration, LigneDeclaration,
    Reception, LigneReception, Stock, Commande, LigneCommande,
    BandeLivraison, LigneBandeLivraison, OrdreTransfert, LigneOrdreTransfert,
    UniteMesure, StatutDeclaration, StatutReception, StatutCommande,
    StatutOrdreTransfert, Incoterm, TypeConteneur
)
from app.schemas.magasin import (
    MagasinCreate, MagasinUpdate, ClientMagasinCreate, ClientMagasinUpdate,
    ArticleCreate, ArticleUpdate, DeclarationCreate, DeclarationUpdate,
    ReceptionCreate, ReceptionUpdate, StockCreate, StockUpdate,
    CommandeCreate, CommandeUpdate, BandeLivraisonCreate, BandeLivraisonUpdate,
    StockFilter, IncotermCreate, IncotermUpdate, TypeConteneurCreate, TypeConteneurUpdate,
    OrdreTransfertCreate, OrdreTransfertUpdate
)
from app.utils.cache_sync import cache_service_sync as cache_service, invalidate_cache_pattern_sync as invalidate_cache_pattern


class MagasinService:
    """Service pour la gestion des magasins"""

    @staticmethod
    def get_all_magasins(db: Session, skip: int = 0, limit: int = 100) -> List[Magasin]:
        cache_key = f"magasin:magasins:all:{skip}:{limit}"
        cached = cache_service.get(cache_key)
        if cached:
            return cached
        result = db.query(Magasin).filter(Magasin.est_actif == True).offset(skip).limit(limit).all()
        cache_service.set(cache_key, result, expire=300)
        return result

    @staticmethod
    def get_magasin(db: Session, magasin_id: int) -> Optional[Magasin]:
        cache_key = f"magasin:magasin:{magasin_id}"
        cached = cache_service.get(cache_key)
        if cached:
            return cached
        result = db.query(Magasin).filter(Magasin.id == magasin_id).first()
        if result:
            cache_service.set(cache_key, result, expire=600)
        return result

    @staticmethod
    def get_magasin_by_code(db: Session, code: str) -> Optional[Magasin]:
        cache_key = f"magasin:magasin:code:{code}"
        cached = cache_service.get(cache_key)
        if cached:
            return cached
        result = db.query(Magasin).filter(Magasin.code == code).first()
        if result:
            cache_service.set(cache_key, result, expire=600)
        return result

    @staticmethod
    def create_magasin(db: Session, magasin: MagasinCreate) -> Magasin:
        db_magasin = Magasin(**magasin.dict())
        db.add(db_magasin)
        db.flush()
        db.refresh(db_magasin)
        
        # Invalider le cache
        invalidate_cache_pattern("magasin:magasins:*")
        
        return db_magasin

    @staticmethod
    def update_magasin(db: Session, magasin_id: int, magasin: MagasinUpdate) -> Optional[Magasin]:
        db_magasin = MagasinService.get_magasin(db, magasin_id)
        if db_magasin:
            for field, value in magasin.dict(exclude_unset=True).items():
                setattr(db_magasin, field, value)
            db.flush()
            db.refresh(db_magasin)
            
            # Invalider le cache
            invalidate_cache_pattern("magasin:magasins:*")
        return db_magasin

    @staticmethod
    def delete_magasin(db: Session, magasin_id: int) -> bool:
        db_magasin = MagasinService.get_magasin(db, magasin_id)
        if db_magasin:
            db_magasin.est_actif = False
            db.flush()
            
            # Invalider le cache
            invalidate_cache_pattern("magasin:magasins:*")
            return True
        return False


class ClientMagasinService:
    """Service pour la gestion des clients"""

    @staticmethod
    def get_all_clients(db: Session, skip: int = 0, limit: int = 100) -> List[ClientMagasin]:
        cache_key = f"magasin:clients:all:{skip}:{limit}"
        cached = cache_service.get(cache_key)
        if cached:
            return cached
        result = db.query(ClientMagasin).filter(ClientMagasin.est_actif == True).offset(skip).limit(limit).all()
        cache_service.set(cache_key, result, expire=300)
        return result

    @staticmethod
    def get_client(db: Session, client_id: int) -> Optional[ClientMagasin]:
        cache_key = f"magasin:client:{client_id}"
        cached = cache_service.get(cache_key)
        if cached:
            return cached
        result = db.query(ClientMagasin).filter(ClientMagasin.id == client_id).first()
        if result:
            cache_service.set(cache_key, result, expire=600)
        return result

    @staticmethod
    def get_client_by_code(db: Session, code: str) -> Optional[ClientMagasin]:
        cache_key = f"magasin:client:code:{code}"
        cached = cache_service.get(cache_key)
        if cached:
            return cached
        result = db.query(ClientMagasin).filter(ClientMagasin.code == code).first()
        if result:
            cache_service.set(cache_key, result, expire=600)
        return result

    @staticmethod
    def create_client(db: Session, client: ClientMagasinCreate) -> ClientMagasin:
        db_client = ClientMagasin(**client.dict())
        db.add(db_client)
        db.flush()
        db.refresh(db_client)
        
        # Invalider le cache
        invalidate_cache_pattern("magasin:clients:*")
        
        return db_client

    @staticmethod
    def update_client(db: Session, client_id: int, client: ClientMagasinUpdate) -> Optional[ClientMagasin]:
        db_client = ClientMagasinService.get_client(db, client_id)
        if db_client:
            for field, value in client.dict(exclude_unset=True).items():
                setattr(db_client, field, value)
            db.flush()
            db.refresh(db_client)
            
            # Invalider le cache
            invalidate_cache_pattern("magasin:clients:*")
        return db_client

    @staticmethod
    def delete_client(db: Session, client_id: int) -> bool:
        db_client = ClientMagasinService.get_client(db, client_id)
        if db_client:
            db_client.est_actif = False
            db.flush()
            
            # Invalider le cache
            invalidate_cache_pattern("magasin:clients:*")
            return True
        return False


class ArticleService:
    """Service pour la gestion des codes d'article"""

    @staticmethod
    def generate_code_article(db: Session) -> str:
        """Génère automatiquement un code d'article structuré (ex: ART-202607-001)"""
        from datetime import datetime
        now = datetime.now()
        prefix = f"ART-{now.strftime('%Y%m')}"
        
        # Récupérer le dernier code d'article avec ce préfixe
        last_article = db.query(Article).filter(Article.code_article.like(f"{prefix}-%")).order_by(Article.id.desc()).first()
        
        if last_article and last_article.code_article:
            try:
                # Extraire le numéro après le dernier tiret
                last_num_str = last_article.code_article.split('-')[-1]
                new_num = int(last_num_str) + 1
            except (ValueError, IndexError):
                new_num = 1
        else:
            new_num = 1
            
        return f"{prefix}-{new_num:03d}"

    @staticmethod
    def get_all_articles(db: Session, skip: int = 0, limit: int = 100) -> List[Article]:
        cache_key = f"magasin:articles:all:{skip}:{limit}"
        cached = cache_service.get(cache_key)
        if cached:
            return cached
        result = db.query(Article).filter(Article.est_actif == True).offset(skip).limit(limit).all()
        cache_service.set(cache_key, result, expire=300)
        return result

    @staticmethod
    def get_article(db: Session, article_id: int) -> Optional[Article]:
        cache_key = f"magasin:article:{article_id}"
        cached = cache_service.get(cache_key)
        if cached:
            return cached
        result = db.query(Article).filter(Article.id == article_id).first()
        if result:
            cache_service.set(cache_key, result, expire=600)
        return result

    @staticmethod
    def get_article_by_code(db: Session, code_article: str) -> Optional[Article]:
        cache_key = f"magasin:article:code:{code_article}"
        cached = cache_service.get(cache_key)
        if cached:
            return cached
        result = db.query(Article).filter(Article.code_article == code_article).first()
        if result:
            cache_service.set(cache_key, result, expire=600)
        return result

    @staticmethod
    def search_articles(db: Session, query: str) -> List[Article]:
        cache_key = f"magasin:articles:search:{query}"
        cached = cache_service.get(cache_key)
        if cached:
            return cached
        result = db.query(Article).filter(
            and_(
                Article.est_actif == True,
                or_(
                    Article.code_article.ilike(f"%{query}%"),
                    Article.nom.ilike(f"%{query}%")
                )
            )
        ).all()
        cache_service.set(cache_key, result, expire=180)
        return result
    @staticmethod
    def generate_code_article(db: Session) -> str:
        """Génère un code article de type ART-YYMM-XXXX"""
        now = datetime.now()
        year_month = now.strftime("%y%m")
        base_prefix = f"ART-{year_month}"
        
        last_article = db.query(Article).filter(Article.code_article.like(f"{base_prefix}-%")).order_by(Article.code_article.desc()).first()
        
        if last_article and last_article.code_article:
            try:
                last_num = int(last_article.code_article.split("-")[-1])
                new_num = last_num + 1
            except ValueError:
                new_num = 1
        else:
            new_num = 1
            
        return f"{base_prefix}-{new_num:04d}"

    @staticmethod
    def create_article(db: Session, article: ArticleCreate) -> Article:
        # Générer automatiquement le code d'article si non fourni
        if not article.code_article:
            article.code_article = ArticleService.generate_code_article(db)
        
        db_article = Article(**article.dict())
        db.add(db_article)
        db.flush()
        db.refresh(db_article)
        
        # Invalider le cache
        invalidate_cache_pattern("magasin:articles:*")
        
        return db_article

    @staticmethod
    def update_article(db: Session, article_id: int, article: ArticleUpdate) -> Optional[Article]:
        db_article = ArticleService.get_article(db, article_id)
        if db_article:
            for field, value in article.dict(exclude_unset=True).items():
                setattr(db_article, field, value)
            db.flush()
            db.refresh(db_article)
            
            # Invalider le cache
            invalidate_cache_pattern("magasin:articles:*")
        return db_article

    @staticmethod
    def delete_article(db: Session, article_id: int) -> bool:
        db_article = ArticleService.get_article(db, article_id)
        if db_article:
            db_article.est_actif = False
            db.flush()
            
            # Invalider le cache
            invalidate_cache_pattern("magasin:articles:*")
            return True
        return False


class ConversionService:
    """Service pour les conversions d'unités"""

    @staticmethod
    def convertir_vers_udb(quantite: Decimal, unite: UniteMesure, article: Article) -> Decimal:
        """Convertit une quantité vers UDB (Unité de Base)"""
        if unite == UniteMesure.UDB:
            return quantite
        
        if unite == UniteMesure.KG:
            if not article.poids_unitaire:
                raise InvalidConversionError(f"Poids unitaire non défini pour l'article {article.code_article}. Impossible de convertir KG vers UDB.")
            return quantite / Decimal(str(article.poids_unitaire))
        
        if unite == UniteMesure.TONNE:
            if not article.poids_unitaire:
                raise InvalidConversionError(f"Poids unitaire non défini pour l'article {article.code_article}. Impossible de convertir TONNE vers UDB.")
            return (quantite * Decimal("1000")) / Decimal(str(article.poids_unitaire))
        
        if unite == UniteMesure.M3:
            if not article.volume_unitaire:
                raise InvalidConversionError(f"Volume unitaire non défini pour l'article {article.code_article}. Impossible de convertir M3 vers UDB.")
            return quantite / Decimal(str(article.volume_unitaire))
        
        if unite == UniteMesure.M2:
            if not article.volume_unitaire:
                raise InvalidConversionError(f"Volume unitaire non défini pour l'article {article.code_article}. Impossible de convertir M2 vers UDB.")
            return quantite / Decimal(str(article.volume_unitaire))
        
        # Si pas de conversion possible, retourne la quantité originale
        return quantite

    @staticmethod
    def convertir_de_udb(quantite_udb: Decimal, unite_cible: UniteMesure, article: Article) -> Decimal:
        """Convertit depuis UDB vers l'unité cible"""
        if unite_cible == UniteMesure.UDB:
            return quantite_udb
        
        if unite_cible == UniteMesure.KG:
            if not article.poids_unitaire:
                raise InvalidConversionError(f"Poids unitaire non défini pour l'article {article.code_article}. Impossible de convertir UDB vers KG.")
            return quantite_udb * Decimal(str(article.poids_unitaire))
        
        if unite_cible == UniteMesure.TONNE:
            if not article.poids_unitaire:
                raise InvalidConversionError(f"Poids unitaire non défini pour l'article {article.code_article}. Impossible de convertir UDB vers TONNE.")
            return (quantite_udb * Decimal(str(article.poids_unitaire))) / Decimal("1000")
        
        if unite_cible == UniteMesure.M3:
            if not article.volume_unitaire:
                raise InvalidConversionError(f"Volume unitaire non défini pour l'article {article.code_article}. Impossible de convertir UDB vers M3.")
            return quantite_udb * Decimal(str(article.volume_unitaire))
        
        if unite_cible == UniteMesure.M2:
            if not article.volume_unitaire:
                raise InvalidConversionError(f"Volume unitaire non défini pour l'article {article.code_article}. Impossible de convertir UDB vers M2.")
            return quantite_udb * Decimal(str(article.volume_unitaire))
        
        return quantite_udb


class DeclarationService:
    """Service pour la gestion des déclarations (Bill of Lading)"""

    @staticmethod
    def generate_numero_bl(db: Session) -> str:
        """Génère un numéro de Bill of Lading unique"""
        year = datetime.now().year
        count = db.query(Declaration).filter(
            Declaration.numero_bl.like(f"BL-{year}-%")
        ).count()
        return f"BL-{year}-{count + 1:04d}"

    @staticmethod
    def get_all_declarations(db: Session, skip: int = 0, limit: int = 100) -> List[Declaration]:
        cache_key = f"magasin:declarations:all:{skip}:{limit}"
        cached = cache_service.get(cache_key)
        if cached:
            return cached
        result = db.query(Declaration).options(
            selectinload(Declaration.lignes)
        ).offset(skip).limit(limit).all()
        cache_service.set(cache_key, result, expire=300)
        return result

    @staticmethod
    def get_receptions_summary(db: Session, declaration_id: int) -> dict:
        """Retourne un résumé des quantités reçues par magasin pour une déclaration"""
        from app.models.magasin import LigneReception, Reception, Magasin, LigneDeclaration
        
        # 1. Total par magasin
        res = db.query(
            Magasin.nom,
            db.func.sum(LigneReception.quantite_recue).label("total_recu")
        ).join(Reception, Reception.magasin_id == Magasin.id) \
         .join(LigneReception, LigneReception.reception_id == Reception.id) \
         .filter(Reception.declaration_id == declaration_id) \
         .group_by(Magasin.nom).all()
        
        receptions_par_magasin = {nom: float(total) for nom, total in res}
        
        # 2. Total reçu global vs déclaré (sur le premier article pour simplifier)
        ligne_decl = db.query(LigneDeclaration).filter(LigneDeclaration.declaration_id == declaration_id).first()
        quantite_declaree = float(ligne_decl.quantite_declaree) if ligne_decl else 0.0
        
        total_global = sum(receptions_par_magasin.values())
        reste_a_recevoir = quantite_declaree - total_global
        
        return {
            "quantite_declaree": quantite_declaree,
            "total_recu": total_global,
            "reste_a_recevoir": max(0, reste_a_recevoir),
            "receptions_par_magasin": receptions_par_magasin
        }

    @staticmethod
    def get_declaration(db: Session, declaration_id: int) -> Optional[Declaration]:
        cache_key = f"magasin:declaration:{declaration_id}"
        cached = cache_service.get(cache_key)
        if cached:
            return cached
        result = db.query(Declaration).filter(Declaration.id == declaration_id).first()
        if result:
            cache_service.set(cache_key, result, expire=600)
        return result

    @staticmethod
    def get_declaration_by_bl(db: Session, numero_bl: str) -> Optional[Declaration]:
        cache_key = f"magasin:declaration:bl:{numero_bl}"
        cached = cache_service.get(cache_key)
        if cached:
            return cached
        result = db.query(Declaration).filter(Declaration.numero_bl == numero_bl).first()
        if result:
            cache_service.set(cache_key, result, expire=600)
        return result

    @staticmethod
    def get_declarations_by_client(db: Session, client_id: int) -> List[Declaration]:
        cache_key = f"magasin:declarations:client:{client_id}"
        cached = cache_service.get(cache_key)
        if cached:
            return cached
        result = db.query(Declaration).filter(Declaration.client_id == client_id).all()
        cache_service.set(cache_key, result, expire=300)
        return result

    @staticmethod
    def create_declaration(db: Session, declaration: DeclarationCreate, cree_par: str) -> Declaration:
        # Générer le numéro de BL
        numero_bl = DeclarationService.generate_numero_bl(db)
        
        try:
            # Transaction explicite
            with db.begin():
                db_declaration = Declaration(
                    numero_bl=numero_bl,
                    cree_par=cree_par,
                    **declaration.dict(exclude={'lignes'})
                )
                db.add(db_declaration)
                db.flush()

                # Ajouter les lignes avec conversion en UDB
                for ligne_data in declaration.lignes:
                    article = ArticleService.get_article(db, ligne_data.article_id)
                    quantite_udb = ConversionService.convertir_vers_udb(
                        ligne_data.quantite_declaree,
                        ligne_data.unite_mesure,
                        article
                    )
                    
                    db_ligne = LigneDeclaration(
                        declaration_id=db_declaration.id,
                        quantite_udb=quantite_udb,
                        **ligne_data.dict()
                    )
                    db.add(db_ligne)

            db.refresh(db_declaration)
            
            # Invalider le cache
            invalidate_cache_pattern("magasin:declarations:*")
            
            return db_declaration
        except Exception as e:
            db.rollback()
            raise BusinessRuleViolationError(f"Erreur lors de la création de la déclaration: {str(e)}")

    @staticmethod
    def update_declaration(db: Session, declaration_id: int, declaration: DeclarationUpdate) -> Optional[Declaration]:
        db_declaration = DeclarationService.get_declaration(db, declaration_id)
        if db_declaration:
            for field, value in declaration.dict(exclude_unset=True).items():
                setattr(db_declaration, field, value)
            db.flush()
            db.refresh(db_declaration)
            
            # Invalider le cache
            invalidate_cache_pattern("magasin:declarations:*")
        return db_declaration

    @staticmethod
    def valider_declaration(db: Session, declaration_id: int) -> Optional[Declaration]:
        """Valide une déclaration"""
        db_declaration = DeclarationService.get_declaration(db, declaration_id)
        if db_declaration:
            db_declaration.statut = StatutDeclaration.VALIDEE
            db.flush()
            db.refresh(db_declaration)
            
            # Invalider le cache
            invalidate_cache_pattern("magasin:declarations:*")
        return db_declaration

    @staticmethod
    def annuler_declaration(db: Session, declaration_id: int) -> Optional[Declaration]:
        """Annule une déclaration"""
        db_declaration = DeclarationService.get_declaration(db, declaration_id)
        if db_declaration:
            db_declaration.statut = StatutDeclaration.ANNULEE
            db.flush()
            db.refresh(db_declaration)
            
            # Invalider le cache
            invalidate_cache_pattern("magasin:declarations:*")
        return db_declaration


class ReceptionService:
    """Service pour la gestion des réceptions"""

    @staticmethod
    def generate_numero_reception(db: Session) -> str:
        """Génère un numéro de réception unique"""
        year = datetime.now().year
        count = db.query(Reception).filter(
            Reception.numero_reception.like(f"REC-{year}-%")
        ).count()
        return f"REC-{year}-{count + 1:04d}"

    @staticmethod
    def get_all_receptions(db: Session, skip: int = 0, limit: int = 100) -> List[Reception]:
        cache_key = f"magasin:receptions:all:{skip}:{limit}"
        cached = cache_service.get(cache_key)
        if cached:
            return cached
        result = db.query(Reception).options(selectinload(Reception.lignes)).offset(skip).limit(limit).all()
        cache_service.set(cache_key, result, expire=300)
        return result

    @staticmethod
    def get_reception(db: Session, reception_id: int) -> Optional[Reception]:
        cache_key = f"magasin:reception:{reception_id}"
        cached = cache_service.get(cache_key)
        if cached:
            return cached
        result = db.query(Reception).filter(Reception.id == reception_id).first()
        if result:
            cache_service.set(cache_key, result, expire=600)
        return result

    @staticmethod
    def get_receptions_by_declaration(db: Session, declaration_id: int) -> List[Reception]:
        cache_key = f"magasin:receptions:declaration:{declaration_id}"
        cached = cache_service.get(cache_key)
        if cached:
            return cached
        result = db.query(Reception).filter(Reception.declaration_id == declaration_id).all()
        cache_service.set(cache_key, result, expire=300)
        return result

    @staticmethod
    def get_receptions_by_magasin(db: Session, magasin_id: int) -> List[Reception]:
        cache_key = f"magasin:receptions:magasin:{magasin_id}"
        cached = cache_service.get(cache_key)
        if cached:
            return cached
        result = db.query(Reception).filter(Reception.magasin_id == magasin_id).all()
        cache_service.set(cache_key, result, expire=300)
        return result

    @staticmethod
    def create_reception(db: Session, reception: ReceptionCreate, recu_par: str, user_id: Optional[int] = None) -> Reception:
        # Générer le numéro de réception
        numero_reception = ReceptionService.generate_numero_reception(db)

        # Récupérer la déclaration pour validation
        declaration = db.query(Declaration).filter(Declaration.id == reception.declaration_id).first()
        if not declaration:
            raise BusinessRuleViolationError("Déclaration introuvable")

        try:
            # Transaction explicite
            with db.begin():
                db_reception = Reception(
                    numero_reception=numero_reception,
                    recu_par=recu_par,
                    **reception.dict(exclude={'lignes'})
                )
                db.add(db_reception)
                db.flush()

                # Ajouter les lignes avec conversion en UDB et validation
                for ligne_data in reception.lignes:
                    article = ArticleService.get_article(db, ligne_data.article_id)
                    quantite_udb = ConversionService.convertir_vers_udb(
                        ligne_data.quantite_recue,
                        ligne_data.unite_mesure,
                        article
                    )

                    # Validation des réceptions partielles : total reçu ≤ quantité déclarée
                    ligne_declaration = db.query(LigneDeclaration).filter(
                        and_(
                            LigneDeclaration.declaration_id == reception.declaration_id,
                            LigneDeclaration.article_id == ligne_data.article_id
                        )
                    ).first()

                    if ligne_declaration:
                        # Calculer le total déjà reçu (tous magasins)
                        total_deja_recu = db.query(LigneReception).join(Reception).filter(
                            and_(
                                Reception.declaration_id == reception.declaration_id,
                                LigneReception.article_id == ligne_data.article_id,
                                Reception.statut != StatutReception.ANNULEE
                            )
                        ).with_entities(
                            db.func.sum(LigneReception.quantite_recue)
                        ).scalar() or Decimal('0')

                        # Vérifier que le nouveau total ne dépasse pas la quantité déclarée
                        nouveau_total = total_deja_recu + ligne_data.quantite_recue
                        if nouveau_total > ligne_declaration.quantite_declaree:
                            raise BusinessRuleViolationError(
                                f"Quantité reçue ({nouveau_total}) dépasse la quantité déclarée ({ligne_declaration.quantite_declaree}) "
                                f"pour l'article {article.code_article}. Reste à recevoir: {ligne_declaration.quantite_declaree - total_deja_recu}"
                            )

                        # Mettre à jour quantite_recue et quantite_restante sur la ligne de déclaration
                        ligne_declaration.quantite_recue = nouveau_total
                        ligne_declaration.quantite_restante = ligne_declaration.quantite_declaree - nouveau_total

                    db_ligne = LigneReception(
                        reception_id=db_reception.id,
                        quantite_udb=quantite_udb,
                        **ligne_data.dict()
                    )
                    db.add(db_ligne)

                # Mettre à jour le stock avec audit trail
                StockService.mettre_a_jour_stock_apres_reception(db, db_reception, user_id)

            db.refresh(db_reception)

            # Invalider le cache
            invalidate_cache_pattern("magasin:receptions:*")
            invalidate_cache_pattern("magasin:stocks:*")
            invalidate_cache_pattern("magasin:declarations:*")

            return db_reception
        except BusinessRuleViolationError:
            raise
        except Exception as e:
            db.rollback()
            raise BusinessRuleViolationError(f"Erreur lors de la création de la réception: {str(e)}")

    @staticmethod
    def update_reception(db: Session, reception_id: int, reception: ReceptionUpdate) -> Optional[Reception]:
        db_reception = ReceptionService.get_reception(db, reception_id)
        if db_reception:
            for field, value in reception.dict(exclude_unset=True).items():
                setattr(db_reception, field, value)
            db.flush()
            db.refresh(db_reception)
            
            # Invalider le cache
            invalidate_cache_pattern("magasin:receptions:*")
        return db_reception

    @staticmethod
    def completer_reception(db: Session, reception_id: int) -> Optional[Reception]:
        """Marque une réception comme complète"""
        db_reception = ReceptionService.get_reception(db, reception_id)
        if db_reception:
            db_reception.statut = StatutReception.COMPLETEE
            db.flush()
            db.refresh(db_reception)
            
            # Invalider le cache
            invalidate_cache_pattern("magasin:receptions:*")
        return db_reception

    @staticmethod
    def annuler_reception(db: Session, reception_id: int) -> Optional[Reception]:
        """Annule une réception et met à jour le stock"""
        db_reception = ReceptionService.get_reception(db, reception_id)
        if db_reception:
            db_reception.statut = StatutReception.ANNULEE
            StockService.annuler_reception_stock(db, db_reception)
            db.flush()
            db.refresh(db_reception)
            
            # Invalider le cache
            invalidate_cache_pattern("magasin:receptions:*")
            invalidate_cache_pattern("magasin:stocks:*")
        return db_reception


class StockService:
    """Service pour la gestion des stocks"""

    @staticmethod
    def get_stock(db: Session, magasin_id: int, article_id: int) -> Optional[Stock]:
        cache_key = f"magasin:stock:{magasin_id}:{article_id}"
        cached = cache_service.get(cache_key)
        if cached:
            return cached
        result = db.query(Stock).filter(
            and_(Stock.magasin_id == magasin_id, Stock.article_id == article_id)
        ).first()
        if result:
            cache_service.set(cache_key, result, expire=600)
        return result

    @staticmethod
    def get_all_stocks(db: Session, skip: int = 0, limit: int = 100) -> List[Stock]:
        cache_key = f"magasin:stocks:all:{skip}:{limit}"
        cached = cache_service.get(cache_key)
        if cached:
            return cached
        result = db.query(Stock).offset(skip).limit(limit).all()
        cache_service.set(cache_key, result, expire=300)
        return result

    @staticmethod
    def get_stocks_by_magasin(db: Session, magasin_id: int) -> List[Stock]:
        cache_key = f"magasin:stocks:magasin:{magasin_id}"
        cached = cache_service.get(cache_key)
        if cached:
            return cached
        result = db.query(Stock).filter(Stock.magasin_id == magasin_id).all()
        cache_service.set(cache_key, result, expire=300)
        return result

    @staticmethod
    def get_stocks_by_article(db: Session, article_id: int) -> List[Stock]:
        cache_key = f"magasin:stocks:article:{article_id}"
        cached = cache_service.get(cache_key)
        if cached:
            return cached
        result = db.query(Stock).filter(Stock.article_id == article_id).all()
        cache_service.set(cache_key, result, expire=300)
        return result

    @staticmethod
    def get_total_stock_by_article(db: Session, article_id: int) -> Decimal:
        """Calcule le stock total d'un article tous magasins confondus"""
        cache_key = f"magasin:stock:total:{article_id}"
        cached = cache_service.get(cache_key)
        if cached:
            return cached
        stocks = StockService.get_stocks_by_article(db, article_id)
        result = sum(stock.quantite_udb for stock in stocks)
        cache_service.set(cache_key, result, expire=180)
        return result

    @staticmethod
    def filter_stocks(db: Session, filters: StockFilter) -> List[Stock]:
        """Filtre les stocks selon plusieurs critères"""
        query = db.query(Stock).join(Article).join(Magasin)

        if filters.code_article:
            query = query.filter(Article.code_article.ilike(f"%{filters.code_article}%"))
        
        if filters.nom_article:
            query = query.filter(Article.nom.ilike(f"%{filters.nom_article}%"))
        
        if filters.magasin_id:
            query = query.filter(Stock.magasin_id == filters.magasin_id)
        
        if filters.client_id:
            # Filtrer par client via les déclarations/réceptions
            query = query.join(Reception).join(Declaration).filter(Declaration.client_id == filters.client_id)
        
        if filters.date_debut or filters.date_fin:
            # Filtrer par date de réception
            if filters.date_debut:
                query = query.join(Reception).filter(Reception.date_reception >= filters.date_debut)
            if filters.date_fin:
                query = query.join(Reception).filter(Reception.date_reception <= filters.date_fin)

        return query.all()

    @staticmethod
    def mettre_a_jour_stock_apres_reception(db: Session, reception: Reception, user_id: Optional[int] = None):
        """Met à jour le stock après une réception"""
        for ligne in reception.lignes:
            stock = StockService.get_stock(db, reception.magasin_id, ligne.article_id)
            
            if stock:
                quantite_avant = stock.quantite_disponible
                stock.quantite_disponible += ligne.quantite_udb
                stock.quantite_udb += ligne.quantite_udb
                quantite_apres = stock.quantite_disponible
                
                # Audit trail avec précision Decimal
                AuditService.log_stock_modification(
                    db=db,
                    action="reception",
                    article_id=ligne.article_id,
                    magasin_id=reception.magasin_id,
                    quantite_avant=quantite_avant,
                    quantite_apres=quantite_apres,
                    user_id=user_id,
                    raison=f"Réception {reception.numero_reception}"
                )
            else:
                stock = Stock(
                    magasin_id=reception.magasin_id,
                    article_id=ligne.article_id,
                    quantite_disponible=ligne.quantite_udb,
                    quantite_udb=ligne.quantite_udb
                )
                db.add(stock)
                
                # Audit trail pour création de stock avec précision Decimal
                AuditService.log_stock_modification(
                    db=db,
                    action="stock_creation",
                    article_id=ligne.article_id,
                    magasin_id=reception.magasin_id,
                    quantite_avant=Decimal('0'),
                    quantite_apres=ligne.quantite_udb,
                    user_id=user_id,
                    raison=f"Création stock via réception {reception.numero_reception}"
                )
        
        # Invalider le cache
        invalidate_cache_pattern("magasin:stocks:*")
        
        # Créer passerelle Réception → Stock
        try:
            dto = ReceptionStockDTO(
                reception_id=reception.id,
                magasin_id=reception.magasin_id,
                numero_reception=reception.numero_reception,
                lignes=[
                    {"article_id": l.article_id, "quantite": l.quantite_recue, "unite": l.unite_mesure}
                    for l in reception.lignes
                ],
            )
            gateway_service.creer_reception_stock(db, dto, str(user_id) if user_id else None)
        except Exception as e:
            # Log l'erreur mais ne pas bloquer le processus
            from app.utils.logger import get_logger
            logger = get_logger(__name__)
            logger.error(f"Erreur création passerelle reception-stock: {str(e)}")

    @staticmethod
    def annuler_reception_stock(db: Session, reception: Reception):
        """Annule l'impact d'une réception sur le stock"""
        for ligne in reception.lignes:
            stock = StockService.get_stock(db, reception.magasin_id, ligne.article_id)
            if stock:
                stock.quantite_disponible -= ligne.quantite_udb
                stock.quantite_udb -= ligne.quantite_udb
        
        # Invalider le cache
        invalidate_cache_pattern("magasin:stocks:*")

    @staticmethod
    def mettre_a_jour_stock_apres_livraison(db: Session, bande: BandeLivraison, user_id: Optional[int] = None):
        """Met à jour le stock après une livraison"""
        for ligne in bande.lignes:
            stock = StockService.get_stock(db, bande.magasin_id, ligne.article_id)
            if stock:
                article = ArticleService.get_article(db, ligne.article_id)
                quantite_udb = ConversionService.convertir_vers_udb(ligne.quantite, ligne.unite_mesure, article)
                
                # Validation: empêcher le stock de devenir négatif
                if stock.quantite_disponible < quantite_udb:
                    raise InsufficientStockError(f"Stock insuffisant pour article {article.code_article}. Disponible: {stock.quantite_disponible} UDB, Demandé: {quantite_udb} UDB")
                if stock.quantite_udb < quantite_udb:
                    raise InsufficientStockError(f"Stock UDB insuffisant pour article {article.code_article}. Disponible: {stock.quantite_udb} UDB, Demandé: {quantite_udb} UDB")
                
                quantite_avant = stock.quantite_disponible
                stock.quantite_disponible -= quantite_udb
                stock.quantite_udb -= quantite_udb
                quantite_apres = stock.quantite_disponible
                
                # Audit trail avec précision Decimal
                AuditService.log_stock_modification(
                    db=db,
                    action="livraison",
                    article_id=ligne.article_id,
                    magasin_id=bande.magasin_id,
                    quantite_avant=quantite_avant,
                    quantite_apres=quantite_apres,
                    user_id=user_id,
                    raison=f"Bande de livraison {bande.numero_bande}"
                )
        
        # Invalider le cache
        invalidate_cache_pattern("magasin:stocks:*")


class CommandeService:
    """Service pour la gestion des commandes"""

    @staticmethod
    def generate_numero_commande(db: Session) -> str:
        """Génère un numéro de commande unique"""
        year = datetime.now().year
        count = db.query(Commande).filter(
            Commande.numero_commande.like(f"CMD-{year}-%")
        ).count()
        return f"CMD-{year}-{count + 1:04d}"

    @staticmethod
    def get_all_commandes(db: Session, skip: int = 0, limit: int = 100) -> List[Commande]:
        cache_key = f"magasin:commandes:all:{skip}:{limit}"
        cached = cache_service.get(cache_key)
        if cached:
            return cached
        result = db.query(Commande).options(selectinload(Commande.lignes)).offset(skip).limit(limit).all()
        cache_service.set(cache_key, result, expire=300)
        return result

    @staticmethod
    def get_commande(db: Session, commande_id: int) -> Optional[Commande]:
        cache_key = f"magasin:commande:{commande_id}"
        cached = cache_service.get(cache_key)
        if cached:
            return cached
        result = db.query(Commande).filter(Commande.id == commande_id).first()
        if result:
            cache_service.set(cache_key, result, expire=600)
        return result

    @staticmethod
    def get_commandes_by_client(db: Session, client_id: int) -> List[Commande]:
        cache_key = f"magasin:commandes:client:{client_id}"
        cached = cache_service.get(cache_key)
        if cached:
            return cached
        result = db.query(Commande).filter(Commande.client_id == client_id).all()
        cache_service.set(cache_key, result, expire=300)
        return result

    @staticmethod
    def get_commandes_verrouillees(db: Session) -> List[Commande]:
        """Récupère les commandes verrouillées (en attente de paiement)"""
        cache_key = "magasin:commandes:verrouillees"
        cached = cache_service.get(cache_key)
        if cached:
            return cached
        result = db.query(Commande).filter(
            and_(Commande.est_verrouille == True, Commande.paiement_valide == False)
        ).all()
        cache_service.set(cache_key, result, expire=180)
        return result

    @staticmethod
    def create_commande(db: Session, commande: CommandeCreate, cree_par: str) -> Commande:
        # Générer le numéro de commande
        numero_commande = CommandeService.generate_numero_commande(db)
        
        try:
            # Transaction explicite
            with db.begin():
                db_commande = Commande(
                    numero_commande=numero_commande,
                    cree_par=cree_par,
                    **commande.dict(exclude={'lignes'})
                )
                db.add(db_commande)
                db.flush()

                # Ajouter les lignes
                for ligne_data in commande.lignes:
                    db_ligne = LigneCommande(
                        commande_id=db_commande.id,
                        **ligne_data.dict()
                    )
                    db.add(db_ligne)

            db.refresh(db_commande)
            
            # Invalider le cache
            invalidate_cache_pattern("magasin:commandes:*")
            
            return db_commande
        except Exception as e:
            db.rollback()
            raise BusinessRuleViolationError(f"Erreur lors de la création de la commande: {str(e)}")

    @staticmethod
    def update_commande(db: Session, commande_id: int, commande: CommandeUpdate) -> Optional[Commande]:
        db_commande = CommandeService.get_commande(db, commande_id)
        if db_commande:
            for field, value in commande.dict(exclude_unset=True).items():
                setattr(db_commande, field, value)
            db.flush()
            db.refresh(db_commande)
            
            # Invalider le cache
            invalidate_cache_pattern("magasin:commandes:*")
        return db_commande

    @staticmethod
    def valider_paiement(db: Session, commande_id: int, valide_par: str) -> Optional[Commande]:
        """Valide le paiement d'une commande et déverrouille la commande"""
        db_commande = CommandeService.get_commande(db, commande_id)
        if db_commande:
            db_commande.paiement_valide = True
            db_commande.est_verrouille = False
            db_commande.statut = StatutCommande.PAYEE
            db_commande.valide_par = valide_par
            db_commande.date_validation = datetime.now()
            db.flush()
            db.refresh(db_commande)
            
            # Invalider le cache
            invalidate_cache_pattern("magasin:commandes:*")
            
            # Créer passerelle Commande → Facture
            try:
                dto = CommandeFactureDTO(
                    commande_id=db_commande.id,
                    client_id=db_commande.client_id,
                    numero_commande=db_commande.numero_commande,
                    montant_total=sum(
                        ligne.quantite_demandee * (ligne.prix_unitaire or Decimal("0"))
                        for ligne in db_commande.lignes
                    ),
                    tva=Decimal("19.25"),
                    date_commande=db_commande.date_commande,
                    lignes=[
                        {
                            "article_id": l.article_id,
                            "quantite": l.quantite_demandee,
                            "prix": l.prix_unitaire or Decimal("0"),
                        }
                        for l in db_commande.lignes
                    ],
                )
                gateway_service.creer_commande_facture(db, dto, valide_par)
            except Exception as e:
                # Log l'erreur mais ne pas bloquer le processus
                from app.utils.logger import get_logger
                logger = get_logger(__name__)
                logger.error(f"Erreur création passerelle commande-facture: {str(e)}")
                
        return db_commande

    @staticmethod
    def mettre_en_preparation(db: Session, commande_id: int) -> Optional[Commande]:
        """Met la commande en préparation"""
        db_commande = CommandeService.get_commande(db, commande_id)
        if db_commande and db_commande.paiement_valide:
            db_commande.statut = StatutCommande.EN_PREPARATION
            db.flush()
            db.refresh(db_commande)
            
            # Invalider le cache
            invalidate_cache_pattern("magasin:commandes:*")
            
            # Créer passerelle Commande → Livraison
            try:
                client = db.query(ClientMagasin).filter(ClientMagasin.id == db_commande.client_id).first()
                adresse_livraison = client.adresse if client else "Non spécifié"
                
                dto = CommandeLivraisonDTO(
                    commande_id=db_commande.id,
                    client_id=db_commande.client_id,
                    numero_commande=db_commande.numero_commande,
                    adresse_livraison=adresse_livraison,
                    date_livraison_souhaitee=db_commande.date_livraison_souhaitee or datetime.now(),
                    lignes=[
                        {"article_id": l.article_id, "quantite": l.quantite_demandee, "unite": l.unite_mesure}
                        for l in db_commande.lignes
                    ],
                )
                gateway_service.creer_commande_livraison(db, dto, db_commande.cree_par)
            except Exception as e:
                # Log l'erreur mais ne pas bloquer le processus
                from app.utils.logger import get_logger
                logger = get_logger(__name__)
                logger.error(f"Erreur création passerelle commande-livraison: {str(e)}")
                
        return db_commande

    @staticmethod
    def marquer_prete(db: Session, commande_id: int) -> Optional[Commande]:
        """Marque la commande comme prête"""
        db_commande = CommandeService.get_commande(db, commande_id)
        if db_commande:
            db_commande.statut = StatutCommande.PRETE
            db.flush()
            db.refresh(db_commande)
            
            # Invalider le cache
            invalidate_cache_pattern("magasin:commandes:*")
        return db_commande

    @staticmethod
    def marquer_livree(db: Session, commande_id: int) -> Optional[Commande]:
        """Marque la commande comme livrée"""
        db_commande = CommandeService.get_commande(db, commande_id)
        if db_commande:
            db_commande.statut = StatutCommande.LIVREE
            db.flush()
            db.refresh(db_commande)
            
            # Invalider le cache
            invalidate_cache_pattern("magasin:commandes:*")
        return db_commande

    @staticmethod
    def annuler_commande(db: Session, commande_id: int) -> Optional[Commande]:
        """Annule une commande"""
        db_commande = CommandeService.get_commande(db, commande_id)
        if db_commande:
            db_commande.statut = StatutCommande.ANNULEE
            db.flush()
            db.refresh(db_commande)
            
            # Invalider le cache
            invalidate_cache_pattern("magasin:commandes:*")
        return db_commande


class BandeLivraisonService:
    """Service pour la gestion des bandes de livraison"""

    @staticmethod
    def generate_numero_bande(db: Session) -> str:
        """Génère un numéro de bande de livraison unique"""
        year = datetime.now().year
        count = db.query(BandeLivraison).filter(
            BandeLivraison.numero_bande.like(f"BLD-{year}-%")
        ).count()
        return f"BLD-{year}-{count + 1:04d}"

    @staticmethod
    def get_all_bandes(db: Session, skip: int = 0, limit: int = 100) -> List[BandeLivraison]:
        cache_key = f"magasin:bandes:all:{skip}:{limit}"
        cached = cache_service.get(cache_key)
        if cached:
            return cached
        result = db.query(BandeLivraison).options(selectinload(BandeLivraison.lignes)).offset(skip).limit(limit).all()
        cache_service.set(cache_key, result, expire=300)
        return result

    @staticmethod
    def get_bande(db: Session, bande_id: int) -> Optional[BandeLivraison]:
        cache_key = f"magasin:bande:{bande_id}"
        cached = cache_service.get(cache_key)
        if cached:
            return cached
        result = db.query(BandeLivraison).filter(BandeLivraison.id == bande_id).first()
        if result:
            cache_service.set(cache_key, result, expire=600)
        return result

    @staticmethod
    def get_bandes_by_commande(db: Session, commande_id: int) -> List[BandeLivraison]:
        cache_key = f"magasin:bandes:commande:{commande_id}"
        cached = cache_service.get(cache_key)
        if cached:
            return cached
        result = db.query(BandeLivraison).filter(BandeLivraison.commande_id == commande_id).all()
        cache_service.set(cache_key, result, expire=300)
        return result

    @staticmethod
    def create_bande(db: Session, bande: BandeLivraisonCreate, prepare_par: str, user_id: Optional[int] = None) -> BandeLivraison:
        # Validate that exactly one of commande_id or ordre_transfert_id is set
        if bande.commande_id is not None and bande.ordre_transfert_id is not None:
            raise BusinessRuleViolationError("Une bande de livraison ne peut être liée à la fois à une commande et à un ordre de transfert")
        if bande.commande_id is None and bande.ordre_transfert_id is None:
            raise BusinessRuleViolationError("Une bande de livraison doit être liée soit à une commande soit à un ordre de transfert")

        # Générer le numéro de bande
        numero_bande = BandeLivraisonService.generate_numero_bande(db)

        try:
            # Transaction explicite
            with db.begin():
                db_bande = BandeLivraison(
                    numero_bande=numero_bande,
                    prepare_par=prepare_par,
                    **bande.dict(exclude={'lignes'})
                )
                db.add(db_bande)
                db.flush()

                # Ajouter les lignes
                for ligne_data in bande.lignes:
                    db_ligne = LigneBandeLivraison(
                        bande_id=db_bande.id,
                        **ligne_data.dict()
                    )
                    db.add(db_ligne)

                # Mettre à jour le stock avec audit trail
                StockService.mettre_a_jour_stock_apres_livraison(db, db_bande, user_id)

            db.refresh(db_bande)

            # Invalider le cache
            invalidate_cache_pattern("magasin:bandes:*")

            return db_bande
        except Exception as e:
            db.rollback()
            raise BusinessRuleViolationError(f"Erreur lors de la création de la bande de livraison: {str(e)}")

    @staticmethod
    def create_bande_from_ordre_transfert(db: Session, ot_id: int, prepare_par: str, user_id: Optional[int] = None) -> BandeLivraison:
        """Crée une bande de livraison à partir d'un ordre de transfert validé"""
        # Récupérer l'OT
        db_ot = OrdreTransfertService.get_by_id(db, ot_id)
        if not db_ot:
            raise BusinessRuleViolationError(f"Ordre de transfert ID {ot_id} introuvable")
        if db_ot.statut != StatutOrdreTransfert.VALIDE:
            raise BusinessRuleViolationError(f"L'OT {db_ot.numero_ot} doit être en statut VALIDE pour générer une bande de livraison")

        # Générer le numéro de bande
        numero_bande = BandeLivraisonService.generate_numero_bande(db)

        try:
            # Transaction explicite
            with db.begin():
                db_bande = BandeLivraison(
                    numero_bande=numero_bande,
                    ordre_transfert_id=db_ot.id,
                    magasin_id=db_ot.magasin_dest_id,
                    prepare_par=prepare_par,
                    date_livraison=None,  # To be set later
                    statut="EN_PREPARATION",
                    nombre_camions=0,
                    notes=f"Bande générée automatiquement depuis l'OT {db_ot.numero_ot}",
                    chauffeur_nom=None,
                    matricule_vehicule=None,
                    signature_chauffeur=None,
                    signature_magasinier=None,
                    signature_transporteur=None
                )
                db.add(db_bande)
                db.flush()

                # Ajouter les lignes depuis l'OT
                for ligne_ot in db_ot.lignes:
                    db_ligne = LigneBandeLivraison(
                        bande_id=db_bande.id,
                        article_id=ligne_ot.article_id,
                        quantite=ligne_ot.quantite,
                        unite_mesure=ligne_ot.unite_mesure
                    )
                    db.add(db_ligne)

            db.refresh(db_bande)

            # Invalider le cache
            invalidate_cache_pattern("magasin:bandes:*")

            return db_bande
        except Exception as e:
            db.rollback()
            raise BusinessRuleViolationError(f"Erreur lors de la création de la bande de livraison depuis l'OT: {str(e)}")

    @staticmethod
    def update_bande(db: Session, bande_id: int, bande: BandeLivraisonUpdate) -> Optional[BandeLivraison]:
        db_bande = BandeLivraisonService.get_bande(db, bande_id)
        if db_bande:
            for field, value in bande.dict(exclude_unset=True).items():
                setattr(db_bande, field, value)
            db.flush()
            db.refresh(db_bande)

            # Invalider le cache
            invalidate_cache_pattern("magasin:bandes:*")
        return db_bande


class IncotermService:
    """Service pour la gestion des Incoterms"""

    @staticmethod
    def get_all(db: Session, skip: int = 0, limit: int = 100) -> List[Incoterm]:
        cache_key = f"magasin:incoterms:all:{skip}:{limit}"
        cached = cache_service.get(cache_key)
        if cached:
            return cached
        result = db.query(Incoterm).offset(skip).limit(limit).all()
        cache_service.set(cache_key, result, expire=3600)
        return result

    @staticmethod
    def get_by_id(db: Session, incoterm_id: int) -> Optional[Incoterm]:
        cache_key = f"magasin:incoterm:{incoterm_id}"
        cached = cache_service.get(cache_key)
        if cached:
            return cached
        result = db.query(Incoterm).filter(Incoterm.id == incoterm_id).first()
        if result:
            cache_service.set(cache_key, result, expire=3600)
        return result

    @staticmethod
    def get_by_code(db: Session, code: str) -> Optional[Incoterm]:
        cache_key = f"magasin:incoterm:code:{code}"
        cached = cache_service.get(cache_key)
        if cached:
            return cached
        result = db.query(Incoterm).filter(Incoterm.code == code).first()
        if result:
            cache_service.set(cache_key, result, expire=3600)
        return result

    @staticmethod
    def create(db: Session, incoterm: IncotermCreate) -> Incoterm:
        db_incoterm = Incoterm(**incoterm.dict())
        db.add(db_incoterm)
        db.flush()
        db.refresh(db_incoterm)
        invalidate_cache_pattern("magasin:incoterms:*")
        return db_incoterm

    @staticmethod
    def update(db: Session, incoterm_id: int, incoterm: IncotermUpdate) -> Optional[Incoterm]:
        db_incoterm = IncotermService.get_by_id(db, incoterm_id)
        if db_incoterm:
            for field, value in incoterm.dict(exclude_unset=True).items():
                setattr(db_incoterm, field, value)
            db.flush()
            db.refresh(db_incoterm)
            invalidate_cache_pattern("magasin:incoterms:*")
        return db_incoterm

    @staticmethod
    def delete(db: Session, incoterm_id: int) -> bool:
        db_incoterm = IncotermService.get_by_id(db, incoterm_id)
        if db_incoterm:
            db_incoterm.est_actif = False
            db.flush()
            invalidate_cache_pattern("magasin:incoterms:*")
            return True
        return False


class TypeConteneurService:
    """Service pour la gestion des types de conteneurs"""

    @staticmethod
    def get_all(db: Session, skip: int = 0, limit: int = 100) -> List[TypeConteneur]:
        cache_key = f"magasin:types_conteneur:all:{skip}:{limit}"
        cached = cache_service.get(cache_key)
        if cached:
            return cached
        result = db.query(TypeConteneur).offset(skip).limit(limit).all()
        cache_service.set(cache_key, result, expire=3600)
        return result

    @staticmethod
    def get_by_id(db: Session, type_id: int) -> Optional[TypeConteneur]:
        cache_key = f"magasin:type_conteneur:{type_id}"
        cached = cache_service.get(cache_key)
        if cached:
            return cached
        result = db.query(TypeConteneur).filter(TypeConteneur.id == type_id).first()
        if result:
            cache_service.set(cache_key, result, expire=3600)
        return result

    @staticmethod
    def get_by_code(db: Session, code: str) -> Optional[TypeConteneur]:
        cache_key = f"magasin:type_conteneur:code:{code}"
        cached = cache_service.get(cache_key)
        if cached:
            return cached
        result = db.query(TypeConteneur).filter(TypeConteneur.code == code).first()
        if result:
            cache_service.set(cache_key, result, expire=3600)
        return result

    @staticmethod
    def create(db: Session, type_conteneur: TypeConteneurCreate) -> TypeConteneur:
        db_type = TypeConteneur(**type_conteneur.dict())
        db.add(db_type)
        db.flush()
        db.refresh(db_type)
        invalidate_cache_pattern("magasin:types_conteneur:*")
        return db_type

    @staticmethod
    def update(db: Session, type_id: int, type_conteneur: TypeConteneurUpdate) -> Optional[TypeConteneur]:
        db_type = TypeConteneurService.get_by_id(db, type_id)
        if db_type:
            for field, value in type_conteneur.dict(exclude_unset=True).items():
                setattr(db_type, field, value)
            db.flush()
            db.refresh(db_type)
            invalidate_cache_pattern("magasin:types_conteneur:*")
        return db_type

    @staticmethod
    def delete(db: Session, type_id: int) -> bool:
        db_type = TypeConteneurService.get_by_id(db, type_id)
        if db_type:
            db_type.est_actif = False
            db.flush()
            invalidate_cache_pattern("magasin:types_conteneur:*")
            return True
        return False


class OrdreTransfertService:
    """Service pour la gestion des Ordres de Transfert inter-magasins"""

    @staticmethod
    def generate_numero_ot(db: Session) -> str:
        """Génère un numéro d'OT unique : OT-2026-0001"""
        year = datetime.now().year
        count = db.query(OrdreTransfert).filter(
            OrdreTransfert.numero_ot.like(f"OT-{year}-%")
        ).count()
        return f"OT-{year}-{count + 1:04d}"

    @staticmethod
    def get_all(db: Session, skip: int = 0, limit: int = 100) -> List[OrdreTransfert]:
        cache_key = f"magasin:ot:all:{skip}:{limit}"
        cached = cache_service.get(cache_key)
        if cached:
            return cached
        result = db.query(OrdreTransfert).options(
            selectinload(OrdreTransfert.lignes)
        ).order_by(OrdreTransfert.id.desc()).offset(skip).limit(limit).all()
        cache_service.set(cache_key, result, expire=300)
        return result

    @staticmethod
    def get_by_id(db: Session, ot_id: int) -> Optional[OrdreTransfert]:
        cache_key = f"magasin:ot:{ot_id}"
        cached = cache_service.get(cache_key)
        if cached:
            return cached
        result = db.query(OrdreTransfert).options(
            selectinload(OrdreTransfert.lignes)
        ).filter(OrdreTransfert.id == ot_id).first()
        if result:
            cache_service.set(cache_key, result, expire=600)
        return result

    @staticmethod
    def get_by_declaration(db: Session, declaration_id: int) -> List[OrdreTransfert]:
        cache_key = f"magasin:ot:declaration:{declaration_id}"
        cached = cache_service.get(cache_key)
        if cached:
            return cached
        result = db.query(OrdreTransfert).filter(
            OrdreTransfert.declaration_id == declaration_id
        ).all()
        cache_service.set(cache_key, result, expire=300)
        return result

    @staticmethod
    def create(db: Session, ot: OrdreTransfertCreate, cree_par: str) -> OrdreTransfert:
        """Crée un OT en statut BROUILLON (pas d'impact stock)"""
        numero_ot = OrdreTransfertService.generate_numero_ot(db)

        # Validation : source ≠ destination
        if ot.magasin_source_id == ot.magasin_dest_id:
            raise BusinessRuleViolationError("Le magasin source et le magasin destination doivent être différents")

        # Vérifier que les magasins existent
        source = db.query(Magasin).filter(Magasin.id == ot.magasin_source_id).first()
        if not source:
            raise BusinessRuleViolationError(f"Magasin source ID {ot.magasin_source_id} introuvable")
        dest = db.query(Magasin).filter(Magasin.id == ot.magasin_dest_id).first()
        if not dest:
            raise BusinessRuleViolationError(f"Magasin destination ID {ot.magasin_dest_id} introuvable")

        try:
            with db.begin():
                db_ot = OrdreTransfert(
                    numero_ot=numero_ot,
                    cree_par=cree_par,
                    statut=StatutOrdreTransfert.BROUILLON,
                    **ot.dict(exclude={'lignes'})
                )
                db.add(db_ot)
                db.flush()

                for ligne_data in ot.lignes:
                    # Vérifier que l'article existe
                    article = db.query(Article).filter(Article.id == ligne_data.article_id).first()
                    if not article:
                        raise BusinessRuleViolationError(f"Article ID {ligne_data.article_id} introuvable")

                    db_ligne = LigneOrdreTransfert(
                        ordre_transfert_id=db_ot.id,
                        **ligne_data.dict()
                    )
                    db.add(db_ligne)

            db.refresh(db_ot)
            invalidate_cache_pattern("magasin:ot:*")
            return db_ot
        except BusinessRuleViolationError:
            raise
        except Exception as e:
            db.rollback()
            raise BusinessRuleViolationError(f"Erreur création OT: {str(e)}")

    @staticmethod
    def update(db: Session, ot_id: int, ot: OrdreTransfertUpdate) -> Optional[OrdreTransfert]:
        """Met à jour un OT (seulement si BROUILLON)"""
        db_ot = OrdreTransfertService.get_by_id(db, ot_id)
        if not db_ot:
            return None
        if db_ot.statut != StatutOrdreTransfert.BROUILLON:
            raise BusinessRuleViolationError("Un OT ne peut être modifié qu'en statut BROUILLON")

        for field, value in ot.dict(exclude_unset=True).items():
            setattr(db_ot, field, value)
        db.flush()
        db.refresh(db_ot)
        invalidate_cache_pattern("magasin:ot:*")
        return db_ot

    @staticmethod
    def valider(db: Session, ot_id: int, autorise_par: str, user_id: Optional[int] = None) -> Optional[OrdreTransfert]:
        """
        Valide un OT → DÉSTOCKE le magasin source.
        Vérifie la disponibilité du stock avant validation.
        """
        db_ot = OrdreTransfertService.get_by_id(db, ot_id)
        if not db_ot:
            return None
        if db_ot.statut != StatutOrdreTransfert.BROUILLON:
            raise BusinessRuleViolationError("Seul un OT en BROUILLON peut être validé")

        try:
            with db.begin():
                # Vérifier et déduire le stock pour chaque ligne
                for ligne in db_ot.lignes:
                    stock = StockService.get_stock(db, db_ot.magasin_source_id, ligne.article_id)
                    # Convertir en UDB pour le stock UDB
                    article = db.query(Article).filter(Article.id == ligne.article_id).first()
                    quantite_udb = ConversionService.convertir_vers_udb(
                        ligne.quantite, ligne.unite_mesure, article
                    )

                    if not stock or stock.quantite_disponible < quantite_udb:
                        dispo = float(stock.quantite_disponible) if stock else 0
                        raise InsufficientStockError(
                            f"Stock insuffisant pour article {article.code_article if article else ligne.article_id}. "
                            f"Disponible: {dispo} UDB, Demandé: {float(quantite_udb)} UDB"
                        )

                    # Déduire du stock source
                    quantite_avant = stock.quantite_disponible
                    stock.quantite_disponible -= quantite_udb
                    stock.quantite_udb -= quantite_udb

                    # Audit trail
                    AuditService.log_stock_modification(
                        db=db,
                        action="transfert_sortie",
                        article_id=ligne.article_id,
                        magasin_id=db_ot.magasin_source_id,
                        quantite_avant=quantite_avant,
                        quantite_apres=stock.quantite_disponible,
                        user_id=user_id,
                        raison=f"OT {db_ot.numero_ot} — sortie vers {db_ot.magasin_dest_id}"
                    )

                db_ot.statut = StatutOrdreTransfert.VALIDE
                db_ot.autorise_par = autorise_par
                db_ot.date_validation = datetime.now()

                # Auto-générer la bande de livraison
                try:
                    bande = BandeLivraisonService.create_bande_from_ordre_transfert(
                        db=db,
                        ot_id=db_ot.id,
                        prepare_par=autorise_par or "Système",
                        user_id=user_id
                    )
                except Exception as e:
                    # If bande creation fails, we still want to raise an error and rollback
                    raise BusinessRuleViolationError(f"Échec de génération automatique de la bande de livraison: {str(e)}")

            db.refresh(db_ot)
            invalidate_cache_pattern("magasin:ot:*")
            invalidate_cache_pattern("magasin:stocks:*")
            return db_ot
        except (BusinessRuleViolationError, InsufficientStockError):
            raise
        except Exception as e:
            db.rollback()
            raise BusinessRuleViolationError(f"Erreur validation OT: {str(e)}")

    @staticmethod
    def expedier(db: Session, ot_id: int) -> Optional[OrdreTransfert]:
        """Marque l'OT comme expédié (en transit physique)"""
        db_ot = OrdreTransfertService.get_by_id(db, ot_id)
        if not db_ot:
            return None
        if db_ot.statut != StatutOrdreTransfert.VALIDE:
            raise BusinessRuleViolationError("Seul un OT VALIDÉ peut être expédié")

        db_ot.statut = StatutOrdreTransfert.EN_TRANSIT
        db_ot.date_expedition = datetime.now()
        db.flush()
        db.refresh(db_ot)
        invalidate_cache_pattern("magasin:ot:*")
        return db_ot

    @staticmethod
    def receptionner(db: Session, ot_id: int, user_id: Optional[int] = None) -> Optional[OrdreTransfert]:
        """
        Réceptionne l'OT → STOCKE dans le magasin destination.
        Met à jour quantite_recue sur chaque ligne.
        """
        db_ot = OrdreTransfertService.get_by_id(db, ot_id)
        if not db_ot:
            return None
        if db_ot.statut not in (StatutOrdreTransfert.VALIDE, StatutOrdreTransfert.EN_TRANSIT):
            raise BusinessRuleViolationError("Seul un OT VALIDÉ ou EN_TRANSIT peut être réceptionné")

        try:
            with db.begin():
                for ligne in db_ot.lignes:
                    article = db.query(Article).filter(Article.id == ligne.article_id).first()
                    quantite_udb = ConversionService.convertir_vers_udb(
                        ligne.quantite, ligne.unite_mesure, article
                    )

                    # Ajouter au stock destination
                    stock_dest = StockService.get_stock(db, db_ot.magasin_dest_id, ligne.article_id)
                    if stock_dest:
                        quantite_avant = stock_dest.quantite_disponible
                        stock_dest.quantite_disponible += quantite_udb
                        stock_dest.quantite_udb += quantite_udb
                    else:
                        stock_dest = Stock(
                            magasin_id=db_ot.magasin_dest_id,
                            article_id=ligne.article_id,
                            quantite_disponible=quantite_udb,
                            quantite_udb=quantite_udb
                        )
                        db.add(stock_dest)
                        quantite_avant = Decimal('0')

                    # Mettre à jour la quantité reçue sur la ligne
                    ligne.quantite_recue = ligne.quantite

                    # Audit trail
                    AuditService.log_stock_modification(
                        db=db,
                        action="transfert_entree",
                        article_id=ligne.article_id,
                        magasin_id=db_ot.magasin_dest_id,
                        quantite_avant=quantite_avant,
                        quantite_apres=stock_dest.quantite_disponible,
                        user_id=user_id,
                        raison=f"OT {db_ot.numero_ot} — entrée depuis {db_ot.magasin_source_id}"
                    )

                db_ot.statut = StatutOrdreTransfert.RECEPTIONNE
                db_ot.date_reception = datetime.now()

            db.refresh(db_ot)
            invalidate_cache_pattern("magasin:ot:*")
            invalidate_cache_pattern("magasin:stocks:*")
            return db_ot
        except BusinessRuleViolationError:
            raise
        except Exception as e:
            db.rollback()
            raise BusinessRuleViolationError(f"Erreur réception OT: {str(e)}")

    @staticmethod
    def annuler(db: Session, ot_id: int, user_id: Optional[int] = None) -> Optional[OrdreTransfert]:
        """
        Annule un OT. Si le stock avait été déduit (VALIDE ou EN_TRANSIT),
        on reverse le stock au magasin source.
        """
        db_ot = OrdreTransfertService.get_by_id(db, ot_id)
        if not db_ot:
            return None
        if db_ot.statut == StatutOrdreTransfert.ANNULE:
            raise BusinessRuleViolationError("Cet OT est déjà annulé")
        if db_ot.statut == StatutOrdreTransfert.RECEPTIONNE:
            raise BusinessRuleViolationError("Un OT réceptionné ne peut pas être annulé")

        try:
            with db.begin():
                # Si validé ou en transit, reverser le stock au magasin source
                if db_ot.statut in (StatutOrdreTransfert.VALIDE, StatutOrdreTransfert.EN_TRANSIT):
                    for ligne in db_ot.lignes:
                        stock = StockService.get_stock(db, db_ot.magasin_source_id, ligne.article_id)
                        if stock:
                            article = db.query(Article).filter(Article.id == ligne.article_id).first()
                            quantite_udb = ConversionService.convertir_vers_udb(
                                ligne.quantite, ligne.unite_mesure, article
                            )
                            quantite_avant = stock.quantite_disponible
                            stock.quantite_disponible += quantite_udb
                            stock.quantite_udb += quantite_udb

                            AuditService.log_stock_modification(
                                db=db,
                                action="transfert_annulation",
                                article_id=ligne.article_id,
                                magasin_id=db_ot.magasin_source_id,
                                quantite_avant=quantite_avant,
                                quantite_apres=stock.quantite_disponible,
                                user_id=user_id,
                                raison=f"Annulation OT {db_ot.numero_ot}"
                            )

                db_ot.statut = StatutOrdreTransfert.ANNULE

            db.refresh(db_ot)
            invalidate_cache_pattern("magasin:ot:*")
            invalidate_cache_pattern("magasin:stocks:*")
            return db_ot
        except BusinessRuleViolationError:
            raise
        except Exception as e:
            db.rollback()
            raise BusinessRuleViolationError(f"Erreur annulation OT: {str(e)}")

