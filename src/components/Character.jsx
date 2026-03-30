import { motion } from 'framer-motion';

export default function Character({ color = '#d7263d', name = 'Red', x, y, direction = 'right' }) {
  const TILE_SIZE = 32;
  const isLeft = direction === 'left';
  
  // A pixel-art / smooth SVG of an Among Us crewmate
  return (
    <motion.div 
      className="absolute z-20 flex flex-col items-center"
      animate={{
        x: x * TILE_SIZE,
        y: y * TILE_SIZE,
      }}
      transition={{ type: 'tween', duration: 0 }}
      style={{
        width: TILE_SIZE,
        height: TILE_SIZE * 1.5,
      }}
    >
      <div 
        className="font-pixel text-[8px] text-red-500 mb-1 tracking-widest"
        style={{ textShadow: '1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000' }}
      >
        {name}
      </div>
      
      <motion.div 
         className="relative w-[32px] h-[40px] mt-1" 
         animate={{ scaleX: isLeft ? -1 : 1 }}
         transition={{ duration: 0.1 }}
      >
        <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          {/* Backpack */}
          <path d="M 25 35 Q 10 35 15 65 Q 20 85 25 85 L 25 35" fill={color} stroke="#000" strokeWidth="6" />
          
          {/* Body */}
          <path d="M 35 15 Q 60 0 80 15 L 85 70 Q 85 95 75 95 Q 65 95 65 80 L 65 75 L 55 75 L 55 95 Q 55 105 45 100 Q 30 95 35 70 Z" fill={color} stroke="#000" strokeWidth="6" />
          
          {/* Shadow on body */}
          <path d="M 35 70 Q 40 85 45 95 Q 55 100 55 90 L 55 70 L 65 70 L 65 85 Q 75 95 80 85 L 85 60 Q 60 80 35 60 Z" fill="rgba(0,0,0,0.2)" />

          {/* Visor */}
          <path d="M 50 25 Q 90 20 95 35 Q 100 50 60 55 Q 40 50 45 35 Q 45 25 50 25 Z" fill="#71bbc9" stroke="#000" strokeWidth="6" />
          
          {/* Visor highlight */}
          <path d="M 55 30 Q 80 28 85 35 Q 85 40 60 40 Q 50 38 52 33 Z" fill="#d1eef4" />
        </svg>
      </motion.div>
    </motion.div>
  );
}
