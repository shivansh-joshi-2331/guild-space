// lib/pushNotifications.js

// Using VAPID public key
const PUBLIC_VAPID_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY || 'mock-vapid-key';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export async function subscribeUserToPush() {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered');

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY)
      });
      
      console.log('User is subscribed:', subscription);
      // Here we would send the subscription to Supabase
      return subscription;
    } catch (err) {
      console.error('Failed to subscribe to push notifications', err);
    }
  } else {
    console.warn('Push notifications are not supported by this browser.');
  }
}

export async function askNotificationPermission() {
  return new Promise((resolve, reject) => {
    const permissionResult = Notification.requestPermission(function(result) {
      resolve(result);
    });
    if (permissionResult) {
      permissionResult.then(resolve, reject);
    }
  }).then((permissionResult) => {
    if (permissionResult !== 'granted') {
      throw new Error("We weren't granted permission.");
    }
    return subscribeUserToPush();
  });
}
