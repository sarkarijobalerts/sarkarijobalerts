export default function SiteEntitySchema() {
  const schemaData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://sarkarijobalerts.com/#organization',
        name: 'SarkariJobAlerts',
        alternateName: ['Sarkari Job Alerts', 'SarkariResult', 'Sarkari Naukri Alerts Portal'],
        url: 'https://sarkarijobalerts.com',
        logo: {
          '@type': 'ImageObject',
          '@id': 'https://sarkarijobalerts.com/#logo',
          url: 'https://sarkarijobalerts.com/icon.png',
          caption: 'SarkariJobAlerts Official Logo',
          width: 512,
          height: 512,
        },
        image: 'https://sarkarijobalerts.com/og-banner.png',
        description: 'SarkariJobAlerts.com is India’s premier automated government job alert portal, tracking over 200+ central and state recruitment boards 24/7 to provide instant updates on Latest Govt Jobs, Admit Cards, and Results.',
        foundingDate: '2024',
        knowsAbout: [
          'Government Jobs in India',
          'Sarkari Naukri',
          'Staff Selection Commission (SSC)',
          'Union Public Service Commission (UPSC)',
          'Railway Recruitment Boards (RRB)',
          'Institute of Banking Personnel Selection (IBPS)',
          'State Police Bharti & Public Service Commissions',
        ],
        sameAs: [
          'https://www.facebook.com/SarkariJobAlertsCom/',
          'https://www.facebook.com/groups/sarkarijobalertscom',
          'https://t.me/sarkarijobalerts_live',
          'https://x.com/SarkariJobAlert',
          'https://www.linkedin.com/company/sarkarijobalerts',
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+91-83683-98283',
          contactType: 'Customer Support & Editorial Inquiries',
          email: 'support@sarkarijobalerts.com',
          areaServed: 'IN',
          availableLanguage: ['en', 'hi'],
        },
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Sector 4',
          addressLocality: 'Noida',
          addressRegion: 'Uttar Pradesh',
          postalCode: '201301',
          addressCountry: 'IN',
        },
      },
      {
        '@type': 'WebSite',
        '@id': 'https://sarkarijobalerts.com/#website',
        url: 'https://sarkarijobalerts.com',
        name: 'SarkariJobAlerts',
        alternateName: 'Sarkari Result & Sarkari Naukri 2026',
        description: 'Sarkari Job Alerts 2026: Get real-time sarkari naukri notifications, sarkari result updates, and admit card links.',
        publisher: {
          '@id': 'https://sarkarijobalerts.com/#organization',
        },
        inLanguage: 'en-IN',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://sarkarijobalerts.com/latest-jobs/?q={search_term_string}',
          },
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Person',
        '@id': 'https://sarkarijobalerts.com/#author',
        name: 'Rohit Sharma',
        jobTitle: 'Senior Government Recruitment Analyst & Chief Editor',
        worksFor: {
          '@id': 'https://sarkarijobalerts.com/#organization',
        },
        url: 'https://sarkarijobalerts.com/about/',
        description: 'Senior Government Recruitment Analyst and Chief Editor at SarkariJobAlerts.com with over 7 years of experience analyzing UPSC, SSC, Railway, and State PSC notifications.',
        sameAs: [
          'https://sarkarijobalerts.com/about/',
          'https://www.linkedin.com/company/sarkarijobalerts',
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}
