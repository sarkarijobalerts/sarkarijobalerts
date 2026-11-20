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
import { buildSitemapFromPosts } from './generateSitemap.js';
import { deployToHostinger } from './deployHostingerViaMcp.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });
const seedPath = path.resolve(__dirname, '../../frontend/lib/seedPosts.json');

function detectTrueCategory(title, rewrittenTitle, sourceUrl, fallbackCategory) {
  const t = (String(title || '') + ' ' + String(rewrittenTitle || '') + ' ' + String(sourceUrl || '')).toLowerCase();
  if (
    t.includes('final result') ||
    t.includes('exam result') ||
    t.includes('written result') ||
    t.includes('marks') ||
    t.includes('score card') ||
    t.includes('scorecard') ||
    t.includes('cutoff') ||
    t.includes('cut off') ||
    t.includes('cut-off') ||
    t.includes('merit list') ||
    t.includes('selection list') ||
    t.includes('result declared') ||
    t.includes('download result')
  ) {
    return 'Results';
  }
  if (
    t.includes('answer key') ||
    t.includes('ans key') ||
    t.includes('response sheet') ||
    t.includes('omr sheet') ||
    t.includes('objection') ||
    t.includes('paper solution')
  ) {
    return 'Answer Key';
  }
  if (
    t.includes('admit card') ||
    t.includes('hall ticket') ||
    t.includes('call letter') ||
    t.includes('exam city') ||
    t.includes('city intimation') ||
    t.includes('exam date')
  ) {
    return 'Admit Cards';
  }
  if (
    t.includes('syllabus') ||
    t.includes('exam pattern') ||
    t.includes('scheme of exam')
  ) {
    return 'Syllabus';
  }
  return fallbackCategory || 'Latest Jobs';
}

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

        const detectedCategory = detectTrueCategory(rawData.title, details.title, rawData.sourceUrl, rawData.category);

        const postRecord = {
          _id: `scraped_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
          title: rawData.title,
          rewrittenTitle: details.title || rawData.title,
          metaTitle: seo.metaTitle || rawData.title,
          metaDescription: seo.metaDescription || rawData.shortInfo,
          slug: slug,
          primaryKeyword: seo.primaryKeyword || '',
          category: detectedCategory,
          sourceUrl: rawData.sourceUrl,
          organizationName: details.organizationName || rawData.organization,
          postName: details.postName || rawData.title,
          totalVacancies: details.totalVacancies || 'Various',
          postDate: new Date().toLocaleDateString('en-GB'),
          shortInfo: details.shortInfo || rawData.shortInfo,
          expertTake: details.expertTake || '',
          selectionProcess: details.selectionProcess || '',
          preparationStrategy: details.preparationStrategy || '',
          importantDates: details.importantDates || rawData.importantDates || [],
          applicationFee: details.applicationFee || rawData.applicationFee || [],
          ageLimit: details.ageLimit || rawData.ageLimit || {},
          vacanciesTable: details.vacanciesTable || rawData.vacancyDetails || [],
          howToApply: details.howToApply || ['Read official notification before applying online.'],
          faqs: details.faqs || [],
          importantLinks: details.importantLinks || rawData.officialLinks || [],
          publishedDate: new Date().toISOString(),
        };

        newScrapedPosts.push(postRecord);
        existingPosts.unshift(postRecord);
        existingSlugs.add(slug);
        existingUrls.add(rawData.sourceUrl);
        // Save incrementally after each post so progress is never lost on interruption
        fs.writeFileSync(seedPath, JSON.stringify(existingPosts, null, 2), 'utf8');
        console.log(`   ✅ Successfully processed & saved post: "${postRecord.rewrittenTitle}" (Total: ${existingPosts.length})`);
        
        // Push the new URL to Google Indexing API & IndexNow
        const newPostUrl = `https://sarkarijobalerts.com/job/${slug}/`;
        console.log(`   🚀 Pushing to Google Indexing API: ${newPostUrl}`);
        await pushUrlToIndex(newPostUrl, 'URL_UPDATED');
        console.log(`   🚀 Pushing to IndexNow API: ${newPostUrl}`);
        await pushUrlsToIndexNow(newPostUrl);

        // Trigger Social Media Posts
        const skipTelegram = process.argv.includes('--skip-telegram');
        const skipFacebook = process.argv.includes('--skip-facebook');
        if (!skipTelegram || !skipFacebook) {
          console.log(`   📱 Pushing to Social Media Channels...`);
          if (!skipTelegram) {
            await sendTelegramMessage(postRecord).catch(err => console.error(`   ❌ [Telegram] ${err.message}`));
          }
          if (!skipFacebook) {
            await sendFacebookPost(postRecord).catch(err => console.error(`   ❌ [Facebook] ${err.message}`));
          }
        }
      }
    } catch (catErr) {
      console.error(`❌ Error processing portal ${portal.name}: ${catErr.message}`);
    }
  }

  console.log(`\n================================================================`);
  console.log(`📊 SCRAPING SUMMARY: ${newScrapedPosts.length} new posts generated.`);
  console.log(`================================================================\n`);

  console.log(`💾 seedPosts.json finalized! Total posts in dataset: ${existingPosts.length}`);

  if (newScrapedPosts.length > 0) {
    console.log(`\n🏗️ Step A: Regenerating sitemap.xml...`);
    buildSitemapFromPosts(existingPosts);

    console.log(`🏗️ Step B: Building Next.js static export for production...`);
    try {
      execSync('npm run build', { cwd: path.resolve(__dirname, '../../frontend'), stdio: 'inherit' });
      console.log(`✅ Static export generated in frontend/out`);
    } catch (buildErr) {
      console.error(`❌ Build error: ${buildErr.message}`);
    }

    console.log(`🚀 Step C: Deploying to Hostinger via Hostinger MCP...`);
    try {
      await deployToHostinger();
      console.log(`✅ Deploy to Hostinger completed successfully!`);
    } catch (deployErr) {
      console.error(`⚠️ Hostinger automated deployment warning: ${deployErr.message}`);
    }
  }

  return { newPostsCount: newScrapedPosts.length, totalPosts: existingPosts.length };
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
