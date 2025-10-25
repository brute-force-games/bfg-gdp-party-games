// import { z } from "zod";
// import { 
//   GameTableSeatSchema,
//   BfgGameSpecificTableAction,
//   GameTableActionResult,
//   createBfgGameEngineProcessor,
//   IBfgGameEngineProcessor
// } from "@bfg-engine";
// import { PLAYER_SEATS, GameTableSeat } from "@bfg-engine/models/game-table/game-table";
// import { BfgGameTableActionId } from "@bfg-engine/models/types/bfg-branded-ids";
// import { createBingoCombinationRepresentationAndInput, createBingoHostRepresentation, createBingoInput, createBingoRepresentation } from "../ui/bingo-components-factory";
// import { BingoGameName } from "../game-box";
// import { GameTable } from "@bfg-engine/models/game-table/game-table";
// import { BfgGameEngineRendererFactory } from "@bfg-engine/models/game-engine/bfg-game-engines";
// import { getActivePlayerSeatsForGameTable } from "@bfg-engine/ops/game-table-ops/player-seat-utils";



// // Bingo number range is 1-75
// // B: 1-15, I: 16-30, N: 31-45, G: 46-60, O: 61-75
// export const BingoNumberSchema = z.number().int().min(1).max(75);
// export type BingoNumber = z.infer<typeof BingoNumberSchema>;

// // A bingo card is a 5x5 grid with numbers (and a free space in the middle)
// export const BingoCardSchema = z.array(z.array(BingoNumberSchema.or(z.literal(0)))).length(5);
// export type BingoCard = z.infer<typeof BingoCardSchema>;

// // Track which numbers on each card are marked
// export const BingoCardMarksSchema = z.array(z.array(z.boolean())).length(5);
// export type BingoCardMarks = z.infer<typeof BingoCardMarksSchema>;

// export const AUTO_CALLER_ID = 'auto-caller' as const;
// export type AutoCallerId = typeof AUTO_CALLER_ID;

// export const BingCallerIdSchema = GameTableSeatSchema.or(z.literal(AUTO_CALLER_ID));
// export type BingCallerId = z.infer<typeof BingCallerIdSchema>;


// export const AUTO_CALL_INTERVAL_MIN = 1000;
// export const AUTO_CALL_INTERVAL_MAX = 60000;


// export const BingoGameConfigurationSchema = z.object({
//   callerSeat: BingCallerIdSchema,
//   callerCandidates: z.array(BingCallerIdSchema),
//   autoCallIntervalInMs: z.number()
//     .int().min(AUTO_CALL_INTERVAL_MIN).max(AUTO_CALL_INTERVAL_MAX)
//     .default(5000),
//   loseForFailedBingoCalls: z.boolean().default(false),
// }).describe('Bingo game configuration');

// export type BingoGameConfiguration = z.infer<typeof BingoGameConfigurationSchema>;


// export const BingoGameStateSchema = z.object({
//   configuration: BingoGameConfigurationSchema,

//   nextToActPlayers: z.array(GameTableSeatSchema),

//   // Player cards
//   playerCards: z.record(GameTableSeatSchema, BingoCardSchema.nullable()),
  
//   // Which numbers are marked on each player's card
//   playerMarks: z.record(GameTableSeatSchema, BingoCardMarksSchema.nullable()),
  
//   // Numbers that have been called
//   calledNumbers: z.array(BingoNumberSchema),
  
//   // Game status
//   isGameStarted: z.boolean(),
//   isGameOver: z.boolean(),
//   winner: GameTableSeatSchema.optional(),
//   outcomeSummary: z.string().optional(),
// }).describe('Bingo');

// export type BingoGameState = z.infer<typeof BingoGameStateSchema>;



