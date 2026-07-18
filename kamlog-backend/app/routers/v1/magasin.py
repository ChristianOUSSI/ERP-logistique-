# app/routers/v1/magasin.py  Version 1 magasin Router
from app.routers import magasin as magasin_v0

# Re-export the router for version 1
router = magasin_v0.router

# Also re-export any other public items if needed
from app.routers.magasin import *  # noqa: F401,F403
