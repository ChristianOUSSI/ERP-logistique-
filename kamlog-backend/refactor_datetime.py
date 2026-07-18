import os
import re

search_dir = "d:/Projet/ERP/KAMLOG-EM-ERP/kamlog-backend"

for root, dirs, files in os.walk(search_dir):
    if "venv" in root or "env" in root or "__pycache__" in root or ".git" in root or ".pytest_cache" in root:
        continue
    for file in files:
        if file.endswith(".py"):
            filepath = os.path.join(root, file)
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()

            original_content = content
            if "lambda: datetime.now(timezone.utc)" in content or "datetime.lambda: datetime.now(timezone.utc)" in content:
                # Add import if missing
                if "timezone" not in content:
                    if "from datetime import" in content:
                        content = re.sub(r'(from datetime import [^\n]+)', r'\1, timezone', content, count=1)
                    else:
                        content = "from datetime import timezone\n" + content

                # Replace usages
                content = content.replace("datetime.now(timezone.utc)", "datetime.now(timezone.utc)")
                content = content.replace("lambda: datetime.now(timezone.utc)", "lambda: datetime.now(timezone.utc)")
                content = content.replace("datetime.datetime.now(timezone.utc)", "datetime.datetime.now(timezone.utc)")
                content = content.replace("datetime.lambda: datetime.now(timezone.utc)", "lambda: datetime.datetime.now(timezone.utc)")

                # A little cleanup for lambda()
                content = content.replace("datetime.now(timezone.utc)", "datetime.now(timezone.utc)")
                content = content.replace("datetime.datetime.now(timezone.utc)", "datetime.datetime.now(timezone.utc)")
                
                # Cleanup in case default=lambda: datetime.now(timezone.utc) became default=lambda: datetime.now(timezone.utc)
                # This is actually fine for SQLAlchemy (default expects a callable)
                
                # But what if it wasn't default=?
                # If we broke syntax, let's just use the lambda for references without (), and the evaluated version for ()
                # Since we replaced () first, the remaining are without ().

                if content != original_content:
                    with open(filepath, "w", encoding="utf-8") as f:
                        f.write(content)
                    print(f"Refactored {filepath}")
