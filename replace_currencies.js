const fs = require('fs');
const path = require('path');

function replaceCurrencies(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
        if (file === 'node_modules' || file === '.next') continue;
        
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            replaceCurrencies(fullPath);
        } else if (stat.isFile() && (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts'))) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;
            
            // Replace literal currencies
            const newContent = content.replace(/\b(USD|XAF|XOF|EUR)\b|€/g, 'FCFA');
            if (newContent !== content) {
                content = newContent;
                modified = true;
            }
            
            // Replace $ amount with amount FCFA
            // Specifically replacing $ followed by numbers like $14,204,500 -> 14,204,500 FCFA
            const dollarRegex = /\$([0-9.,]+(M|K|k|m)?)/g;
            const noDollarContent = content.replace(dollarRegex, '$1 FCFA');
            if (noDollarContent !== content) {
                content = noDollarContent;
                modified = true;
            }

            if (modified) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated currencies in ${fullPath}`);
            }
        }
    }
}

replaceCurrencies(path.join(__dirname, 'kamlog-frontend', 'src'));
console.log('Currency replacement complete.');
