# app/main.py  Configuration Principale FastAPI KAMLOG
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from app.database import engine, Base
from app.routers import auth, tiers, transport, finance, parc, documents, alerts, magasin, gateway, transactions
from app.routers import goods_declaration, removal_slip, reception_mag3, suppliers, master_data
from app.config import settings
from app.utils.logger import setup_logger
from app.utils.monitoring import setup_monitoring
from app.utils.error_handler import setup_error_handlers


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup : initialiser logger, monitoring et vérifier connexion DB
    setup_logger()
    setup_monitoring(app)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    # Shutdown : fermer connexions
    await engine.dispose()


limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title="KAMLOG EM-ERP API",
    description="ERP Logistique Portuaire  Port de Douala",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    lifespan=lifespan,
)

# Rate limiting  protection brute force
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Setup error handlers
setup_error_handlers(app)

# CORS  autoriser le frontend Next.js
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "X-Requested-With"],
)

# Routers
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(tiers.router, prefix="/api/tiers", tags=["Tiers"])
app.include_router(transport.router, prefix="/api/transport", tags=["Transport"])
app.include_router(finance.router, prefix="/api/finance", tags=["Finance"])
app.include_router(parc.router, prefix="/api/parc", tags=["Parc"])
app.include_router(documents.router, prefix="/api/documents", tags=["Documents"])
app.include_router(alerts.router, prefix="/api/alerts", tags=["Alerts"])
app.include_router(magasin.router, tags=["K-Magasin"])
app.include_router(gateway.router, tags=["Gateway"])
app.include_router(transactions.router, prefix="/api/transactions", tags=["Transactions"])
app.include_router(goods_declaration.router, tags=["Goods Declaration"])
app.include_router(removal_slip.router, tags=["Removal Slip"])
app.include_router(reception_mag3.router, tags=["Reception Mag3"])
app.include_router(master_data.router, tags=["Master Data"])


@app.get('/api/health')
async def health_check():
    """Health check basique."""
    return {"status": "ok", "service": "KAMLOG EM-ERP", "version": "1.0.0"}


@app.get('/api/health/detailed')
async def detailed_health_check():
    """Health check détaillé avec vérification des dépendances."""
    checks = {
        "status": "ok",
        "service": "KAMLOG EM-ERP",
        "version": "1.0.0",
        "checks": {}
    }
    
    # Vérifier la base de données
    try:
        async with engine.begin() as conn:
            await conn.execute("SELECT 1")
        checks["checks"]["database"] = {"status": "ok", "message": "PostgreSQL connecté"}
    except Exception as e:
        checks["checks"]["database"] = {"status": "error", "message": str(e)}
        checks["status"] = "degraded"
    
    # Vérifier Redis (si configuré)
    try:
        import redis.asyncio as redis
        redis_client = await redis.from_url(settings.REDIS_URL)
        await redis_client.ping()
        await redis_client.close()
        checks["checks"]["redis"] = {"status": "ok", "message": "Redis connecté"}
    except Exception as e:
        checks["checks"]["redis"] = {"status": "error", "message": str(e)}
        checks["status"] = "degraded"
    
    # Vérifier MinIO (si configuré)
    try:
        from minio import Minio
        minio_client = Minio(
            settings.MINIO_ENDPOINT,
            access_key=settings.MINIO_ACCESS_KEY,
            secret_key=settings.MINIO_SECRET_KEY,
            secure=settings.MINIO_SECURE
        )
        minio_client.bucket_exists(settings.MINIO_BUCKET_DOCUMENTS)
        checks["checks"]["minio"] = {"status": "ok", "message": "MinIO connecté"}
    except Exception as e:
        checks["checks"]["minio"] = {"status": "error", "message": str(e)}
        checks["status"] = "degraded"
    
    return checks
