import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export const useTaskStore = create((set, get) => ({
  tasks: [],
  isDashboardOpen: false,
  isPinned: false,

  toggleDashboard: () => set((state) => ({ isDashboardOpen: !state.isDashboardOpen })),
  setDashboardOpen: (isOpen) => set({ isDashboardOpen: isOpen }),
  togglePin: () => set((state) => {
    const newPinned = !state.isPinned;
    localStorage.setItem('guild-task-pinned', newPinned);
    return { isPinned: newPinned };
  }),
  
  // Database fetch & sync
  fetchTasks: async () => {
    const { data, error } = await supabase.from('tasks').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      set({ tasks: data });
    }
  },

  subscribeToTasks: () => {
    get().fetchTasks();
    
    // Listen for any changes on the 'tasks' table
    supabase.channel('public:tasks')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, (payload) => {
         get().fetchTasks(); // Refresh list intelligently
      })
      .subscribe();
  },

  updateTaskStatus: async (id, newStatus) => {
    // Optimistic UI update
    set((state) => ({
      tasks: state.tasks.map(t => t.id === id ? { ...t, status: newStatus } : t)
    }));
    // Supabase backend update
    await supabase.from('tasks').update({ status: newStatus }).eq('id', id);
  },
  
  addTask: async (newTask) => {
    await supabase.from('tasks').insert([{
      title: newTask.title,
      assigned_to: newTask.assigned_to,
      priority: newTask.priority,
      status: 'backlog',
      project_tag: newTask.project_tag || 'General',
      due_date: newTask.due_date || null
    }]);
  },

  // Hydrate pinned state on load
  initStore: () => {
    const pinned = localStorage.getItem('guild-task-pinned') === 'true';
    if (pinned) {
      set({ isPinned: true, isDashboardOpen: true });
    }
  }
}));
