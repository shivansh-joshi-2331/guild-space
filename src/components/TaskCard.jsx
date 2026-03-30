export default function TaskCard({ task }) {
  const handleDragStart = (e) => {
    e.dataTransfer.setData('taskId', task.id);
  };

  const getPriorityColor = () => {
    switch(task.priority) {
      case 'critical': return 'bg-accent-red';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-accent-gold';
      default: return 'bg-green-500';
    }
  };

  return (
    <div 
      draggable
      onDragStart={handleDragStart}
      className="relative bg-bg-floor border border-slate-600 p-2 cursor-grab active:cursor-grabbing hover:border-slate-400 group pixel-shadow"
    >
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${getPriorityColor()}`} />
      
      <div className="pl-3">
        <h3 className="text-[10px] text-white leading-tight mb-2">{task.title}</h3>
        
        <div className="flex justify-between items-center text-[8px] text-text-muted mt-2 border-t border-slate-700 pt-2">
          {task.assigned_to && (
            <span className="text-accent-gold mr-2 uppercase tracking-tight">
              @{task.assigned_to.replace('user-h', 'Harshil').replace('user-t', 'Twisha').replace('user-m', 'Meet').replace('user-s', 'Shivansh')}
            </span>
          )}
          <span className="bg-slate-700 px-1 py-0.5 rounded-sm pixel-corners">{task.project_tag || 'General'}</span>
        </div>
      </div>
    </div>
  );
}
