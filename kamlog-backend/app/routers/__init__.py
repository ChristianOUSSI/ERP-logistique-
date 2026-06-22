# app/routers  Import tous les routers
from app.routers import auth, tiers, transport, finance, parc, documents, alerts, magasin, gateway, transactions
from app.routers import goods_declaration, removal_slip, reception_mag3, suppliers, master_data

__all__ = ["auth", "tiers", "transport", "finance", "parc", "documents", "alerts", "magasin", "gateway", "transactions", "goods_declaration", "removal_slip", "reception_mag3", "suppliers", "master_data"]
