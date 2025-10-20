// Party Games Registry
// This file exports the initialization function for all party games

import { registerGame } from "@bfg-engine";
import { BingoGameName, BingoGameDefinition } from "./game-definitions/bingo/game-box";
import { BingoGameStateProcessor } from "./game-definitions/bingo/engine/bingo-engine";

// Create metadata objects with game definitions
const BingoGameMetadata = {
  definition: BingoGameDefinition,
  processor: BingoGameStateProcessor
};

/**
 * Initialize and register all party games with the BFG Engine
 * Call this function during your app initialization to make party games available
 */
export const initPartyGames = () => {
  registerGame(BingoGameName, BingoGameDefinition, BingoGameMetadata);
  console.log('Party games module initialized');
};

// Export individual game definitions
export { BingoGameName, BingoGameDefinition } from './game-definitions/bingo/game-box';

