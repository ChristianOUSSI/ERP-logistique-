# app/routers/v1/gateway.py  Version 1 gateway Router
from app.routers import gateway as gateway_v0

# Re-export the router for version 1
router = gateway_v0.router

# Also re-export any other public items if needed
from app.routers.gateway import *  # noqa: F401,F403
