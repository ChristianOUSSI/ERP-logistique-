# app/utils/pdf_generator.py  Génération PDF KAMLOG
from decimal import Decimal
from datetime import datetime
from typing import Optional
from fastapi import HTTPException, status
import os

try:
    from weasyprint import HTML, CSS
    WEASYPRINT_AVAILABLE = True
except ImportError:
    WEASYPRINT_AVAILABLE = False

from app.models.transport import MissionTransport
from app.models.tiers import Tiers
from app.models.finance import Facture


def generer_bl_pdf(mission: MissionTransport, tiers: Tiers) -> bytes:
    """
    Génère un Bon de Livraison (BL) en PDF pour une mission.
    """
    if not WEASYPRINT_AVAILABLE:
        raise HTTPException(
            status.HTTP_501_NOT_IMPLEMENTED,
            "WeasyPrint non installé. Impossible de générer PDF."
        )

    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body {{ font-family: Arial, sans-serif; margin: 40px; }}
            .header {{ text-align: center; margin-bottom: 40px; }}
            .header h1 {{ color: #1e40af; margin: 0; }}
            .header p {{ color: #6b7280; margin: 5px 0; }}
            .info-box {{ border: 2px solid #1e40af; padding: 20px; margin: 20px 0; border-radius: 8px; }}
            .info-row {{ display: flex; justify-content: space-between; margin: 10px 0; }}
            .info-label {{ font-weight: bold; color: #374151; }}
            .info-value {{ color: #111827; }}
            .table {{ width: 100%; border-collapse: collapse; margin: 20px 0; }}
            .table th {{ background-color: #1e40af; color: white; padding: 12px; text-align: left; }}
            .table td {{ border: 1px solid #e5e7eb; padding: 12px; }}
            .footer {{ margin-top: 60px; text-align: center; color: #6b7280; font-size: 12px; }}
            .badge {{ display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: bold; }}
            .badge-planifie {{ background-color: #f3f4f6; color: #374151; }}
            .badge-en-route {{ background-color: #fef3c7; color: #92400e; }}
            .badge-livre {{ background-color: #d1fae5; color: #065f46; }}
        </style>
    </head>
    <body>
        <div class="header">
            <h1>BON DE LIVRAISON</h1>
            <p>KAMLOG EM-ERP  Port de Douala</p>
            <p>Référence: {mission.reference}</p>
        </div>

        <div class="info-box">
            <div class="info-row">
                <span class="info-label">Date:</span>
                <span class="info-value">{datetime.now().strftime('%d/%m/%Y')}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Client:</span>
                <span class="info-value">{tiers.raison_sociale}</span>
            </div>
            <div class="info-row">
                <span class="info-label">NIU:</span>
                <span class="info-value">{tiers.niu}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Statut:</span>
                <span class="badge badge-{mission.statut.lower().replace('_', '-')}">{mission.statut}</span>
            </div>
        </div>

        <table class="table">
            <tr>
                <th>Origine</th>
                <th>Destination</th>
                <th>Type Marchandise</th>
                <th>Distance (km)</th>
                <th>Poids (kg)</th>
            </tr>
            <tr>
                <td>{mission.origine}</td>
                <td>{mission.destination}</td>
                <td>{mission.type_marchandise}</td>
                <td>{mission.distance_km}</td>
                <td>{mission.poids_kg or 'N/A'}</td>
            </tr>
        </table>

        <div class="info-box">
            <div class="info-row">
                <span class="info-label">ID Camion:</span>
                <span class="info-value">{mission.camion_id}</span>
            </div>
            <div class="info-row">
                <span class="info-label">ID Chauffeur:</span>
                <span class="info-value">{mission.chauffeur_id}</span>
            </div>
        </div>

        {mission.notes and f"""
        <div class="info-box">
            <div class="info-label">Notes:</div>
            <p>{mission.notes}</p>
        </div>
        """ or ''}

        <div class="footer">
            <p>Document généré automatiquement par KAMLOG EM-ERP</p>
            <p>Port Autonome de Douala  Cameroun</p>
            <p>Date d'émission: {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}</p>
        </div>
    </body>
    </html>
    """

    try:
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

    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body {{ font-family: Arial, sans-serif; margin: 40px; }}
            .header {{ text-align: center; margin-bottom: 40px; }}
            .header h1 {{ color: #1e40af; margin: 0; }}
            .header p {{ color: #6b7280; margin: 5px 0; }}
            .info-box {{ border: 2px solid #1e40af; padding: 20px; margin: 20px 0; border-radius: 8px; }}
            .info-row {{ display: flex; justify-content: space-between; margin: 10px 0; }}
            .info-label {{ font-weight: bold; color: #374151; }}
            .info-value {{ color: #111827; }}
            .table {{ width: 100%; border-collapse: collapse; margin: 20px 0; }}
            .table th {{ background-color: #1e40af; color: white; padding: 12px; text-align: left; }}
            .table td {{ border: 1px solid #e5e7eb; padding: 12px; }}
            .total {{ text-align: right; font-size: 18px; font-weight: bold; color: #1e40af; margin-top: 20px; }}
            .footer {{ margin-top: 60px; text-align: center; color: #6b7280; font-size: 12px; }}
        </style>
    </head>
    <body>
        <div class="header">
            <h1>FACTURE</h1>
            <p>KAMLOG EM-ERP  Port de Douala</p>
            <p>Numéro: {facture.numero_facture}</p>
        </div>

        <div class="info-box">
            <div class="info-row">
                <span class="info-label">Date d'émission:</span>
                <span class="info-value">{datetime.now().strftime('%d/%m/%Y')}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Client:</span>
                <span class="info-value">{tiers.raison_sociale}</span>
            </div>
            <div class="info-row">
                <span class="info-label">NIU:</span>
                <span class="info-value">{tiers.niu}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Date d'échéance:</span>
                <span class="info-value">{facture.date_echeance or 'N/A'}</span>
            </div>
        </div>

        <table class="table">
            <tr>
                <th>Description</th>
                <th>Montant HT (XAF)</th>
                <th>TVA (19.25%)</th>
                <th>Montant TTC (XAF)</th>
            </tr>
            <tr>
                <td>Services de transport - Mission {facture.mission_id or 'N/A'}</td>
                <td>{facture.montant_ht_xaf:,.0f}</td>
                <td>{facture.tva_xaf:,.0f}</td>
                <td>{facture.montant_ttc_xaf:,.0f}</td>
            </tr>
        </table>

        <div class="total">
            Total TTC: {facture.montant_ttc_xaf:,.0f} XAF
        </div>

        <div class="footer">
            <p>Document généré automatiquement par KAMLOG EM-ERP</p>
            <p>Port Autonome de Douala  Cameroun</p>
            <p>Date d'émission: {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}</p>
        </div>
    </body>
    </html>
    """

    try:
        html = HTML(string=html_content)
        pdf_bytes = html.write_pdf()
        return pdf_bytes
    except Exception as e:
        raise HTTPException(
            status.HTTP_500_INTERNAL_SERVER_ERROR,
            f"Erreur lors de la génération du PDF: {str(e)}"
        )
