# app/services/purchase_service.py
from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.purchase import FicheBesoin, StatutFicheBesoin
from app.schemas.purchase import FicheBesoinCreate, FicheBesoinUpdate
from app.repositories.purchase_repository import FicheBesoinRepository
from app.exceptions import ResourceNotFoundError, BusinessRuleViolationError

class FicheBesoinService:
    def __init__(self):
        self.repo = FicheBesoinRepository()

    def get_all(self, db: Session, skip: int = 0, limit: int = 100) -> List[FicheBesoin]:
        return self.repo.get_all(db, skip, limit)

    def get_by_id(self, db: Session, fiche_id: int) -> FicheBesoin:
        fiche = self.repo.get_by_id(db, fiche_id)
        if not fiche:
            raise ResourceNotFoundError("Fiche de besoin non trouvée.")
        return fiche

    def create(self, db: Session, fiche_data: FicheBesoinCreate, demandeur_id: int, cree_par: str) -> FicheBesoin:
        if self.repo.get_by_matricule(db, fiche_data.matricule):
            raise BusinessRuleViolationError("Une fiche de besoin avec ce matricule existe déjà.")
        
        db_fiche = FicheBesoin(
            **fiche_data.model_dump(),
            demandeur_id=demandeur_id,
            cree_par=cree_par
        )
        return self.repo.create(db, db_fiche)

    def update(self, db: Session, fiche_id: int, fiche_data: FicheBesoinUpdate) -> FicheBesoin:
        db_fiche = self.get_by_id(db, fiche_id)
        
        # Empêcher la modification si la fiche n'est pas en brouillon
        if db_fiche.statut != StatutFicheBesoin.BROUILLON:
            raise BusinessRuleViolationError("Seules les fiches en brouillon peuvent être modifiées.")

        update_data = fiche_data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_fiche, key, value)
            
        return self.repo.update(db, db_fiche)

    def delete(self, db: Session, fiche_id: int) -> FicheBesoin:
        db_fiche = self.get_by_id(db, fiche_id)
        
        # Empêcher la suppression si la fiche n'est pas en brouillon ou rejetée
        if db_fiche.statut not in [StatutFicheBesoin.BROUILLON, StatutFicheBesoin.REJETEE]:
            raise BusinessRuleViolationError("Seules les fiches en brouillon ou rejetées peuvent être supprimées.")

        return self.repo.delete(db, db_fiche)

    def get_by_demandeur(self, db: Session, demandeur_id: int) -> List[FicheBesoin]:
        return self.repo.get_by_demandeur(db, demandeur_id)

    def get_pending_approvals(self, db: Session) -> List[FicheBesoin]:
        return self.repo.get_pending_approvals(db)
