import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import dotenv from 'dotenv';
import { TARGET_PORTALS, discoverNewJobLinks, scrapeJobDetails } from '../services/scraperService.js';
import { processScrapedDataWithGemini } from '../services/geminiService.js';
import { pushUrlToIndex } from '../services/googleIndexingService.js';
import { pushUrlsToIndexNow } from '../services/indexNowService.js';
import { sendTelegramMessage } from '../services/telegramService.js';
import { sendFacebookPost } from '../services/facebookService.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });
const seedPath = path.resolve(__dirname, '../../frontend/lib/seedPosts.json');

async function runManualFullUpdate() {
  console.log('================================================================');
  console.log('🔥 MANUAL FULL-SITE DATA UPDATE & DEPLOYMENT INITIATED 🔥');
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log('================================================================\n');

  // Load existing seed posts
  let existingPosts = [];
  if (fs.existsSync(seedPath)) {
    existingPosts = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
  }
  const existingSlugs = new Set(existingPosts.map(p => p.slug));
  const existingUrls = new Set(existingPosts.map(p => p.sourceUrl));

  console.log(`[Database/Seed Check] Loaded ${existingPosts.length} existing posts from seedPosts.json.`);

  const newScrapedPosts = [];

  for (const portal of TARGET_PORTALS) {
    console.log(`\n----------------------------------------------------`);
    console.log(`🌐 [Category Fetch] Portal: '${portal.name}' (${portal.category}) -> ${portal.url}`);
    console.log(`----------------------------------------------------`);

    try {
      const candidates = await discoverNewJobLinks(portal.url, portal.category);
      console.log(`   Found ${candidates.length} link candidates for category '${portal.category}'`);

      // Filter out links already present in seedPosts.json
      const freshCandidates = candidates.filter(item => !existingUrls.has(item.url));
      console.log(`   ${freshCandidates.length} brand-new link(s) queued for processing.`);

      // Process top fresh items per category (limit 4 items per category for fast execution & rate limits)
      const toProcess = freshCandidates.slice(0, 4);

      for (const item of toProcess) {
        console.log(`\n⏳ Scraping: "${item.title}"`);
        console.log(`   URL: ${item.url}`);

        const rawData = await scrapeJobDetails(item.url, item.category, item.title);
        if (!rawData) {
          console.warn(`   ⚠️ Scraper returned null payload for ${item.url}`);
          continue;
        }

        console.log(`   🤖 Sending raw content to Gemini AI for structuring & SEO optimization...`);
        let aiResult;
        try {
          aiResult = await processScrapedDataWithGemini(rawData);
        } catch (geminiErr) {
          const cleanShortInfo = (rawData.shortInfo && !rawData.shortInfo.toLowerCase().includes('sarkari result') && rawData.shortInfo.length > 25)
            ? rawData.shortInfo
            : `${rawData.title} recruitment notification details, eligibility criteria, vacancy breakdown, and official direct application links.`;

          const cleanVacancies = (rawData.vacancyDetails || []).filter(v => {
            const p = (v.postName || '').toLowerCase();
            return !p.includes('name of post') && !p.includes('post date') && !p.includes('short info') && !p.includes('android app') && !p.includes('sarkari') && !p.includes('download notification') && !p.includes('apply online') && !p.includes('official website');
          });

          const cleanLinks = (rawData.officialLinks || []).map(l => {
            if (!l.url || l.url.includes('sarkariresult.com')) {
              return { label: 'Official Recruitment Portal', url: rawData.sourceUrl || 'https://sarkarijobalerts.com/' };
            }
            return { label: l.linkTitle || l.label || 'Official Link', url: l.url };
          });

          aiResult = {
            seo: {
              metaTitle: rawData.title,
              metaDescription: cleanShortInfo,
              slug: item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
              primaryKeyword: item.title,
            },
            jobDetails: {
              title: rawData.title,
              shortInfo: cleanShortInfo,
              importantDates: rawData.importantDates,
              applicationFee: rawData.applicationFee,
              vacanciesTable: cleanVacancies.length > 0 ? cleanVacancies : [{ postName: rawData.title, totalPost: 'Various', eligibility: 'Passed relevant qualification from recognized board/university.' }],
              importantLinks: cleanLinks,
              ageLimit: rawData.ageLimit,
              howToApply: ['Read official notification carefully before applying online.', 'Submit application on official portal.'],
              organizationName: rawData.organization,
              postName: rawData.title,
              totalVacancies: 'Various',
            },
          };
        }

        const details = aiResult.jobDetails || {};
        const seo = aiResult.seo || {};
        const slug = seo.slug || item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        if (existingSlugs.has(slug)) {
          console.log(`   ⚠️ Slug '${slug}' already exists in seedPosts.json, skipping.`);
          continue;
        }

        const postRecord = {
          _id: `scraped_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
          title: rawData.title,
          rewrittenTitle: details.title || rawData.title,
          metaTitle: seo.metaTitle || rawData.title,
          metaDescription: seo.metaDescription || rawData.shortInfo,
          slug: slug,
          primaryKeyword: seo.primaryKeyword || '',
          category: rawData.category,
          sourceUrl: rawData.sourceUrl,
          organizationName: details.organizationName || rawData.organization,
          postName: details.postName || rawData.title,
          totalVacancies: details.totalVacancies || 'Various',
          postDate: new Date().toLocaleDateString('en-GB'),
          shortInfo: details.shortInfo || rawData.shortInfo,
          importantDates: details.importantDates || rawData.importantDates || [],
          applicationFee: details.applicationFee || rawData.applicationFee || [],
          ageLimit: details.ageLimit || rawData.ageLimit || {},
          vacanciesTable: details.vacanciesTable || rawData.vacancyDetails || [],
          howToApply: details.howToApply || ['Read official notification before applying online.'],
          importantLinks: details.importantLinks || rawData.officialLinks || [],
          publishedDate: new Date().toISOString(),
        };

        newScrapedPosts.push(postRecord);
        existingSlugs.add(slug);
        existingUrls.add(rawData.sourceUrl);
        console.log(`   ✅ Successfully processed & appended post: "${postRecord.rewrittenTitle}"`);
        
        // Push the new URL to Google Indexing API & IndexNow
        const newPostUrl = `https://sarkarijobalerts.com/job/${slug}/`;
        console.log(`   🚀 Pushing to Google Indexing API: ${newPostUrl}`);
        await pushUrlToIndex(newPostUrl, 'URL_UPDATED');
        console.log(`   🚀 Pushing to IndexNow API: ${newPostUrl}`);
        await pushUrlsToIndexNow(newPostUrl);

        // Trigger Social Media Posts
        console.log(`   📱 Pushing to Social Media Channels...`);
        await sendTelegramMessage(postRecord).catch(err => console.error(`   ❌ [Telegram] ${err.message}`));
        await sendFacebookPost(postRecord).catch(err => console.error(`   ❌ [Facebook] ${err.message}`));
      }
    } catch (catErr) {
      console.error(`❌ Error processing portal ${portal.name}: ${catErr.message}`);
    }
  }

  console.log(`\n================================================================`);
  console.log(`📊 SCRAPING SUMMARY: ${newScrapedPosts.length} new posts generated.`);
  console.log(`================================================================\n`);

  // Merge new posts at top of seedPosts array
  const updatedSeedPosts = [...newScrapedPosts, ...existingPosts];
  fs.writeFileSync(seedPath, JSON.stringify(updatedSeedPosts, null, 2), 'utf8');
  console.log(`💾 Updated seedPosts.json written! Total posts in dataset: ${updatedSeedPosts.length}`);

  return { newPostsCount: newScrapedPosts.length, totalPosts: updatedSeedPosts.length };
}

runManualFullUpdate()
  .then(res => {
    console.log(`\n🎉 Manual update completed with ${res.newPostsCount} new post(s).`);
    process.exit(0);
  })
  .catch(err => {
    console.error(`💥 Execution failed: ${err.message}`);
    process.exit(1);
  });
