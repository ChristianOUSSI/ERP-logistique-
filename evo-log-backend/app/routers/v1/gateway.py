"""
Gateway router - manages external system integrations
"""
from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_gateway():
    """Get gateway integrations"""
    return {"message": "Gateway router - placeholder"}