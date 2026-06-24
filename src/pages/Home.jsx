import React from 'react';
import { motion } from 'framer-motion';
import { Play, Zap, Palette, BarChart3, Timer, Gamepad2, Swords, Infinity, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGame } from '@/lib/GameContext';
import { themes, themeList } from '@/lib/themes';
import { getStats, getGameState } from '@/lib/storage';
import Navbar from '@/components/game/Navbar';
import ParticleBackground from '@/components/game/ParticleBackground';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

export default function Home() {
  const { theme, t, changeTheme, startGame } = useGame();
  const stats = getStats();
  const saved = getGameState();

  const features = [
    { icon: Palette, title: t('featureThemes'), desc: t('featureThemesDesc') },
    { icon: Zap, title: t('featureAnim'), desc: t('featureAnimDesc') },
    { icon: Gamepad2, title: t('featureModes'), desc: t('featureModesDesc') },
    { icon: BarChart3, title: t('featureStats'), desc: t('featureStatsDesc') },
  ];

  const modes = [
    { id: 'classic', icon: Gamepad2, nameKey: 'classic', descKey: 'classicDesc' },
    { id: 'timeAttack', icon: Timer, nameKey: 'timeAttack', descKey: 'timeAttackDesc' },
    { id: 'endless', icon: Infinity, nameKey: 'endless', descKey: 'endlessDesc' },
    { id: 'hardcore', icon: Swords, nameKey: 'hardcore', descKey: 'hardcoreDesc' },
  ];

  return (
    <div className={`min-h-screen ${theme.page} relative overflow-hidden`}>
      <ParticleBackground />
      <Navbar />

      <div className="relative z-10 pt-16">
        {/* Hero */}
        <section className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
          <motion.div {...fadeUp} className="space-y-6 max-w-lg">
            <motion.h1
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, type: 'spring', stiffness: 200 }}
              className={`text-7xl md:text-9xl font-black font-display ${theme.textLight} tracking-tight`}
              style={theme.glow ? { textShadow: `0 0 40px ${theme.accent}40, 0 0 80px ${theme.accent}20` } : undefined}
            >
              2048
            </motion.h1>
            <motion.p
              {...fadeUp}
              transition={{ delay: 0.2, duration: 0.6 }}
              className={`text-lg md:text-xl ${theme.text} font-body`}
            >
              {t('hero1')}
            </motion.p>
            <motion.p
              {...fadeUp}
              transition={{ delay: 0.3, duration: 0.6 }}
              className={`text-sm ${theme.text} opacity-60`}
            >
              {t('hero2')}
            </motion.p>
            <motion.div
              {...fadeUp}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4"
            >
              {saved ? (
                <Link to="/game">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`${theme.buttonPrimary} px-8 py-3.5 rounded-2xl text-base font-semibold flex items-center gap-2 shadow-xl`}
                  >
                    <Play size={20} />
                    {t('resume')}
                  </motion.button>
                </Link>
              ) : null}
              <Link to="/game">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => startGame('classic')}
                  className={`${saved ? theme.buttonSecondary : theme.buttonPrimary} px-8 py-3.5 rounded-2xl text-base font-semibold flex items-center gap-2 ${!saved ? 'shadow-xl' : ''}`}
                >
                  <Play size={20} />
                  {saved ? t('newGame') : t('play')}
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* Features */}
        <section className="py-16 px-4">
          <div className="max-w-3xl mx-auto">
            <motion.h2
              {...fadeUp}
              className={`text-2xl md:text-3xl font-bold font-display ${theme.textLight} text-center mb-10`}
            >
              {t('features')}
            </motion.h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {features.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i, duration: 0.5 }}
                  className={`${theme.cardBg} rounded-2xl p-4 text-center space-y-2 hover:scale-105 transition-transform duration-300`}
                >
                  <f.icon size={28} className={`mx-auto ${theme.text}`} style={{ color: theme.accent }} />
                  <h3 className={`text-sm font-semibold ${theme.textLight}`}>{f.title}</h3>
                  <p className={`text-xs ${theme.text} opacity-60`}>{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Game Modes */}
        <section className="py-16 px-4">
          <div className="max-w-3xl mx-auto">
            <motion.h2
              {...fadeUp}
              className={`text-2xl md:text-3xl font-bold font-display ${theme.textLight} text-center mb-10`}
            >
              {t('modes')}
            </motion.h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {modes.map((m, i) => (
                <Link to="/game" key={m.id} onClick={() => startGame(m.id)}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * i }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`${theme.cardBg} rounded-2xl p-4 text-center space-y-2 cursor-pointer h-full`}
                  >
                    <m.icon size={28} className="mx-auto" style={{ color: theme.accent }} />
                    <h3 className={`text-sm font-semibold ${theme.textLight}`}>{t(m.nameKey)}</h3>
                    <p className={`text-xs ${theme.text} opacity-60`}>{t(m.descKey)}</p>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Theme Previews */}
        <section className="py-16 px-4">
          <div className="max-w-3xl mx-auto">
            <motion.h2
              {...fadeUp}
              className={`text-2xl md:text-3xl font-bold font-display ${theme.textLight} text-center mb-10`}
            >
              {t('themes')}
            </motion.h2>
            <div className="grid grid-cols-5 md:grid-cols-10 gap-2 justify-items-center">
              {themeList.map((id, i) => {
                const th = themes[id];
                return (
                  <motion.button
                    key={id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.03 * i }}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => changeTheme(id)}
                    className={`w-10 h-10 md:w-12 md:h-12 rounded-xl border-2 transition-all duration-200 ${
                      id === theme.id ? 'border-white shadow-lg scale-110' : 'border-white/20'
                    }`}
                    style={{ background: th.accent }}
                    title={t(th.nameKey)}
                  />
                );
              })}
            </div>
          </div>
        </section>

        {/* Quick Stats */}
        {stats.totalGames > 0 && (
          <section className="py-16 px-4">
            <div className="max-w-3xl mx-auto">
              <motion.h2
                {...fadeUp}
                className={`text-2xl md:text-3xl font-bold font-display ${theme.textLight} text-center mb-10`}
              >
                {t('statistics')}
              </motion.h2>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: t('totalGames'), value: stats.totalGames },
                  { label: t('highestTile'), value: stats.highestTile },
                  { label: t('winRate'), value: stats.totalGames > 0 ? `${Math.round((stats.wins / stats.totalGames) * 100)}%` : '0%' },
                ].map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * i }}
                    className={`${theme.cardBg} rounded-2xl p-4 text-center`}
                  >
                    <div className={`text-2xl md:text-3xl font-bold font-display ${theme.textLight}`}>{s.value}</div>
                    <div className={`text-xs ${theme.text} opacity-60 mt-1`}>{s.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className={`py-8 px-4 text-center ${theme.text} opacity-40 text-xs`}>
          2048 Premium Edition
        </footer>
      </div>
    </div>
  );
}