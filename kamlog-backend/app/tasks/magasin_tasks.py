import os
import io
import time
from celery.utils.log import get_task_logger
from app.celery_app import celery_app
from app.database import SessionLocal
from app.models.magasin import OrdreTransfert, LigneOrdreTransfert, Article, Magasin
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch

logger = get_task_logger(__name__)

def build_pdf_content(ot_data: dict, lignes: list) -> io.BytesIO:
    """Génère le PDF en utilisant reportlab, avec 5 pages identiques"""
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4, rightMargin=30, leftMargin=30, topMargin=30, bottomMargin=30)
    
    styles = getSampleStyleSheet()
    title_style = styles['Heading1']
    title_style.alignment = 1 # Center
    normal_style = styles['Normal']
    bold_style = ParagraphStyle('Bold', parent=normal_style, fontName='Helvetica-Bold')
    
    elements = []
    
    # Générer le contenu d'une page
    def build_page_elements():
        page_elements = []
        page_elements.append(Paragraph(f"BON D'ENLEVEMENT - KAMLOG EM-ERP", title_style))
        page_elements.append(Spacer(1, 0.2 * inch))
        
        # En-tête (Numéro OT, Date, Magasin Source/Dest)
        header_data = [
            ["N° Ordre Transfert:", ot_data['numero_ot'], "Date de validation:", ot_data['date_validation']],
            ["Magasin Source:", ot_data['magasin_source_nom'], "Magasin Destination:", ot_data['magasin_dest_nom']],
            ["Autorisé par:", ot_data['autorise_par'], "", ""]
        ]
        t = Table(header_data, colWidths=[1.5*inch, 2*inch, 1.5*inch, 2.5*inch])
        t.setStyle(TableStyle([
            ('FONTNAME', (0,0), (-1,-1), 'Helvetica'),
            ('FONTNAME', (0,0), (0,-1), 'Helvetica-Bold'),
            ('FONTNAME', (2,0), (2,-1), 'Helvetica-Bold'),
            ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ]))
        page_elements.append(t)
        page_elements.append(Spacer(1, 0.3 * inch))
        
        # Détails du transport (à remplir par le chauffeur/magasinier)
        page_elements.append(Paragraph("DÉTAILS DU TRANSPORT", styles['Heading2']))
        transport_data = [
            ["Nom du Chauffeur:", "________________________", "Matricule Véhicule:", "________________________"],
            ["Date d'enlèvement:", "________________________", "N° Téléphone:", "________________________"]
        ]
        t2 = Table(transport_data, colWidths=[1.5*inch, 2*inch, 1.5*inch, 2.5*inch])
        t2.setStyle(TableStyle([
            ('FONTNAME', (0,0), (-1,-1), 'Helvetica'),
            ('FONTNAME', (0,0), (0,-1), 'Helvetica-Bold'),
            ('FONTNAME', (2,0), (2,-1), 'Helvetica-Bold'),
            ('BOTTOMPADDING', (0,0), (-1,-1), 10),
        ]))
        page_elements.append(t2)
        page_elements.append(Spacer(1, 0.3 * inch))
        
        # Lignes d'articles
        page_elements.append(Paragraph("ARTICLES À ENLEVER", styles['Heading2']))
        lignes_data = [["Code Article", "Description", "Quantité", "Unité"]]
        for ligne in lignes:
            lignes_data.append([
                ligne['code_article'],
                ligne['nom_article'],
                str(ligne['quantite']),
                ligne['unite_mesure']
            ])
            
        t3 = Table(lignes_data, colWidths=[1.5*inch, 3*inch, 1.5*inch, 1.5*inch])
        t3.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.grey),
            ('TEXTCOLOR', (0,0), (-1,0), colors.whitesmoke),
            ('ALIGN', (0,0), (-1,-1), 'CENTER'),
            ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
            ('BOTTOMPADDING', (0,0), (-1,0), 12),
            ('BACKGROUND', (0,1), (-1,-1), colors.beige),
            ('GRID', (0,0), (-1,-1), 1, colors.black),
        ]))
        page_elements.append(t3)
        page_elements.append(Spacer(1, 0.5 * inch))
        
        # Signatures (5 champs comme demandé)
        page_elements.append(Paragraph("SIGNATURES (Obligatoires)", styles['Heading2']))
        signatures_data = [
            ["Magasinier Source", "Transporteur / Chauffeur", "Sécurité (Sortie)"],
            ["", "", ""],
            ["", "", ""],
            ["", "", ""]
        ]
        t4 = Table(signatures_data, colWidths=[2.5*inch, 2.5*inch, 2.5*inch])
        t4.setStyle(TableStyle([
            ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
            ('ALIGN', (0,0), (-1,0), 'CENTER'),
            ('GRID', (0,0), (-1,-1), 1, colors.black),
            ('ROWBACKGROUNDS', (0,0), (-1,0), [colors.lightgrey]),
            ('BOTTOMPADDING', (0,1), (-1,-1), 40), # Espace pour signer
        ]))
        page_elements.append(t4)
        
        return page_elements
        
    # Construire 5 pages identiques
    for i in range(5):
        elements.extend(build_page_elements())
        if i < 4:
            from reportlab.platypus import PageBreak
            elements.append(PageBreak())
            
    doc.build(elements)
    buffer.seek(0)
    return buffer


