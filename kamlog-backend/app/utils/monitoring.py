# app/utils/monitoring.py - Configuration Prometheus pour le monitoring
from prometheus_client import Counter, Histogram, Gauge, Info
from prometheus_fastapi_instrumentator import Instrumentator
from fastapi import FastAPI


# Métriques de comptage
http_requests_total = Counter(
    'http_requests_total',
    'Total number of HTTP requests',
    ['method', 'endpoint', 'status']
)

http_requests_errors = Counter(
    'http_requests_errors',
    'Total number of HTTP errors',
    ['method', 'endpoint']
)

# Métriques de temps de réponse
http_request_duration_seconds = Histogram(
    'http_request_duration_seconds',
    'HTTP request duration in seconds',
    ['method', 'endpoint']
)

# Métriques de base de données
db_connections_active = Gauge(
    'db_connections_active',
    'Number of active database connections'
)

db_queries_total = Counter(
    'db_queries_total',
    'Total number of database queries',
    ['operation']
)

db_query_duration_seconds = Histogram(
    'db_query_duration_seconds',
    'Database query duration in seconds'
)

# Métriques métier
stock_modifications_total = Counter(
    'stock_modifications_total',
    'Total number of stock modifications',
    ['action', 'article_id']
)

commandes_created_total = Counter(
    'commandes_created_total',
    'Total number of orders created',
    ['statut']
)

receptions_created_total = Counter(
    'receptions_created_total',
    'Total number of receptions created'
)

# Métriques système
app_info = Info(
    'app_info',
    'Application information'
)


def setup_monitoring(app: FastAPI):
    """
    Configure le monitoring Prometheus pour l'application FastAPI.
    
    Args:
        app: Instance FastAPI
    """
    # Instrumenter FastAPI avec Prometheus
    instrumentator = Instrumentator(
        should_group_status_codes=False,
        should_ignore_untemplated=True,
        should_instrument_requests_inprogress=True,
        excluded_handlers=["/metrics"],
        env_var_name="PROMETHEUS_MULTIPROC_DIR",
        inprogress_labels=True,
    )
    
    instrumentator.instrument(app).expose(app, include_in_schema=False)
    
    # Définir les informations de l'application
    app_info.info({
        'version': '1.0.0',
        'environment': 'production' if not app.debug else 'development'
    })
