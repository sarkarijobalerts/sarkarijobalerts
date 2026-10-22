/**
 * Data Cleanup Script for seedPosts.json
 * 
 * Fixes:
 * 1. Corrupted binary shortInfo (BSSC entry with 1MB of junk)
 * 2. Posts with "SARKARI RESULT®" as shortInfo (scraper artifact)
 * 
 * Usage: node scripts/fix-seed-data.mjs
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const seedPath = join(__dirname, '..', 'lib', 'seedPosts.json');
const data = JSON.parse(readFileSync(seedPath, 'utf-8'));

let fixedCount = 0;

data.forEach((post) => {
  const shortInfo = post.shortInfo || '';
  
  // Fix 1: Corrupted binary data (contains control characters or is excessively long)
  const hasBinaryJunk = /[\x00-\x08\x0E-\x1F]/.test(shortInfo) || shortInfo.length > 5000;
  
  // Fix 2: "SARKARI RESULT®" as shortInfo (scraper artifact from source website)
  const isSarkariResultBranding = shortInfo.trim() === 'SARKARI RESULT®' || shortInfo.trim() === 'SARKARI RESULT';
  
  if (hasBinaryJunk || isSarkariResultBranding) {
    // Generate a clean shortInfo from available post data
    const org = post.organizationName || post.organization || 'Recruitment Board';
    const title = post.rewrittenTitle || post.title || 'Government Recruitment';
    const vacancies = post.totalVacancies && post.totalVacancies !== 'N/A' 
      ? ` for ${post.totalVacancies} Posts` 
      : '';
    
    post.shortInfo = `${org} has released the official notification for ${title}${vacancies}. Candidates can check eligibility criteria, important dates, application fee, and apply online through the direct links provided below.`;
    
    console.log(`[FIXED] ${post.slug} | Reason: ${hasBinaryJunk ? 'binary corruption (' + shortInfo.length + ' bytes)' : 'SARKARI RESULT® branding'}`);
    fixedCount++;
  }
});

writeFileSync(seedPath, JSON.stringify(data, null, 2), 'utf-8');
console.log(`\n[Complete] Fixed ${fixedCount} posts in seedPosts.json`);
