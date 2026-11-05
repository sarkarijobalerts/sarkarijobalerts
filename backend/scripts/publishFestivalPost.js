import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { FESTIVAL_CAMPAIGNS } from './renderAllFestivals.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const PAGE_ID = process.env.FACEBOOK_PAGE_ID || '1204392889428589';
const PAGE_ACCESS_TOKEN = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID || '@sarkarijobalerts_live';

/**
 * Send festive photo post to Facebook Page
 */
export async function postFestivalToFacebook(campaign, imagePath) {
  if (!PAGE_ACCESS_TOKEN) {
    console.warn(`[Facebook Warning] FACEBOOK_PAGE_ACCESS_TOKEN missing. Skipping Facebook post.`);
    return null;
  }

  console.log(`[Facebook Campaign] Publishing "${campaign.name}" to Page ${PAGE_ID}...`);

  try {
    const fileBuffer = fs.readFileSync(imagePath);
    const blob = new Blob([fileBuffer], { type: 'image/png' });
    const formData = new FormData();
    formData.append('source', blob, `${campaign.id}_1080x1080.png`);
    formData.append('caption', campaign.caption);
    formData.append('access_token', PAGE_ACCESS_TOKEN);

    const response = await fetch(`https://graph.facebook.com/v19.0/${PAGE_ID}/photos`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    if (response.ok) {
      console.log(`✅ [Facebook Campaign] Successfully posted "${campaign.name}"! Post ID: ${data.post_id || data.id}`);
      return data;
    } else {
      console.error(`❌ [Facebook Error] Post failed for ${campaign.name}:`, JSON.stringify(data));
      return null;
    }
  } catch (error) {
    console.error(`❌ [Facebook Exception] ${error.message}`);
    return null;
  }
}

/**
 * Send festive photo post to Telegram Channel
 */
export async function postFestivalToTelegram(campaign, imagePath) {
  if (!TELEGRAM_BOT_TOKEN) {
    console.warn(`[Telegram Warning] TELEGRAM_BOT_TOKEN missing. Skipping Telegram post.`);
    return null;
  }

  console.log(`[Telegram Campaign] Publishing "${campaign.name}" to channel ${TELEGRAM_CHANNEL_ID}...`);

  try {
    const fileBuffer = fs.readFileSync(imagePath);
    const blob = new Blob([fileBuffer], { type: 'image/png' });
    const formData = new FormData();
    formData.append('chat_id', TELEGRAM_CHANNEL_ID);
    formData.append('photo', blob, `${campaign.id}_1080x1080.png`);
    formData.append('caption', campaign.telegramCaption || campaign.caption);
    formData.append('parse_mode', 'HTML');

    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    if (data.ok) {
      console.log(`✅ [Telegram Campaign] Successfully posted "${campaign.name}"! Message ID: ${data.result?.message_id}`);
      return data.result;
    } else {
      console.error(`❌ [Telegram Error] Post failed for ${campaign.name}:`, JSON.stringify(data));
      return null;
    }
  } catch (error) {
    console.error(`❌ [Telegram Exception] ${error.message}`);
    return null;
  }
}

/**
 * Trigger publication for a specific festival by ID
 */
export async function executeFestivalBroadcast(campaignId) {
  const campaign = FESTIVAL_CAMPAIGNS.find(c => c.id === campaignId);
  if (!campaign) {
    throw new Error(`Campaign ID "${campaignId}" not found in matrix.`);
  }

  const imagePath = path.resolve(__dirname, `../assets/festival_output/${campaign.outputImageName}`);
  if (!fs.existsSync(imagePath)) {
    throw new Error(`Composited festive image not found at ${imagePath}. Please run renderAllFestivals.js first.`);
  }

  console.log(`\n================================================================`);
  console.log(`🚀 EXECUTING FESTIVAL BROADCAST: ${campaign.name.toUpperCase()} 🚀`);
  console.log(`Date: ${new Date().toISOString()}`);
  console.log(`Image: ${imagePath}`);
  console.log(`================================================================\n`);

  const results = {
    facebook: await postFestivalToFacebook(campaign, imagePath),
    telegram: await postFestivalToTelegram(campaign, imagePath),
  };

  console.log(`\n🎉 Broadcast completed for "${campaign.name}". Results:`, {
    facebook: !!results.facebook,
    telegram: !!results.telegram,
  });

  return results;
}

// Allow CLI invocation: node scripts/publishFestivalPost.js [dhanteras|choti_diwali|diwali|govardhan_puja|bhai_dooj|today]
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const targetArg = process.argv[2];

  if (!targetArg) {
    console.log('Usage: node scripts/publishFestivalPost.js <campaign_id|today>');
    console.log('Available campaign IDs:', FESTIVAL_CAMPAIGNS.map(c => c.id).join(', '));
    process.exit(1);
  }

  let campaignToRun;
  if (targetArg === 'today') {
    // Current IST date YYYY-MM-DD
    const nowIST = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date());
    campaignToRun = FESTIVAL_CAMPAIGNS.find(c => c.date === nowIST);
    if (!campaignToRun) {
      console.log(`ℹ️ No festival scheduled for today (${nowIST}). Available dates:`, FESTIVAL_CAMPAIGNS.map(c => `${c.id} (${c.date})`).join(', '));
      process.exit(0);
    }
  } else {
    campaignToRun = FESTIVAL_CAMPAIGNS.find(c => c.id === targetArg);
  }

  if (!campaignToRun) {
    console.error(`❌ Invalid campaign: ${targetArg}`);
    process.exit(1);
  }

  executeFestivalBroadcast(campaignToRun.id)
    .then(() => process.exit(0))
    .catch(err => {
      console.error('❌ Execution error:', err.message);
      process.exit(1);
    });
}
