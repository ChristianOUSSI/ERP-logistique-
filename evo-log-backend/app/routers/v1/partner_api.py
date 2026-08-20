"""
Partner API router - manages B2B integration API
"""
from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_partner_api():
    """Get partner API information"""
    return {"message": "Partner API router - placeholder"}