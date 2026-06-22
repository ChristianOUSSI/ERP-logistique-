import markdown2
from weasyprint import HTML, CSS
import os

def convert_markdown_to_pdf(md_file, pdf_file):
    # Read markdown file
    with open(md_file, 'r', encoding='utf-8') as f:
        md_content = f.read()
    
    # Convert markdown to HTML
    html_content = markdown2.markdown(md_content, extras=['tables', 'fenced-code-blocks'])
    
    # Add CSS styling
    css_content = """
    body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        margin: 40px;
    }
    h1 {
        color: #333;
        border-bottom: 2px solid #333;
        padding-bottom: 10px;
    }
    h2 {
        color: #555;
        border-bottom: 1px solid #555;
        padding-bottom: 5px;
        margin-top: 30px;
    }
    h3 {
        color: #666;
        margin-top: 20px;
    }
    table {
        border-collapse: collapse;
        width: 100%;
        margin: 20px 0;
    }
    th, td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
    }
    th {
        background-color: #f2f2f2;
    }
    code {
        background-color: #f4f4f4;
        padding: 2px 4px;
        border-radius: 3px;
    }
    pre {
        background-color: #f4f4f4;
        padding: 10px;
        border-radius: 5px;
        overflow-x: auto;
    }
    """
    
    # Create complete HTML document
    html_doc = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Document des Transactions</title>
        <style>{css_content}</style>
    </head>
    <body>
        {html_content}
    </body>
    </html>
    """
    
    # Convert HTML to PDF
    HTML(string=html_doc).write_pdf(pdf_file)
    print(f"PDF created successfully: {pdf_file}")

if __name__ == "__main__":
    md_file = "docs/DOCUMENT_TRANSACTIONS.md"
    pdf_file = "docs/DOCUMENT_TRANSACTIONS.pdf"
    
    # Get absolute paths
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    md_file = os.path.join(base_dir, md_file)
    pdf_file = os.path.join(base_dir, pdf_file)
    
    convert_markdown_to_pdf(md_file, pdf_file)
