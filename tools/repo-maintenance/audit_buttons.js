const fs = require('fs');
const path = require('path');
const repoRoot = path.resolve(__dirname, '..', '..');
const frontendRoot = path.join(repoRoot, 'kamlog-frontend');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

const appDir = path.join(frontendRoot, 'src', 'app', '(app)');
const results = [];

walkDir(appDir, (filePath) => {
  if (!filePath.endsWith('.tsx')) return;
  const content = fs.readFileSync(filePath, 'utf-8');
  const relPath = path.relative(frontendRoot, filePath);
  
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (line.includes('<button') && !line.includes('onClick') && !line.includes('type=')) {
      const context = lines.slice(idx, idx + 4).join(' ');
      if (!context.includes('onClick') && !context.includes('type=')) {
        results.push({
          file: relPath,
          line: idx + 1,
          snippet: line.trim().substring(0, 140)
        });
      }
    }
  });
});

console.log('DEAD BUTTONS (no onClick, no type=submit): ' + results.length);
results.forEach(r => {
  console.log(r.file + ':' + r.line + ' => ' + r.snippet);
});
