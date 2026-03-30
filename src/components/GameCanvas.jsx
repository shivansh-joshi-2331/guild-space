import { useState, useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import { useMovement } from '../hooks/useMovement';
import Character from './Character';
import { motion } from 'framer-motion';
import { TILE_SIZE, MAP_WIDTH_TILES, MAP_HEIGHT_TILES, WALLS, DOORS, DESKS } from '../utils/mapGeometry';
import { notificationsChannel } from '../lib/supabase';

export default function GameCanvas() {
  const { myPosition, players, currentUser, chatBubbles, sendChat } = useGameStore();
  const [chatOpen, setChatOpen] = useState(false);
  const [chatText, setChatText] = useState('');
  useMovement();

  useEffect(() => {
    const handleKey = (e) => {
      if (e.code === 'Enter' && !chatOpen) {
        e.preventDefault();
        setChatOpen(true);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [chatOpen]);

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (chatText.trim()) {
      sendChat(chatText.trim());
      setChatText('');
    }
    setChatOpen(false);
  };

  return (
    <div className="w-full h-full flex items-center justify-center bg-black overflow-hidden relative">
      <motion.div 
        className="absolute"
        animate={{
          x: `calc(50vw - ${(myPosition.x + 0.5) * TILE_SIZE}px)`,
          y: `calc(50vh - ${(myPosition.y + 0.5) * TILE_SIZE}px)`
        }}
        transition={{ type: 'tween', duration: 0 }}
        style={{
          width: MAP_WIDTH_TILES * TILE_SIZE,
          height: MAP_HEIGHT_TILES * TILE_SIZE,
        }}
      >
        {/* FLOOR */}
        <div className="absolute inset-0 map-floor" />

        {/* MAP GEOMETRY */}
        {WALLS.map((wall, i) => (
          <div 
            key={`wall-${i}`}
            className="absolute map-wall z-10"
            style={{
              left: wall.x * TILE_SIZE,
              top: wall.y * TILE_SIZE,
              width: wall.w * TILE_SIZE,
              height: wall.h * TILE_SIZE
            }}
          />
        ))}

        {/* DOORS */}
        {Object.values(DOORS).map((door, i) => {
          const ownerPlayer = Object.values(players).find(p => p.member_id === door.ownerId);
          const isFocused = ownerPlayer?.focusMode || (currentUser?.id === door.ownerId && useGameStore.getState().focusMode);
          return (
            <div
              key={`door-${i}`}
              className={`absolute border-2 z-10 flex items-center justify-center pixel-shadow ${isFocused ? 'bg-red-900/80 border-red-500' : 'bg-slate-800/80 border-slate-600'}`}
              style={{
                left: door.x * TILE_SIZE,
                top: door.y * TILE_SIZE,
                width: door.w * TILE_SIZE,
                height: door.h * TILE_SIZE
              }}
            >
              <span className={`text-[6px] rotate-90 opacity-70 font-pixel ${isFocused ? 'text-red-300' : 'text-white opacity-50'}`}>
                {isFocused ? '🔒 DND' : 'DOOR'}
              </span>
            </div>
          );
        })}
        
        {/* DESKS */}
        {DESKS.map((desk, i) => (
          <div
            key={`desk-${i}`}
            className="absolute z-10 bg-amber-900/60 border-2 border-amber-700 flex items-center justify-center pixel-shadow"
            style={{
              left: desk.x * TILE_SIZE,
              top: desk.y * TILE_SIZE,
              width: desk.w * TILE_SIZE,
              height: desk.h * TILE_SIZE
            }}
          >
            <span className="text-[8px] text-amber-300 font-pixel">🖥️</span>
          </div>
        ))}

        {/* Floor Text Overlays */}
        {Object.values(DOORS).map((door, i) => {
          const isLeft = door.x < 32;
          const isTop = door.y < 18;
          return (
            <div 
              key={`label-${i}`}
              className="absolute text-white/30 font-pixel drop-shadow-md pixel-shadow pointer-events-none text-2xl"
              style={{
                left: (isLeft ? 8 : 46) * TILE_SIZE,
                top: (isTop ? 6 : 26) * TILE_SIZE,
              }}
            >
              {door.ownerName}'s Cabin
            </div>
          );
        })}

        <div className="absolute text-white/30 font-pixel drop-shadow-md pixel-shadow pointer-events-none text-xl"
             style={{ left: 30 * TILE_SIZE, top: 18 * TILE_SIZE }}>
          HALLWAY
        </div>

        {/* LOCAL CHARACTER */}
        {myPosition && (
          <Character 
            x={myPosition.x} 
            y={myPosition.y} 
            name={currentUser?.name || "Red"} 
            color={currentUser?.color || "#d7263d"} 
            direction={myPosition.direction}
            chatMessage={chatBubbles?.[currentUser?.id]?.message}
            isAfk={useGameStore.getState().isAfk}
            isFocused={useGameStore.getState().focusMode}
          />
        )}

        {/* REMOTE PLAYERS */}
        {Object.entries(players).map(([id, player]) => (
          <Character
            key={id}
            x={player.position?.x || 0}
            y={player.position?.y || 0}
            name={player.name || 'Unknown'}
            color={player.color || '#888'}
            direction={player.position?.direction || 'right'}
            chatMessage={chatBubbles?.[id]?.message}
            isAfk={player.isAfk}
            isFocused={player.focusMode}
          />
        ))}
      </motion.div>

      {/* CHAT INPUT BAR */}
      {chatOpen && (
        <form onSubmit={handleChatSubmit} className="absolute bottom-12 left-1/2 -translate-x-1/2 z-[200] w-80">
          <input
            autoFocus
            value={chatText}
            onChange={(e) => setChatText(e.target.value)}
            onKeyDown={(e) => { if (e.code === 'Escape') setChatOpen(false); }}
            placeholder="Type a message..."
            className="w-full bg-black/90 border-2 border-accent-gold text-white px-3 py-2 text-xs font-pixel focus:outline-none"
            maxLength={100}
          />
        </form>
      )}
    </div>
  );
}
