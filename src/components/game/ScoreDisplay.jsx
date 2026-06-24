import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/lib/GameContext';

export default function ScoreDisplay() {
  const { score, bestScore, moveCount, combo, lastScoreGain, theme, t, mode, timeLeft } = useGame();
  const [scorePopup, setScorePopup] = useState(null);

  useEffect(() => {
    if (lastScoreGain > 0) {
      setScorePopup(lastScoreGain);
      const timer = setTimeout(() => setScorePopup(null), 800);
      return () => clearTimeout(timer);
    }
  }, [lastScoreGain, score]);

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
      <ScoreCard label={t('score')} value={score} theme={theme} popup={scorePopup} accent />
      <ScoreCard label={t('best')} value={bestScore} theme={theme} />
      <ScoreCard label={t('moves')} value={moveCount} theme={theme} />
      {combo > 1 && <ScoreCard label={t('combo')} value={`${combo}x`} theme={theme} highlight />}
      {mode === 'timeAttack' && (
        <ScoreCard label={t('timeLeft')} value={`${timeLeft}s`} theme={theme} urgent={timeLeft <= 30} />
      )}
    </div>
  );
}

function ScoreCard({ label, value, theme, popup, accent, highlight, urgent }) {
  return (
    <div className={`relative ${theme.cardBg} rounded-xl px-3 py-2 md:px-4 md:py-2.5 min-w-[70px] text-center transition-all duration-300 ${highlight ? 'ring-2 ring-yellow-400/50' : ''} ${urgent ? 'ring-2 ring-red-500/50' : ''}`}>
      <div className={`text-[10px] md:text-xs uppercase tracking-wider ${theme.text} opacity-70 font-medium`}>
        {label}
      </div>
      <div className={`text-lg md:text-xl font-bold ${accent ? theme.textLight : theme.text} font-display`}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
      <AnimatePresence>
        {popup && (
          <motion.div
            initial={{ opacity: 1, y: 0, scale: 0.5 }}
            animate={{ opacity: 0, y: -30, scale: 1.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="absolute -top-2 right-0 text-sm font-bold text-yellow-400 pointer-events-none"
          >
            +{popup}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}