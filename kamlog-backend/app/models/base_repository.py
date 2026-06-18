from typing import Generic, TypeVar, List, Optional
from sqlalchemy.orm import Session
from app.models.base import Base

T = TypeVar("T", bound=Base)

class BaseAgencyRepository(Generic[T]):
    """Repository de base qui force le filtrage par agency_id."""
    def __init__(self, model: T, db: Session, agency_id: int):
        self.model = model
        self.db = db
        self.agency_id = agency_id

    def get_all(self, skip: int = 0, limit: int = 100) -> List[T]:
        return self.db.query(self.model).filter(
            self.model.agency_id == self.agency_id
        ).offset(skip).limit(limit).all()

    def get_by_id(self, id: int) -> Optional[T]:
        return self.db.query(self.model).filter(
            self.model.id == id,
            self.model.agency_id == self.agency_id
        ).first()

    def create(self, obj_in: dict) -> T:
        obj_in["agency_id"] = self.agency_id # Injection forcée
        db_obj = self.model(**obj_in)
        self.db.add(db_obj)
        self.db.commit()
        self.db.refresh(db_obj)
        return db_obj