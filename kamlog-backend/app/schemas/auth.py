# app/schemas/auth.py  Schémas Authentification
from pydantic import BaseModel, EmailStr, Field, ConfigDict
from datetime import datetime
from typing import Optional, List
from pydantic import field_validator


class UserBase(BaseModel):
    email: EmailStr = Field(..., example="utilisateur@example.com")
    username: str = Field(
        ..., 
        min_length=3, 
        max_length=50, 
        pattern=r"^[a-zA-Z0-9_.-]+$", 
        example="jdupont"
    )
    full_name: Optional[str] = Field(None, max_length=200, example="Jean Dupont")
    roles: List[str] = ["gate_agent"]
    agency_id: Optional[str] = Field(None, max_length=50, example="AG001")


class UserCreate(UserBase):
    password: str = Field(
        ..., 
        min_length=8, 
        max_length=128,
        example="MotDePasseSecur123!"
    )


class UserLogin(BaseModel):
    username: str = Field(..., example="jdupont")
    password: str = Field(..., example="MotDePasseSecur123!")


class UserResponse(UserBase):
    id: int = Field(..., example=1)
    is_active: bool = Field(..., example=True)
    created_at: datetime = Field(..., example="2026-07-15T10:30:00Z")

    model_config = ConfigDict(from_attributes=True)

    @field_validator('roles', mode='before')
    def extract_role_codes(cls, v):
        if not v:
            return []
        if isinstance(v, list) and len(v) > 0 and isinstance(v[0], str):
            return v
        return [r.code for r in v]


class Token(BaseModel):
    access_token: str = Field(..., example="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
    refresh_token: str = Field(..., example="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
    token_type: str = "bearer"
    expires_in: int = Field(..., example=1800)


class TokenPayload(BaseModel):
    sub: str = Field(..., example="1")
    exp: int = Field(..., example=1768422600)
