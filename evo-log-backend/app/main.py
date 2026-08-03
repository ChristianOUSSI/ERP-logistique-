# app/main.py  Configuration Principale FastAPI EVO-LOG





from contextlib import asynccontextmanager

from fastapi import FastAPI

from prometheus_fastapi_instrumentator import Instrumentator

from fastapi.middleware.cors import CORSMiddleware

from slowapi import Limiter, _rate_limit_exceeded_handler

from slowapi.util import get_remote_address

from slowapi.errors import RateLimitExceeded

from fastapi import Request

import inspect

import asyncio

from functools import wraps

from typing import Optional



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

from app.routers.v1 import auth, tiers, transport, finance, parc, acconage, documents, alerts, magasin, gateway, transactions, admin

from app.routers.v1 import goods_declaration, removal_slip, reception_mag3, suppliers, master_data, admin_agency, notifications, purchase, incidents, public_api, rh

from app.routers.v1 import bill_of_loading, qhse, new_k_modules, ai_assistant

from app.routers import rh

from app.config import settings

try:
    import sentry_sdk
    from sentry_sdk.integrations.asgi import SentryAsgiMiddleware
    from sentry_sdk.integrations.sqlalchemy import SqlalchemyIntegration
    from sentry_sdk.integrations.redis import RedisIntegration
    try:
        from sentry_sdk.integrations.celery import CeleryIntegration
    except Exception:
        CeleryIntegration = None
except Exception:
    sentry_sdk = None

from app.utils.logger import setup_logger
from app.utils.monitoring import setup_monitoring

from app.utils.error_handler import setup_error_handlers

from app.utils.rate_limiting import limiter

from app.utils.audit_middleware import AuditMiddleware

from app.utils.idempotency import IdempotencyMiddleware

from app.utils.rbac import get_current_user  # Import unifi

from app.utils.tracing import TracingMiddleware  # Nouveau middleware de traage

from app.services.events import event_service  # Service d'vnements en temps rel



from sqlalchemy import text





# tat de sant global de l'application

startup_errors: list = []

heartbeat_task: Optional[asyncio.Task] = None





@asynccontextmanager

async def lifespan(app: FastAPI):

    # Startup : initialiser logger et vrifier connexion DB

    setup_logger()



    # Vrifier la connexion  la base de donnes (sync engine dans executor)

    # Ne pas raise ici : laisser uvicorn dmarrer mme si DB indisponible

    # Le health check signalera l'tat dgrad

    try:

        def check_db():

            with engine.connect() as conn:

                conn.execute(text("SELECT 1"))

        await asyncio.to_thread(check_db)

        print(" ' Database connection OK")

        startup_errors.clear()

        # Auto-seed database records if needed
        try:
            from scripts.seed_data import seed_all
            await asyncio.to_thread(seed_all, False)
            print(" Auto-seeding completed successfully!")
        except Exception as seed_err:
            print(f" Auto-seeding notice: {seed_err}")

        # Initialize default currencies for multicurrency module
        try:
            from app.services.multicurrency_service import MulticurrencyService
            from app.database import SessionLocal
            # Create a database session for initialization
            db = SessionLocal()
            mc_service = MulticurrencyService(db)
            mc_service.initialize_default_currencies()
            db.close()
            print(" Default currencies initialized successfully!")
        except Exception as mc_err:
            print(f" Multicurrency initialization notice: {mc_err}")
    except Exception as e:

        err_msg = f"Database connection failed: {e}"

        print(f"L' {err_msg}")

        startup_errors.append(err_msg)

        # Ne pas raise - l'app dmarre quand mme pour que /api/health rponde



    # Start heartbeat task for WebSocket connections

    global heartbeat_task

    heartbeat_task = asyncio.create_task(_heartbeat_loop())



    yield



    # Shutdown : fermer connexions

    engine.dispose()



    # Stop heartbeat task

    if heartbeat_task:

        heartbeat_task.cancel()

        try:

            await heartbeat_task

        except asyncio.CancelledError:

            pass





async def _heartbeat_loop():

    """Background task to send periodic heartbeats to WebSocket connections"""

    while True:

        try:

            await asyncio.sleep(30)  # Send heartbeat every 30 seconds

            await event_service.broadcast_heartbeat()

            logger.debug("Sent WebSocket heartbeat")

        except asyncio.CancelledError:

            break

        except Exception as e:

            logger.error(f"Error in heartbeat loop: {e}")

            await asyncio.sleep(5)  # Wait before retrying





app = FastAPI(

    title="EVO-LOG SaaS Platform API",

    description="""Plateforme ERP Logistique SaaS Multi-Entreprises (Version 1.3/cadc/EVO-LOG).
    Développée par Code Axis Digital Cameroun (CADC).

    ## Modules disponibles

    * **Multi-Tenant & SuperAdmin** - Gestion des organisations, abonnements et RLS
    * **Auth** - Authentification JWT et RBAC dynamique
    * **Tiers** - Clients, fournisseurs et armateurs
    * **Transport** - Dispatcheur, flotte, E-POD et déclarations
    * **Finance** - Facturation, encaissements et comptabilité OHADA
    * **Parc & Yard** - Gate in/out, ateliers et maintenance
    * **Magasin (WMS)** - Réceptions Mag3, sorties, transferts et inventaires
    * **Documents (GED)** - Archiving, versionning et génération PDF
    * **Sectoriel & Ingestion** - Pont-bascule, lot/série, chaîne du froid, FDS, OCR
    """,

    version="1.3.0",

    docs_url="/api/docs",

    redoc_url="/api/redoc",

    openapi_url="/api/openapi.json",

    lifespan=lifespan,

    contact={

        "name": "Code Axis Digital Cameroun (CADC)",

        "url": "https://codeaxis.cm",

        "email": "contact@codeaxis.cm",

    },

    license_info={

        "name": "Propriétaire CADC / Placide Kouayep",

        "url": "https://codeaxis.cm/license",

    },

    terms_of_service="https://codeaxis.cm/terms",

)



# Rate limiting protection brute force

# Sentry initialization (if DSN provided)

if getattr(settings, "SENTRY_DSN", None):

    sentry_sdk.init(

        dsn=settings.SENTRY_DSN,

        traces_sample_rate=0.2,

        integrations=[

            SqlalchemyIntegration(),

            RedisIntegration(),

            CeleryIntegration(),

        ],

    )

    # Add ASGI middleware for capturing HTTP requests

    app.add_middleware(SentryAsgiMiddleware)

# Rate limiting protection brute force

app.state.limiter = limiter

app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)



# Setup error handlers

setup_error_handlers(app)



# Setup monitoring (must be called outside lifespan because it adds a middleware)

setup_monitoring(app)



# Middleware de traage des requtes avec ID de corrlation

app.add_middleware(TracingMiddleware)



# Middlewares de Scurit et Audit (Niveau World Pro)

app.add_middleware(AuditMiddleware)

redis_url_val = getattr(settings, "REDIS_URL", None)
app.add_middleware(IdempotencyMiddleware, redis_url=redis_url_val)



# CORS  autoriser le frontend Next.js et Vercel previews

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://EVO-LOG.vercel.app",
        "https://EVO-LOG-frontend.vercel.app",
        "https://EVO-LOG-erp.cm"
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



def safe_include_router(mod_or_router, prefix: str = "", tags: list = None):
    tags = tags or []
    try:
        r = getattr(mod_or_router, "router", None) if not hasattr(mod_or_router, "routes") else mod_or_router
        if r is not None:
            app.include_router(r, prefix=prefix, tags=tags)
    except Exception as err:
        logger.warning(f"Could not register router for prefix '{prefix}': {err}")

# Routers - Version 1 API
safe_include_router(auth, prefix="/api/v1/auth", tags=["Auth"])
safe_include_router(tiers, prefix="/api/v1/tiers", tags=["Tiers"])
safe_include_router(transport, prefix="/api/v1/transport", tags=["Transport"])
safe_include_router(finance, prefix="/api/v1/finance", tags=["Finance"])
safe_include_router(parc, prefix="/api/v1/parc", tags=["Parc"])
safe_include_router(acconage, prefix="/api/v1/acconage", tags=["Port Operations & Stevedoring"])
safe_include_router(documents, prefix="/api/v1/documents", tags=["Documents"])
safe_include_router(rh, prefix="/api/v1/rh", tags=["Ressources Humaines"])

from app.routers import ws
safe_include_router(ws, prefix="/api/v1/ws", tags=["WebSockets"])

from app.routers import collaboration
safe_include_router(collaboration, prefix="/api/v1/collaboration", tags=["Collaboration"])

from app.routers import iot
safe_include_router(iot, prefix="/api/v1/iot", tags=["IoT"])

from app.routers import blockchain
safe_include_router(blockchain, prefix="/api/v1/blockchain", tags=["Blockchain"])

