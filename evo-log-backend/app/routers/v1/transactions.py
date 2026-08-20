"""
Transactions router - manages commercial transactions
"""
from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_transactions():
    """Get transactions"""
    return {"message": "Transactions router - placeholder"}