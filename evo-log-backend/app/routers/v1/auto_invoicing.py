"""
Auto Invoicing router - manages automatic OHADA invoicing
"""
from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_auto_invoicing():
    """Get auto invoicing information"""
    return {"message": "Auto Invoicing router - placeholder"}