// export const BINGO_GAME_TABLE_ACTION_INITIALIZE_GAME = 'game-table-action-host-initialize-game' as const;
// export const BINGO_GAME_TABLE_ACTION_UPDATE_CALLER_CANDIDATE = 'game-table-action-updates-caller-candidate' as const;
// export const BINGO_GAME_TABLE_ACTION_UPDATE_CONFIGURATION = 'game-table-action-updates-configuration' as const;
// export const BINGO_GAME_TABLE_ACTION_HOST_STARTS_GAME = 'game-table-action-host-starts-game' as const;
// export const BINGO_GAME_TABLE_ACTION_CALL_NUMBER = 'game-table-action-call-number' as const;
// export const BINGO_GAME_TABLE_ACTION_MARK_NUMBER = 'game-table-action-mark-number' as const;
// export const BINGO_GAME_TABLE_ACTION_CLAIM_BINGO = 'game-table-action-claim-bingo' as const;
// export const BINGO_GAME_TABLE_ACTION_CANCEL_GAME = 'game-table-action-cancel-game' as const;


// export const BingoHostInitializeGameSchema = z.object({
//   actionType: z.literal(BINGO_GAME_TABLE_ACTION_INITIALIZE_GAME),
//   playerSeats: z.array(GameTableSeatSchema),
// })

// export type BingoInitializeGame = z.infer<typeof BingoHostInitializeGameSchema>;


// export const BingoUpdateCallerCandidateSchema = z.object({
//   actionType: z.literal(BINGO_GAME_TABLE_ACTION_UPDATE_CALLER_CANDIDATE),
//   playerSeat: GameTableSeatSchema,
//   isCandidate: z.boolean(),
// })

// export type BingoUpdateCallerCandidate = z.infer<typeof BingoUpdateCallerCandidateSchema>;


// export const BingoHostUpdateConfigurationSchema = z.object({
//   actionType: z.literal(BINGO_GAME_TABLE_ACTION_UPDATE_CONFIGURATION),
//   seat: GameTableSeatSchema,
//   update: BingoGameConfigurationSchema,
// })

// export type BingoUpdateConfiguration = z.infer<typeof BingoHostUpdateConfigurationSchema>;


// export const BingoHostStartsGameSchema = z.object({
//   actionType: z.literal(BINGO_GAME_TABLE_ACTION_HOST_STARTS_GAME),
//   configuration: BingoGameConfigurationSchema,
// })

// export type BingoHostStartsGame = z.infer<typeof BingoHostStartsGameSchema>;

// export const BingoActionCallNumberSchema = z.object({
//   actionType: z.literal(BINGO_GAME_TABLE_ACTION_CALL_NUMBER),
//   seat: GameTableSeatSchema,
//   calledNumber: BingoNumberSchema,
// })

// export const BingoActionMarkNumberSchema = z.object({
//   actionType: z.literal(BINGO_GAME_TABLE_ACTION_MARK_NUMBER),
//   seat: GameTableSeatSchema,
//   markedNumber: BingoNumberSchema,
// })

// export const BingoActionClaimBingoSchema = z.object({
//   actionType: z.literal(BINGO_GAME_TABLE_ACTION_CLAIM_BINGO),
//   seat: GameTableSeatSchema,
// })

// export const BingoActionCancelGameSchema = z.object({
//   actionType: z.literal(BINGO_GAME_TABLE_ACTION_CANCEL_GAME),
//   seat: GameTableSeatSchema,
//   cancellationReason: z.string(),
// })

// export const BingoGameActionSchema = z.discriminatedUnion('actionType', [
//   // BingoInitializeGameSchema,
//   // BingoUpdateConfigurationSchema,
//   BingoUpdateCallerCandidateSchema,
//   // BingoHostStartsGameSchema,
//   BingoActionCallNumberSchema, 
//   BingoActionMarkNumberSchema,
//   BingoActionClaimBingoSchema,
//   BingoActionCancelGameSchema,
// ])

// export type BingoGameAction = z.infer<typeof BingoGameActionSchema>;


// export const BingoGameHostActionSchema = z.discriminatedUnion('actionType', [
//   BingoHostInitializeGameSchema,
//   BingoHostUpdateConfigurationSchema,
//   // BingoUpdateCallerCandidateSchema,
//   BingoHostStartsGameSchema,
//   // BingoActionCallNumberSchema, 
//   // BingoActionMarkNumberSchema,
//   // BingoActionClaimBingoSchema,
//   // BingoActionCancelGameSchema,
// ])

// export type BingoGameHostAction = z.infer<typeof BingoGameHostActionSchema>;


