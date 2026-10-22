async function verifyLive() {
  console.log('--- VERIFYING LIVE SITE: sarkarijobalerts.com ---');
  
  // 1. Robots.txt
  const rRobots = await fetch('https://sarkarijobalerts.com/robots.txt?t=' + Date.now());
  const txtRobots = await rRobots.text();
  const hasRss = /rss\.xml/i.test(txtRobots);
  console.log('1. Live robots.txt has rss.xml?:', hasRss ? '❌ FAIL' : '✅ PASS (Clean)');

  // 2. Homepage
  const rHome = await fetch('https://sarkarijobalerts.com/?t=' + Date.now());
  const txtHome = await rHome.text();
  const titleHome = txtHome.match(/<title>([^<]+)<\/title>/i);
  console.log('2. Live Home Title:', titleHome ? titleHome[1] : 'NOT FOUND');
  console.log('   - Hreflang hi-IN in live Home?:', txtHome.includes('hreflang="hi-IN"') ? '❌ FAIL' : '✅ PASS (Removed)');

  // 3. Job detail page
  const sampleJobUrl = 'https://sarkarijobalerts.com/job/indian-army-10-plus-2-tes-57-recruitment-2026/';
  const rJob = await fetch(sampleJobUrl + '?t=' + Date.now());
  const txtJob = await rJob.text();
  const titleJob = txtJob.match(/<title>([^<]+)<\/title>/i);
  console.log('3. Live Job Title:', titleJob ? titleJob[1] : 'NOT FOUND');
  console.log('   - Title Length:', titleJob ? titleJob[1].length : 0);
  console.log('   - Hreflang hi-IN in live Job?:', txtJob.includes('hreflang="hi-IN"') ? '❌ FAIL' : '✅ PASS (Removed)');
  
  let jobPostingAuthor = false;
  let jobPostingFound = false;
  const schemas = [...txtJob.matchAll(/<script type="application\/ld\+json">([^<]+)<\/script>/gi)];
  for (const s of schemas) {
    try {
      const data = JSON.parse(s[1]);
      if (data['@type'] === 'JobPosting') {
        jobPostingFound = true;
        if (data.author || data.publisher || data.citation) jobPostingAuthor = true;
      }
    } catch {}
  }
  console.log('   - JobPosting schema found?:', jobPostingFound ? '✅ YES' : '❌ NO');
  console.log('   - JobPosting has invalid author/publisher?:', jobPostingAuthor ? '❌ FAIL' : '✅ PASS (Strictly Clean)');

  // 4. Sitemap.xml
  const rSitemap = await fetch('https://sarkarijobalerts.com/sitemap.xml?t=' + Date.now());
  const txtSitemap = await rSitemap.text();
  console.log('4. Live sitemap.xml:');
  console.log('   - Total URLs in live sitemap:', (txtSitemap.match(/<loc>/g) || []).length);
  console.log('   - Has conflicting xhtml:link?:', txtSitemap.includes('xhtml:link') ? '❌ FAIL' : '✅ PASS (Clean)');
}

verifyLive().catch(console.error);
