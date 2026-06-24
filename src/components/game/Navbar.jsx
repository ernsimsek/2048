import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Palette, Globe, Maximize, Minimize, Home } from 'lucide-react';
import { useGame } from '@/lib/GameContext';
import { themeList, themes } from '@/lib/themes';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const { theme, themeId, changeTheme, lang, changeLang, soundOn, toggleSound, t } = useGame();
  const [showThemes, setShowThemes] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const location = useLocation();

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-40 ${theme.navbar}`}>
        <div className="max-w-2xl mx-auto px-4 py-2.5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className={`text-xl font-bold font-display ${theme.textLight}`}>2048</span>
          </Link>
          <div className="flex items-center gap-1.5">
            {location.pathname !== '/' && (
              <NavBtn onClick={() => {}} as={Link} to="/" theme={theme}>
                <Home size={16} />
              </NavBtn>
            )}
            <NavBtn onClick={() => changeLang(lang === 'en' ? 'tr' : 'en')} theme={theme}>
              <Globe size={16} />
              <span className="text-xs ml-1 hidden sm:inline">{lang.toUpperCase()}</span>
            </NavBtn>
            <NavBtn onClick={() => setShowThemes(!showThemes)} theme={theme}>
              <Palette size={16} />
            </NavBtn>
            <NavBtn onClick={toggleSound} theme={theme}>
              {soundOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </NavBtn>
            <NavBtn onClick={toggleFullscreen} theme={theme}>
              {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
            </NavBtn>
          </div>
        </div>
      </nav>

      {/* Theme Picker Dropdown */}
      <AnimatePresence>
        {showThemes && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setShowThemes(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className={`fixed top-14 right-4 z-50 ${theme.cardBg} rounded-2xl p-3 shadow-2xl w-48 max-h-[70vh] overflow-y-auto`}
            >
              <div className="space-y-1">
                {themeList.map(id => (
                  <button
                    key={id}
                    onClick={() => { changeTheme(id); setShowThemes(false); }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                      id === themeId
                        ? `${theme.buttonPrimary}`
                        : `${theme.text} hover:opacity-80`
                    }`}
                  >
                    <div
                      className="w-4 h-4 rounded-full border border-white/20"
                      style={{ background: themes[id].accent }}
                    />
                    {t(themes[id].nameKey)}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function NavBtn({ children, onClick, theme, as: Component, ...rest }) {
  const Wrapper = Component || 'button';
  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Wrapper
        onClick={onClick}
        className={`${theme.buttonSecondary} rounded-xl p-2 flex items-center transition-all duration-200 text-sm`}
        {...rest}
      >
        {children}
      </Wrapper>
    </motion.div>
  );
}