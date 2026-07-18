# app/routers/v1/alerts.py  Version 1 alerts Router
from app.routers import alerts as alerts_v0

# Re-export the router for version 1
router = alerts_v0.router

# Also re-export any other public items if needed
from app.routers.alerts import *  # noqa: F401,F403
