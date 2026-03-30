import { useEffect, useState, useRef } from 'react';
import GameCanvas from './components/GameCanvas';
import HUD from './components/HUD';
import TaskDashboard from './components/TaskDashboard';
import NotificationPrompt from './components/NotificationPrompt';
import LoginScreen from './components/LoginScreen';
import { useGameStore } from './store/useGameStore';
import { useTaskStore } from './store/useTaskStore';
import { notificationsChannel } from './lib/supabase';

function App() {
  const { currentUser } = useGameStore();
  const { tasks } = useTaskStore();
  const [toast, setToast] = useState(null);
  const prevTasksRef = useRef(tasks);

  useEffect(() => {
    const handleNotification = (e) => {
      setToast(e.detail.message);
      setTimeout(() => setToast(null), 3500);
    };
    window.addEventListener('in-game-notification', handleNotification);
    return () => window.removeEventListener('in-game-notification', handleNotification);
  }, []);

  useEffect(() => {
    if (currentUser) {
      useGameStore.getState().initPresence();
      useTaskStore.getState().subscribeToTasks();
      
      notificationsChannel.on('broadcast', { event: 'knock' }, ({ payload }) => {
        if (payload.ownerId === currentUser.id) {
          window.dispatchEvent(new CustomEvent('in-game-notification', {
            detail: { message: `🔔 *BANG* ${payload.knockerName} is aggressively knocking on your door!` }
          }));
        }
      }).subscribe();
    }
  }, [currentUser]);

  if (!currentUser) {
    return <LoginScreen />;
  }

  return (
    <div className="w-screen h-screen bg-bg-base overflow-hidden relative font-pixel text-text-primary">
      <div className="scanlines"></div>
      
      {toast && (
        <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-bg-wall-side border-4 border-accent-gold text-accent-gold p-4 z-[200] text-sm animate-bounce shadow-[0_0_20px_rgba(245,197,24,0.5)]">
          {toast}
        </div>
      )}

      <NotificationPrompt />
      <HUD />
      <GameCanvas />
      <TaskDashboard />
    </div>
  );
}

export default App;
