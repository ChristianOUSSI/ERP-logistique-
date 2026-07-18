# app/routers/v1/public_api.py  Version 1 public_api Router
from app.routers import public_api as public_api_v0

# Re-export the router for version 1
router = public_api_v0.router

# Also re-export any other public items if needed
from app.routers.public_api import *  # noqa: F401,F403
