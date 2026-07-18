# app/routers/v1/finance.py  Version 1 finance Router
from app.routers import finance as finance_v0

# Re-export the router for version 1
router = finance_v0.router

# Also re-export any other public items if needed
from app.routers.finance import *  # noqa: F401,F403
