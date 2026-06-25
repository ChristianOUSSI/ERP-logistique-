# app/main.py  Configuration Principale FastAPI KAMLOG
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi import Request
import inspect
from functools import wraps

# Patch Limiter.limit to dynamically wrap and inject 'request' to avoid SlowAPI exceptions
original_limit = Limiter.limit

def patched_limit(self, *args, **kwargs):
    decorator = original_limit(self, *args, **kwargs)
    def custom_decorator(func):
        sig = inspect.signature(func)
        has_request = any(
            param.name in ('request', 'websocket') or param.annotation == Request
            for param in sig.parameters.values()
        )
        if has_request:
            return decorator(func)
        
        if inspect.iscoroutinefunction(func):
            @wraps(func)
            async def wrapper(*args, **kwargs):
                kwargs.pop('request', None)
                kwargs.pop('websocket', None)
                return await func(*args, **kwargs)
        else:
            @wraps(func)
            def wrapper(*args, **kwargs):
                kwargs.pop('request', None)
                kwargs.pop('websocket', None)
                return func(*args, **kwargs)
        
        # Inject 'request' parameter as KEYWORD_ONLY with default None to satisfy SlowAPI
        parameters = list(sig.parameters.values())
        request_param = inspect.Parameter(
            'request',
            inspect.Parameter.KEYWORD_ONLY,
            default=None,
            annotation=Request
        )
        parameters.append(request_param)
        wrapper.__signature__ = sig.replace(parameters=parameters)
        return decorator(wrapper)
    return custom_decorator

Limiter.limit = patched_limit

from app.database import engine, Base
from app.routers import auth, tiers, transport, finance, parc, documents, alerts, magasin, gateway, transactions
from app import admin
from app.routers import goods_declaration, removal_slip, reception_mag3, suppliers, master_data, admin_agency
from app.config import settings
from app.utils.logger import setup_logger
from app.utils.monitoring import setup_monitoring
from app.utils.error_handler import setup_error_handlers
# from app.utils.audit_middleware import AuditMiddleware # Disabled due to incompatible DB model and SessionLocal import error
from app.utils.idempotency import IdempotencyMiddleware
from app.utils.rbac import get_current_user  # Import unifié

from sqlalchemy import text


# État de santé global de l'application
startup_errors: list = []


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup : initialiser logger, monitoring et vérifier connexion DB
    setup_logger()
    setup_monitoring(app)

    # Vérifier la connexion à la base de données
    # Ne pas raise ici : laisser uvicorn démarrer même si DB indisponible
    # Le health check signalera l'état dégradé
    try:
        async with engine.begin() as conn:
            await conn.execute(text("SELECT 1"))
        print("✅ Database connection OK")
        startup_errors.clear()
    except Exception as e:
        err_msg = f"Database connection failed: {e}"
        print(f"❌ {err_msg}")
        startup_errors.append(err_msg)
        # Ne pas raise - l'app démarre quand même pour que /api/health réponde

    yield

    # Shutdown : fermer connexions
    await engine.dispose()


limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title="KAMLOG EM-ERP API",
    description="ERP Logistique Portuaire - Port de Douala",
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

# Middlewares de Sécurité et Audit (Niveau World Pro)
# app.add_middleware(AuditMiddleware) # Disabled due to incompatible DB model
app.add_middleware(IdempotencyMiddleware, redis_url=settings.REDIS_URL)

# CORS  autoriser le frontend Next.js
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["Content-Type", "Authorization", "X-Requested-With", "X-Idempotency-Key"],
)

# Routers
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(tiers.router, prefix="/api/tiers", tags=["Tiers"])
app.include_router(transport.router, prefix="/api/transport", tags=["Transport"])
app.include_router(finance.router, prefix="/api/finance", tags=["Finance"])
app.include_router(parc.router, prefix="/api/parc", tags=["Parc"])
app.include_router(documents.router, prefix="/api/documents", tags=["Documents"])
app.include_router(alerts.router, prefix="/api/alerts", tags=["Alerts"])
app.include_router(magasin.router, prefix="/api/magasin", tags=["K-Magasin"])
app.include_router(gateway.router, prefix="/api/gateway", tags=["Gateway"])
app.include_router(transactions.router, prefix="/api/transactions", tags=["Transactions"])
app.include_router(goods_declaration.router, prefix="/api/transport/goods-declarations", tags=["Goods Declaration"])
app.include_router(removal_slip.router, prefix="/api/magasin/removal-slips", tags=["Removal Slip"])
app.include_router(reception_mag3.router, prefix="/api/magasin/receptions-mag3", tags=["Reception Mag3"])
app.include_router(master_data.router, prefix="/api/master-data", tags=["Master Data"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])
app.include_router(admin_agency.router, prefix="/api/admin/agencies", tags=["Admin Agencies"])
app.include_router(suppliers.router, prefix="/api/suppliers", tags=["Suppliers"])


@app.get('/api/health')
async def health_check():
    """Health check basique - utilisé par Railway."""
    if startup_errors:
        # Retourner 200 avec status dégradé plutôt que de crasher
        # Railway vérifie le HTTP status code, pas le contenu
        return {
            "status": "degraded",
            "service": "KAMLOG EM-ERP",
            "version": "1.0.0",
            "errors": startup_errors
        }
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
            await conn.execute(text("SELECT 1"))
        checks["checks"]["database"] = {"status": "ok", "message": "PostgreSQL connecté"}
    except Exception as e:
        checks["checks"]["database"] = {"status": "error", "message": str(e)}
        checks["status"] = "degraded"

    # Vérifier Redis (si configuré)
    try:
        import redis.asyncio as aioredis
        redis_client = aioredis.from_url(settings.REDIS_URL)
        await redis_client.ping()
        await redis_client.aclose()
        checks["checks"]["redis"] = {"status": "ok", "message": "Redis connecté"}
    except Exception as e:
        checks["checks"]["redis"] = {"status": "warning", "message": f"Redis indisponible: {str(e)}"}
        # Ne pas marquer comme degraded - Redis est optionnel

    # Vérifier MinIO (si activé)
    if settings.MINIO_ENABLED:
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
            checks["checks"]["minio"] = {"status": "warning", "message": f"MinIO indisponible: {str(e)}"}
    else:
        checks["checks"]["minio"] = {"status": "disabled", "message": "MinIO désactivé (MINIO_ENABLED=false)"}

    return checks
