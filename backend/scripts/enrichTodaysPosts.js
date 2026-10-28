import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const seedPath = path.resolve(__dirname, '../../frontend/lib/seedPosts.json');

const UPDATES = {
  'nta-ugc-net-december-2026-apply-online-form-5388': {
    organizationName: 'National Testing Agency (NTA)',
    postName: 'UGC NET December 2026 Examination',
    rewrittenTitle: 'NTA UGC NET December 2026 Online Application Form Notification Released',
    shortInfo: 'National Testing Agency (NTA) has released the notification and online application form for UGC NET December 2026 for Junior Research Fellowship (JRF) and eligibility for Assistant Professor in 83 Indian subjects.',
    totalVacancies: 'JRF & Assistant Professor (83 Subjects)',
    vacanciesTable: [
      { postName: 'Junior Research Fellowship (JRF)', totalPost: 'Subject Wise', eligibility: 'Master Degree or equivalent degree with minimum 55% marks (50% for SC/ST/OBC/PwD) from recognized university.' },
      { postName: 'Assistant Professor (NET)', totalPost: 'Subject Wise', eligibility: 'Master Degree in relevant subject with minimum 55% marks. No upper age limit.' }
    ],
    importantLinks: [
      { label: 'Apply Online Form / Candidate Registration', url: 'https://ugcnet.nta.nic.in/' },
      { label: 'Download Official Notification PDF', url: 'https://ugcnet.nta.nic.in/' },
      { label: 'NTA Official Website', url: 'https://nta.ac.in/' }
    ]
  },
  'supreme-court-of-india-sci-junior-court-attendant-jca-recruitment-2026-exam-for-130-post-4879': {
    organizationName: 'Supreme Court of India (SCI)',
    postName: 'Junior Court Attendant (JCA) Group C',
    rewrittenTitle: 'Supreme Court SCI Junior Court Attendant (JCA) Recruitment 2026 for 130 Posts',
    shortInfo: 'Supreme Court of India has published recruitment notification for 130 vacancies of Junior Court Attendant (Group C Non-Clerical). Eligible candidates holding Class 10th Matriculation can apply online.',
    totalVacancies: '130 Posts',
    vacanciesTable: [
      { postName: 'Junior Court Attendant (Group C Non-Clerical)', totalPost: '130', eligibility: 'Class 10th High School Exam Passed from any recognized Board in India. Driving license/cooking experience preferred for relevant posts.' }
    ],
    importantLinks: [
      { label: 'Apply Online Form / Candidate Login', url: 'https://www.sci.gov.in/' },
      { label: 'Download Official Notification PDF', url: 'https://www.sci.gov.in/' },
      { label: 'Supreme Court Official Website', url: 'https://www.sci.gov.in/' }
    ]
  },
  'lsg-rajasthan-safai-karamchari-recruitment-2026-apply-online-for-4550': {
    organizationName: 'Local Self Government Department Rajasthan (LSG)',
    postName: 'Safai Karamchari (Sanitation Worker)',
    rewrittenTitle: 'Rajasthan Safai Karamchari Bharti 2026 Apply Online for 24,752 Posts',
    shortInfo: 'Local Self Government Department (LSG), Government of Rajasthan has opened online applications for 24,752 contractual Safai Karamchari vacancies across urban local bodies in Non-TSP and TSP regions.',
    totalVacancies: '24,752 Posts',
    vacanciesTable: [
      { postName: 'Safai Karamchari (Non-TSP Area)', totalPost: '24,277', eligibility: 'Candidate must be a domicile of Rajasthan with minimum 1 year practical sanitation experience in government/semi-government bodies.' },
      { postName: 'Safai Karamchari (TSP Area)', totalPost: '475', eligibility: 'Domicile of TSP regions of Rajasthan with verified sanitation work experience.' }
    ],
    importantLinks: [
      { label: 'Apply Online (SSO Rajasthan Portal)', url: 'https://sso.rajasthan.gov.in/' },
      { label: 'Download District-Wise Vacancy Notification', url: 'https://lsg.rajasthan.gov.in/' },
      { label: 'LSG Rajasthan Official Website', url: 'https://lsg.rajasthan.gov.in/' }
    ]
  },
  'delhi-district-and-session-court-dsssb-sweeper-safai-karamchari-and-chowkidar-advt-no-052026-recruitment-2026-apply-online-4915': {
    organizationName: 'Delhi Subordinate Services Selection Board (DSSSB)',
    postName: 'Sweeper / Safai Karamchari & Chowkidar (Advt 05/2026)',
    rewrittenTitle: 'Delhi District Courts DSSSB Sweeper, Safai Karamchari & Chowkidar Recruitment 2026',
    shortInfo: 'Delhi Subordinate Services Selection Board (DSSSB) has issued Advt 05/2026 inviting online applications for Sweeper, Safai Karamchari, and Chowkidar in Delhi District & Sessions Courts.',
    totalVacancies: 'Various Posts',
    vacanciesTable: [
      { postName: 'Sweeper / Safai Karamchari (District Courts)', totalPost: 'Various', eligibility: 'Class 10th Matriculation passed or equivalent from recognized board.' },
      { postName: 'Chowkidar / Peon', totalPost: 'Various', eligibility: 'Class 10th Pass with knowledge of Hindi and English reading.' }
    ],
    importantLinks: [
      { label: 'Apply Online (DSSSB OARS Portal)', url: 'https://dsssbonline.nic.in/' },
      { label: 'Download Advt 05/2026 Notification PDF', url: 'https://dsssb.delhi.gov.in/' },
      { label: 'DSSSB Official Website', url: 'https://dsssb.delhi.gov.in/' }
    ]
  },
  'central-industrial-security-force-cisf-constable-fire-102-recruitment-2024-exam-date-for-1130-post-8643': {
    organizationName: 'Central Industrial Security Force (CISF)',
    postName: 'Constable / Fire (Male) Recruitment',
    rewrittenTitle: 'CISF Constable Fire Recruitment 2024 Exam Date & Admit Card Notice for 1130 Posts',
    shortInfo: 'Central Industrial Security Force (CISF) has officially declared the written examination schedule and admit card release dates for 1,130 Constable Fire (Male) vacancies.',
    totalVacancies: '1,130 Posts',
    vacanciesTable: [
      { postName: 'Constable / Fire (Male)', totalPost: '1,130', eligibility: '12th Class Pass with Science subject from recognized Board / University.' }
    ],
    importantLinks: [
      { label: 'Download Exam Date & Admit Card Notice', url: 'https://cisfrectt.cisf.gov.in/' },
      { label: 'Official Recruitment Notification PDF', url: 'https://cisfrectt.cisf.gov.in/' },
      { label: 'CISF Recruitment Official Portal', url: 'https://cisfrectt.cisf.gov.in/' }
    ]
  },
  'cbse-kvs-nvs-teaching-and-non-teaching-recruitment-2025-check-tier-ii-exam-download-result-tier-iii-interview-letter-8909': {
    organizationName: 'Kendriya Vidyalaya Sangathan (KVS) / CBSE',
    postName: 'Teaching & Non-Teaching Posts Tier II & III',
    rewrittenTitle: 'CBSE KVS Teaching & Non-Teaching Recruitment Tier II Result & Interview Call Letter 2026',
    shortInfo: 'CBSE and Kendriya Vidyalaya Sangathan have released the Tier II written exam results along with Tier III interview call letters for various Teaching and Non-Teaching vacancies.',
    totalVacancies: 'Various Posts',
    vacanciesTable: [
      { postName: 'PGT / TGT Teachers & Non-Teaching Posts', totalPost: 'Various', eligibility: 'Graduation / Post Graduation with B.Ed and qualified CTET (as applicable).' }
    ],
    importantLinks: [
      { label: 'Download Tier III Interview Call Letter', url: 'https://kvsangathan.nic.in/' },
      { label: 'Download Tier II Result & Merit List PDF', url: 'https://kvsangathan.nic.in/' },
      { label: 'KVS Official Website', url: 'https://kvsangathan.nic.in/' }
    ]
  },
  'uppsc-lecturer-technical-education-2025-admit-card-2026-1993': {
    organizationName: 'Uttar Pradesh Public Service Commission (UPPSC)',
    postName: 'Lecturer in Technical Education Department',
    rewrittenTitle: 'UPPSC Lecturer Technical Education Exam Admit Card 2026 Released',
    shortInfo: 'Uttar Pradesh Public Service Commission (UPPSC) has released the official exam admit cards for Lecturer in Government Polytechnic & Technical Education institutions.',
    totalVacancies: 'Various Posts',
    vacanciesTable: [
      { postName: 'Lecturer (Engineering / Non-Engineering)', totalPost: 'Various', eligibility: 'Bachelor / Master Degree in relevant Engineering/Technology branch with First Class.' }
    ],
    importantLinks: [
      { label: 'Download UPPSC Lecturer Admit Card', url: 'https://uppsc.up.nic.in/' },
      { label: 'Download Exam Schedule Notification', url: 'https://uppsc.up.nic.in/' },
      { label: 'UPPSC Official Website', url: 'https://uppsc.up.nic.in/' }
    ]
  },
  'bihar-bpsc-assistant-section-officer-aso-recruitment-2025-mains-result-for-41-post-5530': {
    organizationName: 'Bihar Public Service Commission (BPSC)',
    postName: 'Assistant Section Officer (ASO)',
    rewrittenTitle: 'Bihar BPSC Assistant Section Officer (ASO) Mains Exam Result 2026 Declared',
    shortInfo: 'Bihar Public Service Commission (BPSC) has declared the Mains written examination results for 41 Assistant Section Officer vacancies under Advt 37/2025.',
    totalVacancies: '41 Posts',
    vacanciesTable: [
      { postName: 'Assistant Section Officer (ASO)', totalPost: '41', eligibility: 'Bachelor Degree in Any Stream from a recognized university in India.' }
    ],
    importantLinks: [
      { label: 'Download BPSC ASO Mains Result PDF', url: 'https://bpsc.bihar.gov.in/' },
      { label: 'Download Cutoff Marks Notice', url: 'https://bpsc.bihar.gov.in/' },
      { label: 'BPSC Official Website', url: 'https://bpsc.bihar.gov.in/' }
    ]
  },
  'upsssc-stenographer-recruitment-2023-result-skill-test-result-2026-5284': {
    organizationName: 'Uttar Pradesh Subordinate Services Selection Commission (UPSSSC)',
    postName: 'Stenographer (Advt 09/2023)',
    rewrittenTitle: 'UPSSSC Stenographer Recruitment 2023 Skill Test Result Declared 2026',
    shortInfo: 'UPSSSC has published the results of the Hindi Shorthand and Typing Skill Test for Stenographer Recruitment 2023 (Advt 09-Exam/2023). Check shortlisted candidates list.',
    totalVacancies: 'Various Posts',
    vacanciesTable: [
      { postName: 'Stenographer', totalPost: 'Various', eligibility: 'UPSSSC PET qualified, 10+2 Intermediate with Hindi Shorthand 80 wpm & Typing 25 wpm.' }
    ],
    importantLinks: [
      { label: 'Download Stenographer 2023 Skill Test Result', url: 'https://upsssc.gov.in/' },
      { label: 'Check Candidate Eligibility & Scorecard', url: 'https://upsssc.gov.in/' },
      { label: 'UPSSSC Official Portal', url: 'https://upsssc.gov.in/' }
    ]
  },
  'upsssc-stenographer-recruitment-2024-result-skill-test-result-2026-4086': {
    organizationName: 'Uttar Pradesh Subordinate Services Selection Commission (UPSSSC)',
    postName: 'Stenographer (Advt 13/2024)',
    rewrittenTitle: 'UPSSSC Stenographer Recruitment 2024 Result & Skill Test Schedule 2026',
    shortInfo: 'UPSSSC has announced the written examination results and upcoming shorthand/typing test dates for Stenographer Recruitment Examination 2024 (Advt 13-Exam/2024).',
    totalVacancies: 'Various Posts',
    vacanciesTable: [
      { postName: 'Stenographer', totalPost: 'Various', eligibility: '10+2 Intermediate with CCC certificate, Hindi Stenography 80 wpm and Hindi Computer Typing 25 wpm.' }
    ],
    importantLinks: [
      { label: 'Download Stenographer 2024 Result PDF', url: 'https://upsssc.gov.in/' },
      { label: 'Download Skill Test Instructions', url: 'https://upsssc.gov.in/' },
      { label: 'UPSSSC Official Portal', url: 'https://upsssc.gov.in/' }
    ]
  },
  'up-state-council-for-vocational-training-scvtup-2026-admissions-first-allotment-result-for-all-courses-3657': {
    organizationName: 'State Council for Vocational Training Uttar Pradesh (SCVTUP)',
    postName: 'UP ITI Admission 2026 Allotment',
    rewrittenTitle: 'SCVTUP UP ITI Admission 2026 First Allotment Result Declared',
    shortInfo: 'State Council for Vocational Training (SCVTUP) has published the First Round Seat Allotment Result for ITI trades across government and private ITIs in Uttar Pradesh.',
    totalVacancies: 'All ITI Courses',
    vacanciesTable: [
      { postName: 'UP ITI Engineering & Non-Engineering Trades', totalPost: 'Statewide Seats', eligibility: 'Class 8th / 10th High School Pass based on selected ITI trade.' }
    ],
    importantLinks: [
      { label: 'Check 1st Round Seat Allotment Result', url: 'https://scvtup.in/' },
      { label: 'Download Allotment Intimation Letter', url: 'https://scvtup.in/' },
      { label: 'SCVTUP Official Website', url: 'https://scvtup.in/' }
    ]
  },
  'atal-bihari-vajpayee-medical-university-abvmu-up-cnet-counselling-2026-5257': {
    organizationName: 'Atal Bihari Vajpayee Medical University (ABVMU)',
    postName: 'Common Nursing Entrance Test (CNET 2026)',
    rewrittenTitle: 'ABVMU UP CNET 2026 Nursing Counselling & Choice Filling Started',
    shortInfo: 'Atal Bihari Vajpayee Medical University, Lucknow has initiated online counselling registration and college choice filling for B.Sc Nursing and Post Basic B.Sc Nursing admissions.',
    totalVacancies: 'Nursing Degree Seats',
    vacanciesTable: [
      { postName: 'B.Sc Nursing (4 Year Course)', totalPost: 'State Seats', eligibility: 'Qualified in ABVMU CNET 2026 with 10+2 PCB & English minimum 45% marks.' },
      { postName: 'Post Basic B.Sc Nursing', totalPost: 'State Seats', eligibility: '10+2 with GNM and registered Nurse & Midwife with State Nursing Council.' }
    ],
    importantLinks: [
      { label: 'Online Counselling Registration Portal', url: 'https://www.abvmuup.edu.in/' },
      { label: 'Download Counselling Schedule & Guidelines', url: 'https://www.abvmuup.edu.in/' },
      { label: 'ABVMU Official Website', url: 'https://www.abvmuup.edu.in/' }
    ]
  },
  'bihar-2-year-bed-admission-test-cet-bed-admissions-2026-4th-round-allotment-result-5641': {
    organizationName: 'Lalit Narayan Mithila University (LNMU) Bihar',
    postName: 'Bihar 2-Year B.Ed Admission (CET-B.Ed 2026)',
    rewrittenTitle: 'Bihar 2-Year B.Ed CET 2026 4th Round Seat Allotment Result Declared',
    shortInfo: 'LNMU Darbhanga has released the 4th Round College Seat Allotment Result for Bihar 2-Year B.Ed and Shiksha Shastri Combined Entrance Test (CET-B.Ed 2026).',
    totalVacancies: 'State B.Ed Seats',
    vacanciesTable: [
      { postName: '2-Year Regular B.Ed & Shiksha Shastri', totalPost: '37,000+ Seats', eligibility: 'Graduation / Post Graduation with minimum 50% marks and qualified in Bihar CET B.Ed 2026.' }
    ],
    importantLinks: [
      { label: 'Check 4th Round College Allotment Status', url: 'https://biharcetbed-lnmu.in/' },
      { label: 'Download Seat Allotment Letter', url: 'https://biharcetbed-lnmu.in/' },
      { label: 'Bihar CET B.Ed Official Portal', url: 'https://biharcetbed-lnmu.in/' }
    ]
  },
  'join-indian-navy-indian-navy-civilian-entrance-test-incet-recruitment-2025-download-re-exam-admit-card-5370': {
    organizationName: 'Indian Navy',
    postName: 'Civilian Entrance Test (INCET 01/2025)',
    rewrittenTitle: 'Indian Navy INCET Civilian Entrance Test Re-Exam Admit Card 2026 Released',
    shortInfo: 'Indian Navy has released the Re-Exam Admit Card for Indian Navy Civilian Entrance Test (INCET 01/2025) for Chargeman, Senior Draughtsman, and Tradesman Mate posts.',
    totalVacancies: 'Various Civilian Posts',
    vacanciesTable: [
      { postName: 'Chargeman, Draughtsman & Tradesman Mate', totalPost: 'Various', eligibility: 'Diploma in Engineering / Degree in Science or 10th with ITI in relevant trade.' }
    ],
    importantLinks: [
      { label: 'Download INCET Re-Exam Admit Card', url: 'https://www.joinindiannavy.gov.in/' },
      { label: 'Download Official Re-Exam Notice', url: 'https://www.joinindiannavy.gov.in/' },
      { label: 'Indian Navy Official Portal', url: 'https://www.joinindiannavy.gov.in/' }
    ]
  },
  'upsc-civil-services-services-mains-admit-card-2026-4653': {
    organizationName: 'Union Public Service Commission (UPSC)',
    postName: 'Civil Services (Mains) Examination (CSE)',
    rewrittenTitle: 'UPSC Civil Services (Mains) Exam Admit Card 2026 Download Released',
    shortInfo: 'Union Public Service Commission (UPSC) has issued the e-Admit Card for candidates qualified for the Civil Services (Mains) Examination 2026. Download using registration ID.',
    totalVacancies: 'IAS / IPS / IFS / Central Services',
    vacanciesTable: [
      { postName: 'Civil Services Examination (Mains)', totalPost: '1,000+ Posts', eligibility: 'Qualified in UPSC CSE Preliminary Examination 2026. Degree from recognized university.' }
    ],
    importantLinks: [
      { label: 'Download UPSC CSE Mains e-Admit Card', url: 'https://upsconline.nic.in/' },
      { label: 'Download Mains Examination Time Table', url: 'https://upsc.gov.in/' },
      { label: 'UPSC Official Website', url: 'https://upsc.gov.in/' }
    ]
  },
  'up-pgt-upsessb-all-subject-syllabus-download-2022-5900': {
    organizationName: 'Uttar Pradesh Secondary Education Service Selection Board (UPSESSB)',
    postName: 'Post Graduate Teacher (PGT)',
    rewrittenTitle: 'UP PGT UPSESSB All Subject Detailed Syllabus & Exam Pattern PDF 2026',
    shortInfo: 'UPSESSB has published the comprehensive subject-wise syllabus and exam pattern PDF for Post Graduate Teacher (PGT) examinations across all secondary school disciplines.',
    totalVacancies: 'PGT All Subjects',
    vacanciesTable: [
      { postName: 'Post Graduate Teacher (PGT)', totalPost: 'Subject Wise', eligibility: 'Post Graduate Degree in related subject with B.Ed qualification.' }
    ],
    importantLinks: [
      { label: 'Download Subject-Wise PGT Syllabus PDF', url: 'https://upsessb.pariksha.nic.in/' },
      { label: 'UPSESSB Examination Portal', url: 'https://upsessb.pariksha.nic.in/' }
    ]
  },
  'up-tgt-upsessb-all-subject-syllabus-download-2022-5106': {
    organizationName: 'Uttar Pradesh Secondary Education Service Selection Board (UPSESSB)',
    postName: 'Trained Graduate Teacher (TGT)',
    rewrittenTitle: 'UP TGT UPSESSB All Subject Syllabus & Exam Pattern PDF Download 2026',
    shortInfo: 'Complete subject-wise examination syllabus and pattern for Uttar Pradesh Trained Graduate Teacher (TGT) recruitment covering Hindi, English, Mathematics, Science, and Arts.',
    totalVacancies: 'TGT All Subjects',
    vacanciesTable: [
      { postName: 'Trained Graduate Teacher (TGT)', totalPost: 'Subject Wise', eligibility: 'Graduation in relevant subject with B.Ed degree from recognized university.' }
    ],
    importantLinks: [
      { label: 'Download Subject-Wise TGT Syllabus PDF', url: 'https://upsessb.pariksha.nic.in/' },
      { label: 'UPSESSB Official Website', url: 'https://upsessb.pariksha.nic.in/' }
    ]
  },
  'ssc-102-head-constable-ministerial-in-delhi-police-recruitment-2022-exam-final-result-with-detailed-marks-2023-4581': {
    organizationName: 'Staff Selection Commission (SSC)',
    postName: 'Head Constable (Ministerial) in Delhi Police',
    rewrittenTitle: 'SSC Delhi Police Head Constable (Ministerial) Final Result & Marks Released',
    shortInfo: 'Staff Selection Commission has uploaded the final merit list and individual candidate scorecards for Head Constable (Ministerial) in Delhi Police Examination.',
    totalVacancies: '835 Posts',
    vacanciesTable: [
      { postName: 'Head Constable (Ministerial) - Male & Female', totalPost: '835', eligibility: '10+2 Senior Secondary with English typing 30 wpm or Hindi typing 25 wpm.' }
    ],
    importantLinks: [
      { label: 'Download Final Result Merit List PDF', url: 'https://ssc.gov.in/' },
      { label: 'Check Candidate Detailed Marks & Scorecard', url: 'https://ssc.gov.in/' },
      { label: 'SSC Official Portal', url: 'https://ssc.gov.in/' }
    ]
  },
  'ssc-selection-post-x-recruitment-2022-additional-written-exam-result-2023-3878': {
    organizationName: 'Staff Selection Commission (SSC)',
    postName: 'Selection Post Phase X Additional Results',
    rewrittenTitle: 'SSC Selection Post Phase X Additional Written Exam Result & Cutoff List 2026',
    shortInfo: 'Staff Selection Commission has declared the Additional Result for Phase-X Selection Posts covering Matriculation, Higher Secondary, and Graduation level categories.',
    totalVacancies: 'Various Selection Posts',
    vacanciesTable: [
      { postName: 'Matriculation / 10+2 / Graduate Level Posts', totalPost: 'Various', eligibility: '10th / 12th / Bachelor Degree depending on specific post category code.' }
    ],
    importantLinks: [
      { label: 'Download Additional Result Merit List PDF', url: 'https://ssc.gov.in/' },
      { label: 'Download Post-Wise Cutoff Marks Notice', url: 'https://ssc.gov.in/' },
      { label: 'SSC Official Portal', url: 'https://ssc.gov.in/' }
    ]
  }
};

