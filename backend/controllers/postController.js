import mongoose from 'mongoose';
import { Post } from '../models/Post.js';
import { executeScrapingCycle } from '../services/cronService.js';

/**
 * Helper to race database queries against a fast 2-second timeout
 */
function withTimeout(promise, ms = 2000) {
  let timeoutId;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error('MongoDB connection timeout')), ms);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timeoutId));
}

/**
 * In-Memory Fallback Dataset (Used when MongoDB service is offline or unstarted)
 */
const IN_MEMORY_POSTS = [
  {
    _id: 'mem_1',
    title: 'SSC CGL 2026 Online Application Form',
    rewrittenTitle: 'SSC CGL 2026 Notification Out - Apply Online for 12,000+ Group B & C Vacancies',
    metaTitle: 'SSC CGL 2026 Notification, Eligibility, Exam Date & Apply Online',
    metaDescription: 'SSC CGL 2026 recruitment notification released for 12,000+ vacancies. Check important dates, application fee, age limit, and direct application link.',
    slug: 'ssc-cgl-2026-online-form',
    primaryKeyword: 'SSC CGL 2026 Notification',
    category: 'Latest Jobs',
    sourceUrl: 'https://sarkariresult.com/ssc/ssc-cgl-2026',
    organizationName: 'Staff Selection Commission (SSC)',
    postName: 'Combined Graduate Level Examination 2026',
    totalVacancies: '12,000+',
    postDate: '31/07/2026',
    shortInfo: 'Staff Selection Commission (SSC) has released the official notification for Combined Graduate Level Examination (CGL) 2026. Eligible candidates can submit online applications.',
    importantDates: [
      { eventName: 'Application Start Date', dateValue: '01/08/2026' },
      { eventName: 'Last Date to Apply Online', dateValue: '31/08/2026' },
      { eventName: 'Tier 1 Exam Date', dateValue: 'October 2026' },
    ],
    applicationFee: [
      { category: 'General / OBC / EWS', amount: '₹ 100' },
      { category: 'SC / ST / Female Candidates', amount: '₹ 0 (Exempted)' },
    ],
    ageLimit: {
      minAge: '18 Years',
      maxAge: '32 Years',
      asOnDate: '01/08/2026',
      relaxationInfo: 'Age relaxation is applicable as per government rules.',
    },
    vacanciesTable: [
      { postName: 'Assistant Section Officer', totalPost: '3,450', eligibility: 'Bachelor Degree in Any Stream' },
      { postName: 'Inspector of Income Tax', totalPost: '1,200', eligibility: 'Bachelor Degree in Any Stream' },
    ],
    howToApply: [
      'Visit the official website at ssc.gov.in.',
      'Complete One Time Registration (OTR) if not already done.',
      'Fill in the application details and upload scanned photo and signature.',
      'Pay application fee online and download the submitted application form.',
    ],
    importantLinks: [
      { label: 'Apply Online Link', url: 'https://ssc.gov.in' },
      { label: 'Download Official Notification PDF', url: 'https://ssc.gov.in/notification' },
    ],
    publishedDate: new Date(),
  },
  {
    _id: 'mem_2',
    title: 'UPSC Civil Services Mains Admit Card 2026',
    rewrittenTitle: 'UPSC IAS Civil Services Mains 2026 Admit Card Released - Download Hall Ticket',
    metaTitle: 'UPSC IAS Mains Admit Card 2026 Out | Direct Download Link',
    metaDescription: 'Union Public Service Commission (UPSC) has issued the admit cards for Civil Services Mains Examination 2026. Download your hall ticket now.',
    slug: 'upsc-ias-mains-admit-card-2026',
    primaryKeyword: 'UPSC Mains Admit Card 2026',
    category: 'Admit Cards',
    sourceUrl: 'https://sarkariresult.com/upsc/upsc-mains-admit-card-2026',
    organizationName: 'Union Public Service Commission (UPSC)',
    postName: 'Civil Services Mains Exam 2026',
    totalVacancies: '1,056',
    postDate: '31/07/2026',
    shortInfo: 'Union Public Service Commission has released the e-Admit Card for Civil Services (Main) Examination 2026.',
    importantDates: [
      { eventName: 'Admit Card Available Date', dateValue: '31/07/2026' },
      { eventName: 'Mains Examination Date', dateValue: '20/09/2026 Onwards' },
    ],
    applicationFee: [{ category: 'Admit Card Download Fee', amount: '₹ 0 (Free)' }],
    ageLimit: { minAge: '21 Years', maxAge: '32 Years', asOnDate: '01/08/2026', relaxationInfo: 'As per IAS notification rules.' },
    vacanciesTable: [{ postName: 'IAS / IPS / IFS Posts', totalPost: '1,056', eligibility: 'Prelims Qualified Candidates' }],
    howToApply: [
      'Visit upsconline.nic.in to access the e-Admit Card download portal.',
      'Enter Registration ID or Roll Number along with Date of Birth.',
      'Download and print your e-Admit Card for exam venue entry.',
    ],
    importantLinks: [
      { label: 'Download Mains Admit Card', url: 'https://upsconline.nic.in' },
      { label: 'Official UPSC Website', url: 'https://upsc.gov.in' },
    ],
    publishedDate: new Date(),
  },
  {
    _id: 'mem_3',
    title: 'RRB NTPC Graduate Level Result 2026',
    rewrittenTitle: 'RRB NTPC CBT 1 Result 2026 Declared - Check Zone Wise Cutoff Marks & Scorecard',
    metaTitle: 'RRB NTPC CBT 1 Result 2026 Declared | Zone-Wise Cutoff List',
    metaDescription: 'Railway Recruitment Boards (RRB) have published the results and merit lists for NTPC Graduate posts CBT 1 exam. Check cutoff marks online.',
    slug: 'rrb-ntpc-result-2026-cbt1',
    primaryKeyword: 'RRB NTPC Result 2026',
    category: 'Results',
    sourceUrl: 'https://sarkariresult.com/rrb/rrb-ntpc-result-2026',
    organizationName: 'Railway Recruitment Boards (RRB)',
    postName: 'NTPC Non-Technical Popular Categories',
    totalVacancies: '8,113',
    postDate: '31/07/2026',
    shortInfo: 'Railway Recruitment Board has officially declared the results of CBT 1 Examination for NTPC Non-Technical Popular Categories.',
    importantDates: [
      { eventName: 'Result Declaration Date', dateValue: '31/07/2026' },
      { eventName: 'CBT 2 Exam Date', dateValue: 'To Be Announced' },
    ],
    applicationFee: [{ category: 'Scorecard Check', amount: '₹ 0' }],
    ageLimit: { minAge: '18 Years', maxAge: '33 Years', asOnDate: '01/01/2026', relaxationInfo: 'Railway age relaxation applicable.' },
    vacanciesTable: [{ postName: 'Station Master / Goods Guard', totalPost: '8,113', eligibility: 'CBT 1 Appeared Candidates' }],
    howToApply: [
      'Visit your respective RRB regional portal.',
      'Click on the NTPC CBT 1 Result PDF and Scorecard Link.',
      'Enter Registration Number and User Password to view your normalized marks.',
    ],
    importantLinks: [
      { label: 'Check Zone Wise Result PDF', url: 'https://indianrailways.gov.in' },
      { label: 'Official Railway Website', url: 'https://indianrailways.gov.in' },
    ],
    publishedDate: new Date(),
  },
];

