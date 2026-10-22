import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildSitemapFromPosts } from './generateSitemap.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const seedPath = path.resolve(__dirname, '../../frontend/lib/seedPosts.json');
const seedPosts = JSON.parse(fs.readFileSync(seedPath, 'utf8'));

console.log(`Building sitemap.xml for ${seedPosts.length} jobs...`);
buildSitemapFromPosts(seedPosts);
