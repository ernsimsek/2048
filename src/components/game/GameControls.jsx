import React from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Undo2, BarChart3, Trophy } from 'lucide-react';
import { useGame } from '@/lib/GameContext';

export default function GameControls({ onShowStats, onShowAchievements }) {
  const { startGame, undo, theme, t, mode, history } = useGame();

  const buttons = [
    { icon: Undo2, label: t('undo'), onClick: undo, disabled: history.length === 0 || mode === 'hardcore' },
    { icon: RotateCcw, label: t('restart'), onClick: () => startGame(mode) },
    { icon: BarChart3, label: t('statistics'), onClick: onShowStats },
    { icon: Trophy, label: t('achievements'), onClick: onShowAchievements },
  ];

  return (
    <div className="flex items-center justify-center gap-2 md:gap-3">
      {buttons.map((btn, i) => (
        <motion.button
          key={i}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={btn.onClick}
          disabled={btn.disabled}
          className={`${theme.buttonSecondary} rounded-xl p-2.5 md:p-3 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed`}
          title={btn.label}
        >
          <btn.icon size={18} />
        </motion.button>
      ))}
    </div>
  );
}