function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}

function getInMemoryFeed() {
  return {
    latestJobs: IN_MEMORY_POSTS.filter(p => p.category === 'Latest Jobs'),
    admitCards: IN_MEMORY_POSTS.filter(p => p.category === 'Admit Cards'),
    results: IN_MEMORY_POSTS.filter(p => p.category === 'Results'),
  };
}

/**
 * GET /api/posts/three-column
 */
export async function getThreeColumnPosts(req, res) {
  try {
    const limit = parseInt(req.query.limit) || 15;

    if (!isMongoConnected()) {
      return res.json({ success: true, data: getInMemoryFeed() });
    }

    const [latestJobs, admitCards, results] = await withTimeout(
      Promise.all([
        Post.find({ category: 'Latest Jobs' }).sort({ publishedDate: -1 }).limit(limit).lean(),
        Post.find({ category: 'Admit Cards' }).sort({ publishedDate: -1 }).limit(limit).lean(),
        Post.find({ category: 'Results' }).sort({ publishedDate: -1 }).limit(limit).lean(),
      ]),
      2000
    );

    res.json({
      success: true,
      data: { latestJobs, admitCards, results },
    });
  } catch (error) {
    console.warn(`[Post Controller Warning] ${error.message}. Returning in-memory feed.`);
    res.json({ success: true, data: getInMemoryFeed() });
  }
}

