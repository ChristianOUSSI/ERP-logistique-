# app/routers/v1/goods_declaration.py  Version 1 goods_declaration Router
from app.routers import goods_declaration as goods_declaration_v0

# Re-export the router for version 1
router = goods_declaration_v0.router

# Also re-export any other public items if needed
from app.routers.goods_declaration import *  # noqa: F401,F403
