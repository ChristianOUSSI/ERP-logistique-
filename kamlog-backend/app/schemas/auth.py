# app/schemas/auth.py  Schémas Authentification
from pydantic import BaseModel, EmailStr, Field, ConfigDict
from datetime import datetime
from typing import Optional
from app.models.user import Role


from typing import Optional, List

class UserBase(BaseModel):
    email: str
    username: str = Field(..., min_length=3, max_length=50)
    full_name: Optional[str] = Field(None, max_length=200)
    roles: List[str] = ["gate_agent"]
    agency_id: Optional[str] = None


class UserCreate(UserBase):
    password: str = Field(..., min_length=8)


class UserLogin(BaseModel):
    username: str
    password: str


from pydantic import field_validator

class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

    @field_validator('roles', mode='before')
    def extract_role_codes(cls, v):
        if not v:
            return []
        if isinstance(v, list) and len(v) > 0 and isinstance(v[0], str):
            return v
        return [r.code for r in v]


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int


class TokenPayload(BaseModel):
    sub: str
    exp: int
