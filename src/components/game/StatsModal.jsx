import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useGame } from '@/lib/GameContext';
import { getStats, getLeaderboard } from '@/lib/storage';

export default function StatsModal({ open, onClose }) {
  const { theme, t } = useGame();

  if (!open) return null;
  const stats = getStats();
  const lb = getLeaderboard();
  const avgScore = stats.totalGames > 0 ? Math.round(stats.totalScore / stats.totalGames) : 0;
  const winRate = stats.totalGames > 0 ? Math.round((stats.wins / stats.totalGames) * 100) : 0;

  const statItems = [
    { label: t('totalGames'), value: stats.totalGames },
    { label: t('totalMoves'), value: stats.totalMoves.toLocaleString() },
    { label: t('highestTile'), value: stats.highestTile },
    { label: t('averageScore'), value: avgScore.toLocaleString() },
    { label: t('winRate'), value: `${winRate}%` },
    { label: t('longestCombo'), value: `${stats.longestCombo}x` },
    { label: t('fastestWin'), value: stats.fastestWin ? `${stats.fastestWin} ${t('moves').toLowerCase()}` : t('never') },
  ];

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
          className={`relative ${theme.cardBg} rounded-2xl p-5 md:p-6 w-full max-w-md max-h-[80vh] overflow-y-auto shadow-2xl`}
        >
          <button onClick={onClose} className={`absolute top-4 right-4 ${theme.text} hover:opacity-70`}>
            <X size={20} />
          </button>
          
          <h2 className={`text-xl font-bold font-display ${theme.textLight} mb-4`}>
            {t('statistics')}
          </h2>
          
          <div className="grid grid-cols-2 gap-2.5 mb-6">
            {statItems.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`${theme.cardBg} rounded-xl p-3 text-center`}
              >
                <div className={`text-[10px] uppercase tracking-wider ${theme.text} opacity-60`}>{item.label}</div>
                <div className={`text-lg font-bold ${theme.textLight} font-display`}>{item.value}</div>
              </motion.div>
            ))}
          </div>

          {lb.length > 0 && (
            <>
              <h3 className={`text-lg font-bold font-display ${theme.textLight} mb-3`}>
                {t('leaderboard')}
              </h3>
              <div className="space-y-1.5">
                {lb.slice(0, 10).map((entry, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className={`flex items-center justify-between ${theme.cardBg} rounded-lg px-3 py-2 text-sm`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`font-bold w-6 ${i < 3 ? 'text-yellow-400' : theme.text}`}>
                        #{i + 1}
                      </span>
                      <span className={`${theme.textLight} font-medium`}>
                        {entry.score?.toLocaleString()}
                      </span>
                    </div>
                    <span className={`text-xs ${theme.text} opacity-60`}>
                      {entry.moves} {t('moves').toLowerCase()}
                    </span>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}