export default function FAQSchema({ post }) {
  if (!post) return null;

  const orgName = post.organizationName || post.organization || 'Government Recruitment Board';
  const postTitle = post.rewrittenTitle || post.title || 'Government Job';
  const postName = post.postName || postTitle;
  const category = post.category || 'Latest Jobs';

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

  // Build category-specific FAQs or use post.faqs if provided
  let faqs = [];

  if (Array.isArray(post.faqs) && post.faqs.length >= 3) {
    faqs = post.faqs;
  } else if (category === 'Results') {
    faqs = [
      {
        question: `How can I check the ${postTitle} result and merit list?`,
        answer: `To check the official result for ${postTitle}, visit the official recruitment portal of ${orgName} or click the direct result link provided in the Important Links table on this page. Open the merit list PDF or log in using your Roll Number / Registration Number and Date of Birth to view your scorecard.`,
      },
      {
        question: `What details are required to check the ${postTitle} scorecard?`,
        answer: `Candidates need their Examination Roll Number or Registration ID and Password or Date of Birth as printed on their original admit card. Make sure to download and save a copy of the marksheet for future verification.`,
      },
      {
        question: `What are the next stages after qualifying in the ${postTitle} exam?`,
        answer: `Candidates who secure cutoff marks in ${postTitle} will proceed to the subsequent recruitment stages, such as Document Verification (DV), Skill/Typing Test, Physical Efficiency Test (PET), or Personal Interview as scheduled by ${orgName}.`,
      },
      {
        question: `How are the cutoff marks determined for ${postTitle}?`,
        answer: `Cutoff scores are determined by ${orgName} considering the total number of vacancies (${post.totalVacancies || 'prescribed vacancies'}), candidate attendance, question paper difficulty level, and statutory category-wise reservations (General, EWS, OBC, SC, ST, PwD).`,
      },
      {
        question: `What should I do if my name or roll number is not in the ${postTitle} result list?`,
        answer: `If your roll number does not appear in the qualified candidates list, compare your raw score with the official category cutoff marks. You can also file a query through the official facilitation desk of ${orgName} if you believe an error occurred.`,
      },
    ];
  } else if (category === 'Admit Cards') {
    faqs = [
      {
        question: `How can I download the ${postTitle} admit card / hall ticket?`,
        answer: `Visit the official recruitment portal of ${orgName} or use the direct download link provided in the Important Links section below. Log in with your Registration Number / Application Number and Date of Birth to download and print your hall ticket.`,
      },
      {
        question: `What documents must I carry to the exam center for ${postTitle}?`,
        answer: `Candidates must carry: (1) A clean printed copy of the ${postTitle} Admit Card, (2) An original valid photo ID proof (Aadhaar Card, Voter ID, PAN Card, Driving License, or Passport), (3) Two recent passport-size photographs, and (4) Permitted stationary as specified in the exam instructions.`,
      },
      {
        question: `What should I do if there is an error on my ${postTitle} admit card?`,
        answer: `If you notice any discrepancy in your name, photograph, signature, roll number, or allocated exam center on the admit card, contact the official helpline or helpdesk email of ${orgName} immediately for corrections before the exam date.`,
      },
      {
        question: `Will the ${postTitle} admit card be sent via postal mail?`,
        answer: `No. Government recruitment bodies release admit cards strictly online through their official portals. No physical admit card will be dispatched via postal mail.`,
      },
      {
        question: `What is the reporting time and shift schedule for ${postTitle}?`,
        answer: `Your specific reporting time, gate closure time, shift slot, and exam venue address are printed in detail on your admit card. Candidates must arrive at least 45 minutes prior to gate closure for biometric verification.`,
      },
    ];
  } else if (category === 'Answer Key') {
    faqs = [
      {
        question: `How can I download the official ${postTitle} answer key?`,
        answer: `To download the answer key, visit the official portal of ${orgName} or use the direct link in the Important Links table on this page. Log in with your exam credentials to download the question paper along with the official answer responses.`,
      },
      {
        question: `How do I calculate my estimated raw marks using the ${postTitle} answer key?`,
        answer: `Compare your submitted responses against the official answer key. Add the prescribed positive marks for every correct answer and deduct the penalty marks (typically 0.25 or 0.33 marks) for every incorrect answer. Unattempted questions carry zero marks.`,
      },
      {
        question: `How to raise an online objection against disputed questions in ${postTitle}?`,
        answer: `Log in to the official candidate grievance portal of ${orgName} during the prescribed objection window. Select the disputed question, submit authentic standard reference book documentation, pay the processing fee per challenged question (if applicable), and submit.`,
      },
      {
        question: `When will the final answer key and results for ${postTitle} be released?`,
        answer: `After an expert committee reviews all student objections, ${orgName} releases the final revised answer key. The final scores and merit list are prepared strictly based on this revised key within 2 to 4 weeks.`,
      },
    ];
  } else if (category === 'Syllabus') {
    faqs = [
      {
        question: `Where can I download the complete ${postTitle} syllabus & exam pattern PDF?`,
        answer: `You can download the comprehensive topic-wise syllabus and exam scheme PDF directly from the Important Links table on this page or through the official website of ${orgName}.`,
      },
      {
        question: `What is the exam scheme and subject breakdown for ${postTitle}?`,
        answer: `The exam typically covers General Intelligence & Reasoning, Quantitative Aptitude / Mathematics, General English / Hindi, and General Awareness / Current Affairs, along with domain-specific subjects where required. Review the Detailed Syllabus section on this page for exact marks allocation.`,
      },
      {
        question: `Is there negative marking in the ${postTitle} examination?`,
        answer: `Yes, most government competitive exams impose negative marking of 1/4th (0.25) or 1/3rd (0.33) marks for every wrong answer. Candidates should practice with precision to minimize negative marks.`,
      },
      {
        question: `What is the best strategy to complete the ${postTitle} syllabus on time?`,
        answer: `Divide the syllabus into weekly study milestones, refer to standard reference books and NCERTs, solve at least 5 to 10 years of previous year question papers (PYQs), and take regular mock tests to improve time management.`,
      },
    ];
  } else {
    // Default: Latest Jobs
    faqs = [
      {
        question: `Can final year or appearing students apply for ${postTitle}?`,
        answer: `Generally, candidates must possess the prescribed educational qualification certificate on or before the crucial closing date specified in the official notification. Candidates whose final results are awaited must carefully review the cut-off qualification date in the official notification before applying.`,
      },
      {
        question: `Is there negative marking in the ${postTitle} examination?`,
        answer: `Most competitive recruitment examinations conducted by bodies like SSC, UPSC, RRB, and State PSCs follow a negative marking pattern—typically deducting 0.25 (1/4th) or 0.33 (1/3rd) marks for every incorrect answer in objective tests. Always verify the exact marking scheme in the official notification.`,
      },
      {
        question: `What documents are required before applying online for ${postTitle}?`,
        answer: `Aspirants must keep the following prepared: (1) Recent scanned passport-size color photograph, (2) Clear digital signature, (3) 10th/12th/Graduation certificates, (4) Government Photo ID proof (Aadhaar / Voter ID / PAN), (5) Category / Caste / EWS / PwD certificate (if applicable), and (6) Active mobile number and email ID for OTP verification.`,
      },
      {
        question: `What is the last date to apply online for ${postTitle}?`,
        answer: `The official last date to submit online applications for ${postTitle} is ${lastDate}. Candidates are strongly advised to complete registration and fee payment well in advance of the deadline to avoid server congestion.`,
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
    ];
  }

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
      <div className="p-6 sm:p-8 bg-slate-900/60 border-t-2 border-slate-700 space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-amber-400 uppercase tracking-wider text-center flex items-center justify-center space-x-2">
          <span>Frequently Asked Questions (FAQs)</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 text-center max-w-2xl mx-auto">
          Essential questions and verified answers for aspirants regarding {postTitle}.
        </p>
        <div className="space-y-3 pt-2">
          {faqs.map((faq, i) => (
            <div
              key={faq.question || i}
              className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 sm:p-5 hover:border-slate-700 transition-colors"
            >
              <h3 className="text-sm sm:text-base font-bold text-slate-200 mb-2 flex items-start space-x-2">
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
