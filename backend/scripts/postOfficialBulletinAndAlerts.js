import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { sendTelegramMessage } from '../services/telegramService.js';
import { sendFacebookPost } from '../services/facebookService.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const seedPath = path.resolve(__dirname, '../../frontend/lib/seedPosts.json');
const posts = JSON.parse(fs.readFileSync(seedPath, 'utf8'));

const botToken = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHANNEL_ID;
const pageId = process.env.FACEBOOK_PAGE_ID;
const accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

async function postMasterBulletin() {
  console.log('📢 Sending Master Daily Update Bulletin to Telegram & Facebook...');

  const bulletinText = `📢 <b>TODAY'S TOP SARKARI JOB ALERTS (28 OCT 2026)</b> 📢
All official links are live and verified! Apply online, download admit cards & check results:

🔥 <b>LATEST RECRUITMENT NOTIFICATIONS:</b>
1️⃣ <b>NTA UGC NET Dec 2026 Online Form</b>
🔗 https://sarkarijobalerts.com/job/nta-ugc-net-december-2026-apply-online-form-5388/

2️⃣ <b>Supreme Court of India (SCI) Attendant (130 Posts)</b>
🔗 https://sarkarijobalerts.com/job/supreme-court-of-india-sci-junior-court-attendant-jca-recruitment-2026-exam-for-130-post-4879/

3️⃣ <b>Rajasthan Safai Karamchari Bharti (24,752 Posts)</b>
🔗 https://sarkarijobalerts.com/job/lsg-rajasthan-safai-karamchari-recruitment-2026-apply-online-for-4550/

4️⃣ <b>Delhi District Courts DSSSB Group C Posts</b>
🔗 https://sarkarijobalerts.com/job/delhi-district-and-session-court-dsssb-sweeper-safai-karamchari-and-chowkidar-advt-no-052026-recruitment-2026-apply-online-4915/

🎟️ <b>ADMIT CARDS & EXAM DATES:</b>
5️⃣ <b>UPSC Civil Services Mains Exam Admit Card</b>
🔗 https://sarkarijobalerts.com/job/upsc-civil-services-services-mains-admit-card-2026-4653/

6️⃣ <b>CISF Constable / Fire 1,130 Posts Exam Notice</b>
🔗 https://sarkarijobalerts.com/job/central-industrial-security-force-cisf-constable-fire-102-recruitment-2024-exam-date-for-1130-post-8643/

7️⃣ <b>UPPSC Lecturer Technical Education Admit Card</b>
🔗 https://sarkarijobalerts.com/job/uppsc-lecturer-technical-education-2025-admit-card-2026-1993/

🏆 <b>RESULTS & MERIT LISTS:</b>
8️⃣ <b>Bihar BPSC ASO Mains Exam Result</b>
🔗 https://sarkarijobalerts.com/job/bihar-bpsc-assistant-section-officer-aso-recruitment-2025-mains-result-for-41-post-5530/

9️⃣ <b>UPSSSC Stenographer Skill Test Results</b>
🔗 https://sarkarijobalerts.com/job/upsssc-stenographer-recruitment-2024-result-skill-test-result-2026-4086/

🌐 <b>Check All 340+ Live Govt Jobs:</b>
👉 https://sarkarijobalerts.com/`;

  // Telegram Bulletin
  try {
    const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: bulletinText,
        parse_mode: 'HTML',
        disable_web_page_preview: false,
      }),
    });
    const tgData = await tgRes.json();
    console.log('✅ Telegram Master Bulletin sent! Msg ID:', tgData.result?.message_id);
  } catch (e) {
    console.error('❌ Telegram Bulletin failed:', e.message);
  }

  // Facebook Bulletin
  try {
    const fbCaption = `📢 TODAY'S TOP SARKARI JOB ALERTS (28 OCT 2026) 📢\nAll official direct links are active and verified. Apply online, download admit cards, and view results:\n\n🔥 LATEST RECRUITMENTS:\n• NTA UGC NET Dec 2026: https://sarkarijobalerts.com/job/nta-ugc-net-december-2026-apply-online-form-5388/\n• Supreme Court of India Attendant (130 Posts): https://sarkarijobalerts.com/job/supreme-court-of-india-sci-junior-court-attendant-jca-recruitment-2026-exam-for-130-post-4879/\n• Rajasthan Safai Karamchari Bharti (24,752 Posts): https://sarkarijobalerts.com/job/lsg-rajasthan-safai-karamchari-recruitment-2026-apply-online-for-4550/\n• Delhi District Courts DSSSB Group C: https://sarkarijobalerts.com/job/delhi-district-and-session-court-dsssb-sweeper-safai-karamchari-and-chowkidar-advt-no-052026-recruitment-2026-apply-online-4915/\n\n🎟️ ADMIT CARDS & EXAMS:\n• UPSC Civil Services Mains Admit Card: https://sarkarijobalerts.com/job/upsc-civil-services-services-mains-admit-card-2026-4653/\n• CISF Constable Fire Exam Notice: https://sarkarijobalerts.com/job/central-industrial-security-force-cisf-constable-fire-102-recruitment-2024-exam-date-for-1130-post-8643/\n• UPPSC Lecturer Admit Card: https://sarkarijobalerts.com/job/uppsc-lecturer-technical-education-2025-admit-card-2026-1993/\n\n🏆 RESULTS:\n• Bihar BPSC ASO Mains Result: https://sarkarijobalerts.com/job/bihar-bpsc-assistant-section-officer-aso-recruitment-2025-mains-result-for-41-post-5530/\n• UPSSSC Stenographer Skill Test Results: https://sarkarijobalerts.com/job/upsssc-stenographer-recruitment-2024-result-skill-test-result-2026-4086/\n\n👉 Browse All Alerts: https://sarkarijobalerts.com/`;

    const imgPath = path.resolve(__dirname, '../../sarkari job.jpg');
    const fileBuffer = fs.readFileSync(imgPath);
    const blob = new Blob([fileBuffer], { type: 'image/jpeg' });
    const formData = new FormData();
    formData.append('source', blob, 'sarkari-job.jpg');
    formData.append('caption', fbCaption);
    formData.append('access_token', accessToken);

    const fbRes = await fetch(`https://graph.facebook.com/v19.0/${pageId}/photos`, {
      method: 'POST',
      body: formData,
    });
    const fbData = await fbRes.json();
    console.log('✅ Facebook Master Bulletin sent! Post ID:', fbData.post_id || fbData.id);
  } catch (e) {
    console.error('❌ Facebook Bulletin failed:', e.message);
  }
}

