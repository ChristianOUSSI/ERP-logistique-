import os
import re

backend_dir = r"d:\Projet\ERP\KAMLOG-EM-ERP\kamlog-backend\app"
backend_scripts = r"d:\Projet\ERP\KAMLOG-EM-ERP\kamlog-backend\scripts"

replacements = {
    r"User\.Role\.ADMIN": '"admin"',
    r"User\.Role\.DISPATCHER": '"dispatcher"',
    r"User\.Role\.FINANCE": '"finance"',
    r"User\.Role\.DOUANE": '"douane"',
    r"User\.Role\.GATE_AGENT": '"gate_agent"',
    r"User\.Role\.MAGASIN": '"magasin"',
    r"User\.Role\.AUDITOR": '"auditor"',
    r"Role\.ADMIN": '"admin"',
    r"Role\.DISPATCHER": '"dispatcher"',
    r"Role\.FINANCE": '"finance"',
    r"Role\.DOUANE": '"douane"',
    r"Role\.GATE_AGENT": '"gate_agent"',
    r"Role\.MAGASIN": '"magasin"',
    r"Role\.AUDITOR": '"auditor"',
}

dirs_to_process = [backend_dir, backend_scripts]

for d in dirs_to_process:
    for root, dirs, files in os.walk(d):
        if "__pycache__" in root or ".venv" in root or "venv" in root:
            continue
        for file in files:
            if file.endswith(".py"):
                filepath = os.path.join(root, file)
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    new_content = content
                    for pattern, replacement in replacements.items():
                        new_content = re.sub(pattern, replacement, new_content)
                        
                    if new_content != content:
                        with open(filepath, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                        print(f"Updated {filepath}")
                except Exception as e:
                    print(f"Error processing {filepath}: {e}")
