# app/routers/v1/incidents.py  Version 1 incidents Router
from app.routers import incidents as incidents_v0

# Re-export the router for version 1
router = incidents_v0.router

# Also re-export any other public items if needed
from app.routers.incidents import *  # noqa: F401,F403
