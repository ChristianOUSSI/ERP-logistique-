const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..', '..');
const baseDir = path.join(repoRoot, 'kamlog-frontend', 'src', 'app', '(app)');
const outputFile = path.join(__dirname, 'modules_list.json');

function getPages(dir, relativePath = '') {
    let pages = [];
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            pages = pages.concat(getPages(fullPath, path.join(relativePath, file)));
        } else if (file === 'page.tsx') {
            pages.push(path.join(relativePath, file).replace(/\\/g, '/'));
        }
    }
    return pages;
}

const allPages = getPages(baseDir);
fs.writeFileSync(outputFile, JSON.stringify(allPages, null, 2));
console.log(`Found ${allPages.length} pages.`);
