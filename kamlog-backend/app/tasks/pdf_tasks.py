import os
import uuid
import tempfile
from celery import shared_task
from types import SimpleNamespace
from app.utils.pdf_generator import generer_bl_pdf, generer_facture_pdf, generer_interchange_pdf
import logging

logger = logging.getLogger(__name__)

def _to_object(data):
    """Convert dict to object with attributes for compatibility with PDF generators."""
    if not isinstance(data, dict):
        raise ValueError(f"Expected dict, got {type(data)}")
    return SimpleNamespace(**data)

def _save_pdf(pdf_bytes: bytes, prefix: str) -> str:
    """Save PDF to a temporary file and return the path."""
    filename = f"{prefix}_{uuid.uuid4().hex}.pdf"
    filepath = os.path.join(tempfile.gettempdir(), filename)
    with open(filepath, 'wb') as f:
        f.write(pdf_bytes)
    return filepath

@shared_task
def generate_bl_pdf_task(mission_dict: dict, tiers_dict: dict):
    """Generate BL PDF asynchronously."""
    try:
        mission = _to_object(mission_dict)
        tiers = _to_object(tiers_dict)
        pdf_bytes = generer_bl_pdf(mission, tiers)
        return _save_pdf(pdf_bytes, "bl")
    except Exception as e:
        logger.error(f'Error generating BL PDF: {e}')
        raise

@shared_task
def generate_facture_pdf_task(facture_dict: dict, tiers_dict: dict):
    """Generate Invoice PDF asynchronously."""
    try:
        facture = _to_object(facture_dict)
        tiers = _to_object(tiers_dict)
        pdf_bytes = generer_facture_pdf(facture, tiers)
        return _save_pdf(pdf_bytes, "facture")
    except Exception as e:
        logger.error(f'Error generating invoice PDF: {e}')
        raise

@shared_task
def generate_interchange_pdf_task(stock_dict: dict, marchandise_dict: dict, dossier_dict: dict, current_user: str):
    """Generate Interchange PDF asynchronously."""
    try:
        stock = _to_object(stock_dict)
        marchandise = _to_object(marchandise_dict)
        dossier = _to_object(dossier_dict) if dossier_dict else None
        pdf_bytes = generer_interchange_pdf(stock, marchandise, dossier, current_user)
        return _save_pdf(pdf_bytes, "interchange")
    except Exception as e:
        logger.error(f'Error generating interchange PDF: {e}')
        raise
