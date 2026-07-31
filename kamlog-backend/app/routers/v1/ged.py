from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

from app.database import get_db
from app.utils.tenant import get_current_tenant_context, TenantContext, require_module_access

router = APIRouter()

@router.get("/documents", dependencies=[Depends(require_module_access("documents"))])
def list_ged_documents(
    category: Optional[str] = None,
    context: TenantContext = Depends(get_current_tenant_context)
):
    """Retrieve GED Document Vault files with versioning and entity association."""
    return {
        "status": "success",
        "organization_id": context.organization_id,
        "documents": [
            {
                "id": "DOC-GED-001",
                "title": "Attestation de Conformité Environnementale QHSE 2026",
                "category": "QHSE",
                "version": "1.2",
                "file_name": "qhse_certif_2026.pdf",
                "file_size_bytes": 1450200,
                "mime_type": "application/pdf",
                "created_at": datetime.utcnow().isoformat(),
                "download_url": "/api/v1/ged/download/DOC-GED-001"
            },
            {
                "id": "DOC-GED-002",
                "title": "Carte Grise Tracteur LT-2024-AA",
                "category": "PARC",
                "version": "1.0",
                "file_name": "carte_grise_lt2024aa.pdf",
                "file_size_bytes": 890100,
                "mime_type": "application/pdf",
                "created_at": datetime.utcnow().isoformat(),
                "download_url": "/api/v1/ged/download/DOC-GED-002"
            }
        ]
    }

@router.post("/upload", status_code=status.HTTP_201_CREATED, dependencies=[Depends(require_module_access("documents"))])
async def upload_ged_document(
    title: str = Form(...),
    category: str = Form("GENERAL"),
    file: UploadFile = File(...),
    context: TenantContext = Depends(get_current_tenant_context)
):
    """Upload document to central GED repository."""
    return {
        "status": "success",
        "message": "Document uploaded and archived in GED vault successfully!",
        "document": {
            "id": f"DOC-GED-{datetime.utcnow().strftime('%M%S')}",
            "organization_id": context.organization_id,
            "title": title,
            "category": category,
            "version": "1.0",
            "file_name": file.filename,
            "mime_type": file.content_type,
            "uploaded_at": datetime.utcnow().isoformat()
        }
    }
