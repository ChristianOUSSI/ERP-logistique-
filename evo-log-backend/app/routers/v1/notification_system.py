"""
Notification System router - manages multi-channel notifications
"""
from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_notification_system():
    """Get notification system information"""
    return {"message": "Notification System router - placeholder"}