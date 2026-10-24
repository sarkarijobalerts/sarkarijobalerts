import fs from 'fs';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import * as cheerio from 'cheerio';
import { Post } from '../models/Post.js';

// Apply Stealth Plugin to avoid bot detection
puppeteer.use(StealthPlugin());

export const TARGET_PORTALS = [
  {
    name: 'SarkariResult Latest Jobs',
    category: 'Latest Jobs',
    url: 'https://www.sarkariresult.com/latestjob.php',
  },
  {
    name: 'SarkariResult Admit Card',
    category: 'Admit Cards',
    url: 'https://www.sarkariresult.com/admitcard.php',
  },
  {
    name: 'SarkariResult Results',
    category: 'Results',
    url: 'https://www.sarkariresult.com/result.php',
  },
  {
    name: 'SarkariResult Answer Key',
    category: 'Answer Key',
    url: 'https://www.sarkariresult.com/answerkey.php',
  },
  {
    name: 'SarkariResult Syllabus',
    category: 'Syllabus',
    url: 'https://www.sarkariresult.com/syllabus.php',
  },
];

const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
];

function getRandomUserAgent() {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

/**
 * Strict text sanitizer: removes HTML/script/style tags, controls characters, and multiline dumps.
 */
export function sanitizeTableCell(text, maxLen = 120) {
  if (!text || typeof text !== 'string') return '';
  return text
    .replace(/<script\b[^<]*>([\s\S]*?)<\/script>/gi, '')
    .replace(/<style\b[^<]*>([\s\S]*?)<\/style>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, maxLen);
}

/**
 * Launch Stealth Puppeteer Browser Instance
 */
async function getBrowserInstance() {
  console.log('[PHASE A: PUPPETEER LAUNCH] Launching chromium in stealth mode...');
  const possiblePaths = [
    process.env.CHROME_PATH,
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
  ].filter(Boolean);

  let executablePath = undefined;
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      executablePath = p;
      break;
    }
  }

  const launchOptions = {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
      '--window-size=1920,1080',
    ],
  };

  if (executablePath) {
    launchOptions.executablePath = executablePath;
  }

  return await puppeteer.launch(launchOptions);
}

/**
 * Resilient Page HTML Fetcher (Puppeteer Stealth with HTTP Fetch Fallback)
 */
async function fetchPageHtml(targetUrl, ua) {
  let browser;
  try {
    browser = await getBrowserInstance();
    const page = await browser.newPage();
    await page.setUserAgent(ua);
    await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 25000 });
    const content = await page.content();
    if (content && content.length > 500) {
      return content;
    }
  } catch (err) {
    console.warn(`[Scraper Notice] Puppeteer fetch failed for ${targetUrl}: ${err.message}. Trying HTTP fetch fallback...`);
  } finally {
    if (browser) await browser.close();
  }

  try {
    const res = await fetch(targetUrl, {
      headers: {
        'User-Agent': ua,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      signal: AbortSignal.timeout(10000),
    });
    if (res.ok) {
      const html = await res.text();
      if (html && html.length > 500) {
        return html;
      }
    }
  } catch (e) {
    console.error(`[Scraper Error] HTTP fetch fallback failed for ${targetUrl}: ${e.message}`);
  }

  return null;
}

/**
 * Fetch links from target category page
 */
