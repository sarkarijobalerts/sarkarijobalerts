import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { sendTelegramMessage } from '../services/telegramService.js';
import { sendFacebookPost } from '../services/facebookService.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const seedPath = path.resolve(__dirname, '../../frontend/lib/seedPosts.json');

async function postTodaysJobs() {
  console.log('================================================================');
  console.log("🚀 INITIATING MASS SOCIAL MEDIA POSTING FOR TODAY'S JOBS");
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log('================================================================\n');

  if (!fs.existsSync(seedPath)) {
    console.error('❌ seedPosts.json not found!');
    process.exit(1);
  }

  const posts = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
  const todayISO = new Date().toISOString().split('T')[0]; // "2026-09-19"
  const todayGB = new Date().toLocaleDateString('en-GB'); // "19/09/2026" (fallback)

  const todaysPosts = posts.filter(p => {
    return (p.publishedDate && p.publishedDate.startsWith(todayISO)) || 
           (p.postDate && p.postDate === todayGB);
  });

  console.log(`📊 Found ${todaysPosts.length} post(s) updated today (${todayISO}).\n`);

  let successCount = 0;

  for (const post of todaysPosts) {
    console.log(`⏳ Posting: "${post.rewrittenTitle || post.title}"`);
    
    try {
      await sendTelegramMessage(post);
    } catch (err) {
      console.error(`   ❌ [Telegram Failed]: ${err.message}`);
    }

    try {
      await sendFacebookPost(post);
    } catch (err) {
      console.error(`   ❌ [Facebook Failed]: ${err.message}`);
    }

    successCount++;
    console.log(`   ✅ Sent to Social Media.\n`);
    
    // Slight delay to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log('================================================================');
  console.log(`🎉 FINISHED: Successfully posted ${successCount} job(s) to Telegram and Facebook.`);
  console.log('================================================================');
}

postTodaysJobs().then(() => process.exit(0)).catch(err => {
  console.error('💥 Execution failed:', err);
  process.exit(1);
});
