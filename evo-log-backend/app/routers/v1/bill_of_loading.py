"""
Bill of Loading router - manages bill of lading documents
"""
from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_bill_of_loading():
    """Get bill of loading documents"""
    return {"message": "Bill of Loading router - placeholder"}