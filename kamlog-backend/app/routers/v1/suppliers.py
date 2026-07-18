# app/routers/v1/suppliers.py  Version 1 suppliers Router
from app.routers import suppliers as suppliers_v0

# Re-export the router for version 1
router = suppliers_v0.router

# Also re-export any other public items if needed
from app.routers.suppliers import *  # noqa: F401,F403
