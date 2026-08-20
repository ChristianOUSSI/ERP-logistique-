"""
EVO-LOG EM-ERP API - Main Application Entry Point
ERP Logistique Portuaire - Système de gestion complet pour le port de Douala
"""

from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from sqlalchemy import text
from sqlalchemy.engine import Engine
import asyncio
import logging
import sentry_sdk
from sentry_sdk.integrations.sqlalchemy import SqlalchemyIntegration
from sentry_sdk.integrations.redis import RedisIntegration
from sentry_sdk.integrations.celery import CeleryIntegration
from sentry_sdk.integrations.asgi import SentryAsgiMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from prometheus_fastapi_instrumentator import Instrumentator

from app.core.config import settings
from app.core.database import engine, get_db
from app.core.security import limiter
from app.middleware.audit import AuditMiddleware
from app.middleware.idempotency import IdempotencyMiddleware
from app.middleware.tracing import TracingMiddleware
from app.utils.error_handlers import setup_error_handlers, setup_monitoring
from app.services.events.event_service import event_service

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global startup errors for health check
startup_errors = []
heartbeat_task = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for startup and shutdown events."""
    global heartbeat_task
    
    # Startup
    logger.info("Starting EVO-LOG EM-ERP API...")
    
    try:
        # Test database connection
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        logger.info("Database connection established successfully")
    except Exception as e:
        err_msg = f"Database connection failed: {e}"
        logger.error(f"? {err_msg}")
        startup_errors.append(err_msg)
    
    # Start heartbeat task for WebSocket connections
    heartbeat_task = asyncio.create_task(_heartbeat_loop())
    
    yield
    
    # Shutdown: close connections
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
    title="EVO-LOG EM-ERP API",
    description="""ERP Logistique Portuaire - Système de gestion complet pour le port de Douala.

    ## Modules disponibles

    * **Auth** - Authentification et gestion des utilisateurs
    * **Tiers** - Gestion des clients, fournisseurs et partenaires
    * **Transport** - Suivi des véhicules, conducteurs et missions
    * **Finance** - Comptabilité, facturation et gestion financière
    * **Parc** - Gestion du parc automobile et des équipements
    * **Documents** - Génération et gestion des documents logistiques
    * **Alerts** - Système d'alertes et de notifications en temps réel
    * **Magasin** - Gestion des stocks et entrepôts
    * **Gateway** - Intégration avec les systèmes externes
    * **Transactions** - Suivi des opérations commerciales
    * **Master Data** - Données de référence (articles, incoterms, types de conteneurs)
    * **Administratif** - Gestion des agences et paramètres système
    * **Notifications** - Centre de notifications
    * **Achats** - Gestion des achats et approvisionnements
    * **Incidents** - Signalement et suivi des incidents
    * **Public API** - Endpoints publics accessibles sans authentification
    * **RH** - Gestion des ressources humaines
    * **Acconage** - Gestion des opérations d'accostage
    * **Transit** - Gestion des opérations de transit
    * **Maintenance** - Gestion de la maintenance
    * **QHSE** - Qualité, Hygiène, Sécurité, Environnement
    * **Magasin Avancé** - Gestion avancée (FEFO, réservations, kits, inventaires tournants)
    * **Transport Avancé** - Optimisation tournées, GPS, sous-traitants, maintenance préventive

    ## Nouveaux Modules Version 2.0

    * **Shift Planning** - Planification des shifts et ressources
    * **Port Pricing** - Tarification des services portuaires
    * **GPS Tracking** - Tracking temps réel de la flotte
    * **Real Customs Integration** - Intégration SYDONIA+ et GUICHET UNIQUE
    * **Port Incidents** - Gestion des incidents portuaires
    * **Auto Invoicing** - Facturation automatique OHADA
    * **Port Performance Dashboard** - Dashboard de performance
    * **Multi-Channel Notifications** - Notifications multi-canal
    * **Container Lifecycle** - Cycle de vie des conteneurs
    * **Partner API** - API pour intégration B2B

    ## Modules Cameroun/CEMAC

    * **Cameroon Integration** - Intégration BSC, CSC, SYGED, APE (CNCC, INS, Douane)
    * **Local Payments** - Paiements locaux (Orange Money, MTN Mobile Money, Banques locales)
    * **Cameroon Taxation** - Fiscalité Cameroun/OHADA (IRPP, IS, TCF, TDR, TVA)

    ## Authentification

    La plupart des endpoints nécessitent une authentification JWT. Utilisez l'endpoint `/api/v1/auth/login` pour obtenir un token d'accès.

    ## Versioning

    Cet API utilise le versioning par URL. La version actuelle est v1 disponible sous `/api/v1/*`.
    Les endpoints sous `/api/*` sont maintenus pour la compatibilité ascendante mais sont dépréciés.

    ## Rate Limiting

    Des limites de taux sont appliquées pour protéger contre les abus:
    * Authentification: 5 requêtes/minute
    * Connexion: 10 requêtes/minute
    * Utilisateurs réguliers: 1000 requêtes/heure
    * Administrateurs: 2000 requêtes/heure
    * Opérations en lot: 10 requêtes/heure
    """,
    version="2.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
    lifespan=lifespan,
    contact={
        "name": "Équipe EVO-LOG",
        "url": "https://EVO-LOG.cm",
        "email": "tech@EVO-LOG.cm",
    },
    license_info={
        "name": "Propriétaire",
        "url": "https://EVO-LOG.cm/license",
    },
    terms_of_service="https://EVO-LOG.cm/terms",
)

# Setup Prometheus Metrics
instrumentator = Instrumentator().instrument(app)

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
    app.add_middleware(SentryAsgiMiddleware)

# Rate limiting protection brute force
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Setup error handlers
setup_error_handlers(app)

# Setup monitoring (must be called outside lifespan because it adds a middleware)
setup_monitoring(app)

# Middleware de traçage des requêtes avec ID de corrélation
app.add_middleware(TracingMiddleware)

# Middlewares de Sécurité et Audit (Niveau World Pro)
app.add_middleware(AuditMiddleware)
app.add_middleware(IdempotencyMiddleware, redis_url=settings.REDIS_URL)

# CORS autoriser le frontend Next.js et Vercel previews
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://EVO-LOG-erp.cm"],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["Content-Type", "Authorization", "X-Requested-With", "X-Idempotency-Key", "X-Request-ID", "trace-id"],
)

# Import routers safely
def safe_include_router(router, **kwargs):
    """Include router safely with error handling"""
    try:
        app.include_router(router, **kwargs)
    except Exception as e:
        logger.warning(f"Failed to include router {kwargs.get('prefix', 'unknown')}: {e}")

# Routers - Version 1 API
from app.routers.v1 import auth, tiers, transport, finance, parc, documents, alerts, magasin, gateway, transactions, master_data, admin, admin_agency, suppliers, notifications, bill_of_loading, purchase, incidents, public_api, rh, acconage, transit, maintenance, qhse, goods_declaration, removal_slip, reception_mag3

safe_include_router(auth.router, prefix="/api/v1/auth", tags=["Auth"])
safe_include_router(tiers.router, prefix="/api/v1/tiers", tags=["Tiers"])
safe_include_router(transport.router, prefix="/api/v1/transport", tags=["Transport"])
safe_include_router(finance.router, prefix="/api/v1/finance", tags=["Finance"])
safe_include_router(parc.router, prefix="/api/v1/parc", tags=["Parc"])
safe_include_router(documents.router, prefix="/api/v1/documents", tags=["Documents"])
safe_include_router(alerts.router, prefix="/api/v1/alerts", tags=["Alerts"])
safe_include_router(magasin.router, prefix="/api/v1/magasin", tags=["EVO-Magasin"])
safe_include_router(gateway.router, prefix="/api/v1/gateway", tags=["Gateway"])
safe_include_router(transactions.router, prefix="/api/v1/transactions", tags=["Transactions"])
safe_include_router(goods_declaration.router, prefix="/api/v1/transport/goods-declarations", tags=["Goods Declaration"])
safe_include_router(removal_slip.router, prefix="/api/v1/magasin/removal-slips", tags=["Removal Slip"])
safe_include_router(reception_mag3.router, prefix="/api/v1/magasin/receptions-mag3", tags=["Reception Mag3"])
safe_include_router(master_data.router, prefix="/api/v1/master-data", tags=["Master Data"])
safe_include_router(admin.router, prefix="/api/v1/admin", tags=["Admin"])
safe_include_router(admin_agency.router, prefix="/api/v1/admin/agencies", tags=["Admin Agencies"])
safe_include_router(suppliers.router, prefix="/api/v1/suppliers", tags=["Suppliers"])
safe_include_router(notifications.router, prefix="/api/v1/notifications", tags=["Notifications"])
safe_include_router(bill_of_loading.router, prefix="/api/v1/bill-of-loading", tags=["Bill of Loading"])
safe_include_router(purchase.router, prefix="/api/v1/purchase", tags=["Achats"])
safe_include_router(incidents.router, prefix="/api/v1/incidents", tags=["Incidents"])
safe_include_router(public_api.router, prefix="/api/v1/public", tags=["Public API"])
safe_include_router(rh.router, prefix="/api/v1/rh", tags=["Ressources Humaines"])
safe_include_router(acconage.router, prefix="/api/v1/acconage", tags=["Accostage"])
safe_include_router(transit.router, prefix="/api/v1/transit", tags=["Transit"])
safe_include_router(maintenance.router, prefix="/api/v1/maintenance", tags=["Maintenance"])
safe_include_router(qhse.router, prefix="/api/v1/qhse", tags=["QHSE"])

# Advanced modules routers
try:
    from app.routers.v1 import magasin_avance, transport_avance, acconage_avance, transit_avance, magasin_douane, transport_international, acquisition, finance, qhse, documents, maintenance_gmao, integration, notifications, reporting, tenant, role, b2b
    safe_include_router(magasin_avance.router, prefix="/api/v1/magasin-avance", tags=["Magasin Avancé"])
    safe_include_router(transport_avance.router, prefix="/api/v1/transport-avance", tags=["Transport Avancé"])
    safe_include_router(acconage_avance.router, prefix="/api/v1/acconage-avance", tags=["Acconage Avancé"])
    safe_include_router(transit_avance.router, prefix="/api/v1/transit-avance", tags=["Transit Avancé"])
    safe_include_router(magasin_douane.router, prefix="/api/v1/magasin-douane", tags=["Magasin Douane"])
    safe_include_router(transport_international.router, prefix="/api/v1/transport-international", tags=["Transport International"])
    safe_include_router(acquisition.router, prefix="/api/v1/acquisition", tags=["Acquisition"])
    safe_include_router(finance.router, prefix="/api/v1/finance", tags=["Finance"])
    safe_include_router(qhse.router, prefix="/api/v1/qhse", tags=["QHSE"])
    safe_include_router(documents.router, prefix="/api/v1/documents", tags=["Documents"])
    safe_include_router(maintenance_gmao.router, prefix="/api/v1/maintenance-gmao", tags=["Maintenance GMAO"])
    safe_include_router(integration.router, prefix="/api/v1/integration", tags=["Integration"])
    safe_include_router(notifications.router, prefix="/api/v1/notifications", tags=["Notifications"])
    safe_include_router(reporting.router, prefix="/api/v1/reporting", tags=["Reporting"])
    safe_include_router(tenant.router, prefix="/api/v1/tenant", tags=["Tenant Management"])
    safe_include_router(role.router, prefix="/api/v1/roles", tags=["Role Management"])
    safe_include_router(b2b.router, prefix="/api/v1/b2b", tags=["B2B Portal"])
except ImportError as e:
    logger.warning(f"Advanced modules not yet implemented: {e}")

# New Version 2.0 Modules
try:
    from app.routers.v1 import shift_planning, port_pricing, gps_tracking, real_customs, port_incidents, auto_invoicing, port_performance, notification_system, container_lifecycle, partner_api
    
    safe_include_router(shift_planning.router, prefix="/api/v1/shift-planning", tags=["Shift Planning"])
    safe_include_router(port_pricing.router, prefix="/api/v1/port-pricing", tags=["Port Pricing"])
    safe_include_router(gps_tracking.router, prefix="/api/v1/gps-tracking", tags=["GPS Tracking"])
    safe_include_router(real_customs.router, prefix="/api/v1/real-customs", tags=["Real Customs"])
    safe_include_router(port_incidents.router, prefix="/api/v1/port-incidents", tags=["Port Incidents"])
    safe_include_router(auto_invoicing.router, prefix="/api/v1/auto-invoicing", tags=["Auto Invoicing"])
    safe_include_router(port_performance.router, prefix="/api/v1/port-performance", tags=["Port Performance"])
    safe_include_router(notification_system.router, prefix="/api/v1/notification-system", tags=["Notification System"])
    safe_include_router(container_lifecycle.router, prefix="/api/v1/container-lifecycle", tags=["Container Lifecycle"])
    safe_include_router(partner_api.router, prefix="/api/v1/partner-api", tags=["Partner API"])
except ImportError as e:
    logger.warning(f"Version 2.0 modules not yet implemented: {e}")

# Cameroon/CEMAC Specific Modules
try:
    from app.routers.v1 import integration_cameroun, paiement_local, fiscalite_cameroun
    
    safe_include_router(integration_cameroun.router, prefix="/api/v1/integration-cameroun", tags=["Cameroon Integration"])
    safe_include_router(paiement_local.router, prefix="/api/v1/paiement-local", tags=["Local Payments"])
    safe_include_router(fiscalite_cameroun.router, prefix="/api/v1/fiscalite-cameroun", tags=["Cameroon Taxation"])
except ImportError as e:
    logger.warning(f"Cameroon/CEMAC modules not yet implemented: {e}")

# WebSocket and additional routers
try:
    from app.routers import ws, collaboration, iot, webhook_whatsapp, telematics
    
    safe_include_router(ws.router, prefix="/api/v1/ws", tags=["WebSockets"])
    safe_include_router(collaboration.router, prefix="/api/v1/collaboration", tags=["Collaboration"])
    safe_include_router(iot.router, prefix="/api/v1/iot", tags=["IoT"])
    safe_include_router(webhook_whatsapp.router, prefix="/api/v1/webhook-whatsapp", tags=["Webhook WhatsApp"])
    safe_include_router(telematics.router, prefix="/api/v1/telematics", tags=["Telematics"])
except ImportError as e:
    logger.warning(f"Additional routers not yet implemented: {e}")

# Backward compatibility - Original API endpoints (deprecated, will be removed in v2)
safe_include_router(auth.router, prefix="/api/auth", tags=["Auth - DEPRECATED"])
safe_include_router(tiers.router, prefix="/api/tiers", tags=["Tiers - DEPRECATED"])
safe_include_router(transport.router, prefix="/api/transport", tags=["Transport - DEPRECATED"])
safe_include_router(finance.router, prefix="/api/finance", tags=["Finance - DEPRECATED"])
safe_include_router(parc.router, prefix="/api/parc", tags=["Parc - DEPRECATED"])
safe_include_router(documents.router, prefix="/api/documents", tags=["Documents - DEPRECATED"])
safe_include_router(alerts.router, prefix="/api/alerts", tags=["Alerts - DEPRECATED"])
safe_include_router(magasin.router, prefix="/api/magasin", tags=["EVO-Magasin - DEPRECATED"])
safe_include_router(gateway.router, prefix="/api/gateway", tags=["Gateway - DEPRECATED"])
safe_include_router(transactions.router, prefix="/api/transactions", tags=["Transactions - DEPRECATED"])

@app.get('/api/health')
async def health_check():
    """Health check basique - utilisé par Railway."""
    if startup_errors:
        return {
            "status": "degraded",
            "service": "EVO-LOG EM-ERP",
            "version": "2.0.0",
            "errors": startup_errors
        }
    return {"status": "ok", "service": "EVO-LOG EM-ERP", "version": "2.0.0"}


@app.get('/api/health/detailed')
async def detailed_health_check():
    """Health check détaillé avec vérification des dépendances."""
    checks = {
        "status": "ok",
        "service": "EVO-LOG EM-ERP",
        "version": "2.0.0",
        "checks": {}
    }

    # Vérifier la base de données
    try:
        def check_db():
            with engine.connect() as conn:
                conn.execute(text("SELECT 1"))
        await asyncio.to_thread(check_db)
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
        checks["checks"]["minio"] = {"status": "disabled", "message": "MinIO désactivé"}

    # Vérifier Celery Workers
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
    """Expose Prometheus metrics on startup"""
    instrumentator.expose(app)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)