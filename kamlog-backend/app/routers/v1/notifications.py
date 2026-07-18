# app/routers/v1/notifications.py  Version 1 notifications Router
from app.routers import notifications as notifications_v0

# Re-export the router for version 1
router = notifications_v0.router

# Also re-export any other public items if needed
from app.routers.notifications import *  # noqa: F401,F403
