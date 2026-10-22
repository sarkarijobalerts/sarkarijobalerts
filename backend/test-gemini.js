import dotenv from 'dotenv';
import { processScrapedDataWithGemini } from './services/geminiService.js';

dotenv.config();

const rawScrapedSample = `
Sarkari Notification: SSC CGL 2026 Examination Online Form Out
Organization: Staff Selection Commission (SSC)
Post Date: 31/07/2026
Short Information: Staff Selection Commission has invited online applications for Combined Graduate Level CGL Exam 2026. Total vacancies 12,000+.
Important Dates: Application Begin: 01/08/2026, Last Date: 31/08/2026, Exam Date: October 2026.
Application Fee: Gen/OBC: Rs 100, SC/ST/PH/Female: Rs 0.
Age Limit as on 01/08/2026: Min Age: 18 Yrs, Max Age: 32 Yrs. Age relaxation extra per rules.
Vacancies: Assistant Section Officer (3450 posts, Bachelor Degree), Income Tax Inspector (1200 posts, Bachelor Degree).
How to apply: Candidate must read full notification, apply on ssc.gov.in, upload photo and sign, pay fee.
Links: Apply Online: https://ssc.gov.in, Notification: https://ssc.gov.in/pdf
`;

async function test() {
  console.log('Testing processScrapedDataWithGemini with provided API Key...');
  try {
    const result = await processScrapedDataWithGemini(rawScrapedSample);
    console.log('\n--- SUCCESSFUL STRUCTURED JSON OUTPUT ---');
    console.log(JSON.stringify(result, null, 2));
  } catch (err) {
    console.error('Test Error:', err);
  }
}

test();
