from sqlalchemy.orm import Session
from app.repositories.agency_repository import AgencyRepository
from app.schemas.agency import AgencyCreate, AgencyUpdate
from app.utils.error_handler import BadRequestException, NotFoundException

class AgencyService:
    def __init__(self):
        self.repository = AgencyRepository()

    def create_agency(self, db: Session, agency_in: AgencyCreate):
        existing = self.repository.get_by_code(db, agency_in.code)
        if existing:
            raise BadRequestException(f"Une agence avec le code {agency_in.code} existe déjà")
        return self.repository.create(db, agency_in.model_dump())

    def get_agencies(self, db: Session, skip: int = 0, limit: int = 100):
        return self.repository.get_all(db, skip=skip, limit=limit)

    def get_agency(self, db: Session, agency_id: int):
        agency = self.repository.get(db, agency_id)
        if not agency:
            raise NotFoundException("Agence non trouvée")
        return agency

    def update_agency(self, db: Session, agency_id: int, agency_in: AgencyUpdate):
        agency = self.get_agency(db, agency_id)
        return self.repository.update(db, agency, agency_in.model_dump(exclude_unset=True))

    def delete_agency(self, db: Session, agency_id: int):
        agency = self.get_agency(db, agency_id)
        return self.repository.delete(db, agency_id)
