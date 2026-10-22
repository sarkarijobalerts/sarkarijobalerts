import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pushUrlsToIndexNow } from '../services/indexNowService.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const seedPath = path.resolve(__dirname, '../../frontend/lib/seedPosts.json');

async function pushAllUrlsToIndexNow() {
  console.log('Reading seedPosts.json...');
  const data = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
  
  const jobs = data.filter(post => post.slug);
  console.log(`Found ${jobs.length} valid jobs.`);
  
  const urls = jobs.map(job => `https://sarkarijobalerts.com/job/${job.slug}/`);
  
  // IndexNow allows submitting up to 10,000 URLs per request
  const CHUNK_SIZE = 10000;
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < urls.length; i += CHUNK_SIZE) {
    const chunk = urls.slice(i, i + CHUNK_SIZE);
    console.log(`\nPushing chunk ${Math.floor(i/CHUNK_SIZE) + 1} (${chunk.length} URLs) to Bing IndexNow...`);
    
    const result = await pushUrlsToIndexNow(chunk);
    if (result) {
      successCount += chunk.length;
    } else {
      failCount += chunk.length;
    }
  }
  
  console.log('\n=====================================');
  console.log(`Done! Successfully pushed ${successCount} URLs to IndexNow.`);
  if (failCount > 0) {
    console.log(`Failed to push ${failCount} URLs.`);
  }
  console.log('=====================================');
}

pushAllUrlsToIndexNow().catch(console.error);
