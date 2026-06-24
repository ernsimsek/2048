import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/lib/GameContext';
import Navbar from '@/components/game/Navbar';
import Board from '@/components/game/Board';
import ScoreDisplay from '@/components/game/ScoreDisplay';
import GameControls from '@/components/game/GameControls';
import GameOverlay from '@/components/game/GameOverlay';
import AchievementPopup from '@/components/game/AchievementPopup';
import StatsModal from '@/components/game/StatsModal';
import AchievementsModal from '@/components/game/AchievementsModal';
import ParticleBackground from '@/components/game/ParticleBackground';

export default function Game() {
  const { theme, gameStatus, grid, startGame, mode, t } = useGame();
  const [showStats, setShowStats] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);

  useEffect(() => {
    if (!grid && gameStatus === 'idle') {
      startGame('classic');
    }
  }, [grid, gameStatus, startGame]);

  return (
    <div className={`min-h-screen ${theme.page} relative overflow-hidden`}>
      <ParticleBackground />
      <Navbar />

      <div className="relative z-10 pt-16 pb-8 flex flex-col items-center justify-center min-h-screen px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-[380px] space-y-4"
        >
          {/* Mode Label */}
          <div className="text-center">
            <span className={`text-xs uppercase tracking-widest ${theme.text} opacity-50 font-medium`}>
              {t(mode)}
            </span>
          </div>

          {/* Score */}
          <ScoreDisplay />

          {/* Board */}
          <div className="relative">
            <Board />
            <GameOverlay />
          </div>

          {/* Controls */}
          <GameControls
            onShowStats={() => setShowStats(true)}
            onShowAchievements={() => setShowAchievements(true)}
          />
        </motion.div>
      </div>

      <AchievementPopup />
      <StatsModal open={showStats} onClose={() => setShowStats(false)} />
      <AchievementsModal open={showAchievements} onClose={() => setShowAchievements(false)} />
    </div>
  );
}