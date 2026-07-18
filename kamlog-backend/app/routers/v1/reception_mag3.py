# app/routers/v1/reception_mag3.py  Version 1 reception_mag3 Router
from app.routers import reception_mag3 as reception_mag3_v0

# Re-export the router for version 1
router = reception_mag3_v0.router

# Also re-export any other public items if needed
from app.routers.reception_mag3 import *  # noqa: F401,F403
