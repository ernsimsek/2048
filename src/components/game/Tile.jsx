import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/lib/GameContext';

export default function Tile({ value, row, col, isNew, isMerged }) {
  const { theme } = useGame();
  
  const tileKey = value === 0 ? 0 : value <= 2048 ? value : 'super';
  const tileClass = theme.tiles[tileKey] || theme.tiles.super;
  
  const fontSize = value >= 1024 ? 'text-lg md:text-xl' : value >= 128 ? 'text-xl md:text-2xl' : 'text-2xl md:text-3xl';

  const retro = theme.id === 'retro';

  if (value === 0) return null;

  return (
    <motion.div
      key={`${row}-${col}-${value}`}
      initial={isNew ? { scale: 0, opacity: 0 } : isMerged ? { scale: 1.2 } : { scale: 1 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={
        isNew
          ? { type: 'spring', stiffness: 400, damping: 20, delay: 0.05 }
          : isMerged
          ? { type: 'spring', stiffness: 500, damping: 15 }
          : { duration: 0.12 }
      }
      className={`absolute inset-0.5 md:inset-1 rounded-lg md:rounded-xl flex items-center justify-center ${tileClass} ${fontSize} font-bold select-none`}
      style={retro ? { fontFamily: theme.font } : undefined}
    >
      {value}
    </motion.div>
  );
}