// // Helper function to generate a random bingo card
// const generateBingoCard = (): BingoCard => {
//   const card: BingoCard = [];
  
//   // B column: 1-15
//   // I column: 16-30
//   // N column: 31-45 (with free space at [2][2])
//   // G column: 46-60
//   // O column: 61-75
  
//   for (let col = 0; col < 5; col++) {
//     const min = col * 15 + 1;
//     const availableNumbers = Array.from({ length: 15 }, (_, i) => min + i);
    
//     // Shuffle and pick 5 numbers
//     const shuffled = availableNumbers.sort(() => Math.random() - 0.5);
//     const columnNumbers = shuffled.slice(0, 5);
    
//     for (let row = 0; row < 5; row++) {
//       if (!card[row]) {
//         card[row] = [];
//       }
      
//       // Free space in the middle
//       if (row === 2 && col === 2) {
//         card[row][col] = 0; // 0 represents free space
//       } else {
//         card[row][col] = columnNumbers[row];
//       }
//     }
//   }
  
//   return card;
// };

// // Helper function to create initial marks (with free space already marked)
// const createInitialMarks = (): BingoCardMarks => {
//   const marks: BingoCardMarks = Array(5).fill(null).map(() => Array(5).fill(false));
//   marks[2][2] = true; // Free space is always marked
//   return marks;
// };

// // Helper function to check if a player has bingo
// const checkForBingo = (marks: BingoCardMarks): boolean => {
//   // Check rows
//   for (let row = 0; row < 5; row++) {
//     if (marks[row].every(marked => marked)) {
//       return true;
//     }
//   }
  
//   // Check columns
//   for (let col = 0; col < 5; col++) {
//     if (marks.every(row => row[col])) {
//       return true;
//     }
//   }
  
//   // Check diagonal (top-left to bottom-right)
//   if (marks.every((row, idx) => row[idx])) {
//     return true;
//   }
  
//   // Check diagonal (top-right to bottom-left)
//   if (marks.every((row, idx) => row[4 - idx])) {
//     return true;
//   }
  
//   return false;
// };


// const createInitialGameState = (
//   initialGameTableAction: BingoGameHostAction,
// ): BingoGameState => {

//   if (initialGameTableAction.actionType !== BINGO_GAME_TABLE_ACTION_INITIALIZE_GAME) {
//     throw new Error("Initial game table action must be a host start game");
//   }

//   // Generate cards for players
//   const playerCards = {} as Record<GameTableSeat, BingoCard | null>;
//   const playerMarks = {} as Record<GameTableSeat, BingoCardMarks | null>;
  
//   initialGameTableAction.playerSeats.forEach(seat => {
//     playerCards[seat] = generateBingoCard();
//     playerMarks[seat] = createInitialMarks();
//   });

//   const nonPlayerSeats = PLAYER_SEATS.filter(seat => !initialGameTableAction.playerSeats.includes(seat));
//   nonPlayerSeats.forEach(seat => {
//     playerCards[seat] = null;
//     playerMarks[seat] = null;
//   });

//   const defaultConfiguration: BingoGameConfiguration = {
//     callerSeat: 'auto-caller',
//     callerCandidates: ['auto-caller'],
//     autoCallIntervalInMs: 5000,
//     loseForFailedBingoCalls: false,
//   };

//   return {
//     configuration: defaultConfiguration,
//     nextToActPlayers: initialGameTableAction.playerSeats,
//     playerCards,
//     playerMarks,
//     calledNumbers: [],
//     isGameStarted: false,
//     isGameOver: false,
//   };
// }


// const createInitialBingoGameTableAction = (
//   newGameTable: GameTable,
// ): BfgGameSpecificTableAction<BingoGameHostAction> => {

//   const playerSeats = getActivePlayerSeatsForGameTable(newGameTable);

//   // const playerSeats = PLAYER_SEATS.filter(seat => newGameTable[seat]);

//   return {
//     actionType: 'game-table-action-host-starts-game',
//     gameSpecificAction: {
//       actionType: BINGO_GAME_TABLE_ACTION_INITIALIZE_GAME,
//       playerSeats,
//     },
//     gameTableActionId: BfgGameTableActionId.createId(),
//     source: 'game-table-action-source-host',
//   };
// }


