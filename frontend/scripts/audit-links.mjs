import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(full));
    } else if (file.endsWith('.html')) {
      results.push(full);
    }
  }
  return results;
}

const outDir = path.join(__dirname, '..', 'out');
const htmlFiles = walk(outDir);
const internalLinks = new Map();
const externalLinks = new Map();

for (const file of htmlFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const regex = /href="([^"]+)"/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const href = match[1];
    if (href.startsWith('http://') || href.startsWith('https://')) {
      if (!externalLinks.has(href)) externalLinks.set(href, 0);
      externalLinks.set(href, externalLinks.get(href) + 1);
    } else if (href.startsWith('/') && !href.startsWith('/_next') && !href.startsWith('/icon') && !href.startsWith('/favicon') && !href.startsWith('/apple')) {
      if (!internalLinks.has(href)) internalLinks.set(href, []);
      internalLinks.get(href).push(file);
    } else if (!href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
      console.log('Relative or broken link found in', file, '->', href);
    }
  }
}

console.log('--- Non-trailing slash internal links ---');
for (const [link, files] of internalLinks.entries()) {
  if (!link.endsWith('/') && !link.includes('.')) {
    console.log(link, `(${files.length} pages)`);
  }
}

console.log('--- External HTTP (insecure) links ---');
for (const [link, count] of externalLinks.entries()) {
  if (link.startsWith('http://')) {
    console.log(link, `(${count} occurrences)`);
  }
}
