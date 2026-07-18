# app/routers/v1/purchase.py  Version 1 purchase Router
from app.routers import purchase as purchase_v0

# Re-export the router for version 1
router = purchase_v0.router

# Also re-export any other public items if needed
from app.routers.purchase import *  # noqa: F401,F403