export async function discoverNewJobLinks(targetUrl, category) {
  const newLinks = [];

  try {
    const ua = getRandomUserAgent();
    console.log(`[PHASE B: TARGET FETCH] Fetching ${category} listing at ${targetUrl}...`);
    
    const content = await fetchPageHtml(targetUrl, ua);
    if (!content) {
      console.warn(`[Scraper Warning] Could not retrieve content from ${targetUrl}`);
      return [];
    }

    const $ = cheerio.load(content);

    const selectorCandidates = ['#post a', 'table a', '.post a', 'ul li a'];
    const IGNORED_TITLES = ['home', 'sitemap', 'contact us', 'privacy policy', 'disclaimer', 'terms', 'search', 'about us', 'more', 'view all', 'download app', 'telegram', 'whatsapp', 'youtube', 'facebook', 'twitter', 'instagram', 'android app', 'ios app', 'latest jobs', 'admit card', 'result', 'answer key', 'syllabus', 'admission', 'certificate verification', 'important', 'sarkari result', 'sarkariresult'];

    for (const selector of selectorCandidates) {
      const elements = $(selector);
      if (elements.length > 0) {
        elements.each((_, element) => {
          const rawTitle = $(element).text();
          const title = sanitizeTableCell(rawTitle, 150);
          let href = $(element).attr('href');

          if (title && href && title.length > 6 && href.length > 5 && !href.includes('javascript:')) {
            if (!href.startsWith('http')) {
              href = new URL(href, targetUrl).href;
            }
            const lowerTitle = title.toLowerCase();
            const isIgnored = IGNORED_TITLES.some(ign => lowerTitle === ign || lowerTitle.startsWith(ign + ' '));
            const isHomePage = href === 'https://sarkariresult.com/' || href === 'https://www.sarkariresult.com/' || href.endsWith('/index.php');

            if (!isIgnored && !isHomePage && !newLinks.some(l => l.url === href)) {
              newLinks.push({ title, url: href, category });
            }
          }
        });
      }
    }

    console.log(`[Scraper Total Discovered] ${newLinks.length} total unique link candidate(s) found on ${targetUrl}`);
  } catch (error) {
    console.error(`[PHASE B ERROR] Failed to fetch target page ${targetUrl}: ${error.message}`);
  }

  const filteredLinks = [];
  for (const item of newLinks) {
    let isDup = false;
    if (Post.db && Post.db.readyState === 1) {
      try {
        isDup = await Post.isDuplicateUrl(item.url);
      } catch (e) {
        console.warn(`[Scraper Warning] DB deduplication check skipped: ${e.message}`);
      }
    }
    if (!isDup) {
      filteredLinks.push(item);
    }
  }

  console.log(`[Scraper Deduplication] ${filteredLinks.length} new link(s) queued for processing in category '${category}'.`);
  return filteredLinks;
}

/**
 * Scrape detailed job metadata from individual notification page
 */
