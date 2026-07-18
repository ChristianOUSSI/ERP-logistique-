from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class BillOfLoadingBase(BaseModel):
    bol_number: str = Field(..., max_length=50)
    vessel_name: Optional[str] = None
    voyage_number: Optional[str] = None
    port_of_loading: Optional[str] = None
    port_of_discharge: Optional[str] = None
    status: str = Field(default="draft", max_length=20)
    total_quantity: Optional[float] = None
    notes: Optional[str] = None


class BillOfLoadingCreate(BillOfLoadingBase):
    pass


class BillOfLoadingUpdate(BaseModel):
    vessel_name: Optional[str] = None
    voyage_number: Optional[str] = None
    port_of_loading: Optional[str] = None
    port_of_discharge: Optional[str] = None
    status: Optional[str] = None
    total_quantity: Optional[float] = None
    notes: Optional[str] = None


class BillOfLoadingInDBBase(BillOfLoadingBase):
    id: int
    date: datetime
    class Config:
        orm_mode = True


class BillOfLoading(BillOfLoadingInDBBase):
    pass
