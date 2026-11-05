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
 * Composite a high-resolution 1080x1080 festive poster
 * Separates AI base background from vector text, logo, and footer overlays.
 */
export async function renderFestivalPoster({
  baseImagePath,
  festivalWish = 'Happy Diwali',
  subWish = 'May the Festival of Lights Bring Prosperity & Career Success',
  outputPath,
}) {
  console.log(`[Compositing Engine] Rendering 1080x1080 poster: "${festivalWish}"...`);

  // Read base image and convert to data URI
  const baseBuffer = fs.readFileSync(baseImagePath);
  const baseMime = baseImagePath.endsWith('.png') ? 'image/png' : 'image/jpeg';
  const baseDataUri = `data:${baseMime};base64,${baseBuffer.toString('base64')}`;

  // Read logo if available or use SVG badge
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
  <title>${festivalWish}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700;900&family=Montserrat:wght@500;700;800;900&family=Playfair+Display:ital,wght@0,700;1,700&display=swap" rel="stylesheet">
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
      background: #000;
      font-family: 'Montserrat', sans-serif;
      -webkit-font-smoothing: antialiased;
    }
    .poster-canvas {
      position: relative;
      width: 1080px;
      height: 1080px;
      background-image: url('${baseDataUri}');
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow: hidden;
    }

    /* Ambient atmospheric vignettes */
    .vignette-top {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 260px;
      background: linear-gradient(180deg, rgba(5, 5, 12, 0.78) 0%, rgba(5, 5, 12, 0.45) 50%, rgba(5, 5, 12, 0) 100%);
      pointer-events: none;
      z-index: 1;
    }
    .vignette-center {
      position: absolute;
      top: 25%;
      left: 0;
      width: 100%;
      height: 48%;
      background: radial-gradient(ellipse at center, rgba(10, 5, 2, 0.55) 0%, rgba(10, 5, 2, 0.25) 50%, rgba(0, 0, 0, 0) 80%);
      pointer-events: none;
      z-index: 1;
    }
    .vignette-bottom {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 240px;
      background: linear-gradient(0deg, rgba(3, 7, 18, 0.95) 0%, rgba(3, 7, 18, 0.70) 50%, rgba(3, 7, 18, 0) 100%);
      pointer-events: none;
      z-index: 1;
    }

    /* TOP OVERLAY: Top-Center with 5% margin */
    .top-header {
      position: relative;
      z-index: 10;
      margin-top: 54px; /* 5% of 1080px = 54px */
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .brand-pill {
      display: inline-flex;
      align-items: center;
      gap: 16px;
      background: rgba(15, 23, 42, 0.88);
      border: 1.5px solid rgba(251, 191, 36, 0.55);
      padding: 10px 28px;
      border-radius: 9999px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6), 0 0 25px rgba(245, 158, 11, 0.25);
      backdrop-filter: blur(12px);
    }
    .brand-logo-img {
      width: 52px;
      height: 52px;
      border-radius: 12px;
      object-fit: cover;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
    }
    .brand-texts {
      display: flex;
      flex-direction: column;
      text-align: left;
    }
    .brand-title {
      font-size: 26px;
      font-weight: 900;
      letter-spacing: -0.5px;
      background: linear-gradient(135deg, #ffffff 30%, #38bdf8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      line-height: 1.1;
    }
    .brand-tagline {
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 2.5px;
      color: #fbbf24;
      text-transform: uppercase;
      margin-top: 2px;
    }

    /* CENTER TYPOGRAPHY OVERLAY */
    .center-typography {
      position: relative;
      z-index: 10;
      text-align: center;
      padding: 0 50px;
      margin-top: -20px;
    }
    .festive-greeting-sub {
      font-family: 'Montserrat', sans-serif;
      font-size: 19px;
      font-weight: 700;
      letter-spacing: 5px;
      color: #fef08a;
      text-transform: uppercase;
      text-shadow: 0 2px 12px rgba(0, 0, 0, 0.9), 0 0 20px rgba(234, 179, 8, 0.6);
      margin-bottom: 12px;
    }
    .festive-wish-main {
      font-family: 'Playfair Display', serif;
      font-size: 82px;
      font-weight: 700;
      line-height: 1.05;
      background: linear-gradient(180deg, #fff7ed 0%, #fef08a 40%, #fbbf24 70%, #d97706 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      filter: drop-shadow(0 6px 18px rgba(0, 0, 0, 0.95)) drop-shadow(0 0 35px rgba(245, 158, 11, 0.5));
      letter-spacing: 1px;
    }
    .festive-divider {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      margin: 18px auto 14px auto;
      max-width: 480px;
    }
    .festive-divider-line {
      flex: 1;
      height: 2px;
      background: linear-gradient(90deg, transparent, #fbbf24, transparent);
    }
    .festive-divider-symbol {
      color: #fef08a;
      font-size: 20px;
      filter: drop-shadow(0 0 10px rgba(245, 158, 11, 0.8));
    }
    .festive-subwish {
      font-family: 'Montserrat', sans-serif;
      font-size: 20px;
      font-weight: 600;
      color: #f8fafc;
      text-shadow: 0 3px 12px rgba(0, 0, 0, 0.95), 0 0 15px rgba(0, 0, 0, 0.8);
      max-width: 820px;
      margin: 0 auto;
      line-height: 1.45;
    }

    /* BOTTOM FOOTER BANNER: Height 80px, Solid / semi-transparent anchored to bottom edge */
    .bottom-footer-banner {
      position: relative;
      z-index: 10;
      width: 1080px;
      height: 80px;
      background: rgba(10, 15, 30, 0.92);
      border-top: 2px solid rgba(251, 191, 36, 0.4);
      backdrop-filter: blur(16px);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 45px;
      box-shadow: 0 -8px 25px rgba(0, 0, 0, 0.5);
    }
    .footer-left {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .globe-icon {
      width: 28px;
      height: 28px;
      fill: none;
      stroke: #38bdf8;
      stroke-width: 2.2;
      stroke-linecap: round;
      stroke-linejoin: round;
      filter: drop-shadow(0 0 8px rgba(56, 189, 248, 0.6));
    }
    .footer-domain {
      font-family: 'Montserrat', sans-serif;
      font-size: 24px;
      font-weight: 800;
      color: #ffffff;
      letter-spacing: 0.5px;
    }
    .footer-domain span {
      color: #38bdf8;
    }
    .footer-right-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      background: linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(217, 119, 6, 0.3));
      border: 1px solid rgba(251, 191, 36, 0.5);
      padding: 7px 18px;
      border-radius: 9999px;
      font-size: 13px;
      font-weight: 700;
      color: #fef08a;
      letter-spacing: 0.8px;
      text-transform: uppercase;
    }
    .pulse-dot {
      width: 9px;
      height: 9px;
      background: #22c55e;
      border-radius: 50%;
      box-shadow: 0 0 10px #22c55e;
    }
  </style>
</head>
<body>
  <div class="poster-canvas">
    <div class="vignette-top"></div>
    <div class="vignette-center"></div>
    <div class="vignette-bottom"></div>

    <!-- Top Overlay (Logo + Brand) with 5% margin -->
    <header class="top-header">
      <div class="brand-pill">
        ${logoDataUri ? `<img src="${logoDataUri}" class="brand-logo-img" alt="Logo" />` : ''}
        <div class="brand-texts">
          <div class="brand-title">SarkariJobAlerts</div>
          <div class="brand-tagline">Automated Govt Exam & Career Alerts</div>
        </div>
      </div>
    </header>

    <!-- Center Typography Overlay -->
    <main class="center-typography">
      <div class="festive-greeting-sub">Festive Greetings From Us</div>
      <h1 class="festive-wish-main">${festivalWish}</h1>
      <div class="festive-divider">
        <div class="festive-divider-line"></div>
        <div class="festive-divider-symbol">🪔 ✦ 🪔</div>
        <div class="festive-divider-line"></div>
      </div>
      <p class="festive-subwish">${subWish}</p>
    </main>

    <!-- Bottom Footer Banner: Height 80px, Globe Icon + Domain -->
    <footer class="bottom-footer-banner">
      <div class="footer-left">
        <!-- Crisp SVG Globe Icon -->
        <svg class="globe-icon" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="2" y1="12" x2="22" y2="12"></line>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        </svg>
        <span class="footer-domain">sarkarijobalerts<span>.com</span></span>
      </div>
      <div class="footer-right-badge">
        <div class="pulse-dot"></div>
        <span>Live Govt Job Updates</span>
      </div>
    </footer>
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
    
    // Ensure directory exists
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
