import py_compile
import os
import sys

errors = []
count = 0
for root, dirs, files in os.walk('app'):
    for f in files:
        if f.endswith('.py'):
            filepath = os.path.join(root, f)
            count += 1
            try:
                py_compile.compile(filepath, doraise=True)
            except py_compile.PyCompileError as e:
                errors.append((filepath, str(e)))

print(f"Checked {count} Python files")
if errors:
    print(f"\nFound {len(errors)} syntax errors:")
    for filepath, error in errors:
        print(f"\n--- {filepath} ---")
        # Print just the relevant error line
        lines = error.split('\n')
        for line in lines:
            if 'SyntaxError' in line or 'Error' in line:
                print(f"  {line.strip()}")
else:
    print("All files passed syntax check!")
