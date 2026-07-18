# app/routers/v1/removal_slip.py  Version 1 removal_slip Router
from app.routers import removal_slip as removal_slip_v0

# Re-export the router for version 1
router = removal_slip_v0.router

# Also re-export any other public items if needed
from app.routers.removal_slip import *  # noqa: F401,F403
