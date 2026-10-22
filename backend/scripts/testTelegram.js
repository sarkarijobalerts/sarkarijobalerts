import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { sendTelegramMessage } from '../services/telegramService.js';

console.log('[Test Telegram] Sending test job alert message to Telegram channel...');

const sampleJob = {
  title: 'SSC Combined Graduate Level (CGL) Exam 2026 Notification Out',
  rewrittenTitle: 'SSC Combined Graduate Level (CGL) Exam 2026 Notification Out',
  organizationName: 'Staff Selection Commission (SSC)',
  totalVacancies: '12,000+ Posts',
  slug: 'ssc-cgl-2026-recruitment',
};

async function test() {
  const result = await sendTelegramMessage(sampleJob);
  console.log('[Test Telegram Result]:', result ? 'SUCCESS' : 'FAILED');
  process.exit(0);
}

test();
