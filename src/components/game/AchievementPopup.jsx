import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/lib/GameContext';
import { achievementDefs } from '@/lib/achievements';

export default function AchievementPopup() {
  const { newAchievement, theme, t } = useGame();

  const ach = achievementDefs.find(a => a.id === newAchievement);

  return (
    <AnimatePresence>
      {ach && (
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 ${theme.cardBg} rounded-2xl px-5 py-3 flex items-center gap-3 shadow-2xl`}
        >
          <span className="text-3xl">{ach.icon}</span>
          <div>
            <div className={`text-xs uppercase tracking-wider ${theme.text} opacity-60`}>
              {t('unlocked')}
            </div>
            <div className={`font-bold ${theme.textLight} font-display`}>
              {t(ach.nameKey)}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}