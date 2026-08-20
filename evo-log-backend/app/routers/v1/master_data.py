"""
Master Data router - manages reference data
"""
from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_master_data():
    """Get master data"""
    return {"message": "Master Data router - placeholder"}