from app.routers import sustainability
safe_include_router(sustainability, prefix="/api/v1/sustainability", tags=["Sustainability"])

from app.routers import ws as ws_v1
from app.routers import collaboration as collaboration_v1
safe_include_router(ws_v1, prefix="/api/ws", tags=["WebSockets - DEPRECATED"])
safe_include_router(collaboration_v1, prefix="/api/collaboration", tags=["Collaboration - DEPRECATED"])

safe_include_router(alerts, prefix="/api/v1/alerts", tags=["Alerts"])
safe_include_router(magasin, prefix="/api/v1/magasin", tags=["EVO-Magasin"])
safe_include_router(gateway, prefix="/api/v1/gateway", tags=["Gateway"])
safe_include_router(transactions, prefix="/api/v1/transactions", tags=["Transactions"])
safe_include_router(goods_declaration, prefix="/api/v1/transport/goods-declarations", tags=["Goods Declaration"])
safe_include_router(removal_slip, prefix="/api/v1/magasin/removal-slips", tags=["Removal Slip"])
safe_include_router(reception_mag3, prefix="/api/v1/magasin/receptions-mag3", tags=["Reception Mag3"])
safe_include_router(master_data, prefix="/api/v1/master-data", tags=["Master Data"])
safe_include_router(admin, prefix="/api/v1/admin", tags=["Admin"])
safe_include_router(admin_agency, prefix="/api/v1/admin/agencies", tags=["Admin Agencies"])
safe_include_router(suppliers, prefix="/api/v1/suppliers", tags=["Suppliers"])

try:
    from app.routers.webhook_whatsapp import router as webhook_router
    safe_include_router(webhook_router)
except Exception as e:
    logger.warning(f"Could not register WhatsApp router: {e}")

try:
    from app.routers.telematics import router as telematics_router
    safe_include_router(telematics_router)
except Exception:
    pass

# EVO-LOG v1.3 New Core & SaaS Routers
from app.routers.v1 import superadmin, subscription, onboarding, privacy
from app.routers.v1 import ohada_accounting, crm, projects, fixed_assets, ged, e_invoicing
from app.routers.v1 import ai_predictive, multicurrency, documentai, bi_advanced, marketplace, api_key, freight_exchange, digital_twin, gamification, sectoral_features, status

safe_include_router(superadmin, prefix="/api/v1/superadmin", tags=["SuperAdmin Multi-Tenant"])
safe_include_router(subscription, prefix="/api/v1/saas/subscription", tags=["SaaS Subscription & Billing"])
safe_include_router(onboarding, prefix="/api/v1/auth/onboarding", tags=["Self-Service Onboarding"])
safe_include_router(privacy, prefix="/api/v1/privacy", tags=["Data Privacy Law 2024/017"])
safe_include_router(ohada_accounting, prefix="/api/v1/accounting/ohada", tags=["Comptabilité SYSCOHADA"])
safe_include_router(crm, prefix="/api/v1/crm", tags=["CRM & Commercial Pipeline"])
safe_include_router(projects, prefix="/api/v1/projects", tags=["Extended Project Management"])
safe_include_router(fixed_assets, prefix="/api/v1/assets", tags=["Fixed Assets & Depreciation"])
safe_include_router(ged, prefix="/api/v1/ged", tags=["GED Complete Document Vault"])
safe_include_router(e_invoicing, prefix="/api/v1/e-invoicing", tags=["Normalized E-Invoicing DGI"])
safe_include_router(ai_predictive, prefix="/api/v1/ai/predictive", tags=["Predictive AI Engine"])
safe_include_router(multicurrency, prefix="/api/v1/multicurrency", tags=["Multicurrency"])
safe_include_router(documentai, prefix="/api/v1/document-ai", tags=["Document AI"])
safe_include_router(bi_advanced, prefix="/api/v1/bi/advanced", tags=["Advanced BI Engine"])
safe_include_router(marketplace, prefix="/api/v1/marketplace", tags=["Marketplace & Public API Keys"])
safe_include_router(api_key, prefix="/api/v1/api-keys", tags=["API Key Management"])
safe_include_router(freight_exchange, prefix="/api/v1/freight-exchange", tags=["Bourse de Fret"])
safe_include_router(digital_twin, prefix="/api/v1/digital-twin", tags=["Digital Twin 2D/3D Occupancy"])
safe_include_router(gamification, prefix="/api/v1/gamification", tags=["Gamification & Driver Badges"])
safe_include_router(sectoral_features, prefix="/api/v1/sectoral", tags=["Paramétrage Sectoriel (Lot, Bascule, FDS, Phyto)"])
safe_include_router(status, prefix="/api/v1/status", tags=["System Public Status & SLA"])

