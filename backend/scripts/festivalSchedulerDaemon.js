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
  console.log('✅ All festival posters verified & ready in memory/disk.\n');
  registerScheduledJobs();
}).catch(err => {
  console.error('⚠️ Warning during startup poster verification:', err.message);
  registerScheduledJobs();
});

function registerScheduledJobs() {
  console.log('📅 Registering Festival Matrix:\n');

  FESTIVAL_CAMPAIGNS.forEach((campaign) => {
    const cronExpression = campaign.cronSchedule;

    console.log(`⏰ [Schedule Queued] ${campaign.date} -> "${campaign.name}" (${cronExpression})`);

    cron.schedule(
      cronExpression,
      async () => {
        console.log(`\n🔔 [ALARM FIRED] Triggering scheduled broadcast for ${campaign.name} on ${campaign.date}...`);
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

  console.log('\n🟢 All festival campaigns are locked and loaded. Waiting for trigger times...');
}

// Keep daemon alive
setInterval(() => {}, 60000);