// const applyBingoGameAction = (
//   _tableState: GameTable,
//   gameState: BingoGameState,
//   gameAction: BingoGameAction,
// ): GameTableActionResult<BingoGameState> => {

//   console.log("APPLY BINGO GAME ACTION - GAME STATE", gameState);
//   console.log("APPLY BINGO GAME ACTION - GAME ACTION", gameAction);

//   // if (gameAction.actionType === BINGO_GAME_TABLE_ACTION_UPDATE_CONFIGURATION) {
//   //   const updatedConfiguration = {
//   //     ...gameState.configuration,
//   //     ...gameAction.update,
//   //   };

//   //   const summary = `Configuration updated by ${gameAction.seat}: ${JSON.stringify(updatedConfiguration)}`;
//   //   return {
//   //     tablePhase: 'table-phase-game-in-progress',
//   //     gameSpecificState: {
//   //       ...gameState,
//   //       configuration: updatedConfiguration,
//   //     },
//   //     gameSpecificStateSummary: summary,
//   //   }
//   // }

//   if (gameAction.actionType === BINGO_GAME_TABLE_ACTION_UPDATE_CALLER_CANDIDATE) {
//     console.log("UPDATE CALLER CANDIDATE - GAME ACTION", gameAction);
    
//     const candidateSeat = gameAction.playerSeat;
//     const updatedCallerCandidates = gameAction.isCandidate ?
//       [...gameState.configuration.callerCandidates, candidateSeat] :
//       gameState.configuration.callerCandidates.filter(candidate => candidate !== candidateSeat);

//     const actionDescription = gameAction.isCandidate ? 'added' : 'removed';
//     const summary = `Caller candidate ${candidateSeat} ${actionDescription} as a caller`;

//     return {
//       tablePhase: 'table-phase-game-in-progress',
//       gameSpecificState: {
//         ...gameState,
//         configuration: {
//           ...gameState.configuration,
//           callerCandidates: updatedCallerCandidates,
//         },
//       },
//       gameSpecificStateSummary: summary,
//     }
//   }

//   // if (gameAction.actionType === BINGO_GAME_TABLE_ACTION_HOST_STARTS_GAME) {
//   //   return {
//   //     tablePhase: 'table-phase-game-complete-with-winners',
//   //     gameSpecificState: {
//   //       ...gameState,
//   //       isGameStarted: true,
//   //       winner: undefined,
//   //       outcomeSummary: 'Game started',
//   //     },
//   //     gameSpecificStateSummary: 'Game started',
//   //   };
//   // }

//   if (gameAction.actionType === BINGO_GAME_TABLE_ACTION_CALL_NUMBER) {
//     // Check if number already called
//     if (gameState.calledNumbers.includes(gameAction.calledNumber)) {
//       const summary = `Number ${gameAction.calledNumber} was already called`;
//       return {
//         tablePhase: 'table-phase-game-in-progress',
//         gameSpecificState: gameState,
//         gameSpecificStateSummary: summary,
//       };
//     }

//     const summary = `Player ${gameAction.seat} called number ${gameAction.calledNumber}`;

//     return {
//       tablePhase: 'table-phase-game-in-progress',
//       gameSpecificState: {
//         ...gameState,
//         calledNumbers: [...gameState.calledNumbers, gameAction.calledNumber],
//         outcomeSummary: summary,
//       },
//       gameSpecificStateSummary: summary,
//     }
//   } 

//   if (gameAction.actionType === BINGO_GAME_TABLE_ACTION_MARK_NUMBER) {
//     const playerCard = gameState.playerCards[gameAction.seat];
//     const playerMarks = gameState.playerMarks[gameAction.seat];

//     if (!playerCard || !playerMarks) {
//       const summary = `Player ${gameAction.seat} data not found`;
//       return {
//         tablePhase: 'table-phase-error',
//         gameSpecificState: gameState,
//         gameSpecificStateSummary: summary,
//       };
//     }
    
//     // Check if the number is on the player's card
//     let found = false;
//     let newMarks = playerMarks.map(row => [...row]);
    
