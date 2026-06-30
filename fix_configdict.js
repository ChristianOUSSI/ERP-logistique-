const fs = require('fs');
const path = require('path');

const schemasDir = path.join(__dirname, 'kamlog-backend', 'app', 'schemas');
const files = fs.readdirSync(schemasDir).filter(f => f.endsWith('.py'));
let fixedCount = 0;

files.forEach(file => {
  const filePath = path.join(schemasDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Check if file uses ConfigDict but doesn't import it
  if (content.includes('ConfigDict') && !content.includes('import') ) {
    // This won't work because every file has imports, let's be more specific
  }
  
  // More precise: check if ConfigDict is used but NOT in any import line
  const lines = content.split('\n');
  const hasConfigDictUsage = lines.some(l => l.includes('ConfigDict') && !l.trim().startsWith('from ') && !l.trim().startsWith('import '));
  const hasConfigDictImport = lines.some(l => (l.trim().startsWith('from pydantic') || l.trim().startsWith('import')) && l.includes('ConfigDict'));
  
  if (hasConfigDictUsage && !hasConfigDictImport) {
    // Add ConfigDict to the pydantic import
    content = content.replace(
      /from pydantic import (.*)/,
      (match, imports) => {
        return `from pydantic import ${imports.trim()}, ConfigDict`;
      }
    );
    fs.writeFileSync(filePath, content, 'utf-8');
    fixedCount++;
    console.log('FIXED: ' + file);
  } else if (hasConfigDictUsage && hasConfigDictImport) {
    console.log('OK: ' + file + ' (already imports ConfigDict)');
  } else {
    console.log('SKIP: ' + file + ' (does not use ConfigDict)');
  }
});

console.log('\nTotal fixed: ' + fixedCount);
