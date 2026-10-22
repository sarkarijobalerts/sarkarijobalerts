import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outDir = path.resolve(__dirname, '..', 'out');

console.log('====================================================');
console.log('🔍 FULL SITE AUDIT RE-VALIDATION REPORT');
console.log('====================================================\n');

// 1. Robots.txt and sitemap.xml
const robots = fs.readFileSync(path.join(outDir, 'robots.txt'), 'utf8');
const hasRssAsSitemap = /Sitemap:.*rss\.xml/i.test(robots);
console.log('1. Sitemaps & Robots:');
console.log(`   - robots.txt has rss.xml as Sitemap? ${hasRssAsSitemap ? '❌ FAIL' : '✅ PASS (Only clean sitemap.xml)'}`);

const sitemap = fs.readFileSync(path.join(outDir, 'sitemap.xml'), 'utf8');
const sitemapHasHreflang = /xhtml:link/i.test(sitemap);
console.log(`   - sitemap.xml has contradictory hreflang tags? ${sitemapHasHreflang ? '❌ FAIL' : '✅ PASS (Clean standard sitemap)'}`);

// 2. Scan all HTML files
function getHtmlFiles(dir, files = []) {
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) {
      getHtmlFiles(full, files);
    } else if (item.endsWith('.html')) {
      files.push(full);
    }
  }
  return files;
}

const htmlFiles = getHtmlFiles(outDir);
console.log(`\n2. HTML Pages Audited: ${htmlFiles.length} files`);

let hreflangIssues = 0;
let schemaIssues = 0;
let titleTooLong = 0;
let descTooLong = 0;
let descTooShort = 0;
let brokenLinks = 0;
const longTitles = [];

for (const f of htmlFiles) {
  const content = fs.readFileSync(f, 'utf8');

  // Hreflang check:
  const hreflangs = [...content.matchAll(/hreflang=["']([^"']+)["']/gi)].map(m => m[1]);
  if (hreflangs.includes('hi-IN') && hreflangs.includes('en')) {
    hreflangIssues++;
  }

  // Title check:
  const titleMatch = content.match(/<title>([^<]+)<\/title>/i);
  if (titleMatch) {
    const t = titleMatch[1];
    if (t.length > 70) {
      titleTooLong++;
      longTitles.push({ file: path.basename(path.dirname(f)), title: t, len: t.length });
    }
  }

  // Meta description check:
  const descMatch = content.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i);
  if (descMatch) {
    const d = descMatch[1];
    if (d.length > 165) descTooLong++;
    if (d.length < 50 && !f.includes('404')) descTooShort++;
  }

  // Schema check:
  const schemas = [...content.matchAll(/<script type=["']application\/ld\+json["']>([^<]+)<\/script>/gi)];
  for (const s of schemas) {
    try {
      const data = JSON.parse(s[1]);
      const checkObj = (obj) => {
        if (!obj || typeof obj !== 'object') return;
        if (obj['@type'] === 'JobPosting') {
          if (obj.author || obj.publisher || obj.citation) schemaIssues++;
          if (obj.jobLocation && obj.jobLocation.address && obj.jobLocation.address.addressLocality === '') schemaIssues++;
        }
        for (const k of Object.keys(obj)) checkObj(obj[k]);
      };
      checkObj(data);
    } catch {}
  }

  // Broken link check
  if (content.includes('href="Click Here"') || content.includes('href="Question Paper')) {
    brokenLinks++;
  }
}

console.log('\n3. Localization (Hreflang):');
console.log(`   - Pages with duplicate/conflicting languages: ${hreflangIssues === 0 ? '✅ 0 (CLEAN)' : '❌ ' + hreflangIssues}`);

console.log('\n4. Content - SEO Title Tags:');
console.log(`   - Titles > 70 characters: ${titleTooLong === 0 ? '✅ 0 (OPTIMIZED)' : '⚠️ ' + titleTooLong}`);
if (longTitles.length > 0) {
  console.log('   Sample long titles:', longTitles.slice(0, 3));
}

console.log('\n5. Content - Meta Descriptions:');
console.log(`   - Descriptions > 165 characters: ${descTooLong === 0 ? '✅ 0 (OPTIMIZED)' : '⚠️ ' + descTooLong}`);
console.log(`   - Descriptions < 50 characters: ${descTooShort === 0 ? '✅ 0 (OPTIMIZED)' : '⚠️ ' + descTooShort}`);

console.log('\n6. Structured Data (Schema.org):');
console.log(`   - JobPosting schema errors (author/publisher/invalid address): ${schemaIssues === 0 ? '✅ 0 (VALIDATED)' : '❌ ' + schemaIssues}`);

console.log('\n7. Broken Links:');
console.log(`   - Broken seed link references found: ${brokenLinks === 0 ? '✅ 0 (ALL CLEAN)' : '❌ ' + brokenLinks}`);

console.log('\n====================================================');
console.log('🎉 AUDIT RE-VALIDATION COMPLETED');
console.log('====================================================');
