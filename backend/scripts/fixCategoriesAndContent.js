import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const seedPostsPath = path.resolve(__dirname, '../../frontend/lib/seedPosts.json');

function clean(str) {
  if (!str) return '';
  return String(str).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function detectTrueCategory(post) {
  const t = (clean(post.title) + ' ' + clean(post.rewrittenTitle) + ' ' + clean(post.sourceUrl)).toLowerCase();
  
  // Results check first (high precision keywords)
  if (
    t.includes('final result') ||
    t.includes('exam result') ||
    t.includes('written result') ||
    t.includes('marks') ||
    t.includes('score card') ||
    t.includes('scorecard') ||
    t.includes('cutoff') ||
    t.includes('cut off') ||
    t.includes('cut-off') ||
    t.includes('merit list') ||
    t.includes('selection list') ||
    t.includes('result declared') ||
    t.includes('download result')
  ) {
    return 'Results';
  }

  // Answer Key check
  if (
    t.includes('answer key') ||
    t.includes('ans key') ||
    t.includes('response sheet') ||
    t.includes('omr sheet') ||
    t.includes('objection') ||
    t.includes('paper solution')
  ) {
    return 'Answer Key';
  }

  // Admit Card check
  if (
    t.includes('admit card') ||
    t.includes('hall ticket') ||
    t.includes('call letter') ||
    t.includes('exam city') ||
    t.includes('city intimation') ||
    t.includes('exam date')
  ) {
    return 'Admit Cards';
  }

  // Syllabus check
  if (
    t.includes('syllabus') ||
    t.includes('exam pattern') ||
    t.includes('scheme of exam')
  ) {
    return 'Syllabus';
  }

  // Default to Latest Jobs
  return 'Latest Jobs';
}

function generateCategoryContent(post, category) {
  const title = clean(post.rewrittenTitle || post.title);
  const org = clean(post.organizationName || post.organization || 'Government Recruitment Board');
  const role = clean(post.postName || title);
  const vacancies = clean(post.totalVacancies) || 'Various Vacancies';

  let expertTake, selectionProcess, preparationStrategy, howToApply, faqs;

  if (category === 'Results') {
    expertTake = `The ${org} has officially announced the final examination results, cut-off marks, and merit list for ${role}. For aspirants who appeared in this recruitment cycle, reaching this milestone is a major accomplishment. Public sector examinations conducted by ${org} are known for their rigorous evaluation and high competitiveness, attracting thousands of qualified graduates. Selected candidates must now thoroughly review the official scorecard and roll-number-wise merit list to confirm their qualification status. If you have successfully qualified, the immediate priority is to organize all your original academic certificates, caste/EWS credentials, and photo identity proofs for the upcoming Document Verification (DV) and medical examination rounds. For candidates who missed the cutoff by a narrow margin, analyzing the official cutoff trends will provide valuable diagnostic insights to strengthen your preparation for upcoming state and central competitive examinations.`;

    selectionProcess = `The recruitment selection journey for ${role} under ${org} involves multiple progressive stages: 1. Written Examination / Computer-Based Test (CBT): Evaluated based on merit and category-wise minimum qualifying cutoffs. 2. Result Declaration & Merit Listing: Shortlisting candidates based on normalized scores for subsequent evaluation rounds. 3. Document Verification (DV): In-depth physical verification of original matriculation, graduation, and category certificates against application records. 4. Medical Fitness Examination: Ensuring candidates meet the physical and medical standards established by the department. Final appointment orders are issued strictly in order of merit to candidates who successfully clear all verification requirements.`;

    preparationStrategy = `For candidates qualifying in the ${role} examination, subsequent steps demand methodical preparation: 1. Document Dossier Preparation: Assemble original 10th marksheet (Date of Birth proof), 12th certificate, Degree/Diploma marksheets, domicile certificate, and category/EWS affidavits with at least 3 sets of self-attested photocopies. 2. Skill & Typing Preparation: If your role requires typing, computer proficiency, or physical endurance, dedicate 2 hours daily to reach required speed thresholds. 3. Medical Readiness: Ensure baseline fitness parameters conforming strictly to departmental physical standards. 4. Tracking Verification Dates: Regularly monitor the official portal of ${org} to report promptly at your designated verification center.`;

    howToApply = [
      `Visit the Official Portal: Open the official recruitment portal of ${org} or use the direct result link provided in the Important Links table below.`,
      `Navigate to Results Section: On the homepage, locate the notification titled "${title} - Final Result / Merit List".`,
      `Enter Login Credentials: Enter your Examination Roll Number or Registration Number along with your Date of Birth or Password.`,
      `Download Result PDF / Scorecard: Open the merit list PDF and search for your Roll Number using the 'Ctrl + F' shortcut on your computer or the search bar on mobile.`,
      `Check Cutoff Marks: Compare your sectional and aggregate scores against the official category-wise cutoff marks.`,
      `Save and Print: Download and take at least 2 printouts of your result and scorecard for the upcoming Document Verification round.`
    ];

    faqs = [
      {
        question: `How can I check the ${title} result and merit list?`,
        answer: `Visit the official website of ${org} or use the direct result link provided in the Important Links table on this page. Open the merit list PDF or enter your Roll Number and Date of Birth to view your qualifying status and scorecard.`
      },
      {
        question: `What details are required to download the ${title} scorecard?`,
        answer: `Candidates need their Examination Roll Number or Registration ID and Password or Date of Birth as printed on their hall ticket. Download and save a copy of the marksheet for subsequent verification rounds.`
      },
      {
        question: `What are the next stages after qualifying in ${title}?`,
        answer: `Shortlisted candidates will be invited for Document Verification (DV), Skill Test (if applicable), and Medical Examination as announced by ${org}. Keep all original educational and reservation certificates ready.`
      },
      {
        question: `How are the cutoff marks determined for ${title}?`,
        answer: `Cutoff scores are determined by ${org} based on total vacancies (${vacancies}), candidate attendance, question paper difficulty level, and statutory category reservations (UR, EWS, OBC, SC, ST).`
      }
    ];
  } else if (category === 'Admit Cards') {
    expertTake = `The ${org} has released the official exam city intimation slip and admit card for ${role}. With the examination dates formally scheduled, registered candidates must download and print their hall tickets immediately rather than waiting for the final days before the exam. Government recruitment test venues are assigned strictly based on logistical capacity, and reviewing your reporting time, shift schedule, and exam center address in advance ensures a stress-free exam day. During this final preparation phase, candidates should avoid starting new or unfamiliar topics and instead focus on consolidating high-yield formulas, core reasoning concepts, and recent 6 months of current affairs. Consistent revision through timed mock tests will sharpen your accuracy and time management under actual examination conditions.`;

    selectionProcess = `The examination process for ${role} involves: 1. Online Application Screening: Verification of basic eligibility criteria and candidate registration. 2. Computer-Based Examination (CBT): Objective multiple-choice test evaluating reasoning, numerical ability, general awareness, and language proficiency. 3. Biometric & Identity Verification at Exam Venue: Mandatory thumb impression and photo capture before entry to prevent impersonation. 4. Skill Test / Mains Examination (if applicable): For candidates who qualify in the preliminary tier. 5. Document Verification and Final Merit List.`;

    preparationStrategy = `To maximize your performance in the ${role} exam on test day: 1. Strict Exam-Day Routine: Practice waking up and solving mock papers during your exact allotted shift timing. 2. Negative Marking Control: Since negative marks (0.25 to 0.33) apply, avoid blind guesswork. Only attempt questions where you can eliminate at least two incorrect options. 3. Exam Kit Preparation: Keep 2 printed admit cards, original government photo ID (Aadhaar/PAN/Voter ID), two passport photos, and permitted pens ready one day in advance. 4. Arrive Early: Reach your designated venue at least 60 minutes before gate closure to complete biometric verification smoothly.`;

    howToApply = [
      `Visit the Official Website: Go to the official website of ${org} or click the direct hall ticket link in the Important Links table on this page.`,
      `Open the Admit Card Portal: Click on the link for "${title} Admit Card / Hall Ticket Download".`,
      `Login with Credentials: Enter your Application Number / Registration ID and Date of Birth / Password as provided during initial registration.`,
      `Verify Exam Details: Carefully check your candidate name, roll number, assigned exam venue, reporting time, shift number, and gate closure timing.`,
      `Download Admit Card PDF: Save the electronic admit card (PDF) directly to your computer or mobile storage.`,
      `Print Hard Copies: Print at least two clear hard copies of the admit card on A4 paper and keep your original photo ID proof ready for the exam day.`
    ];

    faqs = [
      {
        question: `How can I download the ${title} admit card?`,
        answer: `Visit the official recruitment portal of ${org} or use the direct link in the Important Links table on this page. Log in with your Registration Number and Date of Birth to download and print your hall ticket.`
      },
      {
        question: `What documents are required to be carried along with the ${title} admit card?`,
        answer: `Candidates must bring: (1) A printed copy of the Admit Card, (2) Original photo identity proof (Aadhaar Card, PAN Card, Voter ID, or Passport), (3) Two recent passport-size photographs, and (4) Permitted stationery.`
      },
      {
        question: `What should I do if there is an error in my ${title} admit card?`,
        answer: `If you notice any mistake in your name, photograph, signature, or exam venue details, immediately contact the official helpline or email support of ${org} prior to the exam date.`
      },
      {
        question: `Will physical admit cards be sent via post for ${title}?`,
        answer: `No. Government recruitment bodies issue admit cards strictly through online download. No physical copies are sent via postal mail.`
      }
    ];
  } else if (category === 'Answer Key') {
    expertTake = `The ${org} has published the provisional answer key along with candidate response sheets for ${role}. Releasing official answer keys is a critical transparency measure that allows candidates to verify their marked responses against the official answer keys and calculate their estimated raw scores. If you notice any technical discrepancies or incorrect answers in the key, it is crucial to raise an online objection within the specified window by submitting valid academic proof from standard reference textbooks. Calculating your expected score allows you to gauge your standing against historical cutoffs and begin focused preparation for subsequent stages like typing tests, physical endurance tests, or mains examinations.`;

    selectionProcess = `The evaluation and score finalization process for ${role} is conducted in the following phases: 1. Conduct of Written/Computer Based Exam. 2. Provisional Answer Key Release & Objection Window: Inviting candidate challenges with supporting documentary evidence. 3. Expert Committee Scrutiny: Independent subject matter experts evaluate every objection raised by candidates. 4. Final Answer Key Publication: Incorporation of valid corrections and revised key release. 5. Final Merit List and Cutoff Declaration: Score calculation based on the final evaluated key.`;

    preparationStrategy = `To optimize your post-exam strategy after the ${role} answer key release: 1. Systematic Response Cross-Checking: Verify every attempted question systematically against the official answer key. 2. Formula for Score Estimation: Use the formula: Total Score = (Correct Answers × Marks per Question) - (Incorrect Answers × Negative Penalty). 3. Identifying Ambiguous Questions: If an official answer contradicts standard textbooks (NCERT / UGC recognized authors), prepare an objection document before the portal closes. 4. Next Round Planning: If your estimated score exceeds the previous year's cutoff by 5% or more, initiate preparation for Tier-2 / Skill / Document verification immediately.`;

    howToApply = [
      `Access Official Portal: Navigate to the official website of ${org} or click the direct answer key link in the Important Links table below.`,
      `Login to Candidate Portal: Enter your Roll Number and Password / Date of Birth as printed on your admit card.`,
      `Download Question Paper & Key: Download your individual response sheet and the official provisional answer key.`,
      `Calculate Raw Score: Match your marked options with the correct answers. Add positive marks for correct responses and subtract negative marks for incorrect answers.`,
      `Submit Objections (if applicable): If you identify any question with an incorrect answer, click on the 'Raise Objection' tab during the active window.`,
      `Attach Proof & Pay Fee: Upload supporting documentation from standard textbooks and pay the prescribed fee per challenged question before the deadline.`
    ];

    faqs = [
      {
        question: `How to download the official ${title} answer key?`,
        answer: `Access the official portal of ${org} or use the direct link provided in the Important Links table on this page. Log in with your exam credentials to download the question paper and official answer key responses.`
      },
      {
        question: `How to calculate estimated marks using the ${title} answer key?`,
        answer: `Match your responses with the official key. Add the prescribed positive marks for every correct answer and deduct the penalty marks (usually 0.25 or 0.33) for each wrong answer. Unattempted questions carry zero marks.`
      },
      {
        question: `How to submit objections against disputed questions in ${title}?`,
        answer: `Log in to the candidate grievance portal of ${org} during the active objection window, select the disputed question, attach proof from standard reference textbooks, pay the processing fee per question, and submit.`
      },
      {
        question: `When will the final answer key and results for ${title} be released?`,
        answer: `Following expert committee evaluation of all candidate objections, ${org} releases the finalized answer key. The final result and merit list are prepared strictly based on this revised key within 2 to 4 weeks.`
      }
    ];
  } else if (category === 'Syllabus') {
    expertTake = `Understanding the complete examination pattern and syllabus for ${role} conducted by ${org} is the foundational stepping stone for any serious government job aspirant. Competitive public sector exams reward structured, syllabus-oriented preparation over unstructured study. The recruitment scheme tests a candidate's analytical reasoning, quantitative problem-solving speed, language comprehension, and awareness of contemporary national events. By breaking down the syllabus into weekly milestones and identifying high-weightage topics, candidates can optimize their study schedules. Regular practice with previous years' question papers (PYQs) and full-length timed mock tests is indispensable to adapt to the negative marking scheme and achieve the required qualifying cutoff score.`;

    selectionProcess = `The selection framework for ${role} is designed to assess comprehensive aptitude through: 1. Tier-1 Preliminary Screening Test: Objective multiple-choice examination focusing on general aptitude. 2. Tier-2 Mains / Technical Examination: In-depth assessment of domain-specific subjects and advanced problem-solving. 3. Skill / Practical Test: Typing, stenography, or physical efficiency test where mandated by recruitment rules. 4. Document Verification & Merit Preparation: Compilation of the final select list based on aggregate performance in the prescribed examination tiers.`;

    preparationStrategy = `To master the ${role} syllabus efficiently within 60 to 90 days: 1. Subject-Wise Allocation: Divide your daily study time into Reasoning (25%), Quantitative Aptitude (30%), General Awareness (25%), and Language (20%). 2. Foundation Over Memorization: Focus on mastering fundamental principles and formulas rather than rote-learning shortcuts. 3. Previous Year Questions (PYQs): Solve at least the last 5 years' papers to understand the examiner's question framing style. 4. Weekly Timed Mock Tests: Take weekly full-length mock tests to develop pacing, stamina, and accuracy under real examination conditions.`;

    howToApply = [
      `Open Official Link: Click on the verified syllabus download link in the Important Links table on this page.`,
      `Download Syllabus PDF: Save the official syllabus and examination pattern PDF released by ${org}.`,
      `Review Examination Pattern: Examine the tier-wise subjects, maximum marks, question count, and time duration allotted.`,
      `Identify High-Weightage Topics: Highlight priority topics in Reasoning, Quantitative Aptitude, General Awareness, and Language.`,
      `Plan Weekly Milestones: Create a targeted revision schedule allocating dedicated study hours to each subject topic.`,
      `Practice Past Papers: Procure previous year question papers to practice questions corresponding to each syllabus module.`
    ];

    faqs = [
      {
        question: `Where can I download the ${title} syllabus PDF?`,
        answer: `You can download the official comprehensive syllabus and exam scheme PDF directly from the Important Links table on this page or through the official website of ${org}.`
      },
      {
        question: `What is the exam pattern and marking scheme for ${title}?`,
        answer: `The exam pattern consists of multiple-choice objective questions covering reasoning, mathematics, general awareness, and language proficiency. Check the Detailed Syllabus section on this page for exact marks allocation.`
      },
      {
        question: `Is there negative marking in the ${title} exam?`,
        answer: `Yes, most competitive public sector exams enforce negative marking of 1/4th (0.25) or 1/3rd (0.33) marks for every incorrect answer. Maintain high accuracy to avoid mark deductions.`
      },
      {
        question: `What is the best preparation strategy for the ${title} syllabus?`,
        answer: `Create a disciplined study schedule, refer to standard reference books and NCERTs, solve at least 5 to 10 years of previous year question papers (PYQs), and take weekly timed mock tests.`
      }
    ];
  } else {
    // Latest Jobs
    expertTake = `The ${org} has published its recruitment notification for ${role}, announcing ${vacancies} across participating regional and central departments. This recruitment presents a premier career opportunity for candidates seeking long-term professional stability, competitive pay matrix under the 7th Central Pay Commission (CPC) or state scales, and comprehensive government benefits. Given the extensive reach of ${org}, this examination is anticipated to witness intense competition from thousands of aspirants nationwide. Candidates are strongly advised to thoroughly review the educational eligibility criteria, age limits, and category reservation guidelines before submitting their applications. To prevent last-minute server congestion or payment gateway timeouts, complete your registration and fee payment well before the closing date.`;

    selectionProcess = `The selection procedure for ${role} at ${org} comprises a transparent, multi-stage assessment: 1. Preliminary Screening / Written Examination: An objective test testing General Intelligence, Quantitative Aptitude, General Awareness, and English/Hindi Comprehension. 2. Skill / Trade Test: Practical evaluation for technical, typing, or physical posts where required. 3. Document Verification (DV): Scrutiny of original educational marksheets, date of birth certificates, and caste/EWS credentials. 4. Medical Examination: Standard medical fitness assessment as mandated by the government service rules. Final selection is determined on the basis of aggregate marks secured in the written examination subject to qualifying DV and medical fitness.`;

    preparationStrategy = `To crack the ${role} competitive examination: 1. Understand the Syllabus & Weightage: Focus on core scoring sections like Reasoning and Quantitative Aptitude. 2. Stay Consistent with Current Affairs: Dedicate 30 minutes daily to reading national and international developments. 3. Timed Practice: Solve at least 30 to 50 practice questions daily under strict time constraints. 4. Full-Length Mock Tests: Regularly benchmark your preparation with mock tests to identify weak subject areas and improve accuracy.`;

    howToApply = [
      `Review Notification Guidelines: Read the official recruitment notification PDF carefully to verify all eligibility criteria and post details.`,
      `Access the Official Application Portal: Click on the direct "Apply Online" link in the Important Links table below to access the ${org} portal.`,
      `Complete One-Time Registration (OTR): First-time applicants must register with a valid mobile number and email ID to receive their unique Registration ID and Password.`,
      `Fill in Application Details: Log in and enter your personal details, academic qualifications, and communication address accurately as recorded in your 10th certificate.`,
      `Upload Required Documents: Upload a recent scanned color passport-size photograph (20KB - 50KB) and signature (10KB - 20KB) following the official pixel specifications.`,
      `Carefully Preview Application: Review all entered information before final submission, as corrections are strictly disallowed post-submission.`,
      `Pay Application Fee: Pay the requisite fee online via Net Banking, Debit/Credit Card, or UPI and note down the transaction reference ID.`,
      `Print Confirmation Page: Download and print at least two hard copies of the completed application form and payment receipt for future reference.`
    ];

    faqs = [
      {
        question: `Can final year students apply for ${title}?`,
        answer: `Candidates must possess the requisite educational qualification certificate on or before the crucial closing date specified in the official notification. Candidates whose final results are awaited must verify the cut-off qualification date before applying.`
      },
      {
        question: `Is there negative marking in the ${title} recruitment exam?`,
        answer: `Yes, most competitive exams conducted by public recruitment boards enforce a negative marking penalty (typically 0.25 or 0.33 marks) for incorrect answers. Refer to the official notification for the exact marking scheme.`
      },
      {
        question: `What documents are required to apply online for ${title}?`,
        answer: `Aspirants need scanned copies of their recent passport-size photograph, digital signature, 10th certificate (for date of birth proof), educational marksheets, caste/EWS certificate (if applicable), and a valid government photo ID.`
      },
      {
        question: `How to apply online for ${title}?`,
        answer: `Visit the official recruitment portal of ${org} or click the direct application link in the Important Links table on this page. Complete one-time registration, fill out the form, upload documents, pay the fee, and print the confirmation page.`
      }
    ];
  }

  return {
    ...post,
    category,
    expertTake,
    selectionProcess,
    preparationStrategy,
    howToApply,
    faqs
  };
}

async function run() {
  console.log('🔄 Loading seedPosts.json...');
  const raw = fs.readFileSync(seedPostsPath, 'utf8');
  const posts = JSON.parse(raw);
  console.log(`Loaded ${posts.length} posts.`);

  let reclassified = 0;
  const updated = posts.map(p => {
    const trueCategory = detectTrueCategory(p);
    if (trueCategory !== p.category) {
      reclassified++;
    }
    return generateCategoryContent(p, trueCategory);
  });

  console.log(`✅ Correctly reclassified ${reclassified} posts into their true categories and generated rich, category-tailored content!`);

  const counts = {};
  updated.forEach(p => counts[p.category] = (counts[p.category] || 0) + 1);
  console.log('📊 New Category Distribution:', counts);

  fs.writeFileSync(seedPostsPath, JSON.stringify(updated, null, 2), 'utf8');
  console.log(`💾 Saved updated seedPosts.json successfully.`);
}

run().catch(console.error);
