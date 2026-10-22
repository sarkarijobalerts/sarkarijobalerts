/**
 * Telegram Channel Bot Automation Service
 * Automatically posts formatted job alerts to Telegram channel @sarkarijobalerts_live
 */

export async function sendTelegramMessage(jobData) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN || '8897742173:AAFpAVhQl5A-us57x30rpOWVTQIRWT9_4ow';
  const chatId = process.env.TELEGRAM_CHANNEL_ID || '@sarkarijobalerts_live';

  if (!botToken) {
    console.warn('[Telegram Warning] TELEGRAM_BOT_TOKEN is missing in environment variables. Skipping Telegram post.');
    return null;
  }

  const orgName = jobData.organizationName || jobData.organization || 'Government Recruitment Board';
  const jobTitle = jobData.rewrittenTitle || jobData.title || 'New Job Recruitment Notification';
  const vacancies = jobData.totalVacancies || 'Various Posts';
  const slug = jobData.slug || 'job-alert';
  const jobUrl = `https://sarkarijobalerts.com/job/${slug}/`;

  // Escape special HTML characters to prevent Telegram HTML parse errors
  const safeOrg = orgName.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const safeTitle = jobTitle.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const safeVacancies = vacancies.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const messageHtml = `🚨 <b>NEW SARKARI JOB ALERT</b> 🚨

🏢 <b>Org:</b> ${safeOrg}
📝 <b>Post:</b> ${safeTitle}
🎯 <b>Vacancies:</b> ${safeVacancies}

👇 <b>Read Full Details & Apply Online:</b>
🔗 ${jobUrl}`;

  const payload = {
    chat_id: chatId,
    text: messageHtml,
    parse_mode: 'HTML',
    disable_web_page_preview: false,
  };

  try {
    console.log(`[Telegram Service] Posting to channel ${chatId}: "${safeTitle}"...`);

    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (response.ok && data.ok) {
      console.log(`[Telegram Service] Message successfully posted to Telegram! Message ID: ${data.result?.message_id}`);
      return data;
    } else {
      console.error(`[Telegram Error] API returned error:`, data);
      return null;
    }
  } catch (error) {
    console.error(`[Telegram Exception] Failed to send Telegram message: ${error.message}`);
    return null;
  }
}
