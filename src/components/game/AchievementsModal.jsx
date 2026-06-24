import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useGame } from '@/lib/GameContext';
import { achievementDefs } from '@/lib/achievements';
import { getAchievements } from '@/lib/storage';

export default function AchievementsModal({ open, onClose }) {
  const { theme, t } = useGame();

  if (!open) return null;
  const unlocked = getAchievements();

  const scrollbarStyle = {
    '--scrollbar-thumb': theme.accent,
    '--scrollbar-track': 'transparent',
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          onClick={e => e.stopPropagation()}
          style={scrollbarStyle}
          className={`[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[var(--scrollbar-thumb)] [&::-webkit-scrollbar-thumb]:opacity-50 relative ${theme.cardBg} rounded-2xl p-5 md:p-6 w-full max-w-md max-h-[80vh] overflow-y-auto shadow-2xl`}
        >
          <button onClick={onClose} className={`absolute top-4 right-4 ${theme.text} hover:opacity-70`}>
            <X size={20} />
          </button>
          
          <h2 className={`text-xl font-bold font-display ${theme.textLight} mb-4`}>
            {t('achievements')}
          </h2>
          
          <div className="space-y-2.5">
            {achievementDefs.map((ach, i) => {
              const isUnlocked = unlocked.includes(ach.id);
              return (
                <motion.div
                  key={ach.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={`${theme.cardBg} rounded-xl p-3 flex items-center gap-3 transition-all ${
                    isUnlocked ? '' : 'opacity-40'
                  }`}
                >
                  <span className="text-2xl">{ach.icon}</span>
                  <div className="flex-1">
                    <div className={`font-semibold ${theme.textLight} text-sm`}>
                      {t(ach.nameKey)}
                    </div>
                    <div className={`text-xs ${theme.text} opacity-70`}>
                      {t(ach.descKey)}
                    </div>
                  </div>
                  {isUnlocked && (
                    <span className="text-xs text-green-400 font-medium">✓</span>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}