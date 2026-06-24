export const achievementDefs = [
  { id: 'firstMerge', nameKey: 'achFirstMerge', descKey: 'achFirstMergeDesc', icon: '🎯' },
  { id: 'reach128', nameKey: 'achReach128', descKey: 'achReach128Desc', icon: '💎' },
  { id: 'reach256', nameKey: 'achReach256', descKey: 'achReach256Desc', icon: '🔥' },
  { id: 'reach512', nameKey: 'achReach512', descKey: 'achReach512Desc', icon: '⚡' },
  { id: 'reach1024', nameKey: 'achReach1024', descKey: 'achReach1024Desc', icon: '🌟' },
  { id: 'reach2048', nameKey: 'achReach2048', descKey: 'achReach2048Desc', icon: '🏆' },
  { id: 'comboMaster', nameKey: 'achComboMaster', descKey: 'achComboMasterDesc', icon: '🔗' },
  { id: 'fastThinker', nameKey: 'achFastThinker', descKey: 'achFastThinkerDesc', icon: '⏱️' },
  { id: 'noUndo', nameKey: 'achNoUndo', descKey: 'achNoUndoDesc', icon: '🎖️' },
  { id: 'persistent', nameKey: 'achPersistent', descKey: 'achPersistentDesc', icon: '🏅' },
];

export function checkAchievements(gameState, stats, existing) {
  const newAchs = [];
  const unlocked = new Set(existing);

  const check = (id, condition) => {
    if (!unlocked.has(id) && condition) {
      newAchs.push(id);
      unlocked.add(id);
    }
  };

  check('firstMerge', gameState.totalMerges > 0);
  check('reach128', gameState.highestTile >= 128);
  check('reach256', gameState.highestTile >= 256);
  check('reach512', gameState.highestTile >= 512);
  check('reach1024', gameState.highestTile >= 1024);
  check('reach2048', gameState.highestTile >= 2048);
  check('comboMaster', gameState.maxCombo >= 5);
  check('fastThinker', gameState.won && gameState.moveCount < 500);
  check('noUndo', gameState.won && !gameState.usedUndo);
  check('persistent', stats.totalGames >= 50);

  return { newAchs, allUnlocked: Array.from(unlocked) };
}