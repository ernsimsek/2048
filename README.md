# 2048 — Premium Puzzle Game

A modern, feature-rich take on the classic **2048** puzzle game. Built with React and Vite, it delivers smooth animations, multiple game modes, ten visual themes, achievements, and full mobile support — all running entirely in the browser with local persistence.

---

## Features

- **10 stunning themes** — Classic, Neon Cyberpunk, Minimal Dark, Glassmorphism, Retro Arcade, Luxury Gold, Space, Matrix, Ice, and Lava
- **4 game modes** — Classic, Time Attack, Endless, and Hardcore
- **10 unlockable achievements** — From your first merge to reaching the legendary 2048 tile
- **Rich statistics** — Track games played, highest tile, win rate, combos, and more
- **Local leaderboard** — Top 20 scores saved in the browser
- **Auto-save** — Resume your game anytime
- **Sound & haptics** — Merge sounds and vibration feedback on supported devices
- **Bilingual UI** — English and Turkish
- **Responsive design** — Keyboard, swipe, and touch controls with fullscreen support
- **Polished UX** — Framer Motion animations, particle backgrounds, combo tracking, and undo (except in Hardcore)

---

## Game Modes

| Mode | Description |
|------|-------------|
| **Classic** | The original 2048 experience — reach 2048 to win, then keep playing if you like |
| **Time Attack** | Score as high as you can in **120 seconds** |
| **Endless** | Same rules as Classic — built for players who want to push past 2048 |
| **Hardcore** | No undo allowed — every move counts |

---

## How to Play

1. Use **arrow keys** (desktop) or **swipe** (mobile) to slide all tiles in one direction.
2. When two tiles with the same number touch, they **merge into one** with double the value.
3. After each move, a new tile (**2** or **4**) appears in a random empty cell.
4. The game ends when the board is full and no merges are possible.
5. Reach **2048** to win — then choose to keep playing or start a new game.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- npm (comes with Node.js)

### Installation

```bash
# Clone the repository
git clone https://github.com/ernsimsek/2048.git
cd 2048

# Install dependencies
npm install

# Start the development server (opens in browser)
npm run dev
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Auto-fix lint issues |
| `npm run typecheck` | Run TypeScript checks via jsconfig |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 18 |
| Build tool | Vite 6 |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| UI components | Radix UI + shadcn/ui |
| Routing | React Router v6 |
| State | React Context |
| Icons | Lucide React |
| Effects | canvas-confetti |

Game logic lives in a pure JavaScript engine (`src/lib/gameEngine.js`) with no React dependencies, making it easy to test and reuse.

---

## Project Structure

```
2048/
├── src/
│   ├── components/
│   │   ├── game/          # Board, Tile, Navbar, overlays, modals
│   │   └── ui/            # Reusable shadcn/ui components
│   ├── lib/
│   │   ├── gameEngine.js  # Core 2048 logic
│   │   ├── GameContext.jsx # Game state & actions
│   │   ├── themes.js      # Visual theme definitions
│   │   ├── achievements.js
│   │   ├── storage.js     # localStorage persistence
│   │   ├── sounds.js      # Audio & vibration
│   │   └── translations.js
│   ├── pages/
│   │   ├── Home.jsx       # Landing page
│   │   └── Game.jsx       # Main game screen
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── vite.config.js
└── package.json
```

---

## Controls

| Input | Action |
|-------|--------|
| `↑` `↓` `←` `→` | Move tiles |
| Swipe (touch) | Move tiles on mobile |
| Undo button | Revert last move (disabled in Hardcore) |
| Restart button | Start a new game in the current mode |
| Navbar | Theme, language, sound, and fullscreen toggles |

---

## Achievements

| Achievement | Condition |
|-------------|-----------|
| First Merge | Complete your first merge |
| Reach 128 / 256 / 512 / 1024 / 2048 | Create the corresponding tile |
| Combo Master | Achieve a 5× combo in a single move chain |
| Fast Thinker | Win in under 500 moves |
| No Undo Win | Win without using undo |
| Persistent | Play 50 games |

Progress is saved automatically in the browser.

---

## Data & Privacy

All game data — scores, stats, achievements, theme, and language preferences — is stored locally in **localStorage**. Nothing is sent to a server unless you extend the app with backend integration.

---

## Browser Support

Works in all modern browsers that support ES modules and localStorage:

- Chrome / Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome for Android)

---