export async function scrapeJobDetails(jobUrl, category, initialTitle) {
  try {
    const ua = getRandomUserAgent();
    console.log(`[PHASE B: DETAIL FETCH] Navigating to detail page: ${jobUrl}`);
    
    const html = await fetchPageHtml(jobUrl, ua);
    if (!html) {
      console.warn(`[Scraper Warning] Could not fetch detail page content for ${jobUrl}`);
      return null;
    }

    const $ = cheerio.load(html);

    console.log(`[PHASE C: DETAIL EXTRACTION] Parsing DOM metadata for '${initialTitle}'...`);

    const pageTitle = sanitizeTableCell($('h1').first().text() || $('title').text() || initialTitle, 150);
    const rawShortInfo = $('p').first().text();
    const shortInfo = sanitizeTableCell(rawShortInfo, 300) || `${pageTitle} official recruitment notification details and online application link.`;

    // Extract Important Dates (Target ONLY leaf elements, not parent divs/trs)
    const importantDates = [];
    $('td, li').each((_, el) => {
      const text = sanitizeTableCell($(el).text(), 120);
      if (text && text.length < 100 && (text.toLowerCase().includes('application begin') || text.toLowerCase().includes('last date') || text.toLowerCase().includes('exam date') || text.toLowerCase().includes('admit card available'))) {
        const parts = text.split(':');
        if (parts.length >= 2) {
          const title = sanitizeTableCell(parts[0], 40);
          const dateVal = sanitizeTableCell(parts.slice(1).join(':'), 60);
          if (title && dateVal && !importantDates.some(d => d.title === title)) {
            importantDates.push({ title, dateVal });
          }
        }
      }
    });

    if (importantDates.length === 0) {
      importantDates.push({ title: 'Application Start Date', dateVal: 'Refer Official PDF' });
      importantDates.push({ title: 'Last Date to Apply', dateVal: 'Refer Official PDF' });
    }

    // Extract Application Fee (Target ONLY leaf elements)
    const applicationFee = [];
    $('td, li').each((_, el) => {
      const text = sanitizeTableCell($(el).text(), 120);
      if (text && text.length < 100 && (text.toLowerCase().includes('general') || text.toLowerCase().includes('sc/st') || text.toLowerCase().includes('application fee') || text.toLowerCase().includes('obc') || text.toLowerCase().includes('ews'))) {
        const parts = text.split(':');
        if (parts.length >= 2) {
          const cat = sanitizeTableCell(parts[0], 40);
          const feeVal = sanitizeTableCell(parts.slice(1).join(':'), 60);
          if (cat && feeVal && !applicationFee.some(f => f.category === cat)) {
            applicationFee.push({ category: cat, feeVal });
          }
        }
      }
    });

    if (applicationFee.length === 0) {
      applicationFee.push({ category: 'General / OBC / EWS', feeVal: '₹ 100 / As per Rules' });
      applicationFee.push({ category: 'SC / ST / Reserved', feeVal: '₹ 0' });
    }

    // Extract Age Limit
    const ageLimit = [];
    $('td, li').each((_, el) => {
      const text = sanitizeTableCell($(el).text(), 120);
      if (text && text.length < 100 && (text.toLowerCase().includes('minimum age') || text.toLowerCase().includes('maximum age') || text.toLowerCase().includes('age limit'))) {
        if (!ageLimit.some(a => a.details === text)) {
          ageLimit.push({ criteria: 'Age Limit', details: text });
        }
      }
    });

    if (ageLimit.length === 0) {
      ageLimit.push({ criteria: 'Minimum Age', details: '18 Years' });
      ageLimit.push({ criteria: 'Maximum Age', details: '35 Years (As per rules)' });
    }

    // Extract Vacancies (Strictly inspect individual <td> columns)
    const vacancyDetails = [];
    $('table tr').each((_, tr) => {
      const tds = $(tr).find('td');
      if (tds.length >= 2) {
        const postName = sanitizeTableCell($(tds[0]).text(), 80);
        const totalPosts = sanitizeTableCell($(tds[1]).text(), 40);
        const eligibility = tds[2] ? sanitizeTableCell($(tds[2]).text(), 150) : 'Passed relevant degree/diploma';

        if (
          postName &&
          postName.length > 2 &&
          postName.length < 90 &&
          !postName.toLowerCase().includes('important') &&
          !postName.toLowerCase().includes('total') &&
          !vacancyDetails.some(v => v.postName === postName)
        ) {
          vacancyDetails.push({ postName, totalPosts, eligibility });
        }
      }
    });

    if (vacancyDetails.length === 0) {
      vacancyDetails.push({
        postName: pageTitle,
        totalPosts: 'Various Posts',
        eligibility: 'Passed 10th / 12th / Graduate Degree from recognized board/university',
      });
    }

    // Extract Links
    const officialLinks = [];
    $('a[href*="http"]').each((_, a) => {
      const linkText = sanitizeTableCell($(a).text(), 80);
      const href = $(a).attr('href');
      if (
        linkText &&
        href &&
        (linkText.toLowerCase().includes('apply') ||
          linkText.toLowerCase().includes('notification') ||
          linkText.toLowerCase().includes('official') ||
          linkText.toLowerCase().includes('download'))
      ) {
        if (!officialLinks.some(l => l.url === href)) {
          officialLinks.push({ linkTitle: linkText, url: href });
        }
      }
    });

    if (officialLinks.length === 0) {
      officialLinks.push({ linkTitle: 'Official Application Link / PDF', url: jobUrl });
      officialLinks.push({ linkTitle: 'Official Website', url: 'https://sarkariresult.com' });
    }

    return {
      title: pageTitle,
      category,
      sourceUrl: jobUrl,
      organization: pageTitle.split(' ')[0] || 'Recruitment Board',
      postDate: new Date().toLocaleDateString('en-IN'),
      shortInfo,
      importantDates: importantDates.slice(0, 5),
      applicationFee: applicationFee.slice(0, 5),
      ageLimit: ageLimit.slice(0, 3),
      vacancyDetails: vacancyDetails.slice(0, 10),
      officialLinks: officialLinks.slice(0, 5),
    };
  } catch (error) {
    console.error(`[Scraper Error] Details extraction failed for ${jobUrl}: ${error.message}`);
    return null;
  }
}
