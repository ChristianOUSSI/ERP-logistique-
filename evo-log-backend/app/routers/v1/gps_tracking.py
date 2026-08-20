"""
GPS Tracking router - manages real-time fleet tracking
"""
from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_gps_tracking():
    """Get GPS tracking information"""
    return {"message": "GPS Tracking router - placeholder"}