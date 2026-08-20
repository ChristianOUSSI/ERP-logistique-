"""
Admin router - manages system administration
"""
from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_admin():
    """Get admin operations"""
    return {"message": "Admin router - placeholder"}