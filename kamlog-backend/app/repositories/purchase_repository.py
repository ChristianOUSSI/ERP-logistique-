# app/repositories/purchase_repository.py
from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.purchase import FicheBesoin, StatutFicheBesoin
from app.repositories.base_repository import BaseRepository

class FicheBesoinRepository(BaseRepository[FicheBesoin]):
    def __init__(self):
        super().__init__(FicheBesoin)

    def get_by_demandeur(self, db: Session, demandeur_id: int) -> List[FicheBesoin]:
        return db.query(FicheBesoin).filter(FicheBesoin.demandeur_id == demandeur_id).all()

    def get_pending_approvals(self, db: Session) -> List[FicheBesoin]:
        return db.query(FicheBesoin).filter(FicheBesoin.statut == StatutFicheBesoin.EN_ATTENTE_APPROBATION).all()

    def get_by_matricule(self, db: Session, matricule: str) -> Optional[FicheBesoin]:
        return db.query(FicheBesoin).filter(FicheBesoin.matricule == matricule).first()
