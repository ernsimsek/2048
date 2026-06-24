// LocalStorage helpers

const PREFIX = 'game2048_';

function getItem(key) {
  try {
    const val = localStorage.getItem(PREFIX + key);
    return val ? JSON.parse(val) : null;
  } catch { return null; }
}

function setItem(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {}
}

export function saveBestScore(score) {
  const current = getBestScore();
  if (score > current) setItem('bestScore', score);
}
export function getBestScore() { return getItem('bestScore') || 0; }

export function saveTheme(themeId) { setItem('theme', themeId); }
export function getThemeId() { return getItem('theme') || 'neon'; }

export function saveLang(lang) { setItem('lang', lang); }
export function getLang() { return getItem('lang'); }

export function saveSound(on) { setItem('sound', on); }
export function getSound() { const v = getItem('sound'); return v === null ? true : v; }

export function saveGameState(state) { setItem('gameState', state); }
export function getGameState() { return getItem('gameState'); }
export function clearGameState() { localStorage.removeItem(PREFIX + 'gameState'); }

export function getStats() {
  return getItem('stats') || {
    totalGames: 0,
    totalMoves: 0,
    highestTile: 0,
    totalScore: 0,
    wins: 0,
    longestCombo: 0,
    fastestWin: null,
  };
}
export function saveStats(stats) { setItem('stats', stats); }

export function getAchievements() { return getItem('achievements') || []; }
export function saveAchievements(achs) { setItem('achievements', achs); }

export function getLeaderboard() { return getItem('leaderboard') || []; }
export function saveLeaderboard(lb) {
  const sorted = lb.sort((a, b) => b.score - a.score).slice(0, 20);
  setItem('leaderboard', sorted);
}
export function addLeaderboardEntry(entry) {
  const lb = getLeaderboard();
  lb.push({ ...entry, date: new Date().toISOString() });
  saveLeaderboard(lb);
}