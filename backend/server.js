import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import postRoutes from './routes/postRoutes.js';
import { getRssFeed } from './controllers/postController.js';
import { startCronScheduler } from './services/cronService.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Express Middleware
app.use(cors());
app.use(express.json());

// API & RSS Routes
app.get('/rss.xml', getRssFeed);
app.use('/api', postRoutes);

// Healthcheck Route
app.get('/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'Sarkari News Automated Scraper & AI Rewriter API',
  });
});

// 404 Catch-All Middleware for unmapped API endpoints
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Requested API endpoint not found',
  });
});

// Start Server & Connect DB
async function bootstrap() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`[Express Server] Running on http://localhost:${PORT}`);
    
    // Start automated 30-minute node-cron schedule
    startCronScheduler();
  });
}

bootstrap();
