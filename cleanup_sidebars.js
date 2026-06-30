const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

const appDir = path.join(__dirname, 'kamlog-frontend', 'src', 'app', '(app)');
let modifiedCount = 0;

walkDir(appDir, (filePath) => {
  if (!filePath.endsWith('.tsx') || filePath.endsWith('layout.tsx')) return;

  let content = fs.readFileSync(filePath, 'utf-8');
  let originalContent = content;

  // 1. Remove hardcoded navigation aside sidebars
  // We look for <aside> tags that have "fixed" and ("left-0" or "left-[" or "w-[260px]" or "w-60")
  // and contain navigation-like text (e.g., "KAMLOG", "Port Operations", "Nouvelle Opération", "Dashboard", or module names)
  const asideRegex = /<aside[^>]*>([\s\S]*?)<\/aside>/g;
  content = content.replace(asideRegex, (match, innerContent) => {
    const isNavigationSidebar = 
      (match.includes('fixed') && (match.includes('left-0') || match.includes('w-[260px]') || match.includes('w-60') || match.includes('left-['))) &&
      (match.includes('KAMLOG') || match.includes('Port Operations') || match.includes('Nouvelle') || match.includes('Navigation') || match.includes('Sidebar'));
    
    if (isNavigationSidebar) {
      console.log(`Removing sidebar from: ${path.relative(appDir, filePath)}`);
      return '';
    }
    return match;
  });

  // 2. Remove margin-left and padding-left classes that offset the sidebar
  content = content.replace(/ml-\[260px\]/g, '');
  content = content.replace(/ml-60/g, '');
  content = content.replace(/pl-\[260px\]/g, '');
  content = content.replace(/pl-60/g, '');
  content = content.replace(/lg:ml-\[260px\]/g, '');
  content = content.replace(/lg:ml-60/g, '');
  
  // Also clean up any double spaces in className
  content = content.replace(/className="([^"]*)"/g, (match, classNames) => {
    const cleaned = classNames.replace(/\s+/g, ' ').trim();
    return `className="${cleaned}"`;
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8');
    modifiedCount++;
  }
});

console.log(`\nSuccessfully cleaned up sidebar/layout offsets in ${modifiedCount} files.`);
