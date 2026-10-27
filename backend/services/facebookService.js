export async function sendFacebookPost(jobData) {
  const pageId = process.env.FACEBOOK_PAGE_ID;
  const accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
  const groupId = process.env.FACEBOOK_GROUP_ID; // Added for Facebook Group

  if (!pageId || !accessToken) {
    console.warn('[Facebook Warning] FACEBOOK_PAGE_ID or FACEBOOK_PAGE_ACCESS_TOKEN missing in environment variables. Skipping Facebook post.');
    return null;
  }

  const title = jobData.rewrittenTitle || jobData.title;
  const shortInfo = jobData.shortInfo || '';
  const url = `https://sarkarijobalerts.com/job/${jobData.slug || ''}/`;

  const message = `🚨 New Job Alert: ${title}\n\n${shortInfo.substring(0, 150)}...\n\nApply now: ${url}`;
  
  let results = { pagePost: null, groupPost: null };

  // 1. Post to Facebook Page
  try {
    console.log(`[Facebook Service] Posting to page ${pageId}: "${title}"...`);
    const response = await fetch(`https://graph.facebook.com/v19.0/${pageId}/feed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: message, link: url, access_token: accessToken }),
    });

    const data = await response.json();
    if (response.ok) {
      console.log(`[Facebook Service] Message successfully posted to Facebook Page! Post ID: ${data.id}`);
      results.pagePost = data;
    } else {
      console.error(`[Facebook Error] Page API returned error:`, data);
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
      const response = await fetch(`https://graph.facebook.com/v19.0/${groupId}/feed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message, link: url, access_token: accessToken }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log(`[Facebook Service] Message successfully posted to Facebook Group! Post ID: ${data.id}`);
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
    id: results.pagePost ? results.pagePost.id : (results.groupPost ? results.groupPost.id : null),
  };
}
