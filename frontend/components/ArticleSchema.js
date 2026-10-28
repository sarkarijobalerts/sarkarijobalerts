export default function ArticleSchema({ post }) {
  if (!post) return null;

  const parseIsoDate = (dateStr) => {
    if (!dateStr) return new Date().toISOString();
    if (typeof dateStr === 'string' && dateStr.includes('/')) {
      const parts = dateStr.split('/');
      if (parts.length === 3) {
        const [day, month, year] = parts;
        const parsed = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
        if (!isNaN(parsed.getTime())) {
          return parsed.toISOString();
        }
      }
    }
    const parsed = new Date(dateStr);
    return !isNaN(parsed.getTime()) ? parsed.toISOString() : new Date().toISOString();
  };

  const titleText = post.rewrittenTitle || post.title || 'Government Job Vacancy Alert';
  const descText = post.metaDescription || post.shortInfo || `${titleText} recruitment notification, eligibility criteria, important dates, and official application details.`;
  const pageUrl = `https://sarkarijobalerts.com/job/${post.slug}/`;
  const datePublished = parseIsoDate(post.publishedDate || post.postDate);
  const dateModified = parseIsoDate(post.updatedDate || post.postDate || post.publishedDate);

  const keywordsList = [
    post.primaryKeyword,
    post.organizationName,
    post.category,
    'Sarkari Result',
    'Sarkari Naukri',
    'Govt Jobs 2026',
  ].filter(Boolean).join(', ');

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': pageUrl,
    },
    headline: titleText.slice(0, 110),
    description: descText.slice(0, 200),
    image: [
      'https://sarkarijobalerts.com/sarkari-job.jpg',
    ],
    datePublished,
    dateModified,
    author: {
      '@type': 'Person',
      name: 'Rohit Sharma',
      jobTitle: 'Senior Government Recruitment Analyst & Chief Editor',
      url: 'https://sarkarijobalerts.com/about/',
    },
    publisher: {
      '@type': 'Organization',
      name: 'SarkariJobAlerts',
      url: 'https://sarkarijobalerts.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://sarkarijobalerts.com/icon.png',
      },
    },
    articleSection: post.category || 'Government Jobs',
    keywords: keywordsList,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}
