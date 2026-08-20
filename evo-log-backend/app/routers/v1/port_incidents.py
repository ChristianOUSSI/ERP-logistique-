"""
Port Incidents router - manages port incident reporting
"""
from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_port_incidents():
    """Get port incidents information"""
    return {"message": "Port Incidents router - placeholder"}