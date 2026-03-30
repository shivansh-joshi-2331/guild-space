import { useEffect } from 'react';
import { useTaskStore } from '../store/useTaskStore';
import { useGameStore } from '../store/useGameStore';

export default function HUD() {
  const { toggleDashboard, initStore, tasks } = useTaskStore();
  const { myPosition, players, currentUser } = useGameStore();

  useEffect(() => {
    initStore(); // Load pinned state

    const handleKeyDown = (e) => {
      if (e.code === 'KeyT') {
        toggleDashboard();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleDashboard, initStore]);

  const onlineCount = Object.keys(players).length + 1; // +1 for self

  const visibleTasks = currentUser?.role === 'lead' ? tasks : tasks.filter(t => t.assigned_to === currentUser?.id);
  const totalTasks = visibleTasks.length;
  
  const backlogCount = visibleTasks.filter(t => t.status === 'backlog').length;
  const inProgressCount = visibleTasks.filter(t => t.status === 'in_progress').length;
  const blockedCount = visibleTasks.filter(t => t.status === 'blocked').length;
  const doneCount = visibleTasks.filter(t => t.status === 'done').length;

  return (
    <>
      {/* Top Left: Task Bar */}
      <div className="absolute top-4 left-4 z-50 group">
        <div className="bg-black/80 border-4 border-[#3a3a3a] p-1 flex flex-col gap-1 w-80">
          <h1 className="text-white text-[10px] tracking-widest pl-1">TASKS ({totalTasks})</h1>
          <div className="h-4 border-2 border-[#1c1c1c] bg-[#1a1a1a] w-full flex">
             {totalTasks > 0 && (
               <>
                 {backlogCount > 0 && <div className="h-full bg-slate-500 hover:brightness-125 transition-all relative group/segment" style={{ width: `${(backlogCount/totalTasks)*100}%`}}>
                     <span className="absolute top-6 left-1/2 -translate-x-1/2 bg-black px-2 py-1 text-[8px] text-white opacity-0 group-hover/segment:opacity-100 z-50 pointer-events-none whitespace-nowrap border border-slate-600 shadow-md">Backlog: {backlogCount}</span>
                 </div>}
                 {inProgressCount > 0 && <div className="h-full bg-amber-400 hover:brightness-125 transition-all relative group/segment" style={{ width: `${(inProgressCount/totalTasks)*100}%`}}>
                     <span className="absolute top-6 left-1/2 -translate-x-1/2 bg-black px-2 py-1 text-[8px] text-white opacity-0 group-hover/segment:opacity-100 z-50 pointer-events-none whitespace-nowrap border border-slate-600 shadow-md">In Progress: {inProgressCount}</span>
                 </div>}
                 {blockedCount > 0 && <div className="h-full bg-red-500 hover:brightness-125 transition-all relative group/segment" style={{ width: `${(blockedCount/totalTasks)*100}%`}}>
                     <span className="absolute top-6 left-1/2 -translate-x-1/2 bg-black px-2 py-1 text-[8px] text-white opacity-0 group-hover/segment:opacity-100 z-50 pointer-events-none whitespace-nowrap border border-slate-600 shadow-md">Blocked: {blockedCount}</span>
                 </div>}
                 {doneCount > 0 && <div className="h-full bg-green-500 hover:brightness-125 transition-all relative group/segment" style={{ width: `${(doneCount/totalTasks)*100}%`}}>
                     <span className="absolute top-6 left-1/2 -translate-x-1/2 bg-black px-2 py-1 text-[8px] text-white opacity-0 group-hover/segment:opacity-100 z-50 pointer-events-none whitespace-nowrap border border-slate-600 shadow-md">Done: {doneCount}</span>
                 </div>}
               </>
             )}
          </div>
        </div>
      </div>

      {/* Top Right: Status */}
      <div className="absolute top-4 right-4 z-50 flex flex-col items-end gap-2 text-[8px]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-text-primary px-2 py-1 bg-black/50 pixel-corners border border-slate-700">
            [{onlineCount}/8 ONLINE]
          </span>
        </div>
        
        <button 
          onClick={useGameStore.getState().logout}
          className="bg-accent-red hover:bg-red-500 text-white px-2 py-1 border-2 border-black pixel-shadow active:translate-y-[2px] active:shadow-none"
        >
          LOG EXIT
        </button>
      </div>

      {/* Bottom Center: Hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
        <div className="text-text-muted text-[8px] tracking-widest bg-black/80 px-4 py-2 pixel-corners border border-slate-700 animate-pulse">
          [WASD] MOVE &nbsp;&nbsp;&nbsp; [T] TASKS
        </div>
      </div>

      {/* Minimap Placeholder (Bottom Left) */}
      <div className="absolute bottom-4 left-4 z-50 w-32 h-24 bg-black/80 border-2 border-slate-700 pixel-corners flex items-center justify-center opacity-80">
        <span className="text-[6px] text-text-muted">MINIMAP</span>
        {/* Simple dot for me */}
        <div 
          className="absolute w-1 h-1 bg-white"
          style={{
            left: `${(myPosition.x / 32) * 100}%`,
            top: `${(myPosition.y / 24) * 100}%`
          }}
        />
      </div>
    </>
  );
}
