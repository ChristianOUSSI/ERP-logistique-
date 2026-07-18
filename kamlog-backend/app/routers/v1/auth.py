# app/routers/v1/auth.py  Version 1 auth Router
from app.routers import auth as auth_v0

# Re-export the router for version 1
router = auth_v0.router

# Also re-export any other public items if needed
from app.routers.auth import *  # noqa: F401,F403
