import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import JobPostingSchema from '../../../components/JobPostingSchema';
import ArticleSchema from '../../../components/ArticleSchema';
import FAQSchema from '../../../components/FAQSchema';
import AuthorBio from '../../../components/AuthorBio';
import seedPosts from '../../../lib/seedPosts.json';
import expiredSlugs from '../../../lib/expiredSlugs.json';
import {
  Calendar,
  CreditCard,
  UserCheck,
  ExternalLink,
  ArrowLeft,
  Building2,
  Tag,
  ListOrdered,
  FileText,
  ChevronRight,
  BookOpen,
  GraduationCap,
  Sparkles,
  CheckCircle,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
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

  let rawTitle = cleanText(post.rewrittenTitle || post.title || post.postName, 60);
  let finalTitle = `${rawTitle} | SarkariJobAlerts`;
  if (finalTitle.length > 70) {
    finalTitle = `${rawTitle.slice(0, 50).trim()}... | SarkariJobAlerts`;
  }

  let description = cleanText(post.metaDescription || post.shortInfo, 160);
  if (!description || description.length < 50) {
    const orgName = cleanText(post.organizationName || post.organization || 'Govt', 30);
    if (post.category === 'Results') {
      description = `Check ${rawTitle} results, cutoff marks, and merit list released by ${orgName}. Direct scorecard download link and verification guide.`;
    } else if (post.category === 'Admit Cards') {
      description = `Download ${rawTitle} admit card, exam city intimation slip, and hall ticket released by ${orgName}. Check exam dates and reporting instructions.`;
    } else if (post.category === 'Answer Key') {
      description = `Download ${rawTitle} official answer key and question paper solution by ${orgName}. Calculate raw marks and submit online objections.`;
    } else if (post.category === 'Syllabus') {
      description = `Download ${rawTitle} exam syllabus, pattern, and subject-wise marks distribution PDF released by ${orgName}. Preparation strategy and tips.`;
    } else {
      description = `${rawTitle} notification announced by ${orgName}. Check eligibility criteria, age limit, vacancies, and step-by-step apply online guide.`;
    }
  }
  if (description.length > 160) {
    description = description.slice(0, 157).trim() + '...';
  }

  const staticBannerUrl = 'https://sarkarijobalerts.com/sarkari-job.jpg';

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
          height: 675,
          alt: `${cleanText(post.rewrittenTitle || post.title || 'Sarkari Job Alert', 100)} - SarkariJobAlerts.com`,
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

  // Filter and sanitize external links - ensure only valid http/https URLs are clickable
  const links = rawLinks
    .map((l) => {
      let url = l.url;
      if (!url || typeof url !== 'string' || !url.startsWith('http')) {
        // If not a valid URL (e.g. "Click Here" or "Link will be activate..."), fall back to post sourceUrl or portal
        if (post.sourceUrl && post.sourceUrl.startsWith('http')) {
          url = post.sourceUrl;
        } else {
          return null;
        }
      }
      if (url.startsWith('http://')) {
        url = url.replace('http://', 'https://');
      }
      return { ...l, url };
    })
    .filter(Boolean);

  const org = cleanText(post.organizationName || post.organization, 70) || 'Government Recruitment Board';
  const postTitle = cleanText(post.rewrittenTitle || post.title, 110);
  const roleName = cleanText(post.postName || postTitle, 80);
  const totalPostsText = cleanText(post.totalVacancies, 30) || 'Various Posts';
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
          MAIN SARKARI POST CONTAINER CARD
         ========================================================================= */}
      <div className="bg-slate-950 border-2 border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden mb-10">

        {/* HEADER BANNER */}
        <div className="bg-gradient-to-b from-slate-900 to-slate-950 p-6 sm:p-8 text-center border-b-2 border-slate-700 space-y-3">
          <div className="text-xl sm:text-2xl font-black text-rose-500 uppercase tracking-wide">
            {org}
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-emerald-400 leading-tight">
            {post.category === 'Results' && `${postTitle} – Check Result, Merit List & Cutoff Marks`}
            {post.category === 'Admit Cards' && `${postTitle} – Download Hall Ticket, Exam City Slip & Date`}
            {post.category === 'Answer Key' && `${postTitle} – Download Answer Key & Question Paper Solution`}
            {post.category === 'Syllabus' && `${postTitle} – Detailed Exam Pattern, Syllabus & Marking Scheme PDF`}
            {(!post.category || post.category === 'Latest Jobs') && `${postTitle} Recruitment 2026 – Apply Online, Eligibility, Notification PDF`}
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
              <span>By <Link href="/about/" className="text-cyan-400 hover:underline font-semibold">Rohit Sharma</Link> (Senior Analyst, 15+ Yrs Exp)</span>
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

        {/* FEATURED BANNER IMAGE */}
        <div className="w-full border-b-2 border-slate-700 bg-slate-900/60 overflow-hidden flex justify-center">
          <img
            src="/sarkari-job.jpg"
            alt={`${postTitle} - Sarkari Job Alerts`}
            className="w-full max-h-[420px] object-cover"
            loading="eager"
          />
        </div>

        {/* =========================================================================
            SECTION 1: OVERVIEW & EXPERT TAKE (150+ Words Original Analysis)
           ========================================================================= */}
        <section className="p-6 sm:p-8 bg-slate-900/50 border-b-2 border-slate-700 space-y-4">
          <h2 className="text-xl sm:text-2xl font-black text-cyan-400 tracking-wide flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-cyan-400 flex-shrink-0" />
            <span>Overview &amp; Expert Analysis</span>
          </h2>

          <div className="prose prose-invert max-w-none text-sm sm:text-base text-slate-300 leading-relaxed space-y-3.5">
            <p>
              {cleanText(post.expertTake, 1500) || `The ${org} has announced critical updates for ${roleName}. Candidates must verify all details and prepare accordingly.`}
            </p>
            {post.shortInfo && (
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs sm:text-sm text-slate-300 space-y-1">
                <strong className="text-cyan-400 block text-xs uppercase tracking-wider">Official Summary:</strong>
                <p>{cleanText(post.shortInfo, 600)}</p>
              </div>
            )}
            <p className="text-xs sm:text-sm text-amber-300/90 font-medium bg-amber-950/30 border border-amber-500/30 p-3.5 rounded-xl">
              <strong>Advisory from Editorial Board:</strong> Aspirants are strongly encouraged to verify all dates and eligibility parameters directly from the official notification PDF. For online registrations or downloads, avoid peak traffic hours to prevent gateway timeouts.
            </p>
          </div>
        </section>

        {/* =========================================================================
            SECTION 2: IMPORTANT DATES & APPLICATION FEE (Semantic <table> Tags)
           ========================================================================= */}
        <section className="border-b-2 border-slate-700 bg-slate-950">
          <div className="p-6 border-b border-slate-800 bg-slate-900/30 text-center">
            <h2 className="text-xl font-black text-emerald-400 uppercase tracking-wide flex items-center justify-center space-x-2">
              <Calendar className="w-5 h-5 text-emerald-400" />
              <span>Important Dates &amp; Application Fee</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Factual schedule and category-wise examination fee structure for {postTitle}.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800">
            {/* Table 1: Important Dates */}
            <div className="p-6 space-y-3">
              <h3 className="text-sm font-extrabold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span>Important Dates Schedule</span>
              </h3>
              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left text-xs sm:text-sm text-slate-300 border-collapse">
                  <thead className="bg-slate-900 text-slate-200 font-extrabold uppercase border-b border-slate-800">
                    <tr>
                      <th scope="col" className="py-3 px-4 text-left border-r border-slate-800">Recruitment Event</th>
                      <th scope="col" className="py-3 px-4 text-right">Crucial Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 bg-slate-950/60">
                    {dates.length === 0 ? (
                      <tr>
                        <td colSpan={2} className="py-4 px-4 text-center text-slate-400">
                          Please refer to the official notification for the complete schedule.
                        </td>
                      </tr>
                    ) : (
                      dates.map((d, i) => (
                        <tr key={i} className="hover:bg-slate-900/50">
                          <td className="py-3 px-4 font-bold text-slate-200 border-r border-slate-800">
                            {cleanText(d.eventName || d.title, 60)}
                          </td>
                          <td className="py-3 px-4 font-bold text-emerald-400 text-right">
                            {cleanText(d.dateValue || d.dateVal, 60)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Table 2: Application Fee */}
            <div className="p-6 space-y-3">
              <h3 className="text-sm font-extrabold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
                <CreditCard className="w-4 h-4 text-cyan-400" />
                <span>Application Fee Breakdown</span>
              </h3>
              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left text-xs sm:text-sm text-slate-300 border-collapse">
                  <thead className="bg-slate-900 text-slate-200 font-extrabold uppercase border-b border-slate-800">
                    <tr>
                      <th scope="col" className="py-3 px-4 text-left border-r border-slate-800">Candidate Category</th>
                      <th scope="col" className="py-3 px-4 text-right">Fee (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 bg-slate-950/60">
                    {fees.length === 0 ? (
                      <tr>
                        <td colSpan={2} className="py-4 px-4 text-center text-slate-400">
                          General / OBC: ₹ 100/- • SC / ST / PwD: Exempted (As per Rules)
                        </td>
                      </tr>
                    ) : (
                      fees.map((f, i) => (
                        <tr key={i} className="hover:bg-slate-900/50">
                          <td className="py-3 px-4 font-bold text-slate-200 border-r border-slate-800">
                            {cleanText(f.category, 60)}
                          </td>
                          <td className="py-3 px-4 font-bold text-cyan-400 text-right">
                            {cleanText(f.amount || f.feeVal, 60)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <p className="text-[11px] text-slate-400 italic pt-1">
                • Mode of Payment: Online via State Bank of India (SBI) Gateway, Debit Card, Credit Card, Net Banking, or UPI.
              </p>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 3: DETAILED ELIGIBILITY & SYLLABUS BREAKDOWN (200+ Words Analysis)
           ========================================================================= */}
        <section className="p-6 sm:p-8 border-b-2 border-slate-700 bg-slate-900/40 space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-amber-400 uppercase tracking-wide flex items-center justify-center space-x-2">
              <GraduationCap className="w-6 h-6 text-amber-400" />
              <span>Detailed Eligibility &amp; Syllabus Breakdown</span>
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl mx-auto">
              In-depth analysis of qualifications, age relaxation criteria, and subject-wise examination syllabus.
            </p>
          </div>

          {/* Age Limit & Relaxations Table */}
          {post.ageLimit && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
                <UserCheck className="w-4 h-4 text-amber-400" />
                <span>Age Limit Parameters (Statutory Government Rules)</span>
              </h3>
              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left text-xs sm:text-sm text-slate-300 border-collapse">
                  <thead className="bg-slate-900 text-slate-200 font-extrabold uppercase border-b border-slate-800">
                    <tr>
                      <th scope="col" className="py-3 px-4 text-left border-r border-slate-800">Eligibility Parameter</th>
                      <th scope="col" className="py-3 px-4 text-right">Applicable Rule</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 bg-slate-950/70">
                    {post.ageLimit.minAge && (
                      <tr className="hover:bg-slate-900/50">
                        <td className="py-3 px-4 font-bold text-slate-200 border-r border-slate-800">Minimum Age Requirement</td>
                        <td className="py-3 px-4 font-bold text-white text-right">{cleanText(post.ageLimit.minAge, 30)}</td>
                      </tr>
                    )}
                    {post.ageLimit.maxAge && (
                      <tr className="hover:bg-slate-900/50">
                        <td className="py-3 px-4 font-bold text-slate-200 border-r border-slate-800">Maximum Age Limit</td>
                        <td className="py-3 px-4 font-bold text-white text-right">{cleanText(post.ageLimit.maxAge, 30)}</td>
                      </tr>
                    )}
                    {post.ageLimit.asOnDate && (
                      <tr className="hover:bg-slate-900/50">
                        <td className="py-3 px-4 font-bold text-slate-200 border-r border-slate-800">Crucial Date for Age Calculation</td>
                        <td className="py-3 px-4 font-bold text-emerald-400 text-right">{cleanText(post.ageLimit.asOnDate, 50)}</td>
                      </tr>
                    )}
                    <tr className="hover:bg-slate-900/50">
                      <td className="py-3 px-4 font-bold text-slate-200 border-r border-slate-800">Category Age Relaxation</td>
                      <td className="py-3 px-4 text-slate-300 text-right text-xs">
                        {cleanText(post.ageLimit.relaxationInfo, 180) || 'SC/ST: 5 Years, OBC (NCL): 3 Years, PwD Candidates: 10 Years as per Govt of India rules.'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Vacancy Breakdown Table */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-pink-400" />
              <span>Post-Wise Vacancy &amp; Educational Qualification Details</span>
            </h3>
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs sm:text-sm text-slate-300 border-collapse">
                <thead className="bg-slate-900 text-slate-200 font-extrabold uppercase border-b border-slate-800 text-center">
                  <tr>
                    <th scope="col" className="py-3 px-4 text-left border-r border-slate-800">Post Designation</th>
                    <th scope="col" className="py-3 px-4 border-r border-slate-800 w-28">Total Posts</th>
                    <th scope="col" className="py-3 px-4 border-r border-slate-800 w-28">Age Bracket</th>
                    <th scope="col" className="py-3 px-4 text-left">Academic &amp; Technical Eligibility</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-950/70">
                  {vacancies.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-4 px-4 text-center text-slate-400">
                        Refer to the official notification PDF for detailed branch-wise and category-wise vacancy distribution.
                      </td>
                    </tr>
                  ) : (
                    vacancies.map((v, i) => (
                      <tr key={i} className="hover:bg-slate-900/50">
                        <td className="py-3.5 px-4 font-bold text-white border-r border-slate-800">{cleanText(v.postName, 80)}</td>
                        <td className="py-3.5 px-4 text-center font-extrabold text-pink-400 border-r border-slate-800">{cleanText(v.totalPost || v.totalPosts, 30) || 'Various'}</td>
                        <td className="py-3.5 px-4 text-center font-bold text-emerald-400 border-r border-slate-800">{cleanText(v.ageLimit, 30) || '18-35 Yrs'}</td>
                        <td className="py-3.5 px-4 text-xs text-slate-300 leading-relaxed">• {cleanText(v.eligibility, 200)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Detailed Selection Process & Preparation Strategy */}
          <div className="space-y-4 pt-2">
            {post.selectionProcess && (
              <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-6 space-y-3">
                <h3 className="text-base font-extrabold text-cyan-400 flex items-center space-x-2">
                  <GraduationCap className="w-5 h-5 text-cyan-400" />
                  <span>
                    {post.category === 'Results' && 'Selection Stages Completed & Upcoming Document Verification'}
                    {post.category === 'Admit Cards' && 'Exam Scheme & Biometric Verification Protocol'}
                    {post.category === 'Answer Key' && 'Evaluation & Objection Redressal Process'}
                    {post.category === 'Syllabus' && 'Examination Stages & Qualifying Pattern'}
                    {(!post.category || post.category === 'Latest Jobs') && 'Selection Process & Examination Stages'}
                  </span>
                </h3>
                <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-2">
                  <p>{cleanText(post.selectionProcess, 1500)}</p>
                </div>
              </div>
            )}

            {post.preparationStrategy && (
              <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-6 space-y-3">
                <h3 className="text-base font-extrabold text-emerald-400 flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-emerald-400" />
                  <span>
                    {post.category === 'Results' && 'Next Stage Action Plan & Verification Guidelines'}
                    {post.category === 'Admit Cards' && 'Last-Minute Revision & Exam Day Guidelines'}
                    {post.category === 'Answer Key' && 'Score Estimation & Cutoff Analysis Strategy'}
                    {post.category === 'Syllabus' && 'Topic-Wise Syllabus Breakdown & Recommended Strategy'}
                    {(!post.category || post.category === 'Latest Jobs') && 'Syllabus Breakdown & Preparation Strategy'}
                  </span>
                </h3>
                <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-2">
                  <p>{cleanText(post.preparationStrategy, 1500)}</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* =========================================================================
            SECTION 4: STEP-BY-STEP GUIDE (Category-Aware Ordered List)
           ========================================================================= */}
        <section className="p-6 sm:p-8 border-b-2 border-slate-700 bg-slate-950 space-y-4">
          <div className="text-center space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-emerald-400 uppercase tracking-wide flex items-center justify-center space-x-2">
              <ListOrdered className="w-6 h-6 text-emerald-400" />
              <span>
                {post.category === 'Results' && 'Step-by-Step Guide: How to Check Result & Scorecard'}
                {post.category === 'Admit Cards' && 'Step-by-Step Guide: How to Download Admit Card / Hall Ticket'}
                {post.category === 'Answer Key' && 'Step-by-Step Guide: How to Download Answer Key & Challenge Questions'}
                {post.category === 'Syllabus' && 'Step-by-Step Guide: How to Download Official Syllabus PDF'}
                {(!post.category || post.category === 'Latest Jobs') && 'Step-by-Step Guide: How to Apply Online'}
              </span>
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl mx-auto">
              Follow this verified step-by-step procedure to access official updates smoothly without errors.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-7 space-y-4">
            <ol className="list-decimal pl-5 space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed marker:text-emerald-400 marker:font-black">
              {Array.isArray(post.howToApply) && post.howToApply.length > 0 ? (
                post.howToApply.map((step, idx) => (
                  <li key={idx}>
                    {cleanText(step, 400)}
                  </li>
                ))
              ) : (
                <>
                  <li><strong>Visit Official Website:</strong> Navigate to the official portal of {org} via the verified link below.</li>
                  <li><strong>Open Notification:</strong> Click on the active link for &ldquo;{postTitle}&rdquo;.</li>
                  <li><strong>Enter Credentials:</strong> Provide your registered credentials (Roll No / Registration ID &amp; Password / DOB).</li>
                  <li><strong>Review &amp; Verify:</strong> Check all details carefully on your screen.</li>
                  <li><strong>Download &amp; Print:</strong> Save a PDF copy and print physical copies for future official verification.</li>
                </>
              )}
            </ol>
          </div>
        </section>

        {/* =========================================================================
            SECTION 5: USEFUL IMPORTANT DIRECT LINKS TABLE
           ========================================================================= */}
        <section className="p-6 sm:p-8 bg-slate-950 border-b-2 border-slate-700 space-y-4">
          <div className="text-center space-y-1">
            <h2 className="text-xl font-black text-emerald-400 uppercase tracking-wide border-b border-slate-800 pb-3">
              {postTitle} – Useful Important Direct Links
            </h2>
            <p className="text-xs text-slate-400">
              Direct access to official application forms, notification PDFs, and candidate login dashboards.
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs sm:text-sm text-slate-300">
              <tbody className="divide-y divide-slate-800">
                {links.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="py-4 px-4 text-center text-slate-400">
                      Visit the official recruitment portal for online application submission.
                    </td>
                  </tr>
                ) : (
                  links.map((link, i) => {
                    const labelStr = cleanText(link.label || link.linkTitle, 70);
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
                <span>Primary Source: {org} Official Gazette / Portal</span>
              </span>
              <span className="text-[11px] text-slate-400">
                Data extracted and summarized from public government press releases.
              </span>
            </div>
            <p className="text-[11px] text-slate-400 italic leading-relaxed">
              &quot;Candidates are strongly advised to download the official notification PDF and verify all eligibility terms directly before submitting their online applications.&quot; — <em>Editorial Board Advisory</em>
            </p>
          </div>
        </section>

        {/* =========================================================================
            AUTHOR BIO (E-E-A-T TRUST SIGNAL)
           ========================================================================= */}
        <div className="px-6 sm:px-8">
          <AuthorBio postTitle={postTitle} />
        </div>

        {/* =========================================================================
            SECTION 6: FREQUENTLY ASKED QUESTIONS (FAQS) WITH SCHEMA.ORG MARKUP
           ========================================================================= */}
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
