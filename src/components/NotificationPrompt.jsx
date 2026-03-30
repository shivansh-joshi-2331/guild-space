import { useState } from 'react';
import { askNotificationPermission } from '../lib/pushNotifications';

export default function NotificationPrompt() {
  const [denied, setDenied] = useState(Notification.permission === 'denied');
  const [granted, setGranted] = useState(Notification.permission === 'granted');

  const handleRequest = async () => {
    try {
      await askNotificationPermission();
      setGranted(true);
    } catch {
      setDenied(true);
    }
  };

  if (granted || denied) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center pointer-events-auto">
      <div className="bg-bg-room border-4 border-accent-gold p-6 max-w-md w-full pixel-shadow text-center">
        <h2 className="text-accent-gold text-sm drop-shadow-md mb-4">INCOMING TRANSMISSION...</h2>
        <p className="text-[10px] text-text-primary leading-loose mb-6">
          Guild Space wants to send you mission alerts and visitor notifications.
        </p>
        <div className="flex gap-4 justify-center">
          <button 
            onClick={handleRequest}
            className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 border-2 text-[8px] border-black pixel-shadow active:translate-y-[2px] active:shadow-none"
          >
            [ ACCEPT ]
          </button>
          <button 
            onClick={() => setDenied(true)}
            className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 border-2 text-[8px] border-black pixel-shadow active:translate-y-[2px] active:shadow-none"
          >
            [ REJECT ]
          </button>
        </div>
      </div>
    </div>
  );
}
