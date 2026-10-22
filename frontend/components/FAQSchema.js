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
    if (!post.ageLimit) return 'As per official notification rules. Generally 18-35 years with relaxation for reserved categories.';
    const parts = [];
    if (post.ageLimit.minAge) parts.push(`Minimum Age: ${post.ageLimit.minAge}`);
    if (post.ageLimit.maxAge) parts.push(`Maximum Age: ${post.ageLimit.maxAge}`);
    if (post.ageLimit.asOnDate) parts.push(`Age calculated as on: ${post.ageLimit.asOnDate}`);
    if (post.ageLimit.relaxationInfo) parts.push(`Relaxation: ${post.ageLimit.relaxationInfo}`);
    return parts.length > 0
      ? parts.join('. ') + '.'
      : 'As per official notification rules. Generally 18-35 years with relaxation for reserved categories.';
  })();

  const feeInfo = (() => {
    const fees = post.applicationFee || [];
    if (fees.length === 0) return 'Please refer to the official notification PDF for exact fee details. Payment can be made via Debit Card, Credit Card, Net Banking, or E-Wallet.';
    return fees
      .map((f) => `${f.category}: ${f.amount || f.feeVal}`)
      .join(', ') + '. Payment can be made via Debit Card, Credit Card, Net Banking, or E-Wallet.';
  })();

  const eligibilityInfo = (() => {
    const vacancies = post.vacanciesTable || [];
    if (vacancies.length === 0) return 'Candidates must have passed the required qualification from a recognized board or university. Check the official notification PDF for post-wise eligibility details.';
    const firstEligible = vacancies.find((v) => v.eligibility);
    return firstEligible
      ? `For ${firstEligible.postName || 'this post'}: ${firstEligible.eligibility}. Please check the official notification for complete post-wise eligibility criteria.`
      : 'Candidates must have passed the required qualification from a recognized board or university. Check the official notification for details.';
  })();

  const applySteps = post.howToApply || [];
  const applyAnswer = applySteps.length > 0
    ? `To apply online for ${postTitle}: ${applySteps.slice(0, 4).join('. ')}. For complete steps, visit the official portal or click the Apply Online link on this page.`
    : `Visit the official website of ${orgName}, navigate to the recruitment section, click on "${postTitle}" notification link, register with your email/mobile, fill the application form, upload documents, pay the fee, and submit. Direct apply link is available on this page.`;

  const admitCardAnswer = `To download the ${postTitle} Admit Card: Visit the official website of ${orgName}, go to the Admit Card section, enter your Registration Number and Date of Birth, and download your hall ticket. Direct download links are available on this page when released.`;

  const faqs = [
    {
      question: `How to apply online for ${postTitle}?`,
      answer: applyAnswer,
    },
    {
      question: `What is the last date to apply for ${orgName} ${post.postName || 'recruitment'}?`,
      answer: `The last date to apply online for ${postTitle} is ${lastDate}. Candidates are advised to apply well before the deadline to avoid server issues.`,
    },
    {
      question: `What is the age limit for ${postTitle}?`,
      answer: ageInfo,
    },
    {
      question: `What is the application fee for ${postTitle}?`,
      answer: feeInfo,
    },
    {
      question: `What is the eligibility criteria for ${postTitle}?`,
      answer: eligibilityInfo,
    },
    {
      question: `How to download ${postTitle} Admit Card?`,
      answer: admitCardAnswer,
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
      <div className="p-6 bg-slate-900/40 border-t-2 border-slate-700 space-y-4">
        <h2 className="text-lg font-black text-amber-400 uppercase tracking-wider text-center">
          Frequently Asked Questions – {postTitle}
        </h2>
        <div className="space-y-3">
          {faqs.map((faq) => (
            <div
              key={faq.question}
              className="bg-slate-950/80 border border-slate-800 rounded-xl p-4"
            >
              <h3 className="text-sm font-bold text-slate-200 mb-1.5">
                ❓ {faq.question}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
