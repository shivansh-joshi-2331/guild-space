import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { presenceChannel } from '../lib/supabase';

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
      myId: 'user-1', // Fallback
      myPosition: { x: 32, y: 18, direction: 'right' },
      myRoom: 'center',
      players: {}, // Map of other players
      
      login: (username) => {
        // Case-insensitive login
        const normalizedUsername = Object.keys(PREDEFINED_USERS).find(
          key => key.toLowerCase() === username.toLowerCase()
        );

        if (normalizedUsername) {
          const user = PREDEFINED_USERS[normalizedUsername];
          const spawn = SPAWN_POINTS[user.cabinId];
          
          set({ 
            currentUser: user,
            myId: user.id, // override myId
            myPosition: { x: spawn.x, y: spawn.y, direction: 'right' }
          });
          
          get().initPresence();
          return true;
        }
        return false;
      },

      initPresence: () => {
        const { currentUser, myPosition } = get();
        if (!currentUser) return;
        
        presenceChannel
          .on('presence', { event: 'sync' }, () => {
             const state = presenceChannel.presenceState();
             const updatedPlayers = {};
             for (const id in state) {
                if (state[id].length > 0) {
                  const p = state[id][0];
                  // Don't add ourselves to the remote players list
                  if (p.member_id !== currentUser.id) {
                     updatedPlayers[p.member_id] = { position: p.position, name: p.name, color: p.color };
                  }
                }
             }
             set({ players: updatedPlayers });
          })
          .subscribe(async (status) => {
             if (status === 'SUBSCRIBED') {
                await presenceChannel.track({
                  member_id: currentUser.id, name: currentUser.name, color: currentUser.color,
                  position: myPosition
                });
             }
          });
      },

      logout: () => {
        presenceChannel.untrack();
        set({ currentUser: null, players: {} });
      },
      
      setMyPosition: (x, y, direction) => {
        const newPos = { x, y, direction: direction || get().myPosition.direction };
        set({ myPosition: newPos });
        
        const { currentUser } = get();
        if (currentUser && presenceChannel.state === 'joined') {
           // Broadcast new position to other players
           presenceChannel.track({
              member_id: currentUser.id, name: currentUser.name, color: currentUser.color,
              position: newPos
           });
        }
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

