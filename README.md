# BFG GDP Party Games

A collection of party game definitions built using the BFG Engine.

## Games Included

This module will contain multiplayer party games designed for group play, such as:
- Drawing and guessing games
- Trivia games
- Word games
- Team-based games

## Usage

```typescript
import { initPartyGames } from '@brute-force-games/bfg-gdp-party-games';

// Initialize all party games
initPartyGames();
```

## Game Definition Structure

Each game is defined using a `GameDefinition` object that includes:

- **Basic Info**: Name, description, version, author
- **Player Configuration**: Min/max players, team settings
- **Game Engine**: State processor and game logic
- **UI Components**: React components for rendering game state
- **Assets**: Optional game assets (images, sounds, etc.)

## Development

```bash
# Install dependencies
npm install

# Build the library
npm run build

# Watch mode for development
npm run dev

# Type checking
npm run type-check
```

## Adding New Games

1. Create a new directory in `src/game-definitions/`
2. Create the following files:
   - `game-box.ts` - Game definition and metadata
   - `engine/[game-name]-engine.ts` - Game state processor
   - `components/[game-name]-view.tsx` - React UI components
3. Export the game from `src/index.ts`
4. Register the game using `registerGame`

Example structure:

```typescript
// src/game-definitions/my-party-game/game-box.ts
export const MyPartyGameName = 'my-party-game' as const;

export const MyPartyGameDefinition: GameBoxDefinition = {
  name: MyPartyGameName,
  displayName: 'My Party Game',
  description: 'A fun party game',
  version: '1.0.0',
  author: 'Your Name',
  minPlayers: 2,
  maxPlayers: 8,
  // ... other configuration
};

// src/game-definitions/my-party-game/engine/my-party-game-engine.ts
export const MyPartyGameStateProcessor: GameStateProcessor = {
  // Game logic implementation
};

// src/index.ts
import { registerGame } from '@bfg-engine';
import { MyPartyGameName, MyPartyGameDefinition } from './game-definitions/my-party-game/game-box';
import { MyPartyGameStateProcessor } from './game-definitions/my-party-game/engine/my-party-game-engine';

export const initPartyGames = () => {
  registerGame(MyPartyGameName, MyPartyGameDefinition, {
    definition: MyPartyGameDefinition,
    processor: MyPartyGameStateProcessor
  });
};
```

## License

AGPL-3.0

