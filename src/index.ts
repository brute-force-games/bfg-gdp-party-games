// // Party Games Registry
// // This file exports the initialization function for all party games

// import { registerGame } from "@bfg-engine";
// import { BingoGameName, BingoGameDefinition } from "./game-definitions/bingo/game-box";
// import { BingoGameStateSchema, BingoPlayerActionSchema, BingoHostAction, BingoPlayerAction, BingoGameState } from "./game-definitions/bingo/engine/bingo-engine";
// import { BingoHostActionSchema } from "./game-definitions/bingo/engine/bingo-engine";
// import { BingoHistoryComponent, BingoHostComponent, BingoObserverComponent, BingoPlayerComponent } from "./game-definitions/bingo/ui/bingo-components";
// import { createCompleteGameMetadata } from "@bfg-engine/game-metadata/metadata-factory";
// import { createCompleteTypesForBfgGameMetadata } from "../../bfg-engine/src/game-metadata/metadata-types";
// import type { BfgGameEngineComponents } from "../../bfg-engine/src/game-metadata/ui/bfg-game-components";


// const BingoGameComponents: BfgGameEngineComponents<
//   BingoGameState,
//   BingoGameState,
//   BingoPlayerAction,
//   BingoHostAction,
//   null
// > = {
//   ObserverComponent: BingoObserverComponent,
//   PlayerComponent: BingoPlayerComponent,
//   HostComponent: BingoHostComponent,
//   HistoryComponent: BingoHistoryComponent,
// }


// // const BingoGameSchemas: BfgGameEngineSchemas = {
// //   hostGameStateSchema: BingoGameStateSchema,
// //   publicGameStateSchema: BingoGameStateSchema,
// //   playerActionSchema: BingoPlayerActionSchema,
// //   hostActionSchema: BingoHostActionSchema,
// //   playerActionOutcomeSchema: BfgGameSpecificPlayerActionOutcomeSchema,
// //   hostActionOutcomeSchema: BfgGameSpecificHostActionOutcomeSchema,
// //   privatePlayerKnowledgeSchema: BfgPrivatePlayerKnowledgeImplStateSchema,
// // };


// export const BingoGameCompleteTypes = createCompleteTypesForBfgGameMetadata({
//   hostGameStateSchema: BingoGameStateSchema,
//   playerGameStateSchema: BingoGameStateSchema,
//   watcherGameStateSchema: BingoGameStateSchema,
//   playerActionSchema: BingoPlayerActionSchema,
//   hostActionSchema: BingoHostActionSchema,
//   playerActionOutcomeSchema: BfgGameSpecificPlayerActionOutcomeSchema,
//   hostActionOutcomeSchema: BfgGameSpecificHostActionOutcome,
// });


// const BingoGameMetadata = createCompleteGameMetadata(
//   BingoGameName,
//   BingoGameDefinition,
//   BingoGameCompleteTypes,
//   // BingoGameSchemas,
//   // BingoGameProcessor,
//   BingoGameComponents
// );

// /**
//  * Initialize and register all party games with the BFG Engine
//  * Call this function during your app initialization to make party games available
//  */
// export const initPartyGames = () => {
//   registerGame(BingoGameMetadata);
//   console.log('Party games module initialized');
// };

// // Export individual game definitions
// export { BingoGameName, BingoGameDefinition } from './game-definitions/bingo/game-box';
