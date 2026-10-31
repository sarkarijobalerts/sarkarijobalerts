import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function getFeaturedImagePath() {
  const possiblePaths = [
    path.resolve(__dirname, '../../sarkari job.jpg'),
    path.resolve(__dirname, '../sarkari-job.jpg'),
    path.resolve(__dirname, '../../frontend/public/sarkari-job.jpg'),
  ];
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

export async function sendFacebookPost(jobData) {
  const pageId = process.env.FACEBOOK_PAGE_ID;
  const accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
  const groupId = process.env.FACEBOOK_GROUP_ID;

  if (!pageId || !accessToken) {
    console.warn('[Facebook Warning] FACEBOOK_PAGE_ID or FACEBOOK_PAGE_ACCESS_TOKEN missing in environment variables. Skipping Facebook post.');
    return null;
  }

  const title = jobData.rewrittenTitle || jobData.title;
  const shortInfo = jobData.shortInfo || '';
  const url = `https://sarkarijobalerts.com/job/${jobData.slug || ''}/`;

  const caption = `🚨 New Job Alert: ${title}\n\n${shortInfo.substring(0, 160)}...\n\n👉 Apply Online & Full Details: ${url}`;
  
  let results = { pagePost: null, groupPost: null };
  const imagePath = getFeaturedImagePath();

  // 1. Post to Facebook Page
  try {
    console.log(`[Facebook Service] Posting to page ${pageId}: "${title}" (with featured image: ${imagePath ? 'YES' : 'NO'})...`);
    let response;

    if (imagePath) {
      // Upload as full-width photo post with featured image attached
      const fileBuffer = fs.readFileSync(imagePath);
      const blob = new Blob([fileBuffer], { type: 'image/jpeg' });
      const formData = new FormData();
      formData.append('source', blob, 'sarkari-job.jpg');
      formData.append('caption', caption);
      formData.append('access_token', accessToken);

      response = await fetch(`https://graph.facebook.com/v19.0/${pageId}/photos`, {
        method: 'POST',
        body: formData,
      });
    } else {
      // Fallback to link share
      response = await fetch(`https://graph.facebook.com/v19.0/${pageId}/feed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: caption, link: url, access_token: accessToken }),
      });
    }

    const data = await response.json();
    if (response.ok) {
      const postId = data.post_id || data.id;
      console.log(`[Facebook Service] Message successfully posted to Facebook Page! Post ID: ${postId}`);
      results.pagePost = data;
    } else {
      console.error(`[Facebook Error] Page API returned error:`, data);
      if (data?.error?.code === 190) {
        console.error(`\n⚠️  [Facebook Token Alert] Your Facebook Page Access Token has expired or lacks the required page permissions (pages_manage_posts, pages_read_engagement).`);
        console.error(`👉 Please generate a fresh never-expiring Page Access Token from Meta Graph API Explorer and update FACEBOOK_PAGE_ACCESS_TOKEN in backend/.env & GitHub Secrets.\n`);
      }
    }
  } catch (error) {
    console.error(`[Facebook Exception] Failed to send Facebook Page message: ${error.message}`);
  }

  // 2. Post to Facebook Group (only if a distinct numeric group ID is provided)
  const isDuplicatePageHandle = groupId && (
    groupId.toLowerCase() === 'sarkarijobalertscom' ||
    groupId === pageId
  );

  if (groupId && !isDuplicatePageHandle && /^\d+$/.test(groupId)) {
    try {
      console.log(`[Facebook Service] Posting to group ${groupId}: "${title}"...`);
      let response;
      if (imagePath) {
        const fileBuffer = fs.readFileSync(imagePath);
        const blob = new Blob([fileBuffer], { type: 'image/jpeg' });
        const formData = new FormData();
        formData.append('source', blob, 'sarkari-job.jpg');
        formData.append('caption', caption);
        formData.append('access_token', accessToken);

        response = await fetch(`https://graph.facebook.com/v19.0/${groupId}/photos`, {
          method: 'POST',
          body: formData,
        });
      } else {
        response = await fetch(`https://graph.facebook.com/v19.0/${groupId}/feed`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: caption, link: url, access_token: accessToken }),
        });
      }

      const data = await response.json();
      if (response.ok) {
        const postId = data.post_id || data.id;
        console.log(`[Facebook Service] Message successfully posted to Facebook Group! Post ID: ${postId}`);
        results.groupPost = data;
      } else {
        console.error(`[Facebook Error] Group API returned error:`, data);
      }
    } catch (error) {
      console.error(`[Facebook Exception] Failed to send Facebook Group message: ${error.message}`);
    }
  }

  return {
    ...results,
    id: results.pagePost ? (results.pagePost.post_id || results.pagePost.id) : (results.groupPost ? (results.groupPost.post_id || results.groupPost.id) : null),
  };
}
