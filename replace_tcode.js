const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'kamlog-frontend', 'src');

function traverse(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (file === 'node_modules' || file === '.next') continue;
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            traverse(fullPath);
        } else if (fullPath.endsWith('.tsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes('Rechercher T-Code')) {
                // Find the div wrapper of the input
                // It usually starts with <div className="relative focus-within... and ends after </input></div> or </div>
                
                // Let's use regex to find the block
                const regex = /<div[^>]*>\s*<span[^>]*>search<\/span>\s*<input[^>]*placeholder="Rechercher T-Code[^>]*\/>\s*<\/div>/s;
                
                if (regex.test(content)) {
                    content = content.replace(regex, '<TCodeSearch />');
                    
                    // Add import if not exists
                    if (!content.includes('TCodeSearch')) { // should include now because we just replaced, check for import
                        // Find last import
                        const importRegex = /import [^;]+;/g;
                        let match;
                        let lastImportIndex = 0;
                        while ((match = importRegex.exec(content)) !== null) {
                            lastImportIndex = match.index + match[0].length;
                        }
                        
                        const importStr = "\nimport { TCodeSearch } from '@/components/ui/TCodeSearch';\n";
                        if (lastImportIndex > 0) {
                            content = content.slice(0, lastImportIndex) + importStr + content.slice(lastImportIndex);
                        } else {
                            content = importStr + content;
                        }
                    }
                    
                    fs.writeFileSync(fullPath, content, 'utf8');
                    console.log(`Replaced T-Code input in ${fullPath}`);
                }
            }
        }
    }
}

traverse(srcDir);
console.log('T-Code search UI injection complete.');
