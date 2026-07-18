# app/routers/v1/admin.py  Version 1 admin Router
from app.routers import admin as admin_v0

# Re-export the router for version 1
router = admin_v0.router

# Also re-export any other public items if needed
from app.routers.admin import *  # noqa: F401,F403
