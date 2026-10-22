import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { processScrapedDataWithGemini } from '../services/geminiService.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// 20+ Real & Realistic Government Job Notifications
const RAW_SEED_NOTIFICATIONS = [
  // LATEST JOBS (10 Posts)
  {
    title: 'SSC CGL 2026 Recruitment Notification',
    category: 'Latest Jobs',
    organization: 'Staff Selection Commission (SSC)',
    shortInfo: 'SSC has released official notification for Combined Graduate Level CGL Exam 2026 for 12,000+ Group B & C posts.',
    importantDates: [{ title: 'Begin Date', dateVal: '01/08/2026' }, { title: 'Last Date', dateVal: '31/08/2026' }],
    applicationFee: [{ category: 'Gen/OBC/EWS', feeVal: '₹ 100' }, { category: 'SC/ST/Female', feeVal: '₹ 0' }],
    ageLimit: [{ criteria: 'Age Limit', details: '18 to 32 Years as on 01/08/2026' }],
    vacancyDetails: [{ postName: 'Assistant Section Officer', totalPosts: '3,450', eligibility: 'Bachelor Degree' }],
    officialLinks: [{ linkTitle: 'Apply Online', url: 'https://ssc.gov.in' }],
  },
  {
    title: 'IBPS PO Recruitment 2026 Online Form',
    category: 'Latest Jobs',
    organization: 'Institute of Banking Personnel Selection (IBPS)',
    shortInfo: 'IBPS PO XIV Online Application process started for 4,455 Probationary Officer vacancies in participating public sector banks.',
    importantDates: [{ title: 'Begin Date', dateVal: '02/08/2026' }, { title: 'Last Date', dateVal: '22/08/2026' }],
    applicationFee: [{ category: 'Gen/OBC/EWS', feeVal: '₹ 850' }, { category: 'SC/ST/PH', feeVal: '₹ 175' }],
    ageLimit: [{ criteria: 'Age Limit', details: '20 to 30 Years' }],
    vacancyDetails: [{ postName: 'Probationary Officer (PO / MT)', totalPosts: '4,455', eligibility: 'Graduate Degree in Any Stream' }],
    officialLinks: [{ linkTitle: 'Apply Online', url: 'https://ibps.in' }],
  },
  {
    title: 'UPSC CAPF AC Online Form 2026',
    category: 'Latest Jobs',
    organization: 'Union Public Service Commission (UPSC)',
    shortInfo: 'UPSC Assistant Commandants (CAPF) exam notification released for 506 posts in BSF, CRPF, CISF, ITBP, and SSB.',
    importantDates: [{ title: 'Begin Date', dateVal: '15/07/2026' }, { title: 'Last Date', dateVal: '14/08/2026' }],
    applicationFee: [{ category: 'Gen/OBC', feeVal: '₹ 200' }, { category: 'SC/ST/Female', feeVal: '₹ 0' }],
    ageLimit: [{ criteria: 'Age Limit', details: '20 to 25 Years' }],
    vacancyDetails: [{ postName: 'Assistant Commandant', totalPosts: '506', eligibility: 'Bachelor Degree' }],
    officialLinks: [{ linkTitle: 'Apply Online', url: 'https://upsc.gov.in' }],
  },
  {
    title: 'RRB Technician Recruitment 2026',
    category: 'Latest Jobs',
    organization: 'Railway Recruitment Boards (RRB)',
    shortInfo: 'Indian Railways RRB Technician Grade I Signal & Grade III online application window open for 14,298 posts.',
    importantDates: [{ title: 'Begin Date', dateVal: '10/08/2026' }, { title: 'Last Date', dateVal: '09/09/2026' }],
    applicationFee: [{ category: 'Gen/OBC', feeVal: '₹ 500' }, { category: 'SC/ST/Female', feeVal: '₹ 250' }],
    ageLimit: [{ criteria: 'Age Limit', details: '18 to 36 Years' }],
    vacancyDetails: [{ postName: 'Technician Grade I & III', totalPosts: '14,298', eligibility: '10th ITI / Diploma / BSc' }],
    officialLinks: [{ linkTitle: 'Official Portal', url: 'https://indianrailways.gov.in' }],
  },
  {
    title: 'SBI Junior Associate Clerical 2026 Recruitment',
    category: 'Latest Jobs',
    organization: 'State Bank of India (SBI)',
    shortInfo: 'State Bank of India SBI Clerk Junior Associate Customer Support & Sales recruitment for 8,773 posts.',
    importantDates: [{ title: 'Begin Date', dateVal: '05/08/2026' }, { title: 'Last Date', dateVal: '26/08/2026' }],
    applicationFee: [{ category: 'Gen/OBC/EWS', feeVal: '₹ 750' }, { category: 'SC/ST/PH', feeVal: '₹ 0' }],
    ageLimit: [{ criteria: 'Age Limit', details: '20 to 28 Years' }],
    vacancyDetails: [{ postName: 'Junior Associate (Clerk)', totalPosts: '8,773', eligibility: 'Graduate Degree' }],
    officialLinks: [{ linkTitle: 'Apply Online SBI', url: 'https://sbi.co.in/careers' }],
  },
  {
    title: 'UPPSC Combined Upper Subordinate PCS 2026',
    category: 'Latest Jobs',
    organization: 'Uttar Pradesh Public Service Commission (UPPSC)',
    shortInfo: 'UPPSC Provincial Civil Services PCS prelims examination notification published for SDM, DSP and BDO officers.',
    importantDates: [{ title: 'Begin Date', dateVal: '01/08/2026' }, { title: 'Last Date', dateVal: '02/09/2026' }],
    applicationFee: [{ category: 'Gen/OBC', feeVal: '₹ 125' }, { category: 'SC/ST', feeVal: '₹ 65' }],
    ageLimit: [{ criteria: 'Age Limit', details: '21 to 40 Years' }],
    vacancyDetails: [{ postName: 'SDM / DSP / BDO Posts', totalPosts: '268', eligibility: 'Graduate Degree' }],
    officialLinks: [{ linkTitle: 'UPPSC Portal', url: 'https://uppsc.up.nic.in' }],
  },
  {
    title: 'BPSC 70th Integrated Combined Exam 2026',
    category: 'Latest Jobs',
    organization: 'Bihar Public Service Commission (BPSC)',
    shortInfo: 'BPSC 70th CCE notification out for 1,957 administrative posts across Bihar government departments.',
    importantDates: [{ title: 'Begin Date', dateVal: '15/08/2026' }, { title: 'Last Date', dateVal: '15/09/2026' }],
    applicationFee: [{ category: 'Gen/OBC', feeVal: '₹ 600' }, { category: 'SC/ST/Female', feeVal: '₹ 150' }],
    ageLimit: [{ criteria: 'Age Limit', details: '20 to 37 Years' }],
    vacancyDetails: [{ postName: 'Deputy Collector / DSP', totalPosts: '1,957', eligibility: 'Bachelor Degree' }],
    officialLinks: [{ linkTitle: 'Apply Online', url: 'https://bpsc.bih.nic.in' }],
  },
  {
    title: 'SSC GD Constable 2026 Notification',
    category: 'Latest Jobs',
    organization: 'Staff Selection Commission (SSC)',
    shortInfo: 'SSC General Duty GD Constable recruitment for 39,481 vacancies in BSF, CISF, CRPF, SSB, ITBP, and AR.',
    importantDates: [{ title: 'Begin Date', dateVal: '27/08/2026' }, { title: 'Last Date', dateVal: '27/09/2026' }],
    applicationFee: [{ category: 'Gen/OBC', feeVal: '₹ 100' }, { category: 'SC/ST/Female', feeVal: '₹ 0' }],
    ageLimit: [{ criteria: 'Age Limit', details: '18 to 23 Years' }],
    vacancyDetails: [{ postName: 'GD Constable', totalPosts: '39,481', eligibility: 'Class 10th Passed' }],
    officialLinks: [{ linkTitle: 'Official Site', url: 'https://ssc.gov.in' }],
  },
  {
    title: 'Indian Airforce Agniveer Vayu 01/2026',
    category: 'Latest Jobs',
    organization: 'Indian Air Force (IAF)',
    shortInfo: 'Indian Airforce Agniveervayu intake 01/2026 online application for male & female unmarried candidates.',
    importantDates: [{ title: 'Begin Date', dateVal: '08/07/2026' }, { title: 'Last Date', dateVal: '28/07/2026' }],
    applicationFee: [{ category: 'All Candidates', feeVal: '₹ 550' }],
    ageLimit: [{ criteria: 'Age Limit', details: 'Born between 02/01/2004 and 02/07/2007' }],
    vacancyDetails: [{ postName: 'Agniveer Vayu Science & Non-Science', totalPosts: '3,500+', eligibility: '10+2 Intermediate with 50% Marks' }],
    officialLinks: [{ linkTitle: 'Apply Agniveer Vayu', url: 'https://agnipathvayu.cdac.in' }],
  },
  {
    title: 'RPF Constable & SI Recruitment 2026',
    category: 'Latest Jobs',
    organization: 'Railway Protection Force (RPF)',
    shortInfo: 'Ministry of Railways RPF Constable and Sub Inspector SI online recruitment for 4,660 posts.',
    importantDates: [{ title: 'Begin Date', dateVal: '15/04/2026' }, { title: 'Last Date', dateVal: '14/05/2026' }],
    applicationFee: [{ category: 'Gen/OBC', feeVal: '₹ 500' }, { category: 'SC/ST/Female', feeVal: '₹ 250' }],
    ageLimit: [{ criteria: 'Age Limit', details: '18 to 28 Years' }],
    vacancyDetails: [{ postName: 'RPF Constable & Sub Inspector', totalPosts: '4,660', eligibility: '10th Pass / Graduate' }],
    officialLinks: [{ linkTitle: 'RPF Apply Link', url: 'https://rrbapply.gov.in' }],
  },

  // ADMIT CARDS (5 Posts)
  {
    title: 'UPSC Civil Services Mains Admit Card 2026',
    category: 'Admit Cards',
    organization: 'Union Public Service Commission (UPSC)',
    shortInfo: 'UPSC has released the e-Admit Card for Civil Services IAS / IFS Mains Examination 2026.',
    importantDates: [{ title: 'Admit Card Available', dateVal: '31/07/2026' }, { title: 'Exam Date', dateVal: '20/09/2026' }],
    applicationFee: [{ category: 'Admit Card Download', feeVal: '₹ 0' }],
    ageLimit: [{ criteria: 'Age Criteria', details: 'As per Prelims rules' }],
    vacancyDetails: [{ postName: 'IAS / IPS Mains Exam', totalPosts: '1,056', eligibility: 'Prelims Qualified' }],
    officialLinks: [{ linkTitle: 'Download Mains Admit Card', url: 'https://upsconline.nic.in' }],
  },
  {
    title: 'SSC CHSL Tier I Admit Card 2026',
    category: 'Admit Cards',
    organization: 'Staff Selection Commission (SSC)',
    shortInfo: 'SSC Combined Higher Secondary Level CHSL 10+2 Tier 1 Exam admit cards and application status out.',
    importantDates: [{ title: 'Status Released', dateVal: '25/07/2026' }, { title: 'Exam Date', dateVal: '01/08/2026 to 11/08/2026' }],
    applicationFee: [{ category: 'Download Fee', feeVal: '₹ 0' }],
    ageLimit: [{ criteria: 'Age Limit', details: '18 to 27 Years' }],
    vacancyDetails: [{ postName: 'LDC / JSA / DEO Posts', totalPosts: '3,712', eligibility: '12th Pass' }],
    officialLinks: [{ linkTitle: 'Download CHSL Admit Card', url: 'https://ssc.gov.in' }],
  },
  {
    title: 'NEET UG 2026 Admit Card Hall Ticket',
    category: 'Admit Cards',
    organization: 'National Testing Agency (NTA)',
    shortInfo: 'NTA NEET UG medical entrance exam admit card download link activated for registered candidates.',
    importantDates: [{ title: 'Hall Ticket Out', dateVal: '01/05/2026' }, { title: 'Exam Date', dateVal: '05/05/2026' }],
    applicationFee: [{ category: 'Download', feeVal: '₹ 0' }],
    ageLimit: [{ criteria: 'Minimum Age', details: '17 Years' }],
    vacancyDetails: [{ postName: 'MBBS / BDS Entrance', totalPosts: '1,00,000+ Seats', eligibility: '12th PCB' }],
    officialLinks: [{ linkTitle: 'NTA NEET Portal', url: 'https://neet.nta.nic.in' }],
  },
  {
    title: 'IBPS Clerk Prelims Admit Card 2026',
    category: 'Admit Cards',
    organization: 'Institute of Banking Personnel Selection (IBPS)',
    shortInfo: 'IBPS CRP Clerk XIV preliminary online examination call letter available for download.',
    importantDates: [{ title: 'Call Letter Date', dateVal: '12/08/2026' }, { title: 'Exam Date', dateVal: '24/08/2026' }],
    applicationFee: [{ category: 'Call Letter Download', feeVal: '₹ 0' }],
    ageLimit: [{ criteria: 'Age Limit', details: '20 to 28 Years' }],
    vacancyDetails: [{ postName: 'Clerk XIV Posts', totalPosts: '6,128', eligibility: 'Graduate' }],
    officialLinks: [{ linkTitle: 'Download Call Letter', url: 'https://ibps.in' }],
  },
  {
    title: 'CTET July 2026 Admit Card',
    category: 'Admit Cards',
    organization: 'Central Board of Secondary Education (CBSE)',
    shortInfo: 'CBSE Central Teacher Eligibility Test CTET July exam pre-admit card city intimation slip released.',
    importantDates: [{ title: 'City Slip Out', dateVal: '01/07/2026' }, { title: 'Exam Date', dateVal: '07/07/2026' }],
    applicationFee: [{ category: 'Download', feeVal: '₹ 0' }],
    ageLimit: [{ criteria: 'Age Criteria', details: 'No Upper Age Limit' }],
    vacancyDetails: [{ postName: 'CTET Paper I & II', totalPosts: 'Eligibility Test', eligibility: 'D.El.Ed / B.Ed' }],
    officialLinks: [{ linkTitle: 'Download CTET Admit Card', url: 'https://ctet.nic.in' }],
  },

  // RESULTS (5 Posts)
  {
    title: 'RRB NTPC Graduate Level CBT 1 Result 2026',
    category: 'Results',
    organization: 'Railway Recruitment Boards (RRB)',
    shortInfo: 'RRB NTPC CBT 1 examination zone-wise cutoff marks list and scorecard declared online.',
    importantDates: [{ title: 'Result Date', dateVal: '31/07/2026' }, { title: 'CBT 2 Date', dateVal: 'October 2026' }],
    applicationFee: [{ category: 'Scorecard Check', feeVal: '₹ 0' }],
    ageLimit: [{ criteria: 'Age Limit', details: '18 to 33 Years' }],
    vacancyDetails: [{ postName: 'Station Master / Goods Guard', totalPosts: '8,113', eligibility: 'CBT 1 Qualified' }],
    officialLinks: [{ linkTitle: 'Check Zone Wise Result PDF', url: 'https://indianrailways.gov.in' }],
  },
  {
    title: 'UP Police Constable Result 2026',
    category: 'Results',
    organization: 'UP Police Recruitment & Promotion Board (UPPRPB)',
    shortInfo: 'UP Police Civil Constable written exam result and PET physical eligibility cutoff marks announced.',
    importantDates: [{ title: 'Result Out', dateVal: '15/07/2026' }, { title: 'PET Date', dateVal: 'August 2026' }],
    applicationFee: [{ category: 'Result Check', feeVal: '₹ 0' }],
    ageLimit: [{ criteria: 'Age Limit', details: '18 to 25 Years' }],
    vacancyDetails: [{ postName: 'Police Constable', totalPosts: '60,244', eligibility: '12th Pass' }],
    officialLinks: [{ linkTitle: 'Check UP Police Result', url: 'https://uppbpb.gov.in' }],
  },
  {
    title: 'SSC Stenographer Grade C & D Result 2026',
    category: 'Results',
    organization: 'Staff Selection Commission (SSC)',
    shortInfo: 'SSC Stenographer Group C and Group D computer based test skill test qualification result declared.',
    importantDates: [{ title: 'Result Declared', dateVal: '20/07/2026' }],
    applicationFee: [{ category: 'Check Result', feeVal: '₹ 0' }],
    ageLimit: [{ criteria: 'Age Limit', details: '18 to 30 Years' }],
    vacancyDetails: [{ postName: 'Stenographer Grade C & D', totalPosts: '1,207', eligibility: '12th Pass + Steno' }],
    officialLinks: [{ linkTitle: 'Download SSC Result PDF', url: 'https://ssc.gov.in' }],
  },
  {
    title: 'NTA UGC NET June 2026 Scorecard Result',
    category: 'Results',
    organization: 'National Testing Agency (NTA)',
    shortInfo: 'NTA has published the UGC NET Assistant Professor and JRF subject wise cutoff marks and scorecard.',
    importantDates: [{ title: 'Scorecard Out', dateVal: '24/07/2026' }],
    applicationFee: [{ category: 'Scorecard', feeVal: '₹ 0' }],
    ageLimit: [{ criteria: 'JRF Max Age', details: '30 Years' }],
    vacancyDetails: [{ postName: 'JRF & Assistant Professor', totalPosts: 'Eligibility Cert', eligibility: 'Master Degree 55%' }],
    officialLinks: [{ linkTitle: 'Check UGC NET Result', url: 'https://ugcnet.nta.ac.in' }],
  },
  {
    title: 'CBSE Class 10th & 12th Board Result 2026',
    category: 'Results',
    organization: 'Central Board of Secondary Education (CBSE)',
    shortInfo: 'CBSE Senior Secondary Class 12 and High School Class 10 annual board examination results declared.',
    importantDates: [{ title: 'Result Date', dateVal: '13/05/2026' }],
    applicationFee: [{ category: 'Check Result', feeVal: '₹ 0' }],
    ageLimit: [{ criteria: 'Age Criteria', details: 'Board Rules' }],
    vacancyDetails: [{ postName: 'Class 10 & 12 Pass Certificate', totalPosts: '38 Lakhs Candidates', eligibility: 'Board Exam Appeared' }],
    officialLinks: [{ linkTitle: 'CBSE Results Portal', url: 'https://cbseresults.nic.in' }],
  },
];