safe_include_router(notifications, prefix="/api/v1/notifications", tags=["Notifications"])
safe_include_router(bill_of_loading, prefix="/api/v1/bill-of-loading", tags=["Bill of Loading"])
safe_include_router(purchase, prefix="/api/v1/purchase", tags=["Achats"])
safe_include_router(incidents, prefix="/api/v1/incidents", tags=["Incidents"])
safe_include_router(public_api, prefix="/api/v1/public", tags=["Public API"])
safe_include_router(rh, prefix="/api/v1/rh", tags=["Ressources Humaines"])
safe_include_router(qhse, prefix="/api/v1/qhse", tags=["QHSE"])
safe_include_router(ai_assistant, prefix="/api/v1/ai", tags=["AI Assistant"])
from app.routers.v1 import port_operations
safe_include_router(port_operations, prefix="/api/v1/port", tags=["Port Stevedoring & Vessel Operations"])
safe_include_router(new_k_modules)

@app.post("/api/v1/admin/seed")
@app.get("/api/v1/admin/seed")
async def trigger_admin_seed(force: bool = False):
    """Permet d'exécuter à tout moment le seeder de la base de données ERP EVO-LOG."""
    try:
        from scripts.seed_data import seed_all
        res = await asyncio.to_thread(seed_all, force)
        return res
    except Exception as e:
        return {"status": "error", "detail": str(e)}

@app.get('/api/health')

async def health_check():

    """Health check basique - utilis par Railway."""

    if startup_errors:

        # Retourner 200 avec status dgrad plutt que de crasher

        # Railway vrifie le HTTP status code, pas le contenu

        return {

            "status": "degraded",

            "service": "EVO-LOG SaaS",

            "version": "1.3.0",

            "errors": startup_errors

        }

    return {"status": "ok", "service": "EVO-LOG SaaS", "version": "1.3.0"}





@app.get('/api/health/detailed')

async def detailed_health_check():

    """Health check dtaill avec vrification des dpendances."""

    import asyncio

    checks = {

        "status": "ok",

        "service": "EVO-LOG SaaS",

        "version": "1.3.0",

        "checks": {}

    }



    # Vrifier la base de donnes (sync engine dans executor)

    try:

        def check_db():

            with engine.connect() as conn:

                conn.execute(text("SELECT 1"))

        await asyncio.to_thread(check_db)

        checks["checks"]["database"] = {"status": "ok", "message": "PostgreSQL connect"}

    except Exception as e:

        checks["checks"]["database"] = {"status": "error", "message": str(e)}

        checks["status"] = "degraded"



    # Vrifier Redis (si configur)

    try:

        import redis.asyncio as aioredis

        redis_client = aioredis.from_url(settings.REDIS_URL)

        await redis_client.ping()

        await redis_client.aclose()

        checks["checks"]["redis"] = {"status": "ok", "message": "Redis connect"}

    except Exception as e:

        checks["checks"]["redis"] = {"status": "warning", "message": f"Redis indisponible: {str(e)}"}

        # Ne pas marquer comme degraded - Redis est optionnel



    # Vrifier MinIO (si activ)

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

            checks["checks"]["minio"] = {"status": "ok", "message": "MinIO connect"}

        except Exception as e:

            checks["checks"]["minio"] = {"status": "warning", "message": f"MinIO indisponible: {str(e)}"}

    else:

        checks["checks"]["minio"] = {"status": "disabled", "message": "MinIO dsactiv (MINIO_ENABLED=false)"}





    # Vrifier Celery Workers

    try:

        from app.worker import celery_app

        i = celery_app.control.inspect()

        active = i.active()

        if active is None:

            checks["checks"]["celery"] = {"status": "warning", "message": "Aucun worker Celery actif"}

        else:

            checks["checks"]["celery"] = {"status": "ok", "message": "Workers Celery actifs"}

    except Exception as e:

        checks["checks"]["celery"] = {"status": "error", "message": str(e)}

        checks["status"] = "degraded"

    return checks













@app.on_event('startup')

async def expose_metrics():

    instrumentator.expose(app)


from app.routers.v1.new_k_modules import router as new_k_router
app.include_router(new_k_router)


@app.middleware('http')
async def add_security_headers(request, call_next):
    response = await call_next(request)
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
    return response
