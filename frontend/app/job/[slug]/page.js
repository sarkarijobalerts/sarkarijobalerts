import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import JobPostingSchema from '../../../components/JobPostingSchema';
import ArticleSchema from '../../../components/ArticleSchema';
import FAQSchema from '../../../components/FAQSchema';
import seedPosts from '../../../lib/seedPosts.json';
import expiredSlugs from '../../../lib/expiredSlugs.json';
import { Calendar, CreditCard, UserCheck, ExternalLink, ArrowLeft, Building2, Tag, ListOrdered, FileText, ChevronRight } from 'lucide-react';
import RichTextWithLinks from '../../../components/RichTextWithLinks';
export const dynamic = 'force-static';

// Strict view-layer sanitizer helper
function cleanText(text, maxLen = 120) {
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

function toIsoDate(dateStr) {
  if (!dateStr) return new Date().toISOString().split('T')[0];
  if (typeof dateStr === 'string' && dateStr.includes('/')) {
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const [d, m, y] = parts;
      return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
    }
  }
  const parsed = new Date(dateStr);
  return !isNaN(parsed.getTime()) ? parsed.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
}

export async function generateStaticParams() {
  const activeParams = seedPosts.map((post) => ({
    slug: post.slug,
  }));
  const expiredParams = expiredSlugs.map((slug) => ({
    slug,
  }));
  return [...activeParams, ...expiredParams];
}

async function fetchJobDetails(slug) {
  if (expiredSlugs.includes(slug)) {
    return { isExpired: true };
  }

  const match = seedPosts.find((p) => p.slug === slug);
  if (match) return match;

  try {
    const res = await fetch(`http://localhost:5000/api/posts/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (json.success && json.data) return json.data;
  } catch (error) {
    console.warn(`[Frontend] Error fetching job slug '${slug}' from API.`);
  }

  return null;
}

export async function generateMetadata({ params }) {
  const post = await fetchJobDetails(params.slug);
  if (!post || post.isExpired) {
    return {
      title: { absolute: 'Job Alert Not Found | SarkariJobAlerts' },
    };
  }

  let orgShort = cleanText(post.organizationShort || post.organizationName || post.organization || '', 18);
  orgShort = orgShort.replace(/Commission|Recruitment|Board|Department|Corporation|Limited/gi, '').trim();

  let jobShort = cleanText(post.postName || post.rewrittenTitle || post.title, 35);
  let combined = jobShort;
  if (orgShort && orgShort.length > 2 && !jobShort.toLowerCase().includes(orgShort.toLowerCase().slice(0, 4))) {
    combined = `${orgShort} ${jobShort}`;
  }
  combined = cleanText(combined, 33);
  if (!combined.includes('2026') && !combined.includes('2025')) {
    combined = `${combined} 2026`;
  }
  const finalTitle = `${cleanText(combined, 38)} | SarkariJobAlerts`;
  
  let description = cleanText(post.metaDescription || post.shortInfo, 155);
  if (!description || description.length < 50) {
    const orgName = cleanText(post.organizationName || post.organization || 'Govt', 25);
    description = `${cleanText(post.postName || post.title, 35)} recruitment 2026 notification by ${orgName}. Check eligibility criteria, age limit, and apply online.`;
  }
  if (description.length > 155) {
    description = description.slice(0, 152).trim() + '...';
  }

  const staticBannerUrl = 'https://sarkarijobalerts.com/og-banner.png';

  return {
    title: {
      absolute: finalTitle,
    },
    description,
    alternates: {
      canonical: `https://sarkarijobalerts.com/job/${params.slug}/`,
    },
    openGraph: {
      title: finalTitle,
      description,
      url: `https://sarkarijobalerts.com/job/${params.slug}/`,
      siteName: 'SarkariJobAlerts',
      images: [
        {
          url: staticBannerUrl,
          width: 1200,
          height: 630,
          alt: 'SarkariJobAlerts.com Official Banner',
        },
      ],
      locale: 'en_IN',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      site: '@SarkariJobAlert',
      creator: '@SarkariJobAlert',
      title: finalTitle,
      description,
      images: [staticBannerUrl],
    },
  };
}

export default async function JobDetailPage({ params }) {
  const post = await fetchJobDetails(params.slug);

  if (!post) {
    notFound();
  }

  if (post.isExpired) {
    redirect('/');
  }

  const dates = post.importantDates || [];
  const fees = post.applicationFee || [];
  const vacancies = post.vacanciesTable || [];
  const rawLinks = post.importantLinks || [];
  const links = rawLinks
    .map((l) => {
      let url = l.url;
      if (!url || typeof url !== 'string' || !url.startsWith('http')) {
        return null;
      }
      if (url.startsWith('http://')) {
        url = url.replace('http://', 'https://');
      }
      return { ...l, url };
    })
    .filter(Boolean);

  const applySteps = post.howToApply || [];

  const org = cleanText(post.organizationName || post.organization, 60) || 'Government Recruitment Board';
  const postTitle = cleanText(post.rewrittenTitle || post.title, 100);
  const isoDate = toIsoDate(post.publishedDate || post.postDate);
  const isoModified = toIsoDate(post.updatedDate || post.postDate || post.publishedDate);

  // Circular related posts linking: guarantees every post gets at least 6 incoming dofollow links
  const categoryPosts = seedPosts.filter((p) => p.category === post.category);
  const curIdx = categoryPosts.findIndex((p) => p.slug === post.slug);
  const relatedPosts = [];

  if (categoryPosts.length > 1 && curIdx !== -1) {
    for (let offset = 1; offset <= 6 && relatedPosts.length < 6; offset++) {
      const nextIdx = (curIdx + offset) % categoryPosts.length;
      if (nextIdx !== curIdx) {
        relatedPosts.push(categoryPosts[nextIdx]);
      }
    }
  }

  // Cross-category fallbacks if fewer than 6
  if (relatedPosts.length < 6) {
    const additional = seedPosts
      .filter((p) => p.slug !== post.slug && !relatedPosts.some((r) => r.slug === p.slug))
      .slice(0, 6 - relatedPosts.length);
    relatedPosts.push(...additional);
  }

  return (
    <article className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Schema.org NewsArticle Structured Data (Machine Readability & AI Discoverability) */}
      <ArticleSchema post={post} />

      {/* Schema.org JobPosting Structured Data */}
      <JobPostingSchema post={post} />

      {/* Back Navigation */}
      <Link
        href="/"
        className="inline-flex items-center space-x-2 text-xs font-semibold text-cyan-400 hover:text-cyan-300 mb-6 bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-xl transition-colors shadow-md"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Sarkari Job Alerts</span>
      </Link>

      {/* =========================================================================
          CLASSIC SARKARI RESULT / JOB FIND TABLE CARD CONTAINER
         ========================================================================= */}
      <div className="bg-slate-950 border-2 border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden mb-10">
        
        {/* HEADER BANNER */}
        <div className="bg-gradient-to-b from-slate-900 to-slate-950 p-6 sm:p-8 text-center border-b-2 border-slate-700 space-y-3">
          <div className="text-xl sm:text-2xl font-black text-rose-500 uppercase tracking-wide">
            {org}
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-emerald-400 leading-tight">
            {postTitle} Recruitment 2026 – Apply Online, Notification PDF
          </h1>
          <div className="pt-1">
            <span className="text-xs sm:text-sm font-extrabold text-cyan-400 tracking-widest uppercase bg-slate-900 border border-cyan-500/30 px-4 py-1 rounded-full inline-block shadow-inner">
              WWW.SARKARIJOBALERTS.COM
            </span>
          </div>
          
          {/* Verified Author Byline & Dates */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs text-slate-400">
            <span className="inline-flex items-center space-x-1.5 text-slate-300 bg-slate-900/90 border border-slate-800 px-3 py-1 rounded-full">
              <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>By <Link href="/about/" className="text-cyan-400 hover:underline font-semibold">Rohit Sharma</Link> (Fact-Checked &amp; Verified)</span>
            </span>
            <span className="inline-flex items-center space-x-1.5 text-slate-300 bg-slate-900/90 border border-slate-800 px-3 py-1 rounded-full">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <span>Updated:</span>
              <time dateTime={isoModified} className="text-emerald-400 font-semibold">
                {cleanText(post.postDate || isoModified, 30)}
              </time>
            </span>
            <span className="inline-flex items-center space-x-1.5 text-slate-400 bg-slate-900/90 border border-slate-800 px-3 py-1 rounded-full">
              <span>Published:</span>
              <time dateTime={isoDate} className="text-slate-300 font-semibold">
                {isoDate}
              </time>
            </span>
          </div>
        </div>

        {/* SHORT INFORMATION SUMMARY */}
        {post.shortInfo && (
          <div className="p-5 sm:p-6 bg-slate-900/60 border-b-2 border-slate-700 text-sm text-slate-300 leading-relaxed">
            <strong className="text-cyan-400 block mb-1 text-base font-bold">Short Details of Notification :</strong>
            <p><RichTextWithLinks text={cleanText(post.shortInfo, 300)} currentSlug={post.slug} /></p>
          </div>
        )}

        {/* ===== IMPORTANT DATES TABLE (Sanitized <table>) ===== */}
        <div className="p-6 border-b-2 border-slate-700 bg-slate-950/90">
          <h2 className="text-base font-black text-emerald-400 uppercase tracking-wider text-center mb-4 flex items-center justify-center space-x-2">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span>{postTitle} Important Dates 2026</span>
          </h2>
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs sm:text-sm text-slate-300 border-collapse">
              <thead className="bg-slate-900 text-slate-200 font-extrabold uppercase border-b border-slate-800 text-center">
                <tr>
                  <th className="py-3 px-4 text-left border-r border-slate-800">Event</th>
                  <th className="py-3 px-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-950/60">
                {dates.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="py-4 px-4 text-center text-slate-400">
                      Refer official notification for exam schedule
                    </td>
                  </tr>
                ) : (
                  dates.map((d, i) => {
                    const eventNameStr = cleanText(d.eventName || d.title, 50);
                    const dateValueStr = cleanText(d.dateValue || d.dateVal, 60);
                    return (
                      <tr key={i} className="hover:bg-slate-900/50">
                        <td className="py-3 px-4 font-bold text-slate-200 border-r border-slate-800">
                          {eventNameStr}
                        </td>
                        <td className="py-3 px-4 font-bold text-emerald-400 text-right">
                          {dateValueStr}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ===== APPLICATION FEE TABLE (Sanitized <table>) ===== */}
        <div className="p-6 border-b-2 border-slate-700 bg-slate-950/90">
          <h2 className="text-base font-black text-emerald-400 uppercase tracking-wider text-center mb-4 flex items-center justify-center space-x-2">
            <CreditCard className="w-4 h-4 text-emerald-400" />
            <span>{postTitle} Application Fee Details</span>
          </h2>
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs sm:text-sm text-slate-300 border-collapse">
              <thead className="bg-slate-900 text-slate-200 font-extrabold uppercase border-b border-slate-800 text-center">
                <tr>
                  <th className="py-3 px-4 text-left border-r border-slate-800">Category</th>
                  <th className="py-3 px-4 text-right">Fee Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-950/60">
                {fees.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="py-4 px-4 text-center text-slate-400">
                      Refer official notification for fee details
                    </td>
                  </tr>
                ) : (
                  fees.map((f, i) => {
                    const categoryStr = cleanText(f.category, 50);
                    const amountStr = cleanText(f.amount || f.feeVal, 60);
                    return (
                      <tr key={i} className="hover:bg-slate-900/50">
                        <td className="py-3 px-4 font-bold text-slate-200 border-r border-slate-800">
                          {categoryStr}
                        </td>
                        <td className="py-3 px-4 font-bold text-cyan-400 text-right">
                          {amountStr}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-400 italic mt-3 text-center">
            • Pay the Examination Fee Through Debit Card, Credit Card, Net Banking, E Wallet or Offline Fee Mode.
          </p>
        </div>

        {/* ===== AGE LIMIT & ELIGIBILITY TABLE (Sanitized <table>) ===== */}
        {post.ageLimit && (
          <div className="p-6 border-b-2 border-slate-700 bg-slate-900/40">
            <h2 className="text-base font-black text-amber-400 uppercase tracking-wider text-center mb-4 flex items-center justify-center space-x-2">
              <UserCheck className="w-4 h-4 text-amber-400" />
              <span>{postTitle} Age Limit & Eligibility Criteria</span>
            </h2>
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs sm:text-sm text-slate-300 border-collapse">
                <thead className="bg-slate-900 text-slate-200 font-extrabold uppercase border-b border-slate-800 text-center">
                  <tr>
                    <th className="py-3 px-4 text-left border-r border-slate-800">Criteria</th>
                    <th className="py-3 px-4 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-950/60">
                  {post.ageLimit.minAge && (
                    <tr className="hover:bg-slate-900/50">
                      <td className="py-3 px-4 font-bold text-slate-200 border-r border-slate-800">Minimum Age</td>
                      <td className="py-3 px-4 font-bold text-white text-right">{cleanText(post.ageLimit.minAge, 30)}</td>
                    </tr>
                  )}
                  {post.ageLimit.maxAge && (
                    <tr className="hover:bg-slate-900/50">
                      <td className="py-3 px-4 font-bold text-slate-200 border-r border-slate-800">Maximum Age</td>
                      <td className="py-3 px-4 font-bold text-white text-right">{cleanText(post.ageLimit.maxAge, 30)}</td>
                    </tr>
                  )}
                  {post.ageLimit.asOnDate && (
                    <tr className="hover:bg-slate-900/50">
                      <td className="py-3 px-4 font-bold text-slate-200 border-r border-slate-800">Age Calculated As On</td>
                      <td className="py-3 px-4 font-bold text-emerald-400 text-right">{cleanText(post.ageLimit.asOnDate, 50)}</td>
                    </tr>
                  )}
                  {post.ageLimit.relaxationInfo && (
                    <tr className="hover:bg-slate-900/50">
                      <td className="py-3 px-4 font-bold text-slate-200 border-r border-slate-800">Age Relaxation</td>
                      <td className="py-3 px-4 text-slate-300 text-right text-xs">{cleanText(post.ageLimit.relaxationInfo, 150)}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VACANCY DETAILS TABLE (Sanitized 4 COLUMNS: Post Name | Total Post | Age Limit | Eligibility) */}
        <div className="p-6 border-b-2 border-slate-700 bg-slate-950">
          <div className="text-center mb-4">
            <h2 className="text-lg font-black text-emerald-400 uppercase tracking-wider">
              {postTitle} Vacancy Details <span className="text-pink-400">Total Post : {cleanText(post.totalVacancies, 30) || 'Various Posts'}</span>
            </h2>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs sm:text-sm text-slate-300 border-collapse">
              <thead className="bg-slate-900 text-slate-200 font-extrabold uppercase border-b border-slate-800 text-center">
                <tr>
                  <th className="py-3 px-4 text-left border-r border-slate-800">Post Name</th>
                  <th className="py-3 px-4 border-r border-slate-800 w-28">Total Post</th>
                  <th className="py-3 px-4 border-r border-slate-800 w-28">Age Limit</th>
                  <th className="py-3 px-4 text-left">Eligibility</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-950/60">
                {vacancies.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-4 px-4 text-center text-slate-400">
                      Refer official notification PDF for detailed post-wise vacancy breakdown.
                    </td>
                  </tr>
                ) : (
                  vacancies.map((v, i) => {
                    const postNameStr = cleanText(v.postName, 80);
                    const totalPostStr = cleanText(v.totalPost || v.totalPosts, 30) || 'Various';
                    const ageLimitStr = cleanText(v.ageLimit, 30) || '18-35';
                    const eligibilityStr = cleanText(v.eligibility, 150);
                    return (
                      <tr key={i} className="hover:bg-slate-900/50">
                        <td className="py-3.5 px-4 font-bold text-white border-r border-slate-800">{postNameStr}</td>
                        <td className="py-3.5 px-4 text-center font-extrabold text-pink-400 border-r border-slate-800">{totalPostStr}</td>
                        <td className="py-3.5 px-4 text-center font-bold text-emerald-400 border-r border-slate-800">{ageLimitStr}</td>
                        <td className="py-3.5 px-4 text-xs text-slate-300 leading-relaxed">• {eligibilityStr}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* HOW TO APPLY ONLINE SECTION */}
        {applySteps.length > 0 && (
          <div className="p-6 border-b-2 border-slate-700 bg-slate-900/40 space-y-3">
            <h2 className="text-base font-black text-emerald-400 uppercase tracking-wider text-center flex items-center justify-center space-x-2">
              <ListOrdered className="w-5 h-5 text-emerald-400" />
              <span>How To Apply Online for {postTitle} 2026</span>
            </h2>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
              {applySteps.map((step, i) => (
                <li key={i} className="flex items-start space-x-2">
                  <span className="text-emerald-400 font-bold flex-shrink-0">•</span>
                  <span>{cleanText(step, 200)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* USEFUL IMPORTANT DIRECT LINKS TABLE */}
        <div className="p-6 bg-slate-950 border-b-2 border-slate-700 space-y-4">
          <h2 className="text-lg font-black text-emerald-400 uppercase tracking-wider text-center border-b border-slate-800 pb-3">
            {postTitle} – Useful Important Direct Links
          </h2>

          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs sm:text-sm text-slate-300">
              <tbody className="divide-y divide-slate-800">
                {links.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="py-3 px-4 text-center text-slate-400">
                      Visit official portal for application submission.
                    </td>
                  </tr>
                ) : (
                  links.map((link, i) => {
                    const labelStr = cleanText(link.label || link.linkTitle, 60);
                    return (
                      <tr key={i} className="hover:bg-slate-900/60">
                        <td className="py-3.5 px-4 font-bold text-slate-200">
                          {labelStr}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-extrabold text-xs px-4 py-2 rounded-lg transition-all shadow-md group"
                          >
                            <span>Click Here</span>
                            <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                          </a>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Official Source Citation & Authority Attribution */}
          <div className="mt-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="flex items-center space-x-1.5 font-bold text-slate-200">
                <Building2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>Primary Citation: {org} Official Recruitment Portal</span>
              </span>
              <span className="text-[11px] text-slate-400">
                Data extracted from public government gazette notifications.
              </span>
            </div>
            <p className="text-[11px] text-slate-400 italic leading-relaxed">
              &quot;Candidates are strongly advised to download the official notification PDF and verify eligibility terms directly before submitting their online applications.&quot; — <em>National Career Service (NCS) Advisory</em>
            </p>
          </div>
        </div>

        {/* PER-JOB FAQ SECTION WITH SCHEMA */}
        <FAQSchema post={post} />

      </div>

      {/* RELATED SARKARI JOB ALERTS */}
      {relatedPosts.length > 0 && (
        <div className="mt-10 bg-slate-950 border-2 border-slate-700/80 rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-950 to-slate-900 border-b border-indigo-500/30 px-5 py-4">
            <h2 className="text-lg font-bold text-indigo-400 tracking-wide">
              Related Sarkari Job Alerts
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">More {post.category} updates you may be interested in</p>
          </div>
          <ul className="divide-y divide-slate-800/80 p-2">
            {relatedPosts.map((item, index) => {
              const relTitle = cleanText(item.rewrittenTitle || item.title, 100);
              const relOrg = cleanText(item.organizationName || item.organization, 50);
              return (
                <li key={index} className="group">
                  <Link
                    href={`/job/${item.slug}/`}
                    className="block p-3.5 rounded-xl hover:bg-indigo-950/40 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="text-sm font-semibold text-slate-200 group-hover:text-indigo-300 line-clamp-2 leading-snug">
                          {relTitle}
                        </h3>
                        <p className="text-[11px] text-slate-400">
                          {relOrg} {item.totalVacancies && item.totalVacancies !== 'N/A' ? `• ${cleanText(item.totalVacancies, 20)} Posts` : ''}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-transform flex-shrink-0 ml-2 mt-0.5" />
                    </div>
                    {item.postDate && (
                      <span className="text-[11px] text-indigo-400/80 mt-1 inline-block font-medium">
                        Updated: {cleanText(item.postDate, 20)}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </article>
  );
}
