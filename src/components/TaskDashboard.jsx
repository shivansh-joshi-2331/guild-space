import { useState } from 'react';
import { useTaskStore } from '../store/useTaskStore';
import { useGameStore } from '../store/useGameStore';
import TaskCard from './TaskCard';

const COLUMNS = [
  { id: 'backlog', title: 'BACKLOG', color: 'text-text-muted' },
  { id: 'in_progress', title: 'IN PROGRESS', color: 'text-accent-gold' },
  { id: 'blocked', title: 'BLOCKED', color: 'text-accent-red' },
  { id: 'done', title: 'DONE', color: 'text-accent-green' }
];

export default function TaskDashboard() {
  const { tasks, isDashboardOpen, isPinned, toggleDashboard, togglePin, updateTaskStatus, addTask } = useTaskStore();
  const { currentUser } = useGameStore();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('user-h');

  if (!isDashboardOpen || !currentUser) return null;

  const isLead = currentUser.role === 'lead';
  
  // Filter tasks based on role
  const visibleTasks = isLead 
    ? tasks 
    : tasks.filter(t => t.assigned_to === currentUser.id);

  const handleDragOver = (e) => e.preventDefault();
  
  const handleDrop = (e, status) => {
    e.preventDefault();
    const taskId = parseInt(e.dataTransfer.getData('taskId'));
    if (!isNaN(taskId)) updateTaskStatus(taskId, status);
  };

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    addTask({ title: newTaskTitle, assigned_to: newTaskAssignee, priority: 'medium' });
    setNewTaskTitle('');
  };

  const dashboardClasses = isPinned 
    ? "fixed bottom-0 right-0 w-[400px] h-[50vh] bg-bg-base/90 border-t-4 border-l-4 border-accent-red z-50 flex flex-col pointer-events-auto"
    : "fixed inset-8 bg-bg-base border-4 border-accent-red z-50 flex flex-col pointer-events-auto shadow-2xl drop-shadow-2xl";

  return (
    <div className={dashboardClasses}>
      {/* Header */}
      <div className="bg-accent-red text-white p-2 flex justify-between items-center pixel-shadow border-b-4 border-black">
        <h2 className="text-sm">⚠ {isLead ? 'LEAD DASHBOARD' : 'YOUR TASKS'}</h2>
        <div className="flex gap-4">
          <button onClick={togglePin} className="hover:text-amber-200">
            {isPinned ? '[UNPIN]' : '[PIN]'}
          </button>
          {!isPinned && (
            <button onClick={toggleDashboard} className="hover:text-amber-200">
              [X]
            </button>
          )}
        </div>
      </div>
      
      {/* Lead Task Creation Form */}
      {isLead && (
        <form onSubmit={handleCreateTask} className="p-2 border-b-2 border-slate-700 bg-bg-wall-side flex gap-2">
          <input 
            type="text" 
            placeholder="New Task..." 
            className="flex-1 bg-black text-white text-[10px] p-2 border-2 border-slate-600 focus:outline-none focus:border-accent-gold"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
          />
          <select 
            className="bg-black text-white text-[10px] p-2 border-2 border-slate-600 outline-none"
            value={newTaskAssignee}
            onChange={(e) => setNewTaskAssignee(e.target.value)}
          >
            <option value="user-h">Harshil</option>
            <option value="user-t">Twisha</option>
            <option value="user-m">Meet</option>
            <option value="user-s">Shivansh</option>
          </select>
          <button type="submit" className="bg-accent-green hover:bg-green-500 text-black px-2 text-[10px] border-2 border-black pixel-shadow">
            [+]
          </button>
        </form>
      )}

      {/* Board Columns */}
      <div className={`flex flex-1 overflow-x-auto p-4 gap-4 ${isPinned ? 'flex-col overflow-y-auto' : 'flex-row'}`}>
        {COLUMNS.map(col => (
          <div 
            key={col.id} 
            className={`flex-1 min-w-[250px] bg-bg-room border-2 border-slate-700 flex flex-col ${isPinned ? 'w-full min-h-[150px]' : ''}`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.id)}
          >
            <div className={`p-2 border-b-2 border-slate-700 text-[10px] ${col.color}`}>
              {col.title} {isLead && `(${visibleTasks.filter(t => t.status === col.id).length})`}
            </div>
            <div className="p-2 flex-1 flex flex-col gap-2 overflow-y-auto">
              {visibleTasks.filter(t => t.status === col.id).map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
