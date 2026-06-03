# app/main.py — Configuration Principale FastAPI KAMLOG
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from app.database import engine, Base
from app.routers import auth, tiers, transport, finance, parc, documents, alerts
from app.config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup : vérifier connexion DB
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    # Shutdown : fermer connexions
    await engine.dispose()


limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title="KAMLOG EM-ERP API",
    description="ERP Logistique Portuaire — Port de Douala",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    lifespan=lifespan,
)

# Rate limiting — protection brute force
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS — autoriser le frontend Next.js
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(tiers.router, prefix="/api/tiers", tags=["Tiers"])
app.include_router(transport.router, prefix="/api/transport", tags=["Transport"])
app.include_router(finance.router, prefix="/api/finance", tags=["Finance"])
app.include_router(parc.router, prefix="/api/parc", tags=["Parc"])
app.include_router(documents.router, prefix="/api/documents", tags=["Documents"])
app.include_router(alerts.router, prefix="/api/alerts", tags=["Alerts"])


@app.get('/api/health')
async def health_check():
    return {"status": "ok", "service": "KAMLOG EM-ERP", "version": "1.0.0"}
