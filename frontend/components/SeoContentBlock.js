import Link from 'next/link';
import { HelpCircle, CheckCircle, ShieldCheck, Zap, Globe, FileText, Search, UserCheck } from 'lucide-react';

export default function SeoContentBlock() {
  const faqs = [
    {
      question: 'What is SarkariJobAlerts.com and how does it work?',
      answer: 'SarkariJobAlerts.com is India’s premier automated government job alert portal. We monitor official recruitment notifications across central and state government departments 24/7, providing instant, AI-optimized updates on Latest Jobs, Admit Cards, and Examination Results.',
    },
    {
      question: 'Are all job notifications on SarkariJobAlerts.com free?',
      answer: 'Yes! 100% of our job alerts, exam admit card links, syllabus updates, and result notifications are completely free for all job seekers across India.',
    },
    {
      question: 'How do I find government jobs for 10th pass or 12th pass qualifications?',
      answer: 'We categorize job postings by qualification level. You can explore dedicated sections for 10th pass sarkari naukri, 12th pass government jobs, ITI apprenticeships, and graduate degree recruitments directly from our dashboard.',
    },
    {
      question: 'Is SarkariJobAlerts.com affiliated with any government organization?',
      answer: 'No. SarkariJobAlerts.com is an independent news and educational portal. We gather public notifications directly from official government recruitment websites (such as ssc.gov.in, upsc.gov.in, and indianrailways.gov.in) to assist candidates.',
    },
    {
      question: 'How often are job alerts updated on SarkariJobAlerts.com?',
      answer: 'Our automated system updates job notifications every 30 minutes, ensuring you get real-time alerts the moment an official notification PDF or online application link is published.',
    },
    {
      question: 'Where can I get direct links to apply online for Govt jobs?',
      answer: 'Every job detail page on SarkariJobAlerts.com contains a dedicated "Useful Important Direct Links" section with verified official application form links and notification PDF downloads.',
    },
  ];

  const structuredSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': 'https://sarkarijobalerts.com/#article-guide',
        headline: 'How to Find and Apply for Sarkari Naukri 2026? Complete Guide to Latest Govt Jobs & Sarkari Result',
        description: 'Comprehensive guide to finding latest government jobs 2026, admit card downloads, and sarkari result notifications across central and state departments in India.',
        datePublished: '2026-01-01T00:00:00+05:30',
        dateModified: '2026-10-15T12:00:00+05:30',
        author: {
          '@type': 'Person',
          name: 'Rohit Sharma',
          jobTitle: 'Senior Government Recruitment Analyst & Chief Editor',
          url: 'https://sarkarijobalerts.com/about/',
          sameAs: 'https://sarkarijobalerts.com/about/',
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
        mainEntityOfPage: 'https://sarkarijobalerts.com/',
        citation: [
          'https://ssc.gov.in',
          'https://upsc.gov.in',
          'https://indianrailways.gov.in',
          'https://ibps.in',
          'https://www.ncs.gov.in',
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://sarkarijobalerts.com/#faq',
        mainEntity: faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      },
    ],
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-800/80 mt-12 text-slate-300">
      {/* Comprehensive Schema.org JSON-LD (Article + FAQPage) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredSchema) }}
      />

      {/* SEO Article Header */}
      <div className="glass-card rounded-3xl p-6 sm:p-10 mb-10 border border-slate-800 shadow-2xl">
        <div className="inline-flex items-center space-x-2 bg-cyan-950/80 border border-cyan-700/40 px-4 py-1.5 rounded-full text-xs font-bold text-cyan-300 mb-4">
          <Zap className="w-4 h-4 text-cyan-400" />
          <span>India’s Most Trusted Free Job Alert Portal</span>
        </div>
        
        {/* Question-Style H2 Heading */}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight mb-4">
          How to Find and Apply for Sarkari Naukri 2026? Complete Guide to Latest Govt Jobs &amp; Sarkari Result
        </h2>

        {/* Machine-Readable Freshness & Editorial Byline */}
        <div className="flex flex-wrap items-center gap-3 pt-2 pb-4 text-xs text-slate-400 border-b border-slate-800 mb-6">
          <span className="flex items-center space-x-1.5 text-slate-300">
            <UserCheck className="w-4 h-4 text-cyan-400" />
            <span>
              Authored &amp; Fact-Checked by:{' '}
              <Link href="/about/" className="text-cyan-400 font-semibold hover:underline">
                Rohit Sharma (Senior Govt Recruitment Analyst, SarkariJobAlerts Editorial Team)
              </Link>
            </span>
          </span>
          <span>•</span>
          <span className="flex items-center space-x-1">
            <span>Last Updated:</span>
            <time dateTime="2026-10-15" className="text-emerald-400 font-semibold">
              October 15, 2026
            </time>
          </span>
          <span>•</span>
          <span className="text-slate-400">Automated Crawl Cycle: Every 30 Minutes</span>
        </div>

        <div className="prose prose-invert max-w-none text-slate-300 text-sm sm:text-base leading-relaxed space-y-6">
          <p>
            Welcome to <strong>SarkariJobAlerts.com</strong>, your ultimate destination for real-time 
            <strong> Sarkari Naukri</strong> notifications, <strong>Latest Govt Jobs 2026</strong>, 
            entrance exam admit cards, and official <strong>Sarkari Result</strong> declarations. 
            Get the direct links to <strong>apply online govt jobs</strong> instantly. Securing a government job in India (Sarkari Naukri) offers unmatched job security, 
            respect, competitive salary packages, and long-term career growth. However, staying updated with thousands of 
            notifications published across central ministries and state recruitment boards can be overwhelming.
          </p>

          <p>
            That is where <strong>SarkariJobAlerts.com</strong> automated platform steps in. 
            We monitor over 200+ official recruitment portals 24/7—including named government authorities such as the{' '}
            <a
              href="https://ssc.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 font-bold hover:underline"
            >
              Staff Selection Commission (SSC)
            </a>
            ,{' '}
            <a
              href="https://upsc.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 font-bold hover:underline"
            >
              Union Public Service Commission (UPSC)
            </a>
            ,{' '}
            <a
              href="https://indianrailways.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 font-bold hover:underline"
            >
              Railway Recruitment Boards (RRB)
            </a>
            ,{' '}
            <a
              href="https://ibps.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 font-bold hover:underline"
            >
              Institute of Banking Personnel Selection (IBPS)
            </a>
            , and the{' '}
            <a
              href="https://www.ncs.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 font-bold hover:underline"
            >
              National Career Service (NCS Portal)
            </a>
            —bringing you instant, verified, and AI-optimized alerts without clutter.
          </p>

          {/* Outbound Authority Quotation */}
          <blockquote className="border-l-4 border-cyan-500 pl-4 py-3 italic text-slate-300 bg-slate-900/60 rounded-r-xl my-4 text-sm leading-relaxed">
            &ldquo;Ensuring transparent, timely, and accessible recruitment alerts across all central and state departments empowers youth nationwide to participate in nation-building careers.&rdquo;
            <footer className="text-xs text-slate-400 mt-1.5 not-italic font-semibold">
              — <em>National Career Service (NCS) &amp; Ministry of Labour and Employment, Government of India</em>
            </footer>
          </blockquote>

          {/* Question-Style H3 Heading */}
          <h3 className="text-xl font-bold text-cyan-400 mt-8 mb-3 flex items-center space-x-2">
            <Globe className="w-5 h-5 text-cyan-400" />
            <span>Why Choose SarkariJobAlerts.com for Latest Govt Jobs 2026?</span>
          </h3>
          <p>
            Traditional job portals are often slow, difficult to navigate, or filled with outdated links. 
            SarkariJobAlerts.com is built with cutting-edge web architecture designed for ultra-fast loading speed 
            on both mobile devices and desktop screens. Here is why millions of job seekers rely on our platform:
          </p>

          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 my-4 list-none pl-0">
            <li className="flex items-start space-x-3 bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
              <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span><strong>Instant 30-Minute Automation:</strong> Our automated system fetches new job postings every 30 minutes directly from government sources.</span>
            </li>
            <li className="flex items-start space-x-3 bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
              <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span><strong>AI-Optimized Concise Summaries:</strong> Key eligibility rules, fee structures, age limits, and vacancy counts are formatted clearly.</span>
            </li>
            <li className="flex items-start space-x-3 bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
              <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span><strong>Direct Official Links:</strong> 100% verified apply online links and official notification PDF downloads for every job post.</span>
            </li>
            <li className="flex items-start space-x-3 bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
              <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span><strong>Google Jobs Rich Snippets:</strong> Embedded <code>JobPosting</code> JSON-LD schema ensures our listings rank directly in Google Search.</span>
            </li>
          </ul>

          {/* Question-Style H3 Heading */}
          <h3 className="text-xl font-bold text-indigo-400 mt-8 mb-4">
            How Does SarkariJobAlerts.com Compare to Traditional Job Portals?
          </h3>
          <div className="overflow-x-auto my-6 rounded-xl border border-slate-800">
            <table className="w-full min-w-[500px] text-left text-sm text-slate-300 border-collapse">
              <thead className="bg-slate-900 text-xs font-bold text-slate-400 uppercase">
                <tr>
                  <th className="py-3 px-4">Feature</th>
                  <th className="py-3 px-4 text-cyan-400">SarkariJobAlerts.com</th>
                  <th className="py-3 px-4 text-slate-400">Traditional Portals</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-950/40">
                <tr>
                  <td className="py-3 px-4 font-semibold text-white">Update Frequency</td>
                  <td className="py-3 px-4 text-emerald-400 font-bold">Real-time (Every 30 mins)</td>
                  <td className="py-3 px-4 text-slate-400">Manual / Delayed (24-48 hrs)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-white">Mobile Speed &amp; UX</td>
                  <td className="py-3 px-4 text-emerald-400 font-bold">Ultra-fast Next.js Clean Layout</td>
                  <td className="py-3 px-4 text-slate-400">Heavy ads &amp; broken layouts</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-white">Factual Accuracy</td>
                  <td className="py-3 px-4 text-emerald-400 font-bold">100% Exact Dates, Fees &amp; Links</td>
                  <td className="py-3 px-4 text-slate-400">Frequent copy-paste errors</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-white">Google Jobs Snippet Integration</td>
                  <td className="py-3 px-4 text-emerald-400 font-bold">Automatic JobPosting JSON-LD</td>
                  <td className="py-3 px-4 text-slate-400">Missing or invalid schema</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Question-Style H3 Heading */}
          <h3 className="text-xl font-bold text-amber-400 mt-8 mb-3">
            What Government Job Categories Are Covered on SarkariJobAlerts.com?
          </h3>
          <p>
            Whether you are a 10th pass student seeking entry-level posts or a postgraduate looking for administrative officer exams, 
            we cover all major government sectors:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-6">
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <h4 className="font-bold text-cyan-300 text-base mb-1">Railway Jobs (RRB / RRC)</h4>
              <p className="text-xs text-slate-400">RRB NTPC, Group D, Technician, ALP, and RPF Police recruitment updates.</p>
            </div>
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <h4 className="font-bold text-indigo-300 text-base mb-1">SSC Recruitments</h4>
              <p className="text-xs text-slate-400">SSC CGL, CHSL, GD Constable, MTS, CPO, and Stenographer notifications.</p>
            </div>
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <h4 className="font-bold text-emerald-300 text-base mb-1">Banking &amp; Insurance (IBPS / SBI)</h4>
              <p className="text-xs text-slate-400">SBI PO, SBI Clerk, IBPS PO, IBPS Clerk, RRB Officer, and LIC AAO alerts.</p>
            </div>
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <h4 className="font-bold text-amber-300 text-base mb-1">State Police Bharti</h4>
              <p className="text-xs text-slate-400">UP Police Constable, Bihar Police, MP Police SI, and Delhi Police online forms.</p>
            </div>
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <h4 className="font-bold text-rose-300 text-base mb-1">UPSC &amp; State PSC Exams</h4>
              <p className="text-xs text-slate-400">IAS Civil Services, NDA, CDS, CAPF, UPPSC PCS, BPSC, and MPPSC exams.</p>
            </div>
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <h4 className="font-bold text-sky-300 text-base mb-1">Teaching &amp; Defence Jobs</h4>
              <p className="text-xs text-slate-400">CTET, State TET, Agniveer Vayu/Army/Navy, Air Force, and Navy Sailor posts.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions (FAQ Section) */}
      <div className="glass-card rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl">
        <div className="flex items-center space-x-3 mb-8">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            {/* Question-Style H3 Heading */}
            <h3 className="text-2xl font-bold text-white">Frequently Asked Questions: How Do Govt Job Alerts Work?</h3>
            <p className="text-xs text-slate-400">Everything you need to know about government job alerts, dates, and SarkariJobAlerts.com</p>
          </div>
        </div>

        <div className="space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq.question}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-colors"
            >
              <h4 className="text-base font-bold text-slate-200 mb-2 flex items-center justify-between">
                <span>{faq.question}</span>
              </h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
