/**
 * OneSignal REST API Push Notification Service
 * Sends automated Web Push Notifications to all subscribed users
 */

export async function sendPushNotification({ title, message, url }) {
  const appId = process.env.ONESIGNAL_APP_ID || '48d3f0b1-fb96-4602-ba79-8ed3bf592e10';
  const apiKey = process.env.ONESIGNAL_REST_API_KEY;

  if (!apiKey) {
    console.warn('[OneSignal Warning] ONESIGNAL_REST_API_KEY is missing in environment variables. Skipping push notification.');
    return null;
  }

  const payload = {
    app_id: appId,
    included_segments: ['Subscribed Users'],
    headings: { en: title || 'New Sarkari Job Alert' },
    contents: { en: message || 'A new government job notification has been published. Click to view details.' },
    url: url || 'https://sarkarijobalerts.com/',
  };

  try {
    console.log(`[OneSignal Service] Sending push notification: "${title}"...`);

    const response = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': `Basic ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (response.ok) {
      console.log(`[OneSignal Service] Push notification sent successfully! ID: ${data.id}, Recipients: ${data.recipients || 0}`);
      return data;
    } else {
      console.error(`[OneSignal Error] API returned status ${response.status}:`, data);
      return null;
    }
  } catch (error) {
    console.error(`[OneSignal Exception] Failed to send push notification: ${error.message}`);
    return null;
  }
}
