import seedPosts from '../../lib/seedPosts.json';

export const dynamic = 'force-static';
export const revalidate = 3600;

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

export async function GET() {
  let posts = [];

  try {
    const res = await fetch('http://localhost:5000/api/jobs?limit=15', { next: { revalidate: 60 } });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data && json.data.length > 0) {
        posts = json.data;
      }
    }
  } catch (err) {
    console.warn('[RSS Route] Could not connect to backend API, using local seed posts.');
  }

  if (!posts || posts.length === 0) {
    posts = seedPosts;
  }

  // Sort latest 15 by publishedDate descending
  const latest15 = posts
    .slice()
    .sort((a, b) => {
      const dateA = new Date(a.publishedDate || a.createdAt || Date.now()).getTime();
      const dateB = new Date(b.publishedDate || b.createdAt || Date.now()).getTime();
      return dateB - dateA;
    })
    .slice(0, 15);

  const siteUrl = 'https://sarkarijobalerts.com';

  const itemsXml = latest15
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
      const guid = link;
      const cleanTitle = rawTitle.length > 70 ? rawTitle.substring(0, 70) + '...' : rawTitle;
      const ogImageUrl = `https://placehold.co/1200x630/0f172a/ffffff.png?text=${encodeURIComponent(cleanTitle + '\n\n' + rawOrg + '\nSarkariJobAlerts.com')}`;

      return `    <item>
      <title>${title}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${guid}</guid>
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

  return new Response(rssXml, {
    headers: {
      'Content-Type': 'text/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
