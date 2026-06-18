from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from reportlab.lib import colors
import re
import os

def parse_markdown(md_content):
    """Parse markdown content and return a list of platypus flowables."""
    flowables = []
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=18,
        textColor=colors.HexColor('#333333'),
        spaceAfter=12,
        spaceBefore=12,
        alignment=TA_CENTER
    )
    
    heading2_style = ParagraphStyle(
        'CustomHeading2',
        parent=styles['Heading2'],
        fontSize=14,
        textColor=colors.HexColor('#555555'),
        spaceAfter=10,
        spaceBefore=10
    )
    
    heading3_style = ParagraphStyle(
        'CustomHeading3',
        parent=styles['Heading3'],
        fontSize=12,
        textColor=colors.HexColor('#666666'),
        spaceAfter=8,
        spaceBefore=8
    )
    
    body_style = ParagraphStyle(
        'CustomBody',
        parent=styles['BodyText'],
        fontSize=10,
        spaceAfter=6,
        leading=14
    )
    
    lines = md_content.split('\n')
    i = 0
    
    while i < len(lines):
        line = lines[i].strip()
        
        # Skip empty lines
        if not line:
            i += 1
            continue
        
        # Handle headings
        if line.startswith('# '):
            flowables.append(Paragraph(line[2:], title_style))
            flowables.append(Spacer(1, 0.1*inch))
        elif line.startswith('## '):
            flowables.append(Paragraph(line[3:], heading2_style))
            flowables.append(Spacer(1, 0.05*inch))
        elif line.startswith('### '):
            flowables.append(Paragraph(line[4:], heading3_style))
            flowables.append(Spacer(1, 0.03*inch))
        
        # Handle tables
        elif line.startswith('|'):
            # Collect all table rows
            table_rows = []
            while i < len(lines) and lines[i].strip().startswith('|'):
                row = [cell.strip() for cell in lines[i].strip().split('|')[1:-1]]
                table_rows.append(row)
                i += 1
            
            # Skip separator row
            if table_rows and all(c.startswith('-') or c == '' for c in table_rows[1]):
                table_rows = [table_rows[0]] + table_rows[2:]
            
            # Create table
            if table_rows:
                table = Table(table_rows)
                table.setStyle(TableStyle([
                    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#f2f2f2')),
                    ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
                    ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                    ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                    ('FONTSIZE', (0, 0), (-1, 0), 10),
                    ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                    ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
                    ('GRID', (0, 0), (-1, -1), 1, colors.black),
                    ('FONTSIZE', (0, 1), (-1, -1), 9),
                ]))
                flowables.append(table)
                flowables.append(Spacer(1, 0.1*inch))
            continue
        
        # Handle code blocks
        elif line.startswith('```'):
            code_content = []
            i += 1
            while i < len(lines) and not lines[i].strip().startswith('```'):
                code_content.append(lines[i])
                i += 1
            code_text = '\n'.join(code_content)
            code_style = ParagraphStyle(
                'Code',
                parent=body_style,
                fontName='Courier',
                fontSize=8,
                leftIndent=20,
                backColor=colors.HexColor('#f4f4f4'),
                spaceAfter=10
            )
            flowables.append(Paragraph(code_text, code_style))
        
        # Handle lists
        elif line.startswith('- ') or line.startswith('* '):
            list_items = []
            while i < len(lines) and (lines[i].strip().startswith('- ') or lines[i].strip().startswith('* ')):
                list_items.append(lines[i].strip()[2:])
                i += 1
            for item in list_items:
                flowables.append(Paragraph(f"• {item}", body_style))
            continue
        
        # Handle regular text
        else:
            # Handle bold text
            line = re.sub(r'\*\*(.*?)\*\*', r'<b>\1</b>', line)
            # Handle italic text
            line = re.sub(r'\*(.*?)\*', r'<i>\1</i>', line)
            # Handle code
            line = re.sub(r'`(.*?)`', r'<font face="Courier">\1</font>', line)
            
            flowables.append(Paragraph(line, body_style))
        
        i += 1
    
    return flowables

def convert_markdown_to_pdf(md_file, pdf_file, author=""):
    """Convert markdown file to PDF using reportlab."""
    # Read markdown file
    with open(md_file, 'r', encoding='utf-8') as f:
        md_content = f.read()
    
    # Create PDF document with author metadata
    doc = SimpleDocTemplate(
        pdf_file, 
        pagesize=letter,
        author=author,
        title="KAMLOG EM-ERP Documentation"
    )
    
    # Parse markdown and create flowables
    flowables = parse_markdown(md_content)
    
    # Build PDF
    doc.build(flowables)
    
    print(f"PDF created successfully: {pdf_file}")

if __name__ == "__main__":
    import sys
    
    # Default to transactions document if no arguments provided
    if len(sys.argv) < 2:
        md_file = "docs/DOCUMENT_TRANSACTIONS.md"
        pdf_file = "docs/DOCUMENT_TRANSACTIONS.pdf"
        author = ""
    else:
        md_file = sys.argv[1]
        pdf_file = sys.argv[2] if len(sys.argv) > 2 else md_file.replace('.md', '.pdf')
        author = sys.argv[3] if len(sys.argv) > 3 else ""
    
    # Get absolute paths
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    md_file = os.path.join(base_dir, md_file)
    pdf_file = os.path.join(base_dir, pdf_file)
    
    convert_markdown_to_pdf(md_file, pdf_file, author)
