import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { initializeGame, move, canMove, hasWon, getHighestTile, cloneGrid, addRandomTile } from './gameEngine';
import { saveBestScore, getBestScore, saveGameState, getGameState, clearGameState, getStats, saveStats, getAchievements, saveAchievements, addLeaderboardEntry, getThemeId, saveTheme, getLang, saveLang, getSound, saveSound } from './storage';
import { checkAchievements } from './achievements';
import { playMove, playMerge, playBigMerge, playWin, playLose, playAchievement, vibrate } from './sounds';
import { detectLanguage, t as translate } from './translations';
import { getTheme } from './themes';

const GameContext = createContext(null);
export const useGame = () => useContext(GameContext);

export function GameProvider({ children }) {
  const [grid, setGrid] = useState(() => {
    const saved = getGameState();
    return saved?.grid || null;
  });
  const [score, setScore] = useState(() => {
    const saved = getGameState();
    return saved?.score || 0;
  });
  const [bestScore, setBestScore] = useState(() => getBestScore());
  const [moveCount, setMoveCount] = useState(() => {
    const saved = getGameState();
    return saved?.moveCount || 0;
  });
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(() => {
    const saved = getGameState();
    return saved?.maxCombo || 0;
  });
  const [totalMerges, setTotalMerges] = useState(0);
  const [gameStatus, setGameStatus] = useState('idle'); // idle, playing, won, lost
  const [mode, setMode] = useState('classic');
  const [history, setHistory] = useState([]);
  const [usedUndo, setUsedUndo] = useState(false);
  const [newTiles, setNewTiles] = useState([]);
  const [mergedTiles, setMergedTiles] = useState([]);
  const [lastScoreGain, setLastScoreGain] = useState(0);
  const [newAchievement, setNewAchievement] = useState(null);
  const [themeId, setThemeId] = useState(() => getThemeId());
  const [lang, setLangState] = useState(() => getLang() || detectLanguage());
  const [soundOn, setSoundOn] = useState(() => getSound());
  const [timeLeft, setTimeLeft] = useState(120);
  const timerRef = useRef(null);
  const [shakeTrigger, setShakeTrigger] = useState(0);
  const [wonContinued, setWonContinued] = useState(false);

  const theme = getTheme(themeId);
  const t = useCallback((key) => translate(lang, key), [lang]);

  // Save game state
  useEffect(() => {
    if (grid && gameStatus === 'playing') {
      saveGameState({ grid, score, moveCount, maxCombo, mode });
    }
  }, [grid, score, moveCount, maxCombo, gameStatus, mode]);

  // Timer for time attack
  useEffect(() => {
    if (mode === 'timeAttack' && gameStatus === 'playing') {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setGameStatus('lost');
            // Timer end - use current state values through refs would be ideal,
            // but for simplicity just pass what we have
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timerRef.current);
    }
  }, [mode, gameStatus]);

  const startGame = useCallback((gameMode = 'classic') => {
    const { grid: newGrid } = initializeGame();
    setGrid(newGrid);
    setScore(0);
    setMoveCount(0);
    setCombo(0);
    setMaxCombo(0);
    setTotalMerges(0);
    setGameStatus('playing');
    setMode(gameMode);
    setHistory([]);
    setUsedUndo(false);
    setNewTiles([]);
    setMergedTiles([]);
    setWonContinued(false);
    if (gameMode === 'timeAttack') setTimeLeft(120);
    clearGameState();
  }, []);

  const endGame = useCallback((won, currentGrid, currentScore, currentMoveCount) => {
    const stats = getStats();
    stats.totalGames++;
    stats.totalMoves += currentMoveCount;
    const highest = currentGrid ? getHighestTile(currentGrid) : 0;
    if (highest > stats.highestTile) stats.highestTile = highest;
    stats.totalScore += currentScore;
    if (won) {
      stats.wins++;
      if (!stats.fastestWin || currentMoveCount < stats.fastestWin) {
        stats.fastestWin = currentMoveCount;
      }
    }
    if (maxCombo > stats.longestCombo) stats.longestCombo = maxCombo;
    saveStats(stats);
    saveBestScore(currentScore);
    setBestScore(getBestScore());

    addLeaderboardEntry({ score: currentScore, moves: currentMoveCount, mode, highestTile: highest });

    const achState = { totalMerges, highestTile: highest, maxCombo, won, usedUndo, moveCount: currentMoveCount };
    const existing = getAchievements();
    const { newAchs, allUnlocked } = checkAchievements(achState, stats, existing);
    saveAchievements(allUnlocked);

    if (newAchs.length > 0) {
      if (soundOn) playAchievement();
      setNewAchievement(newAchs[0]);
      setTimeout(() => setNewAchievement(null), 3000);
    }

    clearGameState();
  }, [maxCombo, totalMerges, usedUndo, soundOn, mode]);

  const doMove = useCallback((direction) => {
    if (!grid || (gameStatus !== 'playing' && gameStatus !== 'won')) return;
    if (gameStatus === 'won' && !wonContinued) return;

    const result = move(grid, direction);
    if (!result.moved) return;

    setHistory(prev => [...prev.slice(-10), { grid: cloneGrid(grid), score, moveCount }]);

    const { grid: afterAdd, newTile } = addRandomTile(result.grid);

    setGrid(afterAdd);
    setScore(prev => prev + result.score);
    setMoveCount(prev => prev + 1);
    setLastScoreGain(result.score);
    setTotalMerges(prev => prev + result.merges);

    if (newTile) setNewTiles([newTile]);
    if (result.merges > 0) {
      setMergedTiles(getMergedPositions(grid, afterAdd));
      setCombo(prev => {
        const nc = prev + 1;
        setMaxCombo(mc => Math.max(mc, nc));
        return nc;
      });
    } else {
      setCombo(0);
    }

    if (soundOn) {
      if (result.merges > 0) {
        if (result.score >= 64) {
          playBigMerge();
          vibrate(30);
          setShakeTrigger(s => s + 1);
        } else {
          playMerge();
          vibrate(15);
        }
      } else {
        playMove();
      }
    }

    const newScore = score + result.score;
    const newMoveCount = moveCount + 1;

    // Check win
    if (hasWon(afterAdd) && !wonContinued) {
      setGameStatus('won');
      if (soundOn) playWin();
      endGame(true, afterAdd, newScore, newMoveCount);
      return;
    }

    // Check lose
    if (!canMove(afterAdd)) {
      setGameStatus('lost');
      if (soundOn) playLose();
      endGame(false, afterAdd, newScore, newMoveCount);
    }
  }, [grid, gameStatus, score, moveCount, soundOn, wonContinued, endGame]);

  const undo = useCallback(() => {
    if (history.length === 0) return;
    if (mode === 'hardcore') return;
    const prev = history[history.length - 1];
    setGrid(prev.grid);
    setScore(prev.score);
    setMoveCount(prev.moveCount);
    setHistory(h => h.slice(0, -1));
    setUsedUndo(true);
    setCombo(0);
  }, [history, mode]);

  const keepPlaying = useCallback(() => {
    setWonContinued(true);
    setGameStatus('playing');
  }, []);

  const changeTheme = useCallback((id) => {
    setThemeId(id);
    saveTheme(id);
  }, []);

  const changeLang = useCallback((l) => {
    setLangState(l);
    saveLang(l);
  }, []);

  const toggleSound = useCallback(() => {
    setSoundOn(prev => {
      saveSound(!prev);
      return !prev;
    });
  }, []);

  // Resume saved game on mount
  useEffect(() => {
    const saved = getGameState();
    if (saved?.grid) {
      setGrid(saved.grid);
      setScore(saved.score || 0);
      setMoveCount(saved.moveCount || 0);
      setMaxCombo(saved.maxCombo || 0);
      setMode(saved.mode || 'classic');
      setGameStatus('playing');
    }
  }, []);

  return (
    <GameContext.Provider value={{
      grid, score, bestScore, moveCount, combo, maxCombo,
      gameStatus, mode, newTiles, mergedTiles, lastScoreGain,
      newAchievement, theme, themeId, lang, soundOn, timeLeft,
      shakeTrigger, wonContinued, history, usedUndo,
      t, startGame, doMove, undo, keepPlaying,
      changeTheme, changeLang, toggleSound,
    }}>
      {children}
    </GameContext.Provider>
  );
}

function getMergedPositions(oldGrid, newGrid) {
  const merged = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (newGrid[r][c] > 0 && newGrid[r][c] !== oldGrid[r][c] && oldGrid[r][c] !== 0) {
        merged.push({ r, c, value: newGrid[r][c] });
      }
    }
  }
  return merged;
}