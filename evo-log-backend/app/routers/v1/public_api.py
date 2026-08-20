"""
Public API router - manages public endpoints without authentication
"""
from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_public():
    """Get public information"""
    return {"message": "Public API router - placeholder"}