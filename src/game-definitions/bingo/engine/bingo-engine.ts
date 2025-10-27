import { z } from "zod";
import { 
  GameTableSeatSchema,
  GameTableActionResult} from "@bfg-engine";
import { PLAYER_SEATS, GameTableSeat } from "@bfg-engine/models/game-table/game-table";
import { BingoGameName } from "../game-box";
import { GameTable } from "@bfg-engine/models/game-table/game-table";
import { BfgGameImplHostActionSchema, BfgGameImplPlayerActionSchema, BfgPublicGameImplStateSchema } from "@bfg-engine/models/game-engine/bfg-game-engine-types";
import { IBfgAllPublicKnowledgeGameProcessor } from "@bfg-engine/models/game-engine/bfg-game-engine-processor";
import { GameLobby } from "@bfg-engine/models/p2p-lobby";
import { BfgGameSpecificTableAction } from "@bfg-engine/models/game-table/game-table-action";
import { getActivePlayerSeatsForGameTable } from "@bfg-engine/ops/game-table-ops/player-seat-utils";


// Bingo number range is 1-75
// B: 1-15, I: 16-30, N: 31-45, G: 46-60, O: 61-75
export const BingoNumberSchema = z.number().int().min(1).max(75);
export type BingoNumber = z.infer<typeof BingoNumberSchema>;

// A bingo card is a 5x5 grid with numbers (and a free space in the middle)
export const BingoCardSchema = z.array(z.array(BingoNumberSchema.or(z.literal(0)))).length(5);
export type BingoCard = z.infer<typeof BingoCardSchema>;

// Track which numbers on each card are marked
export const BingoCardMarksSchema = z.array(z.array(z.boolean())).length(5);
export type BingoCardMarks = z.infer<typeof BingoCardMarksSchema>;

export const AUTO_CALLER_ID = 'auto-caller' as const;
export type AutoCallerId = typeof AUTO_CALLER_ID;

export const BingoCallerIdSchema = GameTableSeatSchema;
  // .or(z.literal(AUTO_CALLER_ID));
export type BingoCallerId = z.infer<typeof BingoCallerIdSchema>;


export const AUTO_CALL_INTERVAL_MIN = 1000;
export const AUTO_CALL_INTERVAL_MAX = 60000;


export const BingoGameConfigurationSchema = z.object({
  callerSeat: BingoCallerIdSchema.optional(),
  callerCandidates: z.array(BingoCallerIdSchema),
  autoCallIntervalInMs: z.number()
    .int().min(AUTO_CALL_INTERVAL_MIN).max(AUTO_CALL_INTERVAL_MAX),
  loseForFailedBingoCalls: z.boolean().default(false).optional(),

  canStartGame: z.boolean(),
}).describe('Bingo game configuration');

export type BingoGameConfiguration = z.infer<typeof BingoGameConfigurationSchema>;


export const BingoGameStateSchema = BfgPublicGameImplStateSchema.extend({
  configuration: BingoGameConfigurationSchema,

  nextToActPlayers: z.array(GameTableSeatSchema),

  // Player cards
  playerCards: z.record(GameTableSeatSchema, BingoCardSchema.nullable()),
  
  // Which numbers are marked on each player's card
  playerMarks: z.record(GameTableSeatSchema, BingoCardMarksSchema.nullable()),
  
  // Numbers that have been called
  calledNumbers: z.array(BingoNumberSchema),
  lastCalledNumberTimestamp: z.number().optional(),

  eliminatedPlayers: z.array(GameTableSeatSchema),
  
  // Game status
  isGameStarted: z.boolean(),
  isGameOver: z.boolean(),
  winner: GameTableSeatSchema.optional(),
  outcomeSummary: z.string().optional(),
}).describe('Bingo');

export type BingoGameState = z.infer<typeof BingoGameStateSchema>;



export const BINGO_GAME_TABLE_ACTION_INITIALIZE_GAME = 'game-table-action-host-initialize-game' as const;
export const BINGO_GAME_TABLE_ACTION_UPDATE_CALLER_CANDIDATE = 'game-table-action-updates-caller-candidate' as const;
export const BINGO_GAME_TABLE_ACTION_UPDATE_CONFIGURATION = 'game-table-action-host-update-configuration' as const;
export const BINGO_GAME_TABLE_ACTION_HOST_STARTS_GAME = 'game-table-action-host-starts-game' as const;
export const BINGO_GAME_TABLE_ACTION_CALL_NUMBER = 'game-table-action-call-number' as const;
export const BINGO_GAME_TABLE_ACTION_MARK_NUMBER = 'game-table-action-mark-number' as const;
export const BINGO_GAME_TABLE_ACTION_CLAIM_BINGO = 'game-table-action-claim-bingo' as const;
export const BINGO_GAME_TABLE_ACTION_CANCEL_GAME = 'game-table-action-cancel-game' as const;


export const BingoHostInitializeGameSchema = BfgGameImplHostActionSchema.extend({
  hostActionType: z.literal(BINGO_GAME_TABLE_ACTION_INITIALIZE_GAME),
})

export type BingoHostInitializeGame = z.infer<typeof BingoHostInitializeGameSchema>;


export const BingoUpdateCallerCandidateSchema = BfgGameImplPlayerActionSchema.extend({
  playerActionType: z.literal(BINGO_GAME_TABLE_ACTION_UPDATE_CALLER_CANDIDATE),
  playerSeat: GameTableSeatSchema,
  isCandidate: z.boolean(),
})

export type BingoUpdateCallerCandidate = z.infer<typeof BingoUpdateCallerCandidateSchema>;


export const BingoHostUpdateConfigurationSchema = BfgGameImplHostActionSchema.extend({
  hostActionType: z.literal(BINGO_GAME_TABLE_ACTION_UPDATE_CONFIGURATION),
  update: BingoGameConfigurationSchema,
})

export type BingoUpdateConfiguration = z.infer<typeof BingoHostUpdateConfigurationSchema>;


export const BingoHostStartsGameSchema = BfgGameImplHostActionSchema.extend({
  hostActionType: z.literal(BINGO_GAME_TABLE_ACTION_HOST_STARTS_GAME),
  configuration: BingoGameConfigurationSchema,
})

export type BingoHostStartsGame = z.infer<typeof BingoHostStartsGameSchema>;

export const BingoActionCallNumberSchema = BfgGameImplPlayerActionSchema.extend({
  playerActionType: z.literal(BINGO_GAME_TABLE_ACTION_CALL_NUMBER),
  seat: GameTableSeatSchema,
  calledNumber: BingoNumberSchema,
})

export const BingoActionMarkNumberSchema = BfgGameImplPlayerActionSchema.extend({
  playerActionType: z.literal(BINGO_GAME_TABLE_ACTION_MARK_NUMBER),
  seat: GameTableSeatSchema,
  markedNumber: BingoNumberSchema,
})

export const BingoActionClaimBingoSchema = BfgGameImplPlayerActionSchema.extend({
  playerActionType: z.literal(BINGO_GAME_TABLE_ACTION_CLAIM_BINGO),
  seat: GameTableSeatSchema,
})

export const BingoActionCancelGameSchema = BfgGameImplPlayerActionSchema.extend({
  playerActionType: z.literal(BINGO_GAME_TABLE_ACTION_CANCEL_GAME),
  seat: GameTableSeatSchema,
  cancellationReason: z.string(),
})


export const BingoPlayerActionSchema = z.discriminatedUnion('playerActionType', [
  BingoUpdateCallerCandidateSchema,
  BingoActionCallNumberSchema, 
  BingoActionMarkNumberSchema,
  BingoActionClaimBingoSchema,
  BingoActionCancelGameSchema,
])


export type BingoPlayerAction = z.infer<typeof BingoPlayerActionSchema>;


export const BingoHostActionSchema = z.discriminatedUnion('hostActionType', [
  BingoHostInitializeGameSchema,
  BingoHostUpdateConfigurationSchema,
  BingoHostStartsGameSchema,
])

export type BingoHostAction = z.infer<typeof BingoHostActionSchema>;


export const DEFAULT_BINGO_GAME_CONFIGURATION: BingoGameConfiguration = {
  callerSeat: undefined,
  callerCandidates: [],
  autoCallIntervalInMs: 5000,
  loseForFailedBingoCalls: false,
  canStartGame: false,
};


// Helper function to generate a random bingo card
const generateBingoCard = (): BingoCard => {
  const card: BingoCard = [];
  
  // B column: 1-15
  // I column: 16-30
  // N column: 31-45 (with free space at [2][2])
  // G column: 46-60
  // O column: 61-75
  
  for (let col = 0; col < 5; col++) {
    const min = col * 15 + 1;
    const availableNumbers = Array.from({ length: 15 }, (_, i) => min + i);
    
    // Shuffle and pick 5 numbers
    const shuffled = availableNumbers.sort(() => Math.random() - 0.5);
    const columnNumbers = shuffled.slice(0, 5);
    
    for (let row = 0; row < 5; row++) {
      if (!card[row]) {
        card[row] = [];
      }
      
      // Free space in the middle
      if (row === 2 && col === 2) {
        card[row][col] = 0; // 0 represents free space
      } else {
        card[row][col] = columnNumbers[row];
      }
    }
  }
  
  return card;
};

// Helper function to create initial marks (with free space already marked)
const createInitialMarks = (): BingoCardMarks => {
  const marks: BingoCardMarks = Array(5).fill(null).map(() => Array(5).fill(false));
  marks[2][2] = true; // Free space is always marked
  return marks;
};

// Helper function to check if a player has bingo
const checkForBingo = (marks: BingoCardMarks): boolean => {
  // Check rows
  for (let row = 0; row < 5; row++) {
    if (marks[row].every(marked => marked)) {
      return true;
    }
  }
  
  // Check columns
  for (let col = 0; col < 5; col++) {
    if (marks.every(row => row[col])) {
      return true;
    }
  }
  
  // Check diagonal (top-left to bottom-right)
  if (marks.every((row, idx) => row[idx])) {
    return true;
  }
  
  // Check diagonal (top-right to bottom-left)
  if (marks.every((row, idx) => row[4 - idx])) {
    return true;
  }
  
  return false;
};


const createInitialGameSpecificAction = (
  _gameTable: GameTable, 
  _lobbyState: GameLobby
): BfgGameSpecificTableAction<BingoHostAction> => {
  return {
    gameTableActionId: `action-${Date.now()}` as any, // This should be properly generated
    source: 'game-table-action-source-host',
    actionType: 'game-table-action-host-starts-game',
    gameSpecificAction: {
      source: 'host',
      hostActionType: BINGO_GAME_TABLE_ACTION_INITIALIZE_GAME,
    },
  };
}


const createInitialGameState = (
  gameTable: GameTable, 
  gameSpecificInitialAction: BfgGameSpecificTableAction<BingoHostAction>
): BingoGameState => {

  if (gameSpecificInitialAction.gameSpecificAction.hostActionType !== BINGO_GAME_TABLE_ACTION_INITIALIZE_GAME) {
    throw new Error("Initial game table action must be a host initialize game");
  }

  // Generate cards for players
  const playerCards = {} as Record<GameTableSeat, BingoCard | null>;
  const playerMarks = {} as Record<GameTableSeat, BingoCardMarks | null>;

  const playerSeats = getActivePlayerSeatsForGameTable(gameTable);
  
  playerSeats.forEach(seat => {
    playerCards[seat] = generateBingoCard();
    playerMarks[seat] = createInitialMarks();
  });

  const nonPlayerSeats = PLAYER_SEATS.filter(seat => !playerSeats.includes(seat));
  nonPlayerSeats.forEach(seat => {
    playerCards[seat] = null;
    playerMarks[seat] = null;
  });

  return {
    configuration: DEFAULT_BINGO_GAME_CONFIGURATION,
    nextToActPlayers: playerSeats,
    playerCards,
    playerMarks,
    calledNumbers: [],
    eliminatedPlayers: [],
    isGameStarted: false,
    isGameOver: false,
  };
}


const canStartGame = (configuration: BingoGameConfiguration): boolean => {
  return configuration.callerSeat !== undefined;
}


const applyBingoHostAction = async (
  _tableState: GameTable,
  gameState: BingoGameState,
  gameAction: BingoHostAction,
): Promise<GameTableActionResult<BingoGameState>> => {

  if (gameAction.hostActionType === BINGO_GAME_TABLE_ACTION_UPDATE_CONFIGURATION) {
    console.log("HOST ACTION - UPDATE CONFIGURATION - GAME ACTION", gameAction);
    const updatedConfiguration = {
      ...gameState.configuration,
      ...gameAction.update,
    };

    updatedConfiguration.canStartGame = canStartGame(updatedConfiguration);
    if (updatedConfiguration.callerSeat && 
       !updatedConfiguration.callerCandidates.includes(updatedConfiguration.callerSeat))
    {
      updatedConfiguration.callerSeat = undefined;
    }

    const summary = `Configuration updated by host: ${JSON.stringify(updatedConfiguration)}`;
    return {
      tablePhase: 'table-phase-game-in-progress',
      gameSpecificState: {
        ...gameState,
        configuration: updatedConfiguration,
      },
      gameSpecificStateSummary: summary,
    }
  }

  if (gameAction.hostActionType === BINGO_GAME_TABLE_ACTION_HOST_STARTS_GAME) {
    return {
      tablePhase: 'table-phase-game-complete-with-winners',
      gameSpecificState: {
        ...gameState,
        isGameStarted: true,
        winner: undefined,
        outcomeSummary: 'Game started',
      },
      gameSpecificStateSummary: 'Game started',
    };
  }


  return {
    tablePhase: 'table-phase-error',
    gameSpecificState: gameState,
    gameSpecificStateSummary: `Error - invalid game action`,
  };
}


