# app/routers/v1/admin_agency.py  Version 1 admin_agency Router
from app.routers import admin_agency as admin_agency_v0

# Re-export the router for version 1
router = admin_agency_v0.router

# Also re-export any other public items if needed
from app.routers.admin_agency import *  # noqa: F401,F403
