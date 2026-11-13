import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { renderFestivalPoster } from '../services/imageCompositorService.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

export const FESTIVAL_CAMPAIGNS = [
  {
    id: 'dhanteras',
    name: 'Happy Dhanteras',
    subWish: 'May This Dhanteras Bring Endless Wealth, Prosperity & Golden Opportunities to Your Career!',
    date: '2026-11-06',
    cronSchedule: '0 8 6 11 *', // 08:00 AM on Nov 6
    baseImageName: 'dhanteras.jpg',
    outputImageName: 'dhanteras_festive_1080x1080.png',
    caption: `May this Dhanteras bring endless wealth, prosperity, and golden opportunities to your career! ✨ Wishing you and your family a very Happy Dhanteras from the SarkariJobAlerts team. Keep shining and striving for success! 🪔\n\n🌐 Apply for the latest jobs at: https://sarkarijobalerts.com\n\n#Dhanteras #Dhanteras2026 #HappyDhanteras #FestivalOfLights #SarkariJobAlerts`,
    telegramCaption: `✨ <b>HAPPY DHANTERAS 2026</b> ✨\n\nMay this Dhanteras bring endless wealth, prosperity, and golden opportunities to your career! 🪔\n\nWishing you and your family a joyful, bright, and prosperous Dhanteras from the SarkariJobAlerts team. Keep shining and striving for your dream government career!\n\n🌐 <b>Apply for latest jobs:</b> https://sarkarijobalerts.com\n\n#Dhanteras #HappyDhanteras #SarkariJobAlerts`,
    hashtags: ['#Dhanteras', '#Dhanteras2026', '#HappyDhanteras', '#FestivalOfLights', '#SarkariJobAlerts'],
    keywords: ['Dhanteras wishes', 'prosperity', 'government jobs', 'festival season', 'career success'],
  },
  {
    id: 'choti_diwali',
    name: 'Happy Choti Diwali',
    subWish: 'Let the Divine Lights Eliminate Darkness and Illuminate Your Career Path!',
    date: '2026-11-07',
    cronSchedule: '0 8 7 11 *', // 08:00 AM on Nov 7
    baseImageName: 'choti_diwali.jpg',
    outputImageName: 'choti_diwali_festive_1080x1080.png',
    caption: `Let the lights of Choti Diwali eliminate all darkness and bring bright new career opportunities into your life. 🌟 Happy Choti Diwali to all our dedicated aspirants! 🪔\n\n🌐 Find your dream job today: https://sarkarijobalerts.com\n\n#ChotiDiwali #NarakaChaturdashi #DiwaliVibes #FestiveSeason #SarkariJobAlerts`,
    telegramCaption: `🌟 <b>HAPPY CHOTI DIWALI (NARAKA CHATURDASHI)</b> 🌟\n\nLet the sacred lights of Choti Diwali eliminate all darkness and bring bright new career milestones into your life! 🪔\n\nWarmest greetings to all hardworking aspirants from SarkariJobAlerts. May success and victory follow your hard work!\n\n🌐 <b>Find your dream job:</b> https://sarkarijobalerts.com\n\n#ChotiDiwali #DiwaliVibes #SarkariJobAlerts`,
    hashtags: ['#ChotiDiwali', '#NarakaChaturdashi', '#DiwaliVibes', '#FestiveSeason', '#SarkariJobAlerts'],
    keywords: ['Choti Diwali greetings', 'festive celebrations', 'job alerts', 'career opportunities', 'Diwali lights'],
  },
  {
    id: 'diwali',
    name: 'Happy Diwali',
    subWish: 'May the Festival of Lights Guide Your Path to Your Dream Government Job!',
    date: '2026-11-08',
    cronSchedule: '0 8 8 11 *', // 08:00 AM on Nov 8
    baseImageName: 'diwali.jpg',
    outputImageName: 'diwali_festive_1080x1080.png',
    caption: `Wishing you a Deepavali filled with joy, health, and ultimate success! 🎇 May the festival of lights guide your path to your dream government job this year. Happy Diwali! 🪔✨\n\n🌐 Stay updated with the latest alerts: https://sarkarijobalerts.com\n\n#HappyDiwali #Diwali2026 #Deepavali #DiwaliCelebration #SarkariJobAlerts`,
    telegramCaption: `🎇 <b>SHUBH DEEPAVALI / HAPPY DIWALI 2026</b> 🎇\n\nWishing you and your loved ones a sparkling Deepavali filled with boundless joy, health, and ultimate career triumph! 🪔✨\n\nMay the festival of divine lights guide your journey and turn every government exam aspiration into grand success this year!\n\n🌐 <b>Stay updated with latest alerts:</b> https://sarkarijobalerts.com\n\n#HappyDiwali #Deepavali #Diwali2026 #SarkariJobAlerts`,
    hashtags: ['#HappyDiwali', '#Diwali2026', '#Deepavali', '#DiwaliCelebration', '#SarkariJobAlerts'],
    keywords: ['Happy Diwali', 'Deepavali wishes', 'festival of lights', 'government exams', 'latest job updates'],
  },
  {
    id: 'govardhan_puja',
    name: 'Happy Govardhan Puja',
    subWish: 'May Lord Krishna Bless You with Strength, Faith, and Lifelong Success!',
    date: '2026-11-10',
    cronSchedule: '0 8 10 11 *', // 08:00 AM on Nov 10
    baseImageName: 'govardhan_puja.jpg',
    outputImageName: 'govardhan_puja_festive_1080x1080.png',
    caption: `May Lord Krishna bless you with strength, faith, and protection on your journey to success. 🙏 Happy Govardhan Puja to you and your loved ones! 🌸\n\n🌐 Get all your career updates at: https://sarkarijobalerts.com\n\n#GovardhanPuja #Annakut #KrishnaBlessings #GovardhanPuja2026 #SarkariJobAlerts`,
    telegramCaption: `🙏 <b>HAPPY GOVARDHAN PUJA & ANNAKUT</b> 🙏\n\nMay Lord Krishna bless you with immense strength, unwavering faith, and divine protection on your path to success! 🌸\n\nWishing you and your family abundant peace, prosperity, and blessings on this holy day.\n\n🌐 <b>Get all career updates:</b> https://sarkarijobalerts.com\n\n#GovardhanPuja #Annakut #KrishnaBlessings #SarkariJobAlerts`,
    hashtags: ['#GovardhanPuja', '#Annakut', '#KrishnaBlessings', '#GovardhanPuja2026', '#SarkariJobAlerts'],
    keywords: ['Govardhan Puja', 'Lord Krishna', 'div divine blessings', 'festive updates', 'exam preparation'],
  },
  {
    id: 'bhai_dooj',
    name: 'Happy Bhai Dooj',
    subWish: 'Celebrating the Sacred Bond of Love, Trust, and Lifelong Protection!',
    date: '2026-11-11',
    cronSchedule: '0 8 11 11 *', // 08:00 AM on Nov 11
    baseImageName: 'bhai_dooj.jpg',
    outputImageName: 'bhai_dooj_festive_1080x1080.png',
    caption: `Celebrating the beautiful bond of love, trust, and protection between brothers and sisters. 💖 Wishing everyone a very joyous and Happy Bhai Dooj! 🎉\n\n🌐 Share success with your siblings: https://sarkarijobalerts.com\n\n#BhaiDooj #BhaiDooj2026 #SiblingLove #FestiveVibes #SarkariJobAlerts`,
    telegramCaption: `💖 <b>HAPPY BHAI DOOJ 2026</b> 💖\n\nCelebrating the pure and eternal bond of love, trust, and lifelong protection between brothers and sisters! 🎉\n\nWishing you all immense joy, happiness, and shared achievements with your family on this auspicious celebration.\n\n🌐 <b>Share govt job alerts with siblings:</b> https://sarkarijobalerts.com\n\n#BhaiDooj #BhaiDooj2026 #SiblingLove #SarkariJobAlerts`,
    hashtags: ['#BhaiDooj', '#BhaiDooj2026', '#SiblingLove', '#FestiveVibes', '#SarkariJobAlerts'],
    keywords: ['Bhai Dooj', 'brother sister bond', 'festival greetings', 'job notifications', 'festive celebration'],
  },
  {
    id: 'childrens_day',
    name: "Happy Children's Day",
    subWish: 'Wishing Every Child a Future Full of Dreams, Smiles and Success!',
    date: '2026-11-14',
    cronSchedule: '0 9 14 11 *', // 09:00 AM on Nov 14
    baseImageName: 'childrens_day.jpg',
    outputImageName: 'childrens_day_festive_1080x1080.png',
    caption: `Happy Children's Day! 🎈✨ Children are the budding stars and future architects of our nation. May their innocence, boundless curiosity, and dreams always be protected and nurtured. Wishing all students, young dreamers, and future civil servants a joyful Children's Day from the SarkariJobAlerts team! 🌟📚\n\n🌐 Build your future career with: https://sarkarijobalerts.com\n\n#ChildrensDay #HappyChildrensDay #ChildrensDay2026 #BalDiwas #FutureLeaders #SarkariJobAlerts`,
    telegramCaption: `🎈 <b>HAPPY CHILDREN'S DAY 2026 (BAL DIWAS)</b> 🎈\n\nChildren are the sparkling stars and future leaders of tomorrow! May their innocence, relentless curiosity, and grand dreams always shine bright. 🌟📚\n\nWishing all aspirants, young dreamers, and future officers a joyful and inspiring Children's Day from the SarkariJobAlerts family! Keep dreaming big, working hard, and achieving greatness.\n\n🌐 <b>Explore latest government careers:</b> https://sarkarijobalerts.com\n\n#ChildrensDay #HappyChildrensDay #BalDiwas #SarkariJobAlerts`,
    hashtags: ['#ChildrensDay', '#HappyChildrensDay', '#ChildrensDay2026', '#BalDiwas', '#SarkariJobAlerts'],
    keywords: ['Childrens Day', 'Bal Diwas', 'happy children', 'future leaders', 'education'],
  },
  {
    id: 'chhath_puja',
    name: 'Happy Chhath Puja',
    subWish: 'Wishing you health, peace and happiness',
    date: '2026-11-15',
    cronSchedule: '0 9 15 11 *', // 09:00 AM on Nov 15
    baseImageName: 'chhath_puja.jpg',
    outputImageName: 'chhath_puja_festive_1080x1080.png',
    caption: `Warm greetings on the auspicious occasion of Chhath Puja! 🌅 May the Sun God (Surya Dev) and Chhathi Maiya bless you and your family with radiant health, peace, prosperity, and grand success in all your endeavours. 🙏✨\n\n🌐 Stay updated with the latest government job opportunities: https://sarkarijobalerts.com\n\n#ChhathPuja #ChhathPuja2026 #HappyChhathPuja #ChhathiMaiya #SuryaDev #SarkariJobAlerts`,
    telegramCaption: `🌅 <b>HAPPY CHHATH PUJA 2026</b> 🌅\n\nMay the divine rays of Surya Dev and the holy blessings of Chhathi Maiya illuminate your life with infinite joy, good health, peace, and glorious success in your career aspirations! 🙏🪔\n\nWarmest wishes to you and your family on this sacred Mahaparv from the SarkariJobAlerts team.\n\n🌐 <b>Explore latest government job alerts:</b> https://sarkarijobalerts.com\n\n#ChhathPuja #ChhathiMaiya #HappyChhathPuja #SarkariJobAlerts`,
    hashtags: ['#ChhathPuja', '#ChhathPuja2026', '#HappyChhathPuja', '#ChhathiMaiya', '#SarkariJobAlerts'],
    keywords: ['Chhath Puja', 'Chhathi Maiya', 'Surya Dev', 'festival greetings', 'career success'],
  },
];

/**
 * Pre-generate all 5 high-resolution 1080x1080 composite posters
 */
export async function generateAllCompositePosters() {
  console.log('================================================================');
  console.log('🎨 FESTIVAL CAMPAIGN: PRE-COMPOSITING ALL 5 HIGH-RES POSTERS 🎨');
  console.log('================================================================\n');

  const generated = [];

  for (const campaign of FESTIVAL_CAMPAIGNS) {
    const basePath = path.resolve(__dirname, `../assets/festival_bases/${campaign.baseImageName}`);
    const outputPath = path.resolve(__dirname, `../assets/festival_output/${campaign.outputImageName}`);

    if (!fs.existsSync(basePath)) {
      console.error(`❌ Base image not found: ${basePath}`);
      continue;
    }

    try {
      await renderFestivalPoster({
        baseImagePath: basePath,
        festivalWish: campaign.name,
        subWish: campaign.subWish,
        outputPath,
      });
      generated.push({ id: campaign.id, outputPath });
    } catch (err) {
      console.error(`❌ Error compositing ${campaign.id}:`, err.message);
    }
  }

  console.log(`\n🎉 Compositing complete! Generated ${generated.length}/5 festive posters.\n`);
  return generated;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateAllCompositePosters().catch(console.error);
}
