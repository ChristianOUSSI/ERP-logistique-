# app/services/goods_declaration_service.py - Service pour les déclarations de marchandises
from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.goods_declaration import GoodsDeclaration, LigneGoodsDeclaration, StatutGoodsDeclaration
from app.schemas.goods_declaration import GoodsDeclarationCreate, GoodsDeclarationUpdate, LigneGoodsDeclarationCreate
import uuid


class GoodsDeclarationService:
    """Service pour la gestion des déclarations de marchandises"""
    
    @staticmethod
    def get_all_goods_declarations(db: Session, skip: int = 0, limit: int = 100) -> List[GoodsDeclaration]:
        """Récupère toutes les déclarations de marchandises"""
        return db.query(GoodsDeclaration).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_goods_declaration(db: Session, declaration_id: int) -> Optional[GoodsDeclaration]:
        """Récupère une déclaration de marchandises par son ID"""
        return db.query(GoodsDeclaration).filter(GoodsDeclaration.id == declaration_id).first()
    
    @staticmethod
    def get_goods_declarations_by_statut(db: Session, statut: str) -> List[GoodsDeclaration]:
        """Récupère les déclarations par statut"""
        return db.query(GoodsDeclaration).filter(GoodsDeclaration.statut == statut).all()
    
    @staticmethod
    def create_goods_declaration(db: Session, declaration: GoodsDeclarationCreate, user: str) -> GoodsDeclaration:
        """Crée une nouvelle déclaration de marchandises"""
        # Générer un numéro de déclaration unique
        numero_declaration = f"GD-{uuid.uuid4().hex[:8].upper()}"
        
        db_declaration = GoodsDeclaration(
            numero_declaration=numero_declaration,
            code_article=declaration.code_article,
            code_transit=declaration.code_transit,
            description=declaration.description,
            quantite=declaration.quantite,
            unite=declaration.unite,
            poids_kg=declaration.poids_kg,
            valeur_xaf=declaration.valeur_xaf,
            origine=declaration.origine,
            destination=declaration.destination,
            numero_conteneur=declaration.numero_conteneur,
            observations=declaration.observations,
            statut=StatutGoodsDeclaration.BROUILLON,
            cree_par=user
        )
        
        db.add(db_declaration)
        db.commit()
        db.refresh(db_declaration)
        
        # Ajouter les lignes si fournies
        if declaration.lignes:
            for ligne_data in declaration.lignes:
                ligne = LigneGoodsDeclaration(
                    declaration_id=db_declaration.id,
                    article_id=ligne_data.article_id,
                    quantite_declaree=ligne_data.quantite_declaree,
                    unite_mesure=ligne_data.unite_mesure,
                    poids_kg=ligne_data.poids_kg,
                    valeur_unitaire_xaf=ligne_data.valeur_unitaire_xaf,
                    valeur_totale_xaf=ligne_data.valeur_totale_xaf
                )
                db.add(ligne)
            db.commit()
            db.refresh(db_declaration)
        
        return db_declaration
    
    @staticmethod
    def update_goods_declaration(db: Session, declaration_id: int, declaration: GoodsDeclarationUpdate) -> Optional[GoodsDeclaration]:
        """Met à jour une déclaration de marchandises"""
        db_declaration = GoodsDeclarationService.get_goods_declaration(db, declaration_id)
        if not db_declaration:
            return None
        
        update_data = declaration.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_declaration, field, value)
        
        db.commit()
        db.refresh(db_declaration)
        return db_declaration
    
    @staticmethod
    def delete_goods_declaration(db: Session, declaration_id: int) -> bool:
        """Supprime une déclaration de marchandises"""
        db_declaration = GoodsDeclarationService.get_goods_declaration(db, declaration_id)
        if not db_declaration:
            return False
        
        db.delete(db_declaration)
        db.commit()
        return True
    
    @staticmethod
    def add_ligne_goods_declaration(db: Session, declaration_id: int, ligne: LigneGoodsDeclarationCreate) -> LigneGoodsDeclaration:
        """Ajoute une ligne à une déclaration de marchandises"""
        db_ligne = LigneGoodsDeclaration(
            declaration_id=declaration_id,
            article_id=ligne.article_id,
            quantite_declaree=ligne.quantite_declaree,
            unite_mesure=ligne.unite_mesure,
            poids_kg=ligne.poids_kg,
            valeur_unitaire_xaf=ligne.valeur_unitaire_xaf,
            valeur_totale_xaf=ligne.valeur_totale_xaf
        )
        
        db.add(db_ligne)
        db.commit()
        db.refresh(db_ligne)
        return db_ligne
