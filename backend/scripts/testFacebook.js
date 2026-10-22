import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { sendFacebookPost } from '../services/facebookService.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function runTest() {
  console.log('[Test Facebook] Sending test job alert message to Facebook Page...');

  const sampleJob = {
    title: 'Test Post: System Integration Check',
    rewrittenTitle: 'Test Post: System Integration Check 2026',
    slug: 'test-post-system-integration',
    shortInfo: 'This is an automated test post to verify the Facebook Graph API integration. If you see this, the system is working perfectly!',
  };

  const result = await sendFacebookPost(sampleJob);
  
  if (result) {
    console.log('[Test Facebook Result]: SUCCESS. Post ID:', result.id);
  } else {
    console.log('[Test Facebook Result]: FAILED');
  }
}

runTest();
