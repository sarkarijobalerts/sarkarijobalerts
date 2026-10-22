import cron from 'node-cron';
import { TARGET_PORTALS, discoverNewJobLinks, scrapeJobDetails } from './scraperService.js';
import { processScrapedDataWithGemini } from './geminiService.js';
import { sendPushNotification } from './onesignalService.js';
import { sendTelegramMessage } from './telegramService.js';
import { pushUrlsToIndexNow } from './indexNowService.js';
import { Post } from '../models/Post.js';

let isRunning = false;

/**
 * Executes a full automation cycle:
 * 1. Discover target links
 * 2. Deduplicate against MongoDB
 * 3. Scrape detail pages via Puppeteer Stealth
 * 4. Pass raw payload to Gemini API for structured JSON generation
 * 5. Save structured document to MongoDB
 */
export async function executeScrapingCycle() {
  if (isRunning) {
    console.log('[Cron] Scraping cycle is already in progress. Skipping execution...');
    return { success: false, message: 'Scraping cycle currently in progress' };
  }

  isRunning = true;
  console.log('=====================================================');
  console.log(`[Cron] Automated Job Alert Cycle Started: ${new Date().toISOString()}`);
  console.log('=====================================================');

  let totalProcessed = 0;
  let totalSaved = 0;

  try {
    for (const portal of TARGET_PORTALS) {
      console.log(`[Cron] Processing Category: '${portal.category}' from ${portal.url}`);
      const newLinks = await discoverNewJobLinks(portal.url, portal.category);

      // Limit per cycle to avoid rate limits or memory exhaustion
      const linksToProcess = newLinks.slice(0, 3);

      for (const item of linksToProcess) {
        totalProcessed++;

        // Step 1: Scrape raw details
        const rawData = await scrapeJobDetails(item.url, item.category, item.title);
        if (!rawData) continue;

        // Step 2: Rewrite & optimize via Gemini API SDK using exact responseSchema
        console.log(`[Cron] Sending '${rawData.title}' to Gemini API for structured JSON rewriting...`);
        const aiResult = await processScrapedDataWithGemini(rawData);

        // Step 3: Anti-duplication safeguard & Save to MongoDB
        const exists = await Post.isDuplicateUrl(rawData.sourceUrl);
        if (exists) {
          console.log(`[Cron] Post already saved in database: ${rawData.sourceUrl}`);
          continue;
        }

        const details = aiResult.jobDetails || {};
        const seo = aiResult.seo || {};

        const newPost = new Post({
          title: rawData.title,
          rewrittenTitle: details.title || rawData.title,
          metaTitle: seo.metaTitle || rawData.title,
          metaDescription: seo.metaDescription || rawData.shortInfo,
          slug: seo.slug,
          primaryKeyword: seo.primaryKeyword || '',
          category: rawData.category,
          sourceUrl: rawData.sourceUrl,
          organizationName: details.organizationName || rawData.organization,
          postName: details.postName || rawData.title,
          totalVacancies: details.totalVacancies || 'N/A',
          postDate: rawData.postDate,
          shortInfo: details.shortInfo || rawData.shortInfo,
          importantDates: details.importantDates || [],
          applicationFee: details.applicationFee || [],
          ageLimit: details.ageLimit || {},
          vacanciesTable: details.vacanciesTable || [],
          howToApply: details.howToApply || [],
          importantLinks: details.importantLinks || [],
        });

        await newPost.save();
        totalSaved++;
        console.log(`[Cron] Successfully saved post: "${details.title}" (Slug: ${seo.slug})`);

        // Trigger OneSignal Web Push Notification (non-blocking async)
        const jobUrl = `https://sarkarijobalerts.com/job/${newPost.slug || seo.slug}/`;
        sendPushNotification({
          title: `New Job Alert: ${newPost.rewrittenTitle || newPost.title}`,
          message: `${newPost.organizationName || 'Govt Recruitment Board'} - ${newPost.shortInfo ? newPost.shortInfo.substring(0, 90) + '...' : 'Check eligibility & apply online.'}`,
          url: jobUrl,
        }).catch((err) => console.error(`[Cron OneSignal Error] Non-blocking push notification error: ${err.message}`));

        // Trigger Telegram Channel Notification (non-blocking async)
        sendTelegramMessage(newPost).catch((err) =>
          console.error(`[Cron Telegram Error] Non-blocking Telegram message error: ${err.message}`)
        );

        // Trigger IndexNow Submission (non-blocking async)
        pushUrlsToIndexNow([jobUrl]).catch((err) =>
          console.error(`[Cron IndexNow Error] Non-blocking IndexNow submission error: ${err.message}`)
        );
      }
    }
  } catch (error) {
    console.error(`[Cron Error] Scraping cycle failed: ${error.message}`);
  } finally {
    isRunning = false;
    console.log('=====================================================');
    console.log(`[Cron] Cycle Finished. Processed: ${totalProcessed}, Saved: ${totalSaved}`);
    console.log('=====================================================');
  }

  return { success: true, processed: totalProcessed, saved: totalSaved };
}

/**
 * Initialize Node-Cron Scheduler (Runs every 30 minutes)
 */
export function startCronScheduler() {
  console.log('[Cron] Initializing node-cron schedule (Every 30 minutes: */30 * * * *)...');
  
  cron.schedule('*/30 * * * *', async () => {
    await executeScrapingCycle();
  });
}
