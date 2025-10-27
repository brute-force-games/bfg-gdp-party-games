// Party Games Registry
// This file exports the initialization function for all party games

import { registerGame } from "@bfg-engine";
import { BingoGameName, BingoGameDefinition } from "./game-definitions/bingo/game-box";
import { BingoGameStateSchema, BingoPlayerActionSchema, BingoHostAction, BingoPlayerAction, BingoGameState, BingoGameProcessor } from "./game-definitions/bingo/engine/bingo-engine";
import { BingoHostActionSchema } from "./game-definitions/bingo/engine/bingo-engine";
import { BfgAllPublicKnowledgeGameEngineComponents } from "@bfg-engine/models/game-engine/bfg-game-engine-types";
import { BfgGameEngineMetadata } from "@bfg-engine/models/bfg-game-engines";
import { BingoHistoryComponent, BingoHostComponent, BingoObserverComponent, BingoPlayerComponent } from "./game-definitions/bingo/ui/bingo-components";
import { createJsonZodObjectDataEncoder } from "@bfg-engine/models/game-engine/encoders";



const BingoGameComponents: BfgAllPublicKnowledgeGameEngineComponents<
  BingoGameState,
  BingoPlayerAction,
  BingoHostAction
> = {
  ObserverComponent: BingoObserverComponent,
  PlayerComponent: BingoPlayerComponent,
  HostComponent: BingoHostComponent,
  HistoryComponent: BingoHistoryComponent,
}


// Create metadata objects with game definitions
const BingoGameMetadata: BfgGameEngineMetadata<BingoGameState, BingoPlayerAction, BingoHostAction> = {
  gameTitle: BingoGameName,
  definition: BingoGameDefinition,

  // gameSpecificStateSchema: BingoGameStateSchema,
  // playerActionSchema: BingoPlayerActionSchema,
  // hostActionSchema: BingoHostActionSchema,

  gameSpecificStateEncoder: createJsonZodObjectDataEncoder(BingoGameStateSchema),
  playerActionEncoder: createJsonZodObjectDataEncoder(BingoPlayerActionSchema),
  hostActionEncoder: createJsonZodObjectDataEncoder(BingoHostActionSchema),

  engine: BingoGameProcessor,
  components: BingoGameComponents,
  
  // processor: BingoGameStateProcessor
  // engine: BingoGameStateEngine
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

