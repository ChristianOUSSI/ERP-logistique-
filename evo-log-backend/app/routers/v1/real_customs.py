"""
Real Customs router - manages SYDONIA+ and GUICHET UNIQUE integration
"""
from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_real_customs():
    """Get real customs information"""
    return {"message": "Real Customs router - placeholder"}