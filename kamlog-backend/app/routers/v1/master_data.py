# app/routers/v1/master_data.py  Version 1 master_data Router
from app.routers import master_data as master_data_v0

# Re-export the router for version 1
router = master_data_v0.router

# Also re-export any other public items if needed
from app.routers.master_data import *  # noqa: F401,F403
