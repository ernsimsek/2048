// 2048 Game Engine - Pure logic, no React dependencies

export function createEmptyGrid() {
  return Array(4).fill(null).map(() => Array(4).fill(0));
}

export function cloneGrid(grid) {
  return grid.map(row => [...row]);
}

let tileIdCounter = 1;
export function getNextTileId() {
  return tileIdCounter++;
}

export function addRandomTile(grid) {
  const empty = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (grid[r][c] === 0) empty.push({ r, c });
    }
  }
  if (empty.length === 0) return { grid, newTile: null };
  const cell = empty[Math.floor(Math.random() * empty.length)];
  const value = Math.random() < 0.9 ? 2 : 4;
  const newGrid = cloneGrid(grid);
  newGrid[cell.r][cell.c] = value;
  return { grid: newGrid, newTile: { r: cell.r, c: cell.c, value } };
}

export function initializeGame() {
  let grid = createEmptyGrid();
  const r1 = addRandomTile(grid);
  grid = r1.grid;
  const r2 = addRandomTile(grid);
  grid = r2.grid;
  return { grid, tiles: [r1.newTile, r2.newTile].filter(Boolean) };
}

function slideRow(row) {
  const filtered = row.filter(v => v !== 0);
  const result = [];
  let score = 0;
  let merges = 0;
  let i = 0;
  while (i < filtered.length) {
    if (i + 1 < filtered.length && filtered[i] === filtered[i + 1]) {
      const merged = filtered[i] * 2;
      result.push(merged);
      score += merged;
      merges++;
      i += 2;
    } else {
      result.push(filtered[i]);
      i++;
    }
  }
  while (result.length < 4) result.push(0);
  return { row: result, score, merges };
}

export function move(grid, direction) {
  let newGrid = cloneGrid(grid);
  let totalScore = 0;
  let totalMerges = 0;
  let moved = false;

  const rotateClockwise = (g) => {
    const n = g.length;
    const r = Array(n).fill(null).map(() => Array(n).fill(0));
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++)
        r[j][n - 1 - i] = g[i][j];
    return r;
  };

  const rotateCounterClockwise = (g) => {
    const n = g.length;
    const r = Array(n).fill(null).map(() => Array(n).fill(0));
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++)
        r[n - 1 - j][i] = g[i][j];
    return r;
  };

  let rotations = 0;
  if (direction === 'left') rotations = 0;
  else if (direction === 'up') rotations = 1;
  else if (direction === 'right') rotations = 2;
  else if (direction === 'down') rotations = 3;

  let working = cloneGrid(newGrid);
  for (let i = 0; i < rotations; i++) working = rotateCounterClockwise(working);

  for (let r = 0; r < 4; r++) {
    const { row, score, merges } = slideRow(working[r]);
    if (row.some((v, i) => v !== working[r][i])) moved = true;
    working[r] = row;
    totalScore += score;
    totalMerges += merges;
  }

  for (let i = 0; i < rotations; i++) working = rotateClockwise(working);
  newGrid = working;

  return { grid: newGrid, score: totalScore, merges: totalMerges, moved };
}

export function canMove(grid) {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (grid[r][c] === 0) return true;
      if (c + 1 < 4 && grid[r][c] === grid[r][c + 1]) return true;
      if (r + 1 < 4 && grid[r][c] === grid[r + 1][c]) return true;
    }
  }
  return false;
}

export function hasWon(grid) {
  for (let r = 0; r < 4; r++)
    for (let c = 0; c < 4; c++)
      if (grid[r][c] >= 2048) return true;
  return false;
}

export function getHighestTile(grid) {
  let max = 0;
  for (let r = 0; r < 4; r++)
    for (let c = 0; c < 4; c++)
      if (grid[r][c] > max) max = grid[r][c];
  return max;
}