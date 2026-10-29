# 🇮🇳 Sarkari Job Alerts

A modern, automated web application and notification system that provides instant updates on the latest Government Jobs (Sarkari Naukri), entrance exam admit cards, and official result declarations across India.

🌐 **Live Website:** [sarkarijobalerts.com](https://sarkarijobalerts.com)

---

## ✨ Features

- **Automated Daily Updates:** Scrapes and enriches the latest job notifications, admit cards, and results daily using automated backend scripts and GitHub Actions.
- **Multi-Channel Broadcasting:** Automatically publishes new job alerts and notifications to **Telegram**, **Facebook**, and via **OneSignal Push Notifications**.
- **SEO Optimized:** Built with dynamic JSON-LD structured data (`NewsArticle` and `CollectionPage` schema) for maximum search engine visibility.
- **Fast Static Frontend:** Built with Next.js static output for lightning-fast page loads and optimized for mobile devices.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js (React), Tailwind CSS, Static Site Generation (`next export`)
- **Backend:** Node.js, Express
- **AI Integration:** Google Gemini API for automated job description enrichment and structuring
- **Automation & CI/CD:** GitHub Actions (scheduled cron jobs)
- **Deployment:** Hostinger via automated FTPS deployment

---

## 📂 Project Structure

```text
├── .github/workflows/       # Automated GitHub Actions workflows
├── backend/                 # Node.js scraping and notification services
│   ├── scripts/             # Core automation scripts (e.g., manualFullUpdate.js)
│   └── config/              # Service accounts and configuration files
├── frontend/                # Next.js frontend application
│   ├── lib/                 # Generated JSON data (seedPosts.json, etc.)
│   └── public/              # Static assets and sitemaps
├── runDailyJobUpdate.bat    # Local Windows batch script for automated updates
└── runSilentDailyUpdate.vbs # VBScript to run updates silently in the background
