import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

// Load the Service Account Key
// The user should place google-service-account.json in the backend/config/ directory
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SERVICE_ACCOUNT_FILE = fs.existsSync(path.resolve(__dirname, '../config/google-service-account.json'))
  ? path.resolve(__dirname, '../config/google-service-account.json')
  : path.resolve(process.cwd(), 'config/google-service-account.json');

let authClient = null;

async function getAuthClient() {
  if (authClient) return authClient;

  if (!fs.existsSync(SERVICE_ACCOUNT_FILE)) {
    console.warn(`[Indexing API] Warning: Service account file not found at ${SERVICE_ACCOUNT_FILE}`);
    console.warn('[Indexing API] Google Indexing API will not be used.');
    return null;
  }

  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: SERVICE_ACCOUNT_FILE,
      scopes: ['https://www.googleapis.com/auth/indexing'],
    });

    authClient = await auth.getClient();
    return authClient;
  } catch (error) {
    console.error(`[Indexing API] Failed to authenticate: ${error.message}`);
    return null;
  }
}

/**
 * Pushes a URL to the Google Indexing API
 * @param {string} url The fully qualified URL (e.g. https://sarkarijobalerts.com/job/slug/)
 * @param {string} type 'URL_UPDATED' or 'URL_DELETED'
 */
export async function pushUrlToIndex(url, type = 'URL_UPDATED') {
  try {
    const client = await getAuthClient();
    if (!client) return false;

    const indexing = google.indexing({ version: 'v3', auth: client });

    const response = await indexing.urlNotifications.publish({
      requestBody: {
        url: url,
        type: type,
      },
    });

    console.log(`[Indexing API] Successfully pushed ${url} | Status: ${response.status}`);
    return true;
  } catch (error) {
    console.error(`[Indexing API] Error pushing ${url}: ${error.message}`);
    return false;
  }
}
