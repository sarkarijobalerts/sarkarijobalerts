import ThreeColumnLayout from '../components/ThreeColumnLayout';
import SeoContentBlock from '../components/SeoContentBlock';
import seedPosts from '../lib/seedPosts.json';

export const dynamic = 'force-static';

export const metadata = {
  title: {
    absolute: 'Sarkari Result 2026 – Sarkari Naukri & Latest Govt Jobs',
  },
  description: 'Sarkari Job Alerts 2026: Real-time notifications for latest govt jobs, sarkari results, admit cards, and recruitment notices for SSC, Railway, UPSC & Banking.',
  openGraph: {
    title: 'Sarkari Result 2026 – Sarkari Naukri & Latest Govt Jobs',
    description: 'Sarkari Job Alerts 2026: Real-time notifications for latest govt jobs, sarkari results, admit cards, and recruitment notices for SSC, Railway, UPSC & Banking.',
    url: 'https://sarkarijobalerts.com/',
    siteName: 'SarkariJobAlerts',
    images: [
      {
        url: 'https://sarkarijobalerts.com/og-banner.png',
        width: 1200,
        height: 630,
        alt: 'Sarkari Result & Sarkari Naukri 2026 – SarkariJobAlerts.com',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@SarkariJobAlert',
    creator: '@SarkariJobAlert',
    title: 'Sarkari Result 2026 – Sarkari Naukri & Latest Govt Jobs',
    description: 'Sarkari Job Alerts 2026: Real-time notifications for latest govt jobs, sarkari results, admit cards, and recruitment notices for SSC, Railway, UPSC & Banking.',
    images: ['https://sarkarijobalerts.com/og-banner.png'],
  },
  alternates: {
    canonical: 'https://sarkarijobalerts.com/',
  },
};

export default async function HomePage() {
  const latestJobs = seedPosts.filter((p) => p.category === 'Latest Jobs');
  const admitCards = seedPosts.filter((p) => p.category === 'Admit Cards');
  const results = seedPosts.filter((p) => p.category === 'Results');
  const answerKeys = seedPosts.filter((p) => p.category === 'Answer Key');
  const syllabus = seedPosts.filter((p) => p.category === 'Syllabus');

  return (
    <div className="pb-12">
      <ThreeColumnLayout
        results={results}
        admitCards={admitCards}
        latestJobs={latestJobs}
        answerKeys={answerKeys}
        syllabus={syllabus}
      />
      {/* Comprehensive SEO Content Block & FAQ Schema */}
      <SeoContentBlock />
    </div>
  );
}
