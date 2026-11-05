import cron from 'node-cron';
import { fileURLToPath } from 'url';
import { FESTIVAL_CAMPAIGNS, generateAllCompositePosters } from './renderAllFestivals.js';
import { executeFestivalBroadcast } from './publishFestivalPost.js';

console.log('================================================================');
console.log('🪔 SARKARI JOB ALERTS FESTIVAL CAMPAIGN SCHEDULER ACTIVE 🪔');
console.log(`Current Time: ${new Date().toISOString()}`);
console.log('Timezone: Asia/Kolkata (IST)');
console.log('================================================================\n');

// 1. Verify all posters exist on startup
generateAllCompositePosters().then(() => {
  console.log('✅ All 5 festive posters verified & ready in memory/disk.\n');
  registerScheduledJobs();
}).catch(err => {
  console.error('⚠️ Warning during startup poster verification:', err.message);
  registerScheduledJobs();
});

function registerScheduledJobs() {
  console.log('📅 Registering Festival Matrix (All triggers fire at 08:00 AM IST):\n');

  FESTIVAL_CAMPAIGNS.forEach((campaign) => {
    // Schedule format: '0 8 DD 11 *'
    const cronExpression = campaign.cronSchedule;

    console.log(`⏰ [Schedule Queued] ${campaign.date} @ 08:00 AM IST -> "${campaign.name}" (${cronExpression})`);

    cron.schedule(
      cronExpression,
      async () => {
        console.log(`\n🔔 [ALARM FIRED] It is 08:00 AM IST on ${campaign.date}! Initiating broadcast for ${campaign.name}...`);
        try {
          await executeFestivalBroadcast(campaign.id);
        } catch (error) {
          console.error(`❌ [Scheduler Error] Failed to publish ${campaign.name}:`, error.message);
        }
      },
      {
        scheduled: true,
        timezone: 'Asia/Kolkata',
      }
    );
  });

  console.log('\n🟢 All 5 festive campaigns are locked and loaded. Waiting for trigger times...');
}

// Keep daemon alive
setInterval(() => {}, 60000);
