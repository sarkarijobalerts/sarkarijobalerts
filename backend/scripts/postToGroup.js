import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const seedPath = path.resolve(__dirname, '../../frontend/lib/seedPosts.json');

async function postTodaysJobsToGroupOnly() {
  console.log('================================================================');
  console.log("🚀 INITIATING MASS POSTING FOR TODAY'S JOBS TO FACEBOOK GROUP ONLY");
  console.log('================================================================\n');

  const groupId = process.env.FACEBOOK_GROUP_ID;
  const accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

  if (!groupId || !accessToken) {
    console.error('❌ FACEBOOK_GROUP_ID or ACCESS_TOKEN missing.');
    process.exit(1);
  }

  const posts = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
  const todayISO = new Date().toISOString().split('T')[0];
  const todayGB = new Date().toLocaleDateString('en-GB');

  const todaysPosts = posts.filter(p => (p.publishedDate && p.publishedDate.startsWith(todayISO)) || (p.postDate && p.postDate === todayGB));
  console.log(`📊 Found ${todaysPosts.length} post(s) updated today.\n`);

  let successCount = 0;

  for (const post of todaysPosts) {
    const title = post.rewrittenTitle || post.title;
    const shortInfo = post.shortInfo || '';
    const url = `https://sarkarijobalerts.com/job/${post.slug || ''}/`;
    const message = `🚨 New Job Alert: ${title}\n\n${shortInfo.substring(0, 150)}...\n\nApply now: ${url}`;

    console.log(`⏳ Posting to Group: "${title}"`);
    try {
      const response = await fetch(`https://graph.facebook.com/v19.0/${groupId}/feed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, link: url, access_token: accessToken }),
      });
      const data = await response.json();
      if (response.ok) {
        successCount++;
        console.log(`   ✅ Group Post ID: ${data.id}\n`);
      } else {
        console.error(`   ❌ [API Error]:`, data);
      }
    } catch (err) {
      console.error(`   ❌ [Fetch Failed]: ${err.message}`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log('================================================================');
  console.log(`🎉 FINISHED: Successfully posted ${successCount} job(s) to Facebook Group.`);
  console.log('================================================================');
}

postTodaysJobsToGroupOnly().then(() => process.exit(0)).catch(err => process.exit(1));
