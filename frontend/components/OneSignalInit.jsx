'use client';

import { useEffect } from 'react';
import OneSignal from 'react-onesignal';

export default function OneSignalInit() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const appId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID || '48d3f0b1-fb96-4602-ba79-8ed3bf592e10';

      OneSignal.init({
        appId: appId,
        allowLocalhostAsSecureOrigin: true,
        notifyButton: {
          enable: true,
        },
        serviceWorkerParam: {
          scope: '/',
        },
        serviceWorkerPath: 'OneSignalSDKWorker.js',
        scriptSrc: 'https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js',
      })
        .then(() => {
          console.log('[OneSignal Client] Web Push SDK Initialized successfully.');
        })
        .catch((error) => {
          console.warn('[OneSignal Client] Initialization note:', error?.message || error);
        });
    }
  }, []);

  return null;
}