const applyBingoPlayerAction = async (
  _tableState: GameTable,
  gameState: BingoGameState,
  gameAction: BingoPlayerAction,
): Promise<GameTableActionResult<BingoGameState>> => {

  console.log("APPLY BINGO GAME ACTION - GAME STATE", gameState);
  console.log("APPLY BINGO GAME ACTION - GAME ACTION", gameAction);

  if (gameAction.playerActionType === BINGO_GAME_TABLE_ACTION_UPDATE_CALLER_CANDIDATE) {
    console.log("UPDATE CALLER CANDIDATE - GAME ACTION", gameAction);
    
    const candidateSeat = gameAction.playerSeat;
    const updatedCallerCandidates = gameAction.isCandidate ?
      [...gameState.configuration.callerCandidates, candidateSeat] :
      gameState.configuration.callerCandidates.filter(candidate => candidate !== candidateSeat);

    const actionDescription = gameAction.isCandidate ? 'added' : 'removed';
    const summary = `Caller candidate ${candidateSeat} ${actionDescription} as a caller`;

    const updatedConfiguration = {
      ...gameState.configuration,
      callerCandidates: updatedCallerCandidates,
    };
    updatedConfiguration.canStartGame = canStartGame(updatedConfiguration);

    return {
      tablePhase: 'table-phase-game-in-progress',
      gameSpecificState: {
        ...gameState,
        configuration: updatedConfiguration,
      },
      gameSpecificStateSummary: summary,
    }
  }

  if (gameAction.playerActionType === BINGO_GAME_TABLE_ACTION_CALL_NUMBER) {
    // Check if number already called
    if (gameState.calledNumbers.includes(gameAction.calledNumber)) {
      const summary = `Number ${gameAction.calledNumber} was already called`;
      return {
        tablePhase: 'table-phase-game-in-progress',
        gameSpecificState: gameState,
        gameSpecificStateSummary: summary,
      };
    }

    const summary = `Player ${gameAction.seat} called number ${gameAction.calledNumber}`;
    const lastCalledNumberTimestamp = Date.now();

    return {
      tablePhase: 'table-phase-game-in-progress',
      gameSpecificState: {
        ...gameState,
        calledNumbers: [...gameState.calledNumbers, gameAction.calledNumber],
        lastCalledNumberTimestamp,
        outcomeSummary: summary,
      },
      gameSpecificStateSummary: summary,
    }
  } 

  if (gameAction.playerActionType === BINGO_GAME_TABLE_ACTION_MARK_NUMBER) {
    const playerCard = gameState.playerCards[gameAction.seat];
    const playerMarks = gameState.playerMarks[gameAction.seat];

    if (!playerCard || !playerMarks) {
      const summary = `Player ${gameAction.seat} data not found`;
      return {
        tablePhase: 'table-phase-error',
        gameSpecificState: gameState,
        gameSpecificStateSummary: summary,
      };
    }
    
    // Check if the number is on the player's card
    let found = false;
    let newMarks = playerMarks.map(row => [...row]);
    
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        if (playerCard[row][col] === gameAction.markedNumber) {
          newMarks[row][col] = true;
          found = true;
          break;
        }
      }
      if (found) break;
    }
    
    if (!found) {
      const summary = `Player ${gameAction.seat} tried to mark ${gameAction.markedNumber} but it's not on their card`;
      return {
        tablePhase: 'table-phase-game-in-progress',
        gameSpecificState: gameState,
        gameSpecificStateSummary: summary,
      };
    }

    const summary = `Player ${gameAction.seat} marked number ${gameAction.markedNumber}`;

    return {
      tablePhase: 'table-phase-game-in-progress',
      gameSpecificState: {
        ...gameState,
        playerMarks: {
          ...gameState.playerMarks,
          [gameAction.seat]: newMarks,
        },
        outcomeSummary: summary,
      },
      gameSpecificStateSummary: summary,
    }
  }

  if (gameAction.playerActionType === BINGO_GAME_TABLE_ACTION_CLAIM_BINGO) {
    const playerMarks = gameState.playerMarks[gameAction.seat];

    if (!playerMarks) {
      const summary = `Player ${gameAction.seat} data not found`;
      return {
        tablePhase: 'table-phase-error',
        gameSpecificState: gameState,
        gameSpecificStateSummary: summary,
      };
    }

    if (checkForBingo(playerMarks)) {
      const summary = `Player ${gameAction.seat} got BINGO and wins!`;

      return {
        tablePhase: 'table-phase-game-complete-with-winners',
        gameSpecificState: {
          ...gameState,
          isGameOver: true,
          winner: gameAction.seat,
          outcomeSummary: summary,
        },
        gameSpecificStateSummary: summary,
      }
    } else {
      // Player falsely claimed bingo
      const shouldEliminatePlayer = gameState.configuration.loseForFailedBingoCalls;
      const eliminatedPlayers = shouldEliminatePlayer && !gameState.eliminatedPlayers.includes(gameAction.seat)
        ? [...gameState.eliminatedPlayers, gameAction.seat]
        : gameState.eliminatedPlayers;
      
      // Check if all players have been eliminated
      const activePlayerSeats = getActivePlayerSeatsForGameTable(_tableState);
      const remainingActivePlayers = activePlayerSeats.filter(seat => !eliminatedPlayers.includes(seat));
      
      if (remainingActivePlayers.length === 0) {
        // All players eliminated - end the game
        const summary = `All players have been eliminated! Game over.`;
        
        return {
          tablePhase: 'table-phase-game-complete-no-winners',
          gameSpecificState: {
            ...gameState,
            eliminatedPlayers,
            isGameOver: true,
            winner: undefined, // No winner when all players are eliminated
            outcomeSummary: summary,
          },
          gameSpecificStateSummary: summary,
        }
      }
      
      const summary = shouldEliminatePlayer 
        ? `Player ${gameAction.seat} claimed BINGO but doesn't have a winning pattern and has been eliminated`
        : `Player ${gameAction.seat} claimed BINGO but doesn't have a winning pattern`;

      return {
        tablePhase: 'table-phase-game-in-progress',
        gameSpecificState: {
          ...gameState,
          eliminatedPlayers,
          outcomeSummary: summary,
        },
        gameSpecificStateSummary: summary,
      }
    }
  }

  if (gameAction.playerActionType === BINGO_GAME_TABLE_ACTION_CANCEL_GAME) {
    return {
      tablePhase: 'table-phase-game-abandoned',
      gameSpecificState: {
        ...gameState,
        isGameOver: true,
        outcomeSummary: gameAction.cancellationReason,
      },
      gameSpecificStateSummary: gameAction.cancellationReason,
    }
  }

  return {
    tablePhase: 'table-phase-error',
    gameSpecificState: gameState,
    gameSpecificStateSummary: `Error - invalid game action`,
  };
}


export const BingoGameProcessor: IBfgAllPublicKnowledgeGameProcessor<
  BingoGameState,
  BingoPlayerAction,
  BingoHostAction
> = {
  gameTitle: BingoGameName,
  createGameSpecificInitialAction: createInitialGameSpecificAction,
  createGameSpecificInitialState: createInitialGameState,
  applyPlayerAction: applyBingoPlayerAction,
  applyHostAction: applyBingoHostAction,
}