const posts = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
let updatedCount = 0;

for (let i = 0; i < posts.length; i++) {
  const p = posts[i];
  if (UPDATES[p.slug]) {
    const u = UPDATES[p.slug];
    posts[i] = {
      ...p,
      organizationName: u.organizationName || p.organizationName,
      postName: u.postName || p.postName,
      rewrittenTitle: u.rewrittenTitle || p.rewrittenTitle,
      shortInfo: u.shortInfo || p.shortInfo,
      totalVacancies: u.totalVacancies || p.totalVacancies,
      vacanciesTable: u.vacanciesTable || p.vacanciesTable,
      importantLinks: u.importantLinks || p.importantLinks,
      howToApply: [
        `Check eligibility criteria and required qualifications for ${u.postName}.`,
        'Visit the official website link provided in the direct links table below.',
        'Fill out the application form with accurate personal and educational information.',
        'Upload scanned copies of required documents (photograph, signature, certificates).',
        'Pay the requisite application fee (if applicable) through online net banking, debit/credit card, or UPI.',
        'Review all entered details carefully before final submission.',
        'Download and take a printout of the submitted application form and fee payment receipt for future reference.'
      ]
    };
    updatedCount++;
    console.log(`✅ Enriched post: [${p.slug}]`);
  }
}

fs.writeFileSync(seedPath, JSON.stringify(posts, null, 2), 'utf8');
console.log(`\n🎉 Successfully enriched ${updatedCount} posts in seedPosts.json!`);
