import time
import json
from sqlalchemy.exc import ProgrammingError
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from starlette.responses import Response
from starlette.types import ASGIApp
from app.database import SessionLocal
from app.models.audit import HTTPAuditLog
from app.schemas.audit import AuditLogCreate
import logging
from app.utils.tracing import get_request_id

logger = logging.getLogger(__name__)
_missing_http_audit_table_logged = False


def _is_missing_http_audit_table_error(exc: ProgrammingError) -> bool:
    error_message = str(getattr(exc, "orig", exc)).lower()
    return "http_audit_log" in error_message and (
        "does not exist" in error_message or "undefinedtable" in error_message
    )

class AuditMiddleware(BaseHTTPMiddleware):
    def __init__(self, app: ASGIApp):
        super().__init__(app)

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        global _missing_http_audit_table_logged
        start_time = time.time()

        # Extraction sécurisée des informations d'identité (injectées par le middleware d'Auth)
        user = getattr(request.state, "user", None)
        user_id = str(user.id) if user else None
        agency_id = getattr(user, "agency_id", None) if user else None

        request_body_summary = None
        if request.method in ["POST", "PUT", "PATCH"]:
            try:
                # Pour éviter de consommer le stream, on regarde si le contenu est petit
                content_type = request.headers.get("Content-Type", "")
                if "application/json" in content_type:
                    # Note: En prod, on limite la taille pour éviter les attaques DoS sur le log
                    body = await request.body()
                    request_body_summary = body.decode()[:255] if body else None
            except json.JSONDecodeError:
                request_body_summary = "<non-json body>"
            except Exception:
                request_body_summary = "<failed to read body>"

        response = await call_next(request)

        process_time = time.time() - start_time
        duration_ms = int(process_time * 1000)

        # Extract T-Code and module from path if applicable
        tcode = None
        module = None
        path_parts = request.url.path.split('/')
        if len(path_parts) > 2 and path_parts[1] == 'api':
            module = path_parts[2] # e.g., 'transport', 'magasin'
            # Heuristic for T-Code: if path contains something like KMxx
            for part in path_parts:
                if part.startswith('KM') and len(part) <= 5 and part[2:].isdigit():
                    tcode = part
                    break

        audit_log_entry = AuditLogCreate(
            user_id=user_id,
            agency_id=agency_id,
            request_method=request.method,
            request_path=request.url.path,
            request_query_params=dict(request.query_params),
            request_body_summary=request_body_summary,
            response_status_code=response.status_code,
            duration_ms=duration_ms,
            ip_address=request.client.host if request.client else None,
            tcode=tcode,
            module=module,
            request_id=get_request_id(request)
        )

        db = None
        try:
            db = SessionLocal()
            db_audit = HTTPAuditLog(**audit_log_entry.model_dump())
            db.add(db_audit)
            db.commit()
            db.refresh(db_audit)
        except ProgrammingError as e:
            if db is not None:
                db.rollback()

            if _is_missing_http_audit_table_error(e):
                if not _missing_http_audit_table_logged:
                    logger.warning(
                        "Skipping HTTP audit logging because table 'http_audit_log' does not exist yet. "
                        "Apply the latest Alembic migrations to enable it."
                    )
                    _missing_http_audit_table_logged = True
            else:
                logger.error(f"Failed to log audit entry: {e}", exc_info=True)
        except Exception as e:
            if db is not None:
                db.rollback()
            logger.error(f"Failed to log audit entry: {e}", exc_info=True)
        finally:
            if db is not None:
                db.close()

        return response
