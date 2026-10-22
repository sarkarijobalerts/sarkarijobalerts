import { pushUrlToIndex } from './services/googleIndexingService.js';

async function test() {
  console.log('Testing Google Indexing API...');
  await pushUrlToIndex('https://sarkarijobalerts.com/job/test-job-alert/');
  console.log('Test completed.');
}

test();
