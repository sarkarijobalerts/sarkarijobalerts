import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const seedPath = path.resolve(__dirname, '../../frontend/lib/seedPosts.json');
const expiredPath = path.resolve(__dirname, '../../frontend/lib/expiredSlugs.json');

const CUTOFF_DAYS = 60;
const cutoffTime = Date.now() - (CUTOFF_DAYS * 24 * 60 * 60 * 1000);

// Basic date parser for formats like "DD/MM/YYYY" or "19-20 November 2026"
function parseDateString(str) {
  if (!str) return 0;
  
  // Try DD/MM/YYYY
  const dmmyyyyMatch = str.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (dmmyyyyMatch) {
    const [, d, m, y] = dmmyyyyMatch;
    return new Date(`${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`).getTime();
  }
  
  // Try YYYY-MM-DD
  const ymdMatch = str.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (ymdMatch) {
    const [, y, m, d] = ymdMatch;
    return new Date(`${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`).getTime();
  }

  // Try extracting Month and Year (e.g. "November 2026")
  const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december', 'jan', 'feb', 'mar', 'apr', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  const lowerStr = str.toLowerCase();
  for (let i = 0; i < months.length; i++) {
    if (lowerStr.includes(months[i])) {
      const yearMatch = str.match(/\d{4}/);
      if (yearMatch) {
        // approximate month/year
        return new Date(`${months[i]} 1, ${yearMatch[0]}`).getTime();
      }
    }
  }

  // Fallback to JS standard Date parsing
  const parsed = Date.parse(str);
  if (!isNaN(parsed)) return parsed;
  
  return 0;
}

function run() {
  console.log('Loading seedPosts.json...');
  const posts = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
  
  let existingExpired = [];
  if (fs.existsSync(expiredPath)) {
    existingExpired = JSON.parse(fs.readFileSync(expiredPath, 'utf8'));
  }
  
  const activePosts = [];
  const newExpiredSlugs = [];

  for (const post of posts) {
    let latestTime = 0;
    
    // Parse postDate
    if (post.postDate) {
      latestTime = Math.max(latestTime, parseDateString(post.postDate));
    }
    if (post.publishedDate) {
      latestTime = Math.max(latestTime, parseDateString(post.publishedDate));
    }

    // Parse importantDates
    if (post.importantDates && Array.isArray(post.importantDates)) {
      for (const d of post.importantDates) {
        const time = parseDateString(d.dateValue);
        if (time > latestTime) {
          latestTime = time;
        }
      }
    }

    // If we couldn't parse a single date, keep it just to be safe
    if (latestTime === 0) {
      activePosts.push(post);
      continue;
    }

    if (latestTime < cutoffTime) {
      newExpiredSlugs.push(post.slug);
      console.log(`[Expired] ${post.slug} (Latest Date: ${new Date(latestTime).toISOString()})`);
    } else {
      activePosts.push(post);
    }
  }

  console.log(`Original total posts: ${posts.length}`);
  console.log(`Expired posts found: ${newExpiredSlugs.length}`);
  console.log(`Active posts remaining: ${activePosts.length}`);

  // Merge with previously expired slugs so we don't lose old ones
  const finalExpiredSlugs = Array.from(new Set([...existingExpired, ...newExpiredSlugs]));

  // Save back
  fs.writeFileSync(seedPath, JSON.stringify(activePosts, null, 2), 'utf8');
  fs.writeFileSync(expiredPath, JSON.stringify(finalExpiredSlugs, null, 2), 'utf8');
  
  console.log('Successfully pruned expired jobs and updated frontend files.');
}

run();
