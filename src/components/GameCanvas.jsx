import { useGameStore } from '../store/useGameStore';
import { useMovement } from '../hooks/useMovement';
import Character from './Character';
import { motion } from 'framer-motion';
import { TILE_SIZE, MAP_WIDTH_TILES, MAP_HEIGHT_TILES, WALLS, DOORS } from '../utils/mapGeometry';

export default function GameCanvas() {
  const { myPosition } = useGameStore();
  useMovement();

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
        {Object.values(DOORS).map((door, i) => (
          <div
            key={`door-${i}`}
            className="absolute bg-slate-800/80 border-2 border-slate-600 z-10 flex items-center justify-center pixel-shadow"
            style={{
              left: door.x * TILE_SIZE,
              top: door.y * TILE_SIZE,
              width: door.w * TILE_SIZE,
              height: door.h * TILE_SIZE
            }}
          >
            <span className="text-[6px] text-white rotate-90 opacity-50 font-pixel">DOOR</span>
          </div>
        ))}
        
        {/* Floor Text Overlays */}
        {Object.values(DOORS).map((door, i) => {
          // Position the name inside the cabin
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

        {/* CHARACTER */}
        {myPosition && (
          <Character 
            x={myPosition.x} 
            y={myPosition.y} 
            name={useGameStore.getState().currentUser?.name || "Red"} 
            color={useGameStore.getState().currentUser?.color || "#d7263d"} 
            direction={myPosition.direction} 
          />
        )}
      </motion.div>
    </div>
  );
}
