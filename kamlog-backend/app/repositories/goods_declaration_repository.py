# app/repositories/goods_declaration_repository.py - Repository pour les déclarations de marchandises
from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.goods_declaration import GoodsDeclaration, LigneGoodsDeclaration, StatutGoodsDeclaration


class GoodsDeclarationRepository:
    """Repository pour les déclarations de marchandises"""
    
    @staticmethod
    def get_all(db: Session, skip: int = 0, limit: int = 100) -> List[GoodsDeclaration]:
        """Récupère toutes les déclarations de marchandises"""
        return db.query(GoodsDeclaration).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_by_id(db: Session, declaration_id: int) -> Optional[GoodsDeclaration]:
        """Récupère une déclaration par son ID"""
        return db.query(GoodsDeclaration).filter(GoodsDeclaration.id == declaration_id).first()
    
    @staticmethod
    def get_by_numero(db: Session, numero: str) -> Optional[GoodsDeclaration]:
        """Récupère une déclaration par son numéro"""
        return db.query(GoodsDeclaration).filter(GoodsDeclaration.numero_declaration == numero).first()
    
    @staticmethod
    def get_by_statut(db: Session, statut: str) -> List[GoodsDeclaration]:
        """Récupère les déclarations par statut"""
        return db.query(GoodsDeclaration).filter(GoodsDeclaration.statut == statut).all()
    
    @staticmethod
    def get_by_article(db: Session, article_id: int) -> List[GoodsDeclaration]:
        """Récupère les déclarations par article"""
        return db.query(GoodsDeclaration).filter(GoodsDeclaration.article_id == article_id).all()
    
    @staticmethod
    def create(db: Session, declaration: GoodsDeclaration) -> GoodsDeclaration:
        """Crée une nouvelle déclaration de marchandises"""
        db.add(declaration)
        db.commit()
        db.refresh(declaration)
        return declaration
    
    @staticmethod
    def update(db: Session, declaration: GoodsDeclaration) -> GoodsDeclaration:
        """Met à jour une déclaration de marchandises"""
        db.commit()
        db.refresh(declaration)
        return declaration
    
    @staticmethod
    def delete(db: Session, declaration_id: int) -> bool:
        """Supprime une déclaration de marchandises"""
        declaration = GoodsDeclarationRepository.get_by_id(db, declaration_id)
        if not declaration:
            return False
        db.delete(declaration)
        db.commit()
        return True
    
    @staticmethod
    def get_lignes(db: Session, declaration_id: int) -> List[LigneGoodsDeclaration]:
        """Récupère les lignes d'une déclaration"""
        return db.query(LigneGoodsDeclaration).filter(LigneGoodsDeclaration.declaration_id == declaration_id).all()
    
    @staticmethod
    def add_ligne(db: Session, ligne: LigneGoodsDeclaration) -> LigneGoodsDeclaration:
        """Ajoute une ligne à une déclaration"""
        db.add(ligne)
        db.commit()
        db.refresh(ligne)
        return ligne
    
    @staticmethod
    def delete_ligne(db: Session, ligne_id: int) -> bool:
        """Supprime une ligne de déclaration"""
        ligne = db.query(LigneGoodsDeclaration).filter(LigneGoodsDeclaration.id == ligne_id).first()
        if not ligne:
            return False
        db.delete(ligne)
        db.commit()
        return True