@celery_app.task(name="generate_bon_enlevement_pdf_async")
def generate_bon_enlevement_pdf_async(ot_id: int):
    """
    Tâche Celery qui génère un PDF pour un Ordre de Transfert validé.
    Le document génère 5 exemplaires (5 pages identiques) du bon d'enlèvement.
    """
    logger.info(f"Début de la génération du Bon d'Enlèvement pour l'OT {ot_id}")
    
    db = SessionLocal()
    try:
        ot = db.query(OrdreTransfert).filter(OrdreTransfert.id == ot_id).first()
        if not ot:
            logger.error(f"OT {ot_id} non trouvé en base.")
            return False
            
        mag_source = db.query(Magasin).filter(Magasin.id == ot.magasin_source_id).first()
        mag_dest = db.query(Magasin).filter(Magasin.id == ot.magasin_dest_id).first()
        
        # Préparer les données pour le PDF
        ot_data = {
            "numero_ot": ot.numero_ot,
            "date_validation": ot.date_validation.strftime("%d/%m/%Y %H:%M") if ot.date_validation else "",
            "magasin_source_nom": mag_source.nom if mag_source else "Inconnu",
            "magasin_dest_nom": mag_dest.nom if mag_dest else "Inconnu",
            "autorise_par": ot.autorise_par or "Service Client"
        }
        
        lignes = []
        for l in ot.lignes:
            article = db.query(Article).filter(Article.id == l.article_id).first()
            lignes.append({
                "code_article": article.code_article if article else "N/A",
                "nom_article": article.nom if article else "Article Inconnu",
                "quantite": l.quantite,
                "unite_mesure": l.unite_mesure.value if l.unite_mesure else ""
            })
            
        logger.info("Données récupérées, construction du PDF avec ReportLab...")
        pdf_buffer = build_pdf_content(ot_data, lignes)
        
        # Sauvegarde du fichier localement (pourrait être envoyé sur Minio S3 dans la vraie vie)
        # On va créer le dossier public/documents/ot s'il n'existe pas
        os.makedirs("public/documents/ot", exist_ok=True)
        pdf_path = f"public/documents/ot/{ot.numero_ot}_Bon_Enlevement.pdf"
        
        with open(pdf_path, "wb") as f:
            f.write(pdf_buffer.getbuffer())
            
        logger.info(f"✅ Bon d'enlèvement généré avec succès: {pdf_path} (5 exemplaires inclus)")
        return True
        
    except Exception as e:
        logger.error(f"❌ Erreur lors de la génération du PDF pour OT {ot_id}: {str(e)}")
        return False
    finally:
        db.close()
