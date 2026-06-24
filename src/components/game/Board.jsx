import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/lib/GameContext';
import Tile from './Tile';

export default function Board() {
  const { grid, doMove, theme, newTiles, mergedTiles, shakeTrigger, gameStatus } = useGame();
  const boardRef = useRef(null);
  const touchStart = useRef(null);
  const [shakeKey, setShakeKey] = useState(0);

  useEffect(() => {
    if (shakeTrigger > 0) setShakeKey(s => s + 1);
  }, [shakeTrigger]);

  // Keyboard controls
  useEffect(() => {
    const handleKey = (e) => {
      const map = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' };
      if (map[e.key]) {
        e.preventDefault();
        doMove(map[e.key]);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [doMove]);

  // Touch controls
  const handleTouchStart = (e) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };

  const handleTouchEnd = (e) => {
    if (!touchStart.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStart.current.x;
    const dy = t.clientY - touchStart.current.y;
    const minSwipe = 30;
    
    if (Math.abs(dx) > Math.abs(dy)) {
      if (Math.abs(dx) > minSwipe) doMove(dx > 0 ? 'right' : 'left');
    } else {
      if (Math.abs(dy) > minSwipe) doMove(dy > 0 ? 'down' : 'up');
    }
    touchStart.current = null;
  };

  if (!grid) return null;

  const isNew = (r, c) => newTiles.some(t => t.r === r && t.c === c);
  const isMerged = (r, c) => mergedTiles.some(t => t.r === r && t.c === c);

  return (
    <motion.div
      key={shakeKey}
      animate={shakeKey > 0 ? { x: [0, -3, 3, -2, 2, 0] } : {}}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      <div
        ref={boardRef}
        className={`${theme.board} p-1.5 md:p-2.5 touch-none select-none w-full`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="grid grid-cols-4 gap-1.5 md:gap-2.5 w-full">
          {grid.map((row, r) =>
            row.map((value, c) => (
              <div key={`${r}-${c}`} className={`${theme.cell} relative aspect-square`}>
                <Tile
                  value={value}
                  row={r}
                  col={c}
                  isNew={isNew(r, c)}
                  isMerged={isMerged(r, c)}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
}