async function postIndividualTopAlerts() {
  console.log('\n📱 Posting Individual Verified Job Alerts for Top 5 Major Jobs...');
  const keySlugs = [
    'nta-ugc-net-december-2026-apply-online-form-5388',
    'supreme-court-of-india-sci-junior-court-attendant-jca-recruitment-2026-exam-for-130-post-4879',
    'lsg-rajasthan-safai-karamchari-recruitment-2026-apply-online-for-4550',
    'delhi-district-and-session-court-dsssb-sweeper-safai-karamchari-and-chowkidar-advt-no-052026-recruitment-2026-apply-online-4915',
    'central-industrial-security-force-cisf-constable-fire-102-recruitment-2024-exam-date-for-1130-post-8643',
  ];

  for (const slug of keySlugs) {
    const post = posts.find(p => p.slug === slug);
    if (!post) continue;

    console.log(`\n⏳ Sending Alert: "${post.rewrittenTitle || post.title}"...`);
    try {
      await sendTelegramMessage(post);
    } catch (e) {
      console.error('   ❌ Telegram error:', e.message);
    }

    try {
      await sendFacebookPost(post);
    } catch (e) {
      console.error('   ❌ Facebook error:', e.message);
    }

    await new Promise(r => setTimeout(r, 2500));
  }
}

(async () => {
  await postMasterBulletin();
  await postIndividualTopAlerts();
  console.log('\n🎉 ALL SOCIAL MEDIA POSTING COMPLETED SUCCESSFULLY!');
})();
