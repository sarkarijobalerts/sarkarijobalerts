import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer-extra';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const CHROME_PATHS = [
  process.env.CHROME_PATH,
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium-browser',
  '/usr/bin/chromium',
].filter(Boolean);

function getBrowserExecutable() {
  for (const p of CHROME_PATHS) {
    if (fs.existsSync(p)) return p;
  }
  return undefined;
}

/**
 * Composite an ultra-clean 1080x1080 festival greeting poster matching the ZestRank design standard.
 * Features:
 *  - Delicate inset golden/amber outer border frame
 *  - Clean top-left logo & brand typography (unboxed, professional corporate look)
 *  - Elegant top-center serif festival headline in warm golden terracotta
 *  - Full, vibrant, natural photographic background
 *  - Deep royal navy blue footer card with serif wish, team sign-off, divider & contact icons
 */
export async function renderFestivalPoster({
  baseImagePath,
  festivalWish = 'Happy Chhath Puja',
  wishMessage = 'Wishing you health, peace and happiness',
  subWish = null,
  teamSignoff = 'With best wishes, the SarkariJobAlerts team',
  domain = 'sarkarijobalerts.com',
  email = 'info@sarkarijobalerts.com',
  channel = 't.me/sarkarijobalerts_live',
  channelLabel = null,
  outputPath,
}) {
  console.log(`[Compositing Engine] Rendering premium 1080x1080 poster: "${festivalWish}"...`);

  const primaryWish = subWish || wishMessage;

  // Read base image and convert to data URI
  const baseBuffer = fs.readFileSync(baseImagePath);
  const baseMime = baseImagePath.endsWith('.png') ? 'image/png' : 'image/jpeg';
  const baseDataUri = `data:${baseMime};base64,${baseBuffer.toString('base64')}`;

  // Read logo if available or fallback
  const logoPath = path.resolve(__dirname, '../../frontend/public/apple-touch-icon.png');
  let logoDataUri = '';
  if (fs.existsSync(logoPath)) {
    const logoBuffer = fs.readFileSync(logoPath);
    logoDataUri = `data:image/png;base64,${logoBuffer.toString('base64')}`;
  }

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${festivalWish} - SarkariJobAlerts</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet">
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    html, body {
      width: 1080px;
      height: 1080px;
      overflow: hidden;
      font-family: 'Plus Jakarta Sans', sans-serif;
      background: #FFFFFF;
      -webkit-font-smoothing: antialiased;
    }

    .poster-container {
      position: relative;
      width: 1080px;
      height: 1080px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      background: #FFFFFF;
    }

    /* Outer golden/amber border frame inset by 24px */
    .outer-border-frame {
      position: absolute;
      top: 24px;
      left: 24px;
      right: 24px;
      bottom: 24px;
      border: 2px solid #E59837;
      pointer-events: none;
      z-index: 30;
    }

    /* Top/Main photographic section (upper 820px) */
    .photo-hero {
      position: relative;
      width: 1080px;
      height: 820px;
      background-image: url('${baseDataUri}');
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
    }

    /* Ultra-soft ambient warm tint at the top to ensure crisp typography */
    .top-light-gradient {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 240px;
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.55) 0%, rgba(255, 255, 255, 0.25) 55%, rgba(255, 255, 255, 0) 100%);
      pointer-events: none;
      z-index: 2;
    }

    /* Top-Left Brand Logo & Identity */
    .brand-header {
      position: absolute;
      top: 48px;
      left: 52px;
      display: flex;
      align-items: center;
      gap: 14px;
      z-index: 10;
    }

    .brand-logo-img {
      width: 52px;
      height: 52px;
      border-radius: 12px;
      object-fit: cover;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.8);
    }

    .brand-text-col {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .brand-name {
      font-size: 24px;
      font-weight: 900;
      letter-spacing: 0.6px;
      color: #0F2C59;
      line-height: 1.1;
      text-transform: uppercase;
    }

    .brand-tagline {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.8px;
      color: #D97706;
      margin-top: 2px;
      text-transform: capitalize;
    }

    /* Top-Center Festival Greeting Headline */
    .festival-title-wrap {
      position: absolute;
      top: 150px;
      left: 0;
      width: 100%;
      text-align: center;
      z-index: 10;
      padding: 0 40px;
    }

    .festival-title {
      font-family: 'Playfair Display', serif;
      font-size: 80px;
      font-weight: 700;
      color: #D67425;
      line-height: 1.1;
      letter-spacing: 0.5px;
      text-shadow: 0 2px 10px rgba(255, 255, 255, 0.9), 0 1px 3px rgba(0, 0, 0, 0.12);
    }

    /* Bottom Navy Blue Banner (height 260px) */
    .bottom-navy-banner {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 1080px;
      height: 260px;
      background: #0F2C59;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 26px 48px;
      z-index: 10;
    }

    .wish-main {
      font-family: 'Playfair Display', serif;
      font-size: 38px;
      font-weight: 700;
      color: #FFFFFF;
      text-align: center;
      letter-spacing: 0.3px;
      line-height: 1.25;
      margin-bottom: 8px;
    }

    .wish-sub {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 20px;
      font-weight: 500;
      color: #D1D5DB;
      text-align: center;
      margin-bottom: 24px;
    }

    .banner-divider {
      width: 92%;
      max-width: 960px;
      height: 1px;
      background: rgba(255, 255, 255, 0.22);
      margin-bottom: 22px;
    }

    .contact-strip {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 90%;
      max-width: 920px;
      color: #FFFFFF;
      font-size: 18px;
      font-weight: 600;
    }

    .contact-item {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .contact-icon {
      width: 22px;
      height: 22px;
      stroke: #FFFFFF;
      stroke-width: 2;
      fill: none;
      stroke-linecap: round;
      stroke-linejoin: round;
      flex-shrink: 0;
    }
  </style>
</head>
<body>
  <div class="poster-container">
    <!-- Golden Inset Border Frame -->
    <div class="outer-border-frame"></div>

    <!-- Upper Photographic Hero Section -->
    <div class="photo-hero">
      <div class="top-light-gradient"></div>

      <!-- Top-Left Clean Brand Identity -->
      <div class="brand-header">
        ${logoDataUri ? `<img src="${logoDataUri}" class="brand-logo-img" alt="Logo" />` : ''}
        <div class="brand-text-col">
          <span class="brand-name">SarkariJobAlerts</span>
          <span class="brand-tagline">Govt Jobs & Career Alerts</span>
        </div>
      </div>

      <!-- Top-Center Festival Greeting Headline -->
      <div class="festival-title-wrap">
        <h1 class="festival-title">${festivalWish}</h1>
      </div>
    </div>

    <!-- Bottom Deep Navy Blue Banner -->
    <div class="bottom-navy-banner">
      <h2 class="wish-main">${primaryWish}</h2>
      <p class="wish-sub">${teamSignoff}</p>
      
      <div class="banner-divider"></div>

      <div class="contact-strip">
        <!-- Website -->
        <div class="contact-item">
          <svg class="contact-icon" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          </svg>
          <span>${domain}</span>
        </div>

        <!-- Email -->
        <div class="contact-item">
          <svg class="contact-icon" viewBox="0 0 24 24">
            <rect width="20" height="16" x="2" y="4" rx="2"></rect>
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
          </svg>
          <span>${email}</span>
        </div>

        <!-- Telegram / Official Channel -->
        <div class="contact-item">
          <svg class="contact-icon" viewBox="0 0 24 24">
            <path d="M21.198 2.433a2.242 2.242 0 0 0-1.022.215l-17.5 7.5a2.25 2.25 0 0 0 .12 4.167l4.316 1.439 1.635 5.234a1.5 1.5 0 0 0 2.42.604l2.584-2.261 4.58 3.332a2.25 2.25 0 0 0 3.535-1.405l3.25-16.25a2.25 2.25 0 0 0-2.918-2.575z"></path>
          </svg>
          <span>${channelLabel || channel}</span>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();

  const executablePath = getBrowserExecutable();
  const launchOptions = {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  };
  if (executablePath) {
    launchOptions.executablePath = executablePath;
  }

  const browser = await puppeteer.launch(launchOptions);
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1080, deviceScaleFactor: 1 });
    await page.setContent(htmlContent, { waitUntil: ['load', 'networkidle0'], timeout: 20000 });

    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    await page.screenshot({
      path: outputPath,
      type: 'png',
      clip: { x: 0, y: 0, width: 1080, height: 1080 },
    });
    console.log(`✅ [Compositing Engine] High-resolution poster saved: ${outputPath}`);
    return outputPath;
  } finally {
    await browser.close();
  }
}