//     for (let row = 0; row < 5; row++) {
//       for (let col = 0; col < 5; col++) {
//         if (playerCard[row][col] === gameAction.markedNumber) {
//           newMarks[row][col] = true;
//           found = true;
//           break;
//         }
//       }
//       if (found) break;
//     }
    
//     if (!found) {
//       const summary = `Player ${gameAction.seat} tried to mark ${gameAction.markedNumber} but it's not on their card`;
//       return {
//         tablePhase: 'table-phase-game-in-progress',
//         gameSpecificState: gameState,
//         gameSpecificStateSummary: summary,
//       };
//     }

//     const summary = `Player ${gameAction.seat} marked number ${gameAction.markedNumber}`;

//     return {
//       tablePhase: 'table-phase-game-in-progress',
//       gameSpecificState: {
//         ...gameState,
//         playerMarks: {
//           ...gameState.playerMarks,
//           [gameAction.seat]: newMarks,
//         },
//         outcomeSummary: summary,
//       },
//       gameSpecificStateSummary: summary,
//     }
//   }

//   if (gameAction.actionType === BINGO_GAME_TABLE_ACTION_CLAIM_BINGO) {
//     const playerMarks = gameState.playerMarks[gameAction.seat];

//     if (!playerMarks) {
//       const summary = `Player ${gameAction.seat} data not found`;
//       return {
//         tablePhase: 'table-phase-error',
//         gameSpecificState: gameState,
//         gameSpecificStateSummary: summary,
//       };
//     }
//     if (checkForBingo(playerMarks)) {
//       const summary = `Player ${gameAction.seat} got BINGO and wins!`;

//       return {
//         tablePhase: 'table-phase-game-complete-with-winners',
//         gameSpecificState: {
//           ...gameState,
//           isGameOver: true,
//           winner: gameAction.seat,
//           outcomeSummary: summary,
//         },
//         gameSpecificStateSummary: summary,
//       }
//     } else {
//       const summary = `Player ${gameAction.seat} claimed BINGO but doesn't have a winning pattern`;
      
//       return {
//         tablePhase: 'table-phase-game-in-progress',
//         gameSpecificState: {
//           ...gameState,
//           outcomeSummary: summary,
//         },
//         gameSpecificStateSummary: summary,
//       }
//     }
//   }

//   if (gameAction.actionType === BINGO_GAME_TABLE_ACTION_CANCEL_GAME) {
//     return {
//       tablePhase: 'table-phase-game-abandoned',
//       gameSpecificState: {
//         ...gameState,
//         isGameOver: true,
//         outcomeSummary: gameAction.cancellationReason,
//       },
//       gameSpecificStateSummary: gameAction.cancellationReason,
//     }
//   }

//   return {
//     tablePhase: 'table-phase-error',
//     gameSpecificState: gameState,
//     gameSpecificStateSummary: `Error - invalid game action`,
//   };
// }


// const bingoRendererFactory: BfgGameEngineRendererFactory<
//   typeof BingoGameStateSchema,
//   typeof BingoGameActionSchema
// > = {
//   createGameStateHostComponent: createBingoHostRepresentation,
//   createGameStateRepresentationComponent: createBingoRepresentation,
//   createGameStateActionInputComponent: createBingoInput,
//   createGameStateCombinationRepresentationAndInputComponent: createBingoCombinationRepresentationAndInput,
// }


// const bingoProcessorImplementation: IBfgGameEngineProcessor<
//   typeof BingoGameStateSchema,
//   typeof BingoGameActionSchema
// > = {
//   gameTitle: BingoGameName,

//   applyGameAction: applyBingoGameAction,

//   createInitialGameSpecificState: createInitialGameState,
//   createInitialGameTableAction: createInitialBingoGameTableAction,

//   createGameStateRepresentationComponent: createBingoRepresentation,
//   createGameStateActionInputComponent: createBingoInput,
//   createGameStateHostComponent: createBingoHostRepresentation,

//   createGameStateCombinationRepresentationAndInputComponent: createBingoCombinationRepresentationAndInput,
// }



// export const BingoGameStateProcessor = createBfgGameEngineProcessor(
//   BingoGameName,
//   BingoGameStateSchema,
//   BingoGameActionSchema,

//   bingoProcessorImplementation,
//   bingoRendererFactory,
// );
