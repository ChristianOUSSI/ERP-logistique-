"""
Admin Agency router - manages agency administration
"""
from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_admin_agencies():
    """Get admin agencies"""
    return {"message": "Admin Agency router - placeholder"}