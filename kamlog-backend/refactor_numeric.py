import os

search_dir = "d:/Projet/ERP/KAMLOG-EM-ERP/kamlog-backend/app/models"

for root, dirs, files in os.walk(search_dir):
    if "__pycache__" in root:
        continue
    for file in files:
        if file.endswith(".py"):
            filepath = os.path.join(root, file)
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()

            original_content = content
            content = content.replace("Numeric(15, 2)", "Numeric(18, 4)")
            content = content.replace("Numeric(10, 3)", "Numeric(18, 4)")
            
            if content != original_content:
                with open(filepath, "w", encoding="utf-8") as f:
                    f.write(content)
                print(f"Refactored Numeric fields in {filepath}")
