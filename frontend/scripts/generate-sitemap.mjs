/**
 * Build-time Sitemap Generator for sarkarijobalerts.com
 * 
 * Run this script BEFORE `next build` to auto-generate sitemap.xml from seedPosts.json.
 * Usage: node scripts/generate-sitemap.mjs
 * 
 * Only includes high-value pages: homepage, category pages, and individual job posts.
 * Now also includes legal/info pages (about, contact, privacy, terms, disclaimer)
 * to ensure they are discovered and indexed by Google.
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SITE_URL = 'https://sarkarijobalerts.com';

// Load seed posts
const seedPostsPath = join(__dirname, '..', 'lib', 'seedPosts.json');
const seedPosts = JSON.parse(readFileSync(seedPostsPath, 'utf-8'));

function generateSitemap() {
  const now = new Date().toISOString();

  // High-priority static pages (homepage, categories, and info pages)
  const staticPages = [
    { loc: '/', changefreq: 'always', priority: '1.0', lastmod: now },
    { loc: '/latest-jobs/', changefreq: 'daily', priority: '0.9', lastmod: now },
    { loc: '/admit-cards/', changefreq: 'daily', priority: '0.9', lastmod: now },
    { loc: '/results/', changefreq: 'daily', priority: '0.9', lastmod: now },
    { loc: '/answer-key/', changefreq: 'daily', priority: '0.8', lastmod: now },
    { loc: '/syllabus/', changefreq: 'daily', priority: '0.8', lastmod: now },
    { loc: '/about/', changefreq: 'monthly', priority: '0.5', lastmod: now },
    { loc: '/contact/', changefreq: 'monthly', priority: '0.5', lastmod: now },
    { loc: '/disclaimer/', changefreq: 'monthly', priority: '0.5', lastmod: now },
    { loc: '/privacy-policy/', changefreq: 'monthly', priority: '0.5', lastmod: now },
    { loc: '/terms-and-conditions/', changefreq: 'monthly', priority: '0.5', lastmod: now },
  ];

  // Only include job posts from high-value categories
  const validCategories = ['Latest Jobs', 'Admit Cards', 'Results', 'Answer Key', 'Syllabus'];
  
  const jobPages = seedPosts
    .filter((post) => post.slug && validCategories.includes(post.category))
    .map((post) => {
      // Determine lastmod from post data
      let lastmod = now;
      if (post.publishedDate) {
        const d = new Date(post.publishedDate);
        if (!isNaN(d.getTime())) lastmod = d.toISOString();
      } else if (post.postDate && typeof post.postDate === 'string' && post.postDate.includes('/')) {
        const parts = post.postDate.split('/');
        if (parts.length === 3) {
          const [day, month, year] = parts;
          const d = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
          if (!isNaN(d.getTime())) lastmod = d.toISOString();
        }
      }

      return {
        loc: `/job/${post.slug}/`,
        changefreq: 'weekly',
        priority: '0.8',
        lastmod,
      };
    });

  const allPages = [...staticPages, ...jobPages];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `  <url>
    <loc>${SITE_URL}${page.loc}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  const outputPath = join(__dirname, '..', 'public', 'sitemap.xml');
  writeFileSync(outputPath, xml, 'utf-8');

  console.log(`[Sitemap Generator] Generated sitemap.xml with ${allPages.length} URLs`);
  console.log(`  - Static pages: ${staticPages.length}`);
  console.log(`  - Job pages: ${jobPages.length}`);
  console.log(`  - Output: ${outputPath}`);
}

generateSitemap();
