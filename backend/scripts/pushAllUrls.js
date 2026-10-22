import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pushUrlToIndex } from '../services/googleIndexingService.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const seedPath = path.resolve(__dirname, '../../frontend/lib/seedPosts.json');

async function pushAllUrls() {
  console.log('Reading seedPosts.json...');
  const data = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
  
  const jobs = data.filter(post => post.slug);
  console.log(`Found ${jobs.length} valid jobs.`);
  
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < jobs.length; i++) {
    const job = jobs[i];
    const url = `https://sarkarijobalerts.com/job/${job.slug}/`;
    console.log(`[${i+1}/${jobs.length}] Pushing: ${url}`);
    
    const result = await pushUrlToIndex(url, 'URL_UPDATED');
    if (result) {
      successCount++;
    } else {
      failCount++;
    }
    
    // Slight delay to avoid hitting rate limits too fast (100ms)
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log('\n=====================================');
  console.log(`Done! Successfully pushed ${successCount} URLs.`);
  if (failCount > 0) {
    console.log(`Failed to push ${failCount} URLs.`);
  }
  console.log('=====================================');
}

pushAllUrls().catch(console.error);
