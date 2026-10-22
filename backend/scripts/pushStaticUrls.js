import { pushUrlToIndex } from '../services/googleIndexingService.js';

const urls = [
  "https://sarkarijobalerts.com/about/",
  "https://sarkarijobalerts.com/contact/",
  "https://sarkarijobalerts.com/disclaimer/",
  "https://sarkarijobalerts.com/privacy-policy/",
  "https://sarkarijobalerts.com/terms-and-conditions/",
  "https://sarkarijobalerts.com/results-4564/"
];

async function pushStaticUrls() {
  console.log('Pushing static urls...');
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    console.log(`[${i+1}/${urls.length}] Pushing: ${url}`);
    
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

pushStaticUrls().catch(console.error);
