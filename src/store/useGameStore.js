import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { presenceChannel, notificationsChannel, supabase } from '../lib/supabase';

const PREDEFINED_USERS = {
  'Harshil': { id: 'user-h', name: 'Harshil', role: 'lead', color: '#d7263d', cabinId: 'cabin-tl' },
  'Twisha': { id: 'user-t', name: 'Twisha', role: 'designer', color: '#4ade80', cabinId: 'cabin-tr' },
  'Meet': { id: 'user-m', name: 'Meet', role: 'designer', color: '#f5c518', cabinId: 'cabin-bl' },
  'Shivansh': { id: 'user-s', name: 'Shivansh', role: 'designer', color: '#3b82f6', cabinId: 'cabin-br' },
};

const SPAWN_POINTS = {
  'cabin-tl': { x: 8, y: 8 },
  'cabin-tr': { x: 56, y: 8 },
  'cabin-bl': { x: 8, y: 28 },
  'cabin-br': { x: 56, y: 28 },
};

export const useGameStore = create(
  persist(
    (set, get) => ({
      currentUser: null,
      myId: 'user-1',
      myPosition: { x: 32, y: 18, direction: 'right' },
      myRoom: 'center',
      players: {},
      chatBubbles: {},
      focusMode: false,
      isAfk: false,
      deskUrls: {},
      
      login: (username) => {
        const normalizedUsername = Object.keys(PREDEFINED_USERS).find(
          key => key.toLowerCase() === username.toLowerCase()
        );
        if (normalizedUsername) {
          const user = PREDEFINED_USERS[normalizedUsername];
          const spawn = SPAWN_POINTS[user.cabinId];
          set({ 
            currentUser: user,
            myId: user.id,
            myPosition: { x: spawn.x, y: spawn.y, direction: 'right' },
            focusMode: false,
            isAfk: false,
          });
          get().initPresence();
          get().fetchDeskUrls();
          return true;
        }
        return false;
      },

      _presenceInitialized: false,
      initPresence: () => {
        const { currentUser, myPosition } = get();
        if (!currentUser || get()._presenceInitialized) return;
        set({ _presenceInitialized: true });
        
        presenceChannel
          .on('presence', { event: 'sync' }, () => {
             const state = presenceChannel.presenceState();
             const updatedPlayers = {};
             for (const id in state) {
                if (state[id].length > 0) {
                  const p = state[id][0];
                  if (p.member_id !== currentUser.id) {
                     updatedPlayers[p.member_id] = {
                       position: p.position, name: p.name, color: p.color,
                       member_id: p.member_id,
                       focusMode: p.focusMode || false,
                       isAfk: p.isAfk || false,
                     };
                  }
                }
             }
             set({ players: updatedPlayers });
          })
          .subscribe(async (status) => {
             if (status === 'SUBSCRIBED') {
                await presenceChannel.track({
                  member_id: currentUser.id, name: currentUser.name, color: currentUser.color,
                  position: myPosition, focusMode: false, isAfk: false,
                });
             }
          });
      },

      logout: () => {
        presenceChannel.untrack();
        set({ currentUser: null, players: {}, chatBubbles: {}, focusMode: false, isAfk: false, _presenceInitialized: false });
      },
      
      setMyPosition: (x, y, direction) => {
        const newPos = { x, y, direction: direction || get().myPosition.direction };
        set({ myPosition: newPos });
        
        const { currentUser, focusMode, isAfk } = get();
        if (currentUser && presenceChannel.state === 'joined') {
           presenceChannel.track({
              member_id: currentUser.id, name: currentUser.name, color: currentUser.color,
              position: newPos, focusMode, isAfk,
           });
        }
      },

      // Chat
      sendChat: (message) => {
        const { currentUser } = get();
        if (!currentUser) return;
        
        // Show locally
        set((state) => ({
          chatBubbles: { ...state.chatBubbles, [currentUser.id]: { message, timestamp: Date.now() } }
        }));
        setTimeout(() => {
          set((state) => {
            const updated = { ...state.chatBubbles };
            delete updated[currentUser.id];
            return { chatBubbles: updated };
          });
        }, 5000);

        notificationsChannel.send({
          type: 'broadcast', event: 'chat',
          payload: { senderId: currentUser.id, senderName: currentUser.name, message }
        });
      },

      receiveChatBubble: (senderId, message) => {
        set((state) => ({
          chatBubbles: { ...state.chatBubbles, [senderId]: { message, timestamp: Date.now() } }
        }));
        setTimeout(() => {
          set((state) => {
            const updated = { ...state.chatBubbles };
            delete updated[senderId];
            return { chatBubbles: updated };
          });
        }, 5000);
      },

      // Focus Mode
      toggleFocusMode: () => {
        const newFocus = !get().focusMode;
        set({ focusMode: newFocus });
        const { currentUser, myPosition, isAfk } = get();
        if (currentUser && presenceChannel.state === 'joined') {
          presenceChannel.track({
            member_id: currentUser.id, name: currentUser.name, color: currentUser.color,
            position: myPosition, focusMode: newFocus, isAfk,
          });
        }
        window.dispatchEvent(new CustomEvent('in-game-notification', {
          detail: { message: newFocus ? '🔒 Deep Focus Mode ON — Your cabin is locked!' : '🔓 Focus Mode OFF — Door unlocked!' }
        }));
      },

      // AFK
      setAfk: (afk) => {
        if (get().isAfk === afk) return;
        set({ isAfk: afk });
        const { currentUser, myPosition, focusMode } = get();
        if (currentUser && presenceChannel.state === 'joined') {
          presenceChannel.track({
            member_id: currentUser.id, name: currentUser.name, color: currentUser.color,
            position: myPosition, focusMode, isAfk: afk,
          });
        }
      },

      // Desk Portals
      fetchDeskUrls: async () => {
        const { data } = await supabase.from('desks').select('*');
        if (data) {
          const urls = {};
          data.forEach(d => { urls[d.id] = d.figma_url; });
          set({ deskUrls: urls });
        }
      },

      setDeskUrl: async (ownerId, url) => {
        await supabase.from('desks').upsert({ id: ownerId, figma_url: url, updated_at: new Date().toISOString() });
        set((state) => ({ deskUrls: { ...state.deskUrls, [ownerId]: url } }));
      },
      
      setMyRoom: (room) => set({ myRoom: room }),
      setPlayers: (players) => set({ players })
    }),
    {
      name: 'guild-game-storage',
      partialize: (state) => ({ currentUser: state.currentUser, myId: state.myId, myPosition: state.myPosition }),
    }
  )
);
