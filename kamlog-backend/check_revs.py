import glob
import re

for f in glob.glob('migrations/versions/*.py'):
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
        match = re.search(r"revision = '([^']+)'", content)
        if match:
            rev_id = match.group(1)
            if len(rev_id) > 32:
                print(f'{f}: {rev_id} ({len(rev_id)} chars)')
