# app/main.py  Configuration Principale FastAPI KAMLOG





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

from app.routers.v1 import auth, tiers, transport, finance, parc, documents, alerts, magasin, gateway, transactions, admin

from app.routers.v1 import goods_declaration, removal_slip, reception_mag3, suppliers, master_data, admin_agency, notifications, purchase, incidents, public_api, rh

from app.routers.v1 import bill_of_loading, qhse, new_k_modules

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

        print("' Database connection OK")

        startup_errors.clear()

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

    title="KAMLOG EM-ERP API",

    description="""ERP Logistique Portuaire - Systme de gestion complet pour le port de Douala.



    ## Modules disponibles



    * **Auth** - Authentification et gestion des utilisateurs

    * **Tiers** - Gestion des clients, fournisseurs et partenaires

    * **Transport** - Suivi des vhicules, conducteurs et missions

    * **Finance** - Comptabilit, facturation et gestion financire

    * **Parc** - Gestion du parc automobile et des quipements

    * **Documents** - Gnration et gestion des documents logistiques

    * **Alerts** - Systme d'alertes et de notifications en temps rel

    * **Magasin** - Gestion des stocks et entrepts

    * **Gateway** - Intgration avec les systmes externes

    * **Transactions** - Suivi des oprations commerciales

    * **Master Data** - Donnes de rfrence (articles, incoterms, types de conteneurs)

# Setup Prometheus Metrics

instrumentator = Instrumentator().instrument(app)



    * **Administratif** - Gestion des agences et paramtres systme

    * **Notifications** - Centre de notifications

    * **Achats** - Gestion des achats et approvisionnements

    * **Incidents** - Signalement et suivi des incidents

    * **Public API** - Endpoints publics accessibles sans authentification

    * **RH** - Gestion des ressources humaines



    ## Authentification



    La plupart des endpoints ncessitent une authentification JWT. Utilisez l'endpoint `/api/v1/auth/login` pour obtenir un token d'accs.



    ## Versioning



    Cet API utilise le versioning par URL. La version actuelle est v1 disponible sous `/api/v1/*`.

    Les endpoints sous `/api/*` sont maintenus pour la compatibilit ascendante mais sont dprcis.



    ## Rate Limiting



    Des limites de taux sont appliques pour protger contre les abus:

    * Authentification: 5 requtes/minute

    * Connexion: 10 requtes/minute

    * Utilisateurs rguliers: 1000 requtes/heure

    * Administrateurs: 2000 requtes/heure

    * Oprations en lot: 10 requtes/heure

    """,

    version="1.0.0",

    docs_url="/api/docs",

    redoc_url="/api/redoc",

    openapi_url="/api/openapi.json",

    lifespan=lifespan,

    contact={

        "name": "quipe KAMLOG",

        "url": "https://kamlog.cm",

        "email": "tech@kamlog.cm",

    },

    license_info={

        "name": "Propritaire",

        "url": "https://kamlog.cm/license",

    },

    terms_of_service="https://kamlog.cm/terms",

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

    allow_origins=["http://localhost:3000", "https://kamlog-erp.cm"],

    allow_origin_regex=r"https://.*\.vercel\.app",

    allow_credentials=True,

    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],

    allow_headers=["Content-Type", "Authorization", "X-Requested-With", "X-Idempotency-Key", "X-Request-ID", "trace-id"],

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
safe_include_router(documents, prefix="/api/v1/documents", tags=["Documents"])

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
safe_include_router(magasin, prefix="/api/v1/magasin", tags=["K-Magasin"])
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
except Exception:
    pass

try:
    from app.routers.telematics import router as telematics_router
    safe_include_router(telematics_router)
except Exception:
    pass
safe_include_router(notifications, prefix="/api/v1/notifications", tags=["Notifications"])
safe_include_router(bill_of_loading, prefix="/api/v1/bill-of-loading", tags=["Bill of Loading"])
safe_include_router(purchase, prefix="/api/v1/purchase", tags=["Achats"])
safe_include_router(incidents, prefix="/api/v1/incidents", tags=["Incidents"])
safe_include_router(public_api, prefix="/api/v1/public", tags=["Public API"])
safe_include_router(rh, prefix="/api/v1/rh", tags=["Ressources Humaines"])
safe_include_router(qhse, prefix="/api/v1/qhse", tags=["QHSE"])
safe_include_router(new_k_modules)

safe_include_router(auth, prefix="/api/auth", tags=["Auth - DEPRECATED"])
safe_include_router(tiers, prefix="/api/tiers", tags=["Tiers - DEPRECATED"])
safe_include_router(transport, prefix="/api/transport", tags=["Transport - DEPRECATED"])
safe_include_router(finance, prefix="/api/finance", tags=["Finance - DEPRECATED"])
safe_include_router(parc, prefix="/api/parc", tags=["Parc - DEPRECATED"])
safe_include_router(documents, prefix="/api/documents", tags=["Documents - DEPRECATED"])
safe_include_router(ws, prefix="/api/ws", tags=["WebSockets - DEPRECATED"])
safe_include_router(alerts, prefix="/api/alerts", tags=["Alerts - DEPRECATED"])
safe_include_router(magasin, prefix="/api/magasin", tags=["K-Magasin - DEPRECATED"])
safe_include_router(gateway, prefix="/api/gateway", tags=["Gateway - DEPRECATED"])
safe_include_router(transactions, prefix="/api/transactions", tags=["Transactions - DEPRECATED"])
safe_include_router(goods_declaration, prefix="/api/transport/goods-declarations", tags=["Goods Declaration - DEPRECATED"])
safe_include_router(removal_slip, prefix="/api/magasin/removal-slips", tags=["Removal Slip - DEPRECATED"])
safe_include_router(reception_mag3, prefix="/api/magasin/receptions-mag3", tags=["Reception Mag3 - DEPRECATED"])
safe_include_router(master_data, prefix="/api/master-data", tags=["Master Data - DEPRECATED"])
safe_include_router(admin, prefix="/api/admin", tags=["Admin - DEPRECATED"])
safe_include_router(admin_agency, prefix="/api/admin/agencies", tags=["Admin Agencies - DEPRECATED"])
safe_include_router(suppliers, prefix="/api/suppliers", tags=["Suppliers - DEPRECATED"])
safe_include_router(notifications, prefix="/api/notifications", tags=["Notifications - DEPRECATED"])
safe_include_router(purchase, prefix="/api/purchase", tags=["Achats - DEPRECATED"])
safe_include_router(incidents, prefix="/api/incidents", tags=["Incidents - DEPRECATED"])
safe_include_router(public_api, prefix="/api/public", tags=["Public API - DEPRECATED"])
safe_include_router(rh, prefix="/api/rh", tags=["Ressources Humaines - DEPRECATED"])
safe_include_router(qhse, prefix="/api/qhse", tags=["QHSE - DEPRECATED"])






@app.get('/api/health')

async def health_check():

    """Health check basique - utilis par Railway."""

    if startup_errors:

        # Retourner 200 avec status dgrad plutt que de crasher

        # Railway vrifie le HTTP status code, pas le contenu

        return {

            "status": "degraded",

            "service": "KAMLOG EM-ERP",

            "version": "1.0.0",

            "errors": startup_errors

        }

    return {"status": "ok", "service": "KAMLOG EM-ERP", "version": "1.0.0"}





@app.get('/api/health/detailed')

async def detailed_health_check():

    """Health check dtaill avec vrification des dpendances."""

    import asyncio

    checks = {

        "status": "ok",

        "service": "KAMLOG EM-ERP",

        "version": "1.0.0",

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
