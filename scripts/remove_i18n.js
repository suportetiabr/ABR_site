const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'src');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  // Remove attributes: data-i18n (standalone) and data-i18n-xxx="..."
  content = content.replace(/\sdata-i18n(?![-a-zA-Z0-9])/g, '');
  content = content.replace(/\sdata-i18n-[a-zA-Z0-9-]+="[^"]*"/g, '');
  content = content.replace(/\sdata-i18n-aria-label/g, '');
  content = content.replace(/\sdata-i18n-title/g, '');
  content = content.replace(/\sdata-i18n-alt/g, '');
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Processed', filePath);
}

function walk(dirPath) {
  const files = fs.readdirSync(dirPath);
  files.forEach(f => {
    const full = path.join(dirPath, f);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walk(full);
    else if (full.endsWith('.html')) processFile(full);
  });
}

walk(dir);
console.log('Done');
