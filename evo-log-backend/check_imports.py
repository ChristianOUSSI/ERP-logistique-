import ast
import os
import sys

# Parse __init__.py to find all imports
init_path = os.path.join('app', 'schemas', '__init__.py')
with open(init_path, 'r', encoding='utf-8') as f:
    content = f.read()

tree = ast.parse(content)

missing = []
for node in ast.walk(tree):
    if isinstance(node, ast.ImportFrom):
        module = node.module or ''
        # Convert module path to file path
        parts = module.split('.')
        if len(parts) >= 3 and parts[0] == 'app' and parts[1] == 'schemas':
            schema_file = os.path.join('app', 'schemas', parts[2] + '.py')
            if not os.path.exists(schema_file):
                for alias in node.names:
                    missing.append((module, alias.name, f"FILE NOT FOUND: {schema_file}"))
                continue
            
            # Parse the schema file to find defined classes
            with open(schema_file, 'r', encoding='utf-8') as f:
                try:
                    schema_tree = ast.parse(f.read())
                except SyntaxError:
                    for alias in node.names:
                        missing.append((module, alias.name, f"SYNTAX ERROR in {schema_file}"))
                    continue
            
            defined = set()
            for n in ast.walk(schema_tree):
                if isinstance(n, ast.ClassDef):
                    defined.add(n.name)
            
            for alias in node.names:
                if alias.name not in defined:
                    missing.append((module, alias.name, schema_file))

if missing:
    print(f"Found {len(missing)} missing imports:")
    for module, name, info in missing:
        print(f"  {name} from {module} (file: {info})")
else:
    print("All imports found!")
