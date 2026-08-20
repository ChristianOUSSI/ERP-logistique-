"""
Suppliers router - manages supplier operations
"""
from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_suppliers():
    """Get suppliers"""
    return {"message": "Suppliers router - placeholder"}