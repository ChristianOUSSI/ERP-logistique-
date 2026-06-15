# app/utils/error_handler.py - Gestion centralisée des erreurs
from fastapi import HTTPException, Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from typing import Union
import logging
from datetime import datetime

logger = logging.getLogger(__name__)


class AppException(Exception):
    """Exception de base pour l'application"""
    def __init__(self, message: str, code: str = "APP_ERROR", status_code: int = 500):
        self.message = message
        self.code = code
        self.status_code = status_code
        super().__init__(self.message)


class NotFoundException(AppException):
    """Exception pour les ressources non trouvées"""
    def __init__(self, message: str = "Ressource non trouvée"):
        super().__init__(message, code="NOT_FOUND", status_code=404)


class BadRequestException(AppException):
    """Exception pour les requêtes invalides"""
    def __init__(self, message: str = "Requête invalide"):
        super().__init__(message, code="BAD_REQUEST", status_code=400)


class UnauthorizedException(AppException):
    """Exception pour les accès non autorisés"""
    def __init__(self, message: str = "Accès non autorisé"):
        super().__init__(message, code="UNAUTHORIZED", status_code=401)


class ForbiddenException(AppException):
    """Exception pour les accès interdits"""
    def __init__(self, message: str = "Accès interdit"):
        super().__init__(message, code="FORBIDDEN", status_code=403)


class ConflictException(AppException):
    """Exception pour les conflits de données"""
    def __init__(self, message: str = "Conflit de données"):
        super().__init__(message, code="CONFLICT", status_code=409)


class ValidationException(AppException):
    """Exception pour les erreurs de validation"""
    def __init__(self, message: str = "Erreur de validation"):
        super().__init__(message, code="VALIDATION_ERROR", status_code=422)


class BusinessLogicException(AppException):
    """Exception pour les erreurs de logique métier"""
    def __init__(self, message: str = "Erreur de logique métier"):
        super().__init__(message, code="BUSINESS_LOGIC_ERROR", status_code=400)


def log_error(error: Exception, context: dict = None):
    """Log une erreur avec contexte"""
    error_data = {
        "timestamp": datetime.utcnow().isoformat(),
        "error_type": type(error).__name__,
        "error_message": str(error),
        "context": context or {}
    }
    logger.error(f"Error occurred: {error_data}", exc_info=True)
    return error_data


async def app_exception_handler(request: Request, exc: AppException) -> JSONResponse:
    """Handler pour les exceptions de l'application"""
    log_error(exc, {"path": request.url.path, "method": request.method})
    
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "code": exc.code,
                "message": exc.message,
                "timestamp": datetime.utcnow().isoformat(),
                "path": request.url.path
            }
        }
    )


async def http_exception_handler(request: Request, exc: HTTPException) -> JSONResponse:
    """Handler pour les exceptions HTTP"""
    log_error(exc, {"path": request.url.path, "method": request.method})
    
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "code": "HTTP_ERROR",
                "message": exc.detail,
                "timestamp": datetime.utcnow().isoformat(),
                "path": request.url.path
            }
        }
    )


async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    """Handler pour les erreurs de validation"""
    errors = []
    for error in exc.errors():
        errors.append({
            "field": ".".join(str(loc) for loc in error["loc"]),
            "message": error["msg"],
            "type": error["type"]
        })
    
    log_error(exc, {"path": request.url.path, "method": request.method, "validation_errors": errors})
    
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": {
                "code": "VALIDATION_ERROR",
                "message": "Erreur de validation des données",
                "timestamp": datetime.utcnow().isoformat(),
                "path": request.url.path,
                "details": errors
            }
        }
    )


async def integrity_error_handler(request: Request, exc: IntegrityError) -> JSONResponse:
    """Handler pour les erreurs d'intégrité de base de données"""
    error_message = str(exc.orig) if hasattr(exc, 'orig') else str(exc)
    
    # Détecter les types d'erreurs d'intégrité courants
    if "unique constraint" in error_message.lower():
        message = "Une ressource avec ces données existe déjà"
        code = "DUPLICATE_ENTRY"
    elif "foreign key constraint" in error_message.lower():
        message = "Cette ressource est référencée par d'autres données et ne peut pas être supprimée"
        code = "FOREIGN_KEY_CONSTRAINT"
    elif "not null constraint" in error_message.lower():
        message = "Un champ requis est manquant"
        code = "NOT_NULL_CONSTRAINT"
    else:
        message = "Erreur de contrainte de base de données"
        code = "INTEGRITY_ERROR"
    
    log_error(exc, {"path": request.url.path, "method": request.method, "database_error": error_message})
    
    return JSONResponse(
        status_code=status.HTTP_409_CONFLICT,
        content={
            "error": {
                "code": code,
                "message": message,
                "timestamp": datetime.utcnow().isoformat(),
                "path": request.url.path,
                "details": error_message
            }
        }
    )


async def sqlalchemy_error_handler(request: Request, exc: SQLAlchemyError) -> JSONResponse:
    """Handler pour les erreurs SQLAlchemy générales"""
    error_message = str(exc)
    
    log_error(exc, {"path": request.url.path, "method": request.method, "database_error": error_message})
    
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": {
                "code": "DATABASE_ERROR",
                "message": "Erreur de base de données",
                "timestamp": datetime.utcnow().isoformat(),
                "path": request.url.path,
                "details": error_message
            }
        }
    )


async def generic_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Handler pour les exceptions génériques"""
    log_error(exc, {"path": request.url.path, "method": request.method})
    
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "Une erreur interne est survenue",
                "timestamp": datetime.utcnow().isoformat(),
                "path": request.url.path
            }
        }
    )


def setup_error_handlers(app):
    """Configure tous les handlers d'erreurs pour l'application FastAPI"""
    app.add_exception_handler(AppException, app_exception_handler)
    app.add_exception_handler(HTTPException, http_exception_handler)
    app.add_exception_handler(RequestValidationError, validation_exception_handler)
    app.add_exception_handler(IntegrityError, integrity_error_handler)
    app.add_exception_handler(SQLAlchemyError, sqlalchemy_error_handler)
    app.add_exception_handler(Exception, generic_exception_handler)
