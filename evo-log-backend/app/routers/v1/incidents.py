"""
Incidents router - manages incident reporting and tracking
"""
from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_incidents():
    """Get incidents"""
    return {"message": "Incidents router - placeholder"}