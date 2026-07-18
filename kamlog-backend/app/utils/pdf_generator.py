# app/utils/pdf_generator.py  Génération PDF KAMLOG
from decimal import Decimal
from datetime import datetime
from typing import Optional
from fastapi import HTTPException, status
import os
from jinja2 import Environment, FileSystemLoader

try:
    from weasyprint import HTML, CSS
    WEASYPRINT_AVAILABLE = True
except ImportError:
    WEASYPRINT_AVAILABLE = False

from app.models.transport import MissionTransport
from app.models.tiers import Tiers
from app.models.finance import Facture
from app.models.parc import StockPhysiqueParc
from app.models.marchandises import Marchandise
from app.models.dossier import DossierOperationnel

# Initialisation de l'environnement Jinja2
TEMPLATE_DIR = os.path.join(os.path.dirname(__file__), '..', 'templates', 'pdf')
jinja_env = Environment(loader=FileSystemLoader(TEMPLATE_DIR))


def generer_bl_pdf(mission: MissionTransport, tiers: Tiers) -> bytes:
    """
    Génère un Bon de Livraison (BL) en PDF pour une mission.
    """
    if not WEASYPRINT_AVAILABLE:
        raise HTTPException(
            status.HTTP_501_NOT_IMPLEMENTED,
            "WeasyPrint non installé. Impossible de générer PDF."
        )

    try:
        template = jinja_env.get_template('bl.html.j2')
        html_content = template.render(
            mission=mission,
            tiers=tiers,
            date_generation=datetime.now().strftime('%d/%m/%Y'),
            datetime_generation=datetime.now().strftime('%d/%m/%Y %H:%M:%S')
        )
        
        html = HTML(string=html_content)
        pdf_bytes = html.write_pdf()
        return pdf_bytes
    except Exception as e:
        raise HTTPException(
            status.HTTP_500_INTERNAL_SERVER_ERROR,
            f"Erreur lors de la génération du PDF: {str(e)}"
        )


def generer_facture_pdf(facture: Facture, tiers: Tiers) -> bytes:
    """
    Génère une Facture en PDF.
    """
    if not WEASYPRINT_AVAILABLE:
        raise HTTPException(
            status.HTTP_501_NOT_IMPLEMENTED,
            "WeasyPrint non installé. Impossible de générer PDF."
        )

    try:
        template = jinja_env.get_template('facture.html.j2')
        html_content = template.render(
            facture=facture,
            tiers=tiers,
            date_generation=datetime.now().strftime('%d/%m/%Y'),
            datetime_generation=datetime.now().strftime('%d/%m/%Y %H:%M:%S')
        )
        
        html = HTML(string=html_content)
        pdf_bytes = html.write_pdf()
        return pdf_bytes
    except Exception as e:
        raise HTTPException(
            status.HTTP_500_INTERNAL_SERVER_ERROR,
            f"Erreur lors de la génération du PDF: {str(e)}"
        )


def generer_interchange_pdf(stock: StockPhysiqueParc, marchandise: Marchandise, dossier: DossierOperationnel, current_user: str) -> bytes:
    """
    Génère un document Interchange en PDF pour un conteneur.
    """
    if not WEASYPRINT_AVAILABLE:
        raise HTTPException(
            status.HTTP_501_NOT_IMPLEMENTED,
            "WeasyPrint non installé. Impossible de générer PDF."
        )

    try:
        template = jinja_env.get_template('interchange.html.j2')
        html_content = template.render(
            stock=stock,
            marchandise=marchandise,
            dossier=dossier,
            current_user=current_user,
            date_generation=datetime.now().strftime('%d/%m/%Y'),
            datetime_generation=datetime.now().strftime('%d/%m/%Y %H:%M:%S')
        )
        
        html = HTML(string=html_content)
        pdf_bytes = html.write_pdf()
        return pdf_bytes
    except Exception as e:
        raise HTTPException(
            status.HTTP_500_INTERNAL_SERVER_ERROR,
            f"Erreur lors de la génération du PDF: {str(e)}"
        )
