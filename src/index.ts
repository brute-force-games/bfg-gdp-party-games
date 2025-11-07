// Party Games Registry
// This file exports the initialization function for all party games

import { registerGame } from "@bfg-engine";
import { BingoGameName, BingoGameDefinition } from "./game-definitions/bingo/game-box";
import { BingoGameStateSchema, BingoPlayerActionSchema, BingoHostAction, BingoPlayerAction, BingoGameState, BingoGameProcessor } from "./game-definitions/bingo/engine/bingo-engine";
import { BingoHostActionSchema } from "./game-definitions/bingo/engine/bingo-engine";
import { BfgAllPublicKnowledgeGameEngineComponents, BfgPrivatePlayerKnowledgeImplStateSchema } from "@bfg-engine/models/game-engine/bfg-game-engine-types";
import { BingoHistoryComponent, BingoHostComponent, BingoObserverComponent, BingoPlayerComponent } from "./game-definitions/bingo/ui/bingo-components";
import { createPublicKnowledgeGameMetadata } from "@bfg-engine/game-metadata/metadata-factory";
import { BfgGameEngineSchemas } from "@bfg-engine/models/game-engine/bfg-game-engine-schemas";


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


const BingoGameSchemas: BfgGameEngineSchemas = {
  hostGameStateSchema: BingoGameStateSchema,
  publicGameStateSchema: BingoGameStateSchema,
  playerActionSchema: BingoPlayerActionSchema,
  hostActionSchema: BingoHostActionSchema,
  privatePlayerKnowledgeSchema: BfgPrivatePlayerKnowledgeImplStateSchema,
};


const BingoGameMetadata = createPublicKnowledgeGameMetadata(
  BingoGameName,
  BingoGameDefinition,
  BingoGameSchemas,
  BingoGameProcessor,
  BingoGameComponents
);

/**
 * Initialize and register all party games with the BFG Engine
 * Call this function during your app initialization to make party games available
 */
export const initPartyGames = () => {
  registerGame(BingoGameMetadata);
  console.log('Party games module initialized');
};

// Export individual game definitions
export { BingoGameName, BingoGameDefinition } from './game-definitions/bingo/game-box';
