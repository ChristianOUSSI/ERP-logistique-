const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'kamlog-frontend', 'src');
const libApiDir = path.join(srcDir, 'lib', 'api');
const typesDir = path.join(srcDir, 'types');

if (!fs.existsSync(typesDir)) {
  fs.mkdirSync(typesDir, { recursive: true });
}

// 1. Move lib/api/*.ts to types/*.ts and strip out the API implementations
const files = fs.readdirSync(libApiDir);
for (const file of files) {
  if (!file.endsWith('.ts')) continue;
  
  const content = fs.readFileSync(path.join(libApiDir, file), 'utf8');
  
  const classIndex = content.search(/class \w+API/);
  const constIndex = content.search(/export const \w+API/);
  
  let cutIndex = content.length;
  if (classIndex !== -1 && constIndex !== -1) cutIndex = Math.min(classIndex, constIndex);
  else if (classIndex !== -1) cutIndex = classIndex;
  else if (constIndex !== -1) cutIndex = constIndex;
  
  let newContent = content.substring(0, cutIndex);
  // Remove any imports of apiClient
  newContent = newContent.replace(/import \{ apiClient \} from '\.\.\/api-client';\n/g, '');
  newContent = newContent.replace(/import axios.*?\n/g, '');
  
  const targetPath = path.join(typesDir, file);
  // If file already exists in types, append to it, else create
  if (fs.existsSync(targetPath)) {
    fs.appendFileSync(targetPath, '\n' + newContent);
  } else {
    fs.writeFileSync(targetPath, newContent);
  }
}

// 2. Scan all .ts and .tsx files to update imports
function scanAndUpdate(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanAndUpdate(fullPath);
    } else if (entry.isFile() && (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx'))) {
      if (fullPath.includes('kamlog-frontend\\src\\lib\\api\\')) continue; 
      
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;

      // Regex to find: import { X, yAPI, Z } from '@/lib/api/module'
      const importRegex = /import\s+\{([^}]+)\}\s+from\s+['"]@\/lib\/api\/([^'"]+)['"];?/g;
      
      content = content.replace(importRegex, (match, imports, module) => {
        modified = true;
        
        const importedItems = imports.split(',').map(s => s.trim()).filter(s => s);
        
        const apiItems = importedItems.filter(s => s.endsWith('API'));
        const typeItems = importedItems.filter(s => !s.endsWith('API'));
        
        let newImports = [];
        if (apiItems.length > 0) {
          newImports.push(`import { ${apiItems.join(', ')} } from '@/lib/api-client';`);
        }
        if (typeItems.length > 0) {
          newImports.push(`import { ${typeItems.join(', ')} } from '@/types/${module}';`);
        }
        
        return newImports.join('\n');
      });

      if (modified) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated imports in ${fullPath}`);
      }
    }
  }
}

scanAndUpdate(path.join(srcDir, 'app'));
scanAndUpdate(path.join(srcDir, 'components'));
scanAndUpdate(path.join(srcDir, 'hooks'));

// 3. Delete lib/api
fs.rmSync(libApiDir, { recursive: true, force: true });
console.log('Deleted src/lib/api');
