"""
Port Performance router - manages port performance dashboard
"""
from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_port_performance():
    """Get port performance metrics"""
    return {"message": "Port Performance router - placeholder"}