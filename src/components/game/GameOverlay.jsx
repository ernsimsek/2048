import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/lib/GameContext';

export default function GameOverlay() {
  const { gameStatus, startGame, keepPlaying, theme, t, mode, score, wonContinued } = useGame();

  const showWin = gameStatus === 'won' && !wonContinued;
  const showLose = gameStatus === 'lost';

  return (
    <AnimatePresence>
      {(showWin || showLose) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-30 flex items-center justify-center rounded-xl md:rounded-2xl"
          style={{ backgroundColor: showWin ? 'rgba(250,200,50,0.6)' : 'rgba(0,0,0,0.65)' }}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="text-center space-y-4"
          >
            <h2 className={`text-3xl md:text-4xl font-bold font-display ${showWin ? 'text-white' : 'text-white'}`}>
              {showWin ? t('youWin') : t('gameOver')}
            </h2>
            <p className="text-white/80 text-lg font-medium">
              {t('score')}: {score.toLocaleString()}
            </p>
            <div className="flex gap-3 justify-center pt-2">
              {showWin && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={keepPlaying}
                  className="px-5 py-2.5 rounded-xl bg-white/20 backdrop-blur-sm text-white font-semibold border border-white/30 hover:bg-white/30 transition-all"
                >
                  {t('keepPlaying')}
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => startGame(mode)}
                className={`px-5 py-2.5 rounded-xl font-semibold transition-all ${theme.buttonPrimary}`}
              >
                {showWin ? t('newGame') : t('tryAgain')}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}