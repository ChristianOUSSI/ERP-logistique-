"""
Purchase router - manages purchasing operations
"""
from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_purchases():
    """Get purchases"""
    return {"message": "Purchase router - placeholder"}