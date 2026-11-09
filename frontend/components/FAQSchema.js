export default function FAQSchema({ post }) {
  if (!post) return null;

  const orgName = post.organizationName || post.organization || 'Government Recruitment Board';
  const postTitle = post.rewrittenTitle || post.title || 'Government Job';
  const postName = post.postName || postTitle;

  // Extract actual data for answers
  const lastDate = (() => {
    const dates = post.importantDates || [];
    const lastDateEntry = dates.find(
      (d) =>
        (d.eventName || d.title || '').toLowerCase().includes('last date') ||
        (d.eventName || d.title || '').toLowerCase().includes('closing date')
    );
    return lastDateEntry
      ? lastDateEntry.dateValue || lastDateEntry.dateVal || 'Refer official notification'
      : 'Refer official notification PDF';
  })();

  const ageInfo = (() => {
    if (!post.ageLimit) return 'As per official recruitment notification rules. Generally 18-35 years with statutory relaxation for reserved categories (SC/ST/OBC/EWS/PwD).';
    const parts = [];
    if (post.ageLimit.minAge) parts.push(`Minimum Age: ${post.ageLimit.minAge}`);
    if (post.ageLimit.maxAge) parts.push(`Maximum Age: ${post.ageLimit.maxAge}`);
    if (post.ageLimit.asOnDate) parts.push(`Age calculated as on: ${post.ageLimit.asOnDate}`);
    if (post.ageLimit.relaxationInfo) parts.push(`Relaxation: ${post.ageLimit.relaxationInfo}`);
    return parts.length > 0
      ? parts.join('. ') + '.'
      : 'As per official recruitment notification rules. Generally 18-35 years with statutory relaxation for reserved categories.';
  })();

  const feeInfo = (() => {
    const fees = post.applicationFee || [];
    if (fees.length === 0) return 'Please refer to the official notification PDF for exact fee details. Payment is typically accepted online via Debit Card, Credit Card, Net Banking, or UPI.';
    return fees
      .map((f) => `${f.category}: ${f.amount || f.feeVal}`)
      .join(', ') + '. Payment can be made online via Debit Card, Credit Card, Net Banking, or UPI.';
  })();

  const eligibilityInfo = (() => {
    const vacancies = post.vacanciesTable || [];
    if (vacancies.length === 0) return 'Candidates must have passed the required qualification from a recognized board or university. Check the official notification PDF for post-wise eligibility details.';
    const firstEligible = vacancies.find((v) => v.eligibility);
    return firstEligible
      ? `For ${firstEligible.postName || 'this post'}: ${firstEligible.eligibility}. Please check the official notification PDF for complete post-wise eligibility criteria and reservation details.`
      : 'Candidates must have passed the required qualification from a recognized board or university. Check the official notification for details.';
  })();

  const applySteps = post.howToApply || [];
  const applyAnswer = applySteps.length > 0
    ? `To apply online for ${postTitle}: ${applySteps.slice(0, 4).join('. ')}. For complete instructions, visit the official recruitment portal via the direct link provided on this page.`
    : `Visit the official recruitment portal of ${orgName}, navigate to the online application link for "${postTitle}", register with an active mobile number and email ID, enter personal and educational details, upload required scanned documents, pay the application fee online, and submit the form. Direct apply links are provided on this page.`;

  const faqs = [
    {
      question: `Can final year or appearing students apply for ${postTitle}?`,
      answer: `Generally, candidates must possess the prescribed educational qualification certificate and marksheets on or before the crucial closing date specified in the official notification. Candidates whose final results are awaited must carefully review the cut-off qualification date in the official notification before applying.`,
    },
    {
      question: `Is there negative marking in the ${postTitle} examination?`,
      answer: `Most competitive recruitment examinations conducted by central and state government bodies (such as SSC, UPSC, RRB, and State PSCs) follow a negative marking pattern—typically deducting 0.25 (1/4th) or 0.33 (1/3rd) marks for every incorrect answer in objective multiple-choice tests. Candidates should verify the exact marking scheme in the official examination pattern section.`,
    },
    {
      question: `What documents are required to be kept ready before applying online?`,
      answer: `Aspirants must keep the following documents prepared before starting the application: (1) Recent scanned passport-sized color photograph with light background, (2) Clear digital signature, (3) 10th/12th/Degree marksheets and pass certificates, (4) Valid government photo ID (Aadhaar / Voter ID / PAN / Passport), (5) Category / Caste / EWS / PwD certificate (if applicable), and (6) Active mobile number and email ID for OTP verification.`,
    },
    {
      question: `What is the last date to apply online for ${postTitle}?`,
      answer: `The official last date to submit online applications for ${postTitle} is ${lastDate}. Candidates are strongly advised to complete registration and fee payment well in advance of the deadline to avoid eleventh-hour server congestion.`,
    },
    {
      question: `What is the age limit and relaxation criteria for ${postTitle}?`,
      answer: ageInfo,
    },
    {
      question: `What is the application fee for ${postTitle}?`,
      answer: feeInfo,
    },
    {
      question: `What is the educational eligibility criteria for ${postTitle}?`,
      answer: eligibilityInfo,
    },
    {
      question: `How to download the ${postTitle} Admit Card?`,
      answer: `To download the hall ticket or admit card for ${postTitle}: Visit the official website of ${orgName}, click on the Admit Card / Hall Ticket portal link, enter your Registration Number / Application Number and Date of Birth / Password, and download the PDF. Direct admit card download links are updated on this page the moment they are officially released.`,
    },
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      {/* JSON-LD FAQPage Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Visible FAQ Section */}
      <div className="p-6 bg-slate-900/60 border-t-2 border-slate-700 space-y-4">
        <h2 className="text-xl font-black text-amber-400 uppercase tracking-wider text-center flex items-center justify-center space-x-2">
          <span>Frequently Asked Questions (FAQs)</span>
        </h2>
        <p className="text-xs text-slate-400 text-center max-w-2xl mx-auto">
          Common queries answered for aspirants preparing for {postTitle} recruitment 2026.
        </p>
        <div className="space-y-3 pt-2">
          {faqs.map((faq) => (
            <div
              key={faq.question}
              className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 sm:p-5 hover:border-slate-700 transition-colors"
            >
              <h3 className="text-sm font-bold text-slate-200 mb-2 flex items-start space-x-2">
                <span className="text-amber-400 font-extrabold flex-shrink-0">Q.</span>
                <span>{faq.question}</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-6">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
