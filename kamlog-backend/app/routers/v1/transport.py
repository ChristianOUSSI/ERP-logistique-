# app/routers/v1/transport.py  Version 1 transport Router
from app.routers import transport as transport_v0

# Re-export the router for version 1
router = transport_v0.router

# Also re-export any other public items if needed
from app.routers.transport import *  # noqa: F401,F403
