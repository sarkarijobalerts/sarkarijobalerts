/**
 * Standalone IndexNow URL Submission Script
 * Submits all sitemap and seedPosts URLs to IndexNow (Bing, Yandex, etc.)
 *
 * Usage: node scripts/submit-indexnow.mjs
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const HOST = 'sarkarijobalerts.com';
const KEY = 'a1b2c3d4e5f678901234567890abcdef';
const KEY_LOCATION = 'https://sarkarijobalerts.com/a1b2c3d4e5f678901234567890abcdef.txt';

const staticPages = [
  'https://sarkarijobalerts.com/',
  'https://sarkarijobalerts.com/latest-jobs/',
  'https://sarkarijobalerts.com/admit-cards/',
  'https://sarkarijobalerts.com/results/',
  'https://sarkarijobalerts.com/answer-key/',
  'https://sarkarijobalerts.com/syllabus/',
  'https://sarkarijobalerts.com/about/',
  'https://sarkarijobalerts.com/contact/',
  'https://sarkarijobalerts.com/disclaimer/',
  'https://sarkarijobalerts.com/privacy-policy/',
  'https://sarkarijobalerts.com/terms-and-conditions/',
];

// Load seed posts
const seedPath = join(__dirname, '..', 'lib', 'seedPosts.json');
const seedPosts = JSON.parse(readFileSync(seedPath, 'utf8'));

const jobUrls = seedPosts
  .filter(p => p.slug)
  .map(p => `https://sarkarijobalerts.com/job/${p.slug}/`);

const allUrls = Array.from(new Set([...staticPages, ...jobUrls]));

console.log(`[IndexNow] Preparing to submit ${allUrls.length} URLs to IndexNow...`);

const payload = {
  host: HOST,
  key: KEY,
  keyLocation: KEY_LOCATION,
  urlList: allUrls,
};

const endpoints = [
  'https://api.indexnow.org/indexnow',
  'https://www.bing.com/indexnow',
];

for (const endpoint of endpoints) {
  try {
    console.log(`[IndexNow] Sending request to ${endpoint}...`);
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    if (res.status === 200 || res.status === 202) {
      console.log(`[IndexNow] Success from ${endpoint}! Status: ${res.status}`);
    } else {
      const errText = await res.text().catch(() => '');
      console.warn(`[IndexNow] Received status ${res.status} from ${endpoint}: ${errText}`);
    }
  } catch (err) {
    console.error(`[IndexNow] Error calling ${endpoint}:`, err.message);
  }
}

console.log('[IndexNow] Submission completed.');
