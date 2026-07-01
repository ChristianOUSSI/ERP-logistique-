from sqlalchemy.orm import Session
from app.models.agency import Agency
from app.repositories.base_repository import BaseRepository
from typing import Optional

class AgencyRepository(BaseRepository[Agency]):
    def __init__(self):
        super().__init__(Agency)

    def get_by_code(self, db: Session, code: str) -> Optional[Agency]:
        return db.query(self.model).filter(self.model.code == code).first()

    def get_active_agencies(self, db: Session):
        return db.query(self.model).filter(self.model.is_active == True).all()
