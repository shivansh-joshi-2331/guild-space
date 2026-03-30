import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mock-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'mock-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Realtime Channels
 */
export const presenceChannel = supabase.channel('guild-space-presence');
export const notificationsChannel = supabase.channel('guild-space-notifications', {
  config: { broadcast: { ack: true } }
});

export const joinPresence = (memberId, position, roomId) => {
  return presenceChannel.subscribe(async (status) => {
    if (status === 'SUBSCRIBED') {
      await presenceChannel.track({
        member_id: memberId,
        position,
        room_id: roomId,
        last_seen: new Date().toISOString()
      });
    }
  });
};