async function generateAllGeminiPosts() {
  console.log(`[Seed Script] Generating Gemini AI optimized payloads for ${RAW_SEED_NOTIFICATIONS.length} jobs using GEMINI_API_KEY...`);
  const finalPosts = [];

  for (let i = 0; i < RAW_SEED_NOTIFICATIONS.length; i++) {
    const raw = RAW_SEED_NOTIFICATIONS[i];
    console.log(`[Processing ${i + 1}/${RAW_SEED_NOTIFICATIONS.length}] ${raw.title}...`);

    const aiRes = await processScrapedDataWithGemini(raw);
    const details = aiRes.jobDetails || {};
    const seo = aiRes.seo || {};

    finalPosts.push({
      _id: `seed_${i + 1}`,
      title: raw.title,
      rewrittenTitle: details.title || raw.title,
      metaTitle: seo.metaTitle || raw.title,
      metaDescription: seo.metaDescription || raw.shortInfo,
      slug: seo.slug || `job-post-${i + 1}`,
      primaryKeyword: seo.primaryKeyword || raw.title.substring(0, 30),
      category: raw.category,
      sourceUrl: raw.officialLinks[0]?.url || 'https://sarkariresult.com',
      organizationName: details.organizationName || raw.organization,
      postName: details.postName || raw.title,
      totalVacancies: details.totalVacancies || 'Various',
      postDate: new Date().toLocaleDateString('en-IN'),
      shortInfo: details.shortInfo || raw.shortInfo,
      importantDates: details.importantDates || raw.importantDates,
      applicationFee: details.applicationFee || raw.applicationFee,
      ageLimit: details.ageLimit || { minAge: '18 Yrs', maxAge: '35 Yrs', asOnDate: '01/08/2026', relaxationInfo: 'Rules apply.' },
      vacanciesTable: details.vacanciesTable || raw.vacancyDetails,
      howToApply: details.howToApply || ['Read official notification', 'Apply online on official website link'],
      importantLinks: details.importantLinks || raw.officialLinks,
      publishedDate: new Date(),
    });
  }

  const outputPath = path.resolve(__dirname, '../../frontend/lib/seedPosts.json');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(finalPosts, null, 2));

  console.log(`\n🎉 SUCCESS! Generated ${finalPosts.length} Gemini-optimized posts to ${outputPath}`);
}

generateAllGeminiPosts();
