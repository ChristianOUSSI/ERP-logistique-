import os
import ast

def get_python_files(directory):
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith('.py'):
                yield os.path.join(root, file)

def check_imports(app_dir):
    all_modules = set()
    for file in get_python_files(app_dir):
        module_path = os.path.relpath(file, app_dir).replace(os.sep, '.')[:-3]
        if module_path.endswith('.__init__'):
            module_path = module_path[:-9]
        all_modules.add(f"app.{module_path}")

    print(f"Found {len(all_modules)} modules in app.")
    
    missing_imports = []
    
    for file in get_python_files(app_dir):
        with open(file, 'r', encoding='utf-8') as f:
            try:
                tree = ast.parse(f.read(), filename=file)
            except SyntaxError as e:
                print(f"SyntaxError in {file}: {e}")
                continue
                
        for node in ast.walk(tree):
            if isinstance(node, ast.ImportFrom):
                if node.module and node.module.startswith('app.'):
                    # We can't easily verify the exact names without loading the module,
                    # but we can verify the module exists.
                    if node.module not in all_modules:
                        # Sometimes it might be a file or a directory
                        print(f"WARNING: Module {node.module} imported in {file} does not seem to exist.")
            
if __name__ == '__main__':
    check_imports('app')
