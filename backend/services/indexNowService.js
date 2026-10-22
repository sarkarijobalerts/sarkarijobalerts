/**
 * IndexNow Service for SarkariJobAlerts
 * Submits changed URLs directly to search engines (Bing, Yandex, etc.) via IndexNow protocol.
 */

const INDEXNOW_HOST = 'sarkarijobalerts.com';
const INDEXNOW_KEY = 'a1b2c3d4e5f678901234567890abcdef';
const INDEXNOW_KEY_LOCATION = 'https://sarkarijobalerts.com/a1b2c3d4e5f678901234567890abcdef.txt';
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';

/**
 * Submits a single URL or a list of URLs to IndexNow
 * @param {string|string[]} urls URL string or array of URL strings
 * @returns {Promise<boolean>}
 */
export async function pushUrlsToIndexNow(urls) {
  const urlList = Array.isArray(urls) ? urls : [urls];
  if (urlList.length === 0) return true;

  const payload = {
    host: INDEXNOW_HOST,
    key: INDEXNOW_KEY,
    keyLocation: INDEXNOW_KEY_LOCATION,
    urlList: urlList,
  };

  try {
    const response = await fetch(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    // 200: OK, 202: Accepted
    if (response.status === 200 || response.status === 202) {
      console.log(`[IndexNow] Successfully submitted ${urlList.length} URL(s) to IndexNow (Status: ${response.status})`);
      return true;
    } else {
      const text = await response.text().catch(() => '');
      console.warn(`[IndexNow] Submission returned status ${response.status}: ${text}`);
      return false;
    }
  } catch (error) {
    console.error(`[IndexNow] Submission failed: ${error.message}`);
    return false;
  }
}