/**
 * GET /api/jobs
 */
export async function getAllJobs(req, res) {
  try {
    if (!isMongoConnected()) {
      return res.json({ success: true, total: IN_MEMORY_POSTS.length, page: 1, pages: 1, data: IN_MEMORY_POSTS });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 30;
    const skip = (page - 1) * limit;

    const posts = await withTimeout(
      Post.find({}).sort({ publishedDate: -1 }).skip(skip).limit(limit).lean(),
      2000
    );

    res.json({ success: true, total: posts.length, page, pages: 1, data: posts });
  } catch (error) {
    res.json({ success: true, total: IN_MEMORY_POSTS.length, page: 1, pages: 1, data: IN_MEMORY_POSTS });
  }
}

/**
 * GET /api/posts/:slug
 */
export async function getPostBySlug(req, res) {
  try {
    const { slug } = req.params;

    if (!isMongoConnected()) {
      const match = IN_MEMORY_POSTS.find(p => p.slug === slug);
      if (!match) return res.status(404).json({ success: false, message: 'Job alert not found' });
      return res.json({ success: true, data: match });
    }

    const post = await withTimeout(Post.findOne({ slug }).lean(), 2000);

    if (!post) {
      const match = IN_MEMORY_POSTS.find(p => p.slug === slug);
      if (match) return res.json({ success: true, data: match });
      return res.status(404).json({ success: false, message: 'Job alert not found' });
    }

    res.json({ success: true, data: post });
  } catch (error) {
    const match = IN_MEMORY_POSTS.find(p => p.slug === req.params.slug);
    if (match) return res.json({ success: true, data: match });
    res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * GET /api/test-scrape & POST /api/scraper/trigger
 */
export async function triggerScraper(req, res) {
  try {
    console.log('[Manual Trigger] On-demand scraping cycle initiated via API...');
    const result = await executeScrapingCycle();
    res.json({
      success: true,
      message: 'On-demand scraping cycle completed',
      metrics: result,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * POST /api/posts/seed
 */
export async function seedPosts(req, res) {
  try {
    if (!isMongoConnected()) {
      return res.json({ success: true, message: 'MongoDB offline; in-memory fallback active.' });
    }
    const inserted = await autoSeedMockJobs();
    res.json({ success: true, message: `Seeded ${inserted} sample posts into database.` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

function escapeXml(unsafe) {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function formatRfc822(rawDate) {
  if (!rawDate) return new Date().toUTCString();

  const d = new Date(rawDate);
  if (!isNaN(d.getTime())) {
    return d.toUTCString();
  }

  if (typeof rawDate === 'string' && rawDate.includes('/')) {
    const parts = rawDate.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      const parsed = new Date(Date.UTC(year, month, day));
      if (!isNaN(parsed.getTime())) {
        return parsed.toUTCString();
      }
    }
  }

  return new Date().toUTCString();
}

/**
 * GET /rss.xml & GET /api/rss.xml
 * Dynamic RSS 2.0 Feed Generator for Make.com / IFTTT / Zapier Automation
 */
export async function getRssFeed(req, res) {
  try {
    let posts = [];

    if (isMongoConnected()) {
      posts = await withTimeout(
        Post.find({}).sort({ publishedDate: -1 }).limit(15).lean(),
        2000
      );
    }

    if (!posts || posts.length === 0) {
      posts = IN_MEMORY_POSTS.slice(0, 15);
    }

    const siteUrl = 'https://sarkarijobalerts.com';

    const itemsXml = posts
      .map((post) => {
        const rawTitle = post.rewrittenTitle || post.title || 'Sarkari Job Notification';
        const rawOrg = post.organizationName || post.organization || 'Government Recruitment Board';
        const rawCategory = post.category || 'Latest Jobs';
        const rawVacancies = post.totalVacancies || 'Various Posts';

        const title = escapeXml(rawTitle);
        const link = `${siteUrl}/job/${post.slug}/`;
        const description = escapeXml(
          post.metaDescription || post.shortInfo || `${title} - Check eligibility, age limit, dates and apply online.`
        );
        const pubDate = formatRfc822(post.publishedDate || post.postDate || post.createdAt);
        const cleanTitle = rawTitle.length > 70 ? rawTitle.substring(0, 70) + '...' : rawTitle;
        const ogImageUrl = `https://placehold.co/1200x630/0f172a/ffffff.png?text=${encodeURIComponent(cleanTitle + '\n\n' + rawOrg + '\nSarkariJobAlerts.com')}`;

        return `    <item>
      <title>${title}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${description}</description>
      <pubDate>${pubDate}</pubDate>
      <enclosure url="${ogImageUrl}" length="0" type="image/png" />
      <media:content url="${ogImageUrl}" medium="image" />
    </item>`;
      })
      .join('\n');

    const rssXml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>SarkariJobAlerts - Latest Govt Job Alerts &amp; Notifications</title>
    <link>${siteUrl}</link>
    <description>Realtime automated Sarkari job alerts, admit cards, exam results and government recruitment notifications.</description>
    <language>en-in</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
${itemsXml}
  </channel>
</rss>`;

    res.set({
      'Content-Type': 'text/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
    });
    return res.send(rssXml);
  } catch (error) {
    res.status(500).send(`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Error</title><description>${error.message}</description></channel></rss>`);
  }
}

/**
 * GET /api/og
 * Dynamic Open Graph (OG) Image Card Generator for Social Media & Make.com
 */
export async function getOgImage(req, res) {
  try {
    const title = req.query.title || 'Sarkari Job Alert 2026';
    const org = req.query.org || 'Government Recruitment Board';
    const category = req.query.category || 'Latest Jobs';
    const vacancies = req.query.vacancies || 'Various Posts';

    const safeTitle = escapeXml(title);
    const safeOrg = escapeXml(org);
    const safeCategory = escapeXml(category.toUpperCase());
    const safeVacancies = escapeXml(vacancies);

    const svg = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0b132b" />
      <stop offset="50%" stop-color="#1c2541" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>
  </defs>

  <rect width="1200" height="630" fill="url(#bg)" />
  
  <!-- Top Bar -->
  <rect x="56" y="48" width="300" height="44" rx="22" fill="#1e293b" stroke="#38bdf8" stroke-width="2" />
  <text x="76" y="76" font-family="sans-serif" font-size="16" font-weight="bold" fill="#38bdf8">${safeCategory} • ${safeVacancies}</text>
  
  <text x="1144" y="78" text-anchor="end" font-family="sans-serif" font-size="22" font-weight="900" fill="#fbbf24">WWW.SARKARIJOBALERTS.COM</text>
  
  <!-- Organization -->
  <text x="56" y="190" font-family="sans-serif" font-size="24" font-weight="800" fill="#f43f5e" letter-spacing="1">${safeOrg}</text>
  
  <!-- Title -->
  <foreignObject x="56" y="220" width="1088" height="260">
    <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: sans-serif; font-size: 42px; font-weight: 900; color: #ffffff; line-height: 1.3;">
      ${safeTitle}
    </div>
  </foreignObject>
  
  <!-- Divider -->
  <line x1="56" y1="520" x2="1144" y2="520" stroke="#334155" stroke-width="2" />
  
  <!-- Footer Bar -->
  <text x="56" y="565" font-family="sans-serif" font-size="18" font-weight="600" fill="#94a3b8">Real-time Automated Govt Job Portal • 24/7 Alerts</text>
  
  <rect x="880" y="535" width="264" height="50" rx="12" fill="#0284c7" />
  <text x="1012" y="567" text-anchor="middle" font-family="sans-serif" font-size="18" font-weight="bold" fill="#ffffff">Apply Online →</text>
</svg>`;

    res.set({
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    });
    return res.send(svg);
  } catch (error) {
    res.status(500).send('Error generating OG image');
  }
}

async function autoSeedMockJobs() {
  let inserted = 0;
  for (const p of IN_MEMORY_POSTS) {
    const exists = await Post.findOne({ sourceUrl: p.sourceUrl });
    if (!exists) {
      const copy = { ...p };
      delete copy._id;
      await Post.create(copy);
      inserted++;
    }
  }
  return inserted;
}

