import { useEffect, useState, useRef } from 'react';
import GameCanvas from './components/GameCanvas';
import HUD from './components/HUD';
import TaskDashboard from './components/TaskDashboard';
import NotificationPrompt from './components/NotificationPrompt';
import LoginScreen from './components/LoginScreen';
import { useGameStore } from './store/useGameStore';
import { useTaskStore } from './store/useTaskStore';

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
    }
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    
    const prevTasks = prevTasksRef.current;
    
    // Find new tasks assigned to me
    const newTasks = tasks.filter(t => t.assigned_to === currentUser.id && Array.isArray(prevTasks) && !prevTasks.find(pt => pt.id === t.id));
    if (newTasks.length > 0) {
       window.dispatchEvent(new CustomEvent('in-game-notification', {
        detail: { message: `✅ NEW TASK ASSIGNED: ${newTasks[0].title}` }
       }));
    }

    // Find tasks assigned to me that changed status
    if (Array.isArray(prevTasks)) {
      const statusChangedTasks = tasks.filter(t => t.assigned_to === currentUser.id && prevTasks.find(pt => pt.id === t.id && pt.status !== t.status));
      if (statusChangedTasks.length > 0) {
         window.dispatchEvent(new CustomEvent('in-game-notification', {
          detail: { message: `🔄 TASK UPDATE: '${statusChangedTasks[0].title}' moved to ${statusChangedTasks[0].status.replace('_', ' ').toUpperCase()}` }
         }));
      }
    }

    prevTasksRef.current = tasks;
  }, [tasks, currentUser]);

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
