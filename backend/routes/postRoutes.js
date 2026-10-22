import express from 'express';
import {
  getThreeColumnPosts,
  getAllJobs,
  getPostBySlug,
  triggerScraper,
  seedPosts,
  getRssFeed,
  getOgImage,
} from '../controllers/postController.js';

const router = express.Router();

// RSS & Dynamic OG Card Routes
router.get('/rss.xml', getRssFeed);
router.get('/posts/rss.xml', getRssFeed);
router.get('/og', getOgImage);
router.get('/og.png', getOgImage);

// Public Job Feeds & Dynamic Retrieval
router.get('/posts/three-column', getThreeColumnPosts);
router.get('/jobs', getAllJobs);
router.get('/posts/:slug', getPostBySlug);

// Manual Scraper & Test Triggers
router.get('/test-scrape', triggerScraper);
router.post('/scraper/trigger', triggerScraper);
router.post('/posts/seed', seedPosts);

export default router;
