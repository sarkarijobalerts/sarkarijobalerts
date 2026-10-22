import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function buildSitemapFromPosts(posts = []) {
  const baseUrl = 'https://sarkarijobalerts.com';
  const now = new Date().toISOString();

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Homepage
  xml += `  <url>\n    <loc>${baseUrl}/</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>always</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;

  // Main Category & Policy Pages
  const staticPages = [
    '/latest-jobs/',
    '/admit-cards/',
    '/results/',
    '/about/',
    '/contact/',
    '/privacy-policy/',
    '/terms-and-conditions/',
    '/disclaimer/',
  ];

  staticPages.forEach((p) => {
    xml += `  <url>\n    <loc>${baseUrl}${p}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
  });

  // Dynamic Job Detail Pages
  posts.forEach((post) => {
    if (post.slug) {
      xml += `  <url>\n    <loc>${baseUrl}/job/${post.slug}/</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    }
  });

  xml += `</urlset>`;

  const targetPath = path.resolve(__dirname, '../../frontend/public/sitemap.xml');
  fs.writeFileSync(targetPath, xml);
  console.log(`[Sitemap] Generated sitemap.xml with ${posts.length + staticPages.length + 1} URLs at ${targetPath}`);
}
