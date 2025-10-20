import { z } from "zod";
import { 
  GameTableSeatSchema,
  BfgGameSpecificTableAction,
  GameTableActionResult,
  createBfgGameEngineProcessor,
  IBfgGameEngineProcessor
} from "@bfg-engine";
import { PLAYER_SEATS, GameTableSeat } from "@bfg-engine/models/game-table/game-table";
import { BfgGameTableActionId } from "@bfg-engine/models/types/bfg-branded-ids";
import { createBingoCombinationRepresentationAndInput, createBingoHostRepresentation, createBingoInput, createBingoRepresentation } from "../ui/bingo-components";
import { BingoGameName } from "../game-box";
import { GameTable } from "@bfg-engine/models/game-table/game-table";
import { BfgGameEngineRendererFactory } from "@bfg-engine/models/game-engine/bfg-game-engines";


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


export const BINGO_GAME_TABLE_ACTION_START_GAME = 'game-table-action-host-start-game' as const;
export const BINGO_GAME_TABLE_ACTION_CALL_NUMBER = 'game-table-action-call-number' as const;
export const BINGO_GAME_TABLE_ACTION_MARK_NUMBER = 'game-table-action-mark-number' as const;
export const BINGO_GAME_TABLE_ACTION_CLAIM_BINGO = 'game-table-action-claim-bingo' as const;
export const BINGO_GAME_TABLE_ACTION_CANCEL_GAME = 'game-table-action-cancel-game' as const;


export const BingoStartGameSchema = z.object({
  actionType: z.literal(BINGO_GAME_TABLE_ACTION_START_GAME),
})

export type BingoStartGame = z.infer<typeof BingoStartGameSchema>;


export const BingoActionCallNumberSchema = z.object({
  actionType: z.literal(BINGO_GAME_TABLE_ACTION_CALL_NUMBER),
  seat: GameTableSeatSchema,
  calledNumber: BingoNumberSchema,
})

export const BingoActionMarkNumberSchema = z.object({
  actionType: z.literal(BINGO_GAME_TABLE_ACTION_MARK_NUMBER),
  seat: GameTableSeatSchema,
  markedNumber: BingoNumberSchema,
})

export const BingoActionClaimBingoSchema = z.object({
  actionType: z.literal(BINGO_GAME_TABLE_ACTION_CLAIM_BINGO),
  seat: GameTableSeatSchema,
})

export const BingoActionCancelGameSchema = z.object({
  actionType: z.literal(BINGO_GAME_TABLE_ACTION_CANCEL_GAME),
  seat: GameTableSeatSchema,
  cancellationReason: z.string(),
})

export const BingoGameActionSchema = z.discriminatedUnion('actionType', [
  BingoStartGameSchema,
  BingoActionCallNumberSchema, 
  BingoActionMarkNumberSchema,
  BingoActionClaimBingoSchema,
  BingoActionCancelGameSchema,
])

export type BingoGameAction = z.infer<typeof BingoGameActionSchema>;


export const BingoGameStateSchema = z.object({
  // Player cards
  playerCards: z.record(GameTableSeatSchema, BingoCardSchema),
  
  // Which numbers are marked on each player's card
  playerMarks: z.record(GameTableSeatSchema, BingoCardMarksSchema),
  
  // Numbers that have been called
  calledNumbers: z.array(BingoNumberSchema),
  
  // Game status
  isGameOver: z.boolean(),
  winner: GameTableSeatSchema.optional(),
  outcomeSummary: z.string().optional(),
}).describe('Bingo');

export type BingoGameState = z.infer<typeof BingoGameStateSchema>;


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


const createInitialGameState = (
  initialGameTableAction: BingoGameAction,
): BingoGameState => {

  if (initialGameTableAction.actionType !== 'game-table-action-host-start-game') {
    throw new Error("Initial game table action must be a host start game");
  }

  // Generate cards for all possible players
  const playerCards: Record<GameTableSeat, BingoCard> = {} as Record<GameTableSeat, BingoCard>;
  const playerMarks: Record<GameTableSeat, BingoCardMarks> = {} as Record<GameTableSeat, BingoCardMarks>;
  
  PLAYER_SEATS.forEach(seat => {
    playerCards[seat] = generateBingoCard();
    playerMarks[seat] = createInitialMarks();
  });

  return {
    playerCards,
    playerMarks,
    calledNumbers: [],
    isGameOver: false,
  };
}


const createInitialBingoGameTableAction = (
  // _gameTable: NewGameTable,
): BfgGameSpecificTableAction<BingoGameAction> => {
  return {
    actionType: 'game-table-action-host-starts-game',
    gameSpecificAction: {
      actionType: BINGO_GAME_TABLE_ACTION_START_GAME,
    },
    gameTableActionId: BfgGameTableActionId.createId(),
    source: 'game-table-action-source-host',
  };
}


const applyBingoGameAction = (
  _tableState: GameTable,
  gameState: BingoGameState,
  gameAction: BingoGameAction,
): GameTableActionResult<BingoGameState> => {

  console.log("APPLY BINGO GAME ACTION - GAME STATE", gameState);
  console.log("APPLY BINGO GAME ACTION - GAME ACTION", gameAction);

  if (gameAction.actionType === BINGO_GAME_TABLE_ACTION_CALL_NUMBER) {
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

    return {
      tablePhase: 'table-phase-game-in-progress',
      gameSpecificState: {
        ...gameState,
        calledNumbers: [...gameState.calledNumbers, gameAction.calledNumber],
        outcomeSummary: summary,
      },
      gameSpecificStateSummary: summary,
    }
  } 

  if (gameAction.actionType === BINGO_GAME_TABLE_ACTION_MARK_NUMBER) {
    const playerCard = gameState.playerCards[gameAction.seat];
    const playerMarks = gameState.playerMarks[gameAction.seat];
    
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

  if (gameAction.actionType === BINGO_GAME_TABLE_ACTION_CLAIM_BINGO) {
    const playerMarks = gameState.playerMarks[gameAction.seat];
    
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
      const summary = `Player ${gameAction.seat} claimed BINGO but doesn't have a winning pattern`;
      
      return {
        tablePhase: 'table-phase-game-in-progress',
        gameSpecificState: {
          ...gameState,
          outcomeSummary: summary,
        },
        gameSpecificStateSummary: summary,
      }
    }
  }

  if (gameAction.actionType === BINGO_GAME_TABLE_ACTION_CANCEL_GAME) {
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


const bingoRendererFactory: BfgGameEngineRendererFactory<
  typeof BingoGameStateSchema,
  typeof BingoGameActionSchema
> = {
  createGameStateHostComponent: createBingoHostRepresentation,
  createGameStateRepresentationComponent: createBingoRepresentation,
  createGameStateActionInputComponent: createBingoInput,
  createGameStateCombinationRepresentationAndInputComponent: createBingoCombinationRepresentationAndInput,
}


const bingoProcessorImplementation: IBfgGameEngineProcessor<
  typeof BingoGameStateSchema,
  typeof BingoGameActionSchema
> = {
  gameTitle: BingoGameName,

  applyGameAction: applyBingoGameAction,

  createInitialGameSpecificState: createInitialGameState,
  createInitialGameTableAction: createInitialBingoGameTableAction,

  createGameStateRepresentationComponent: createBingoRepresentation,
  createGameStateActionInputComponent: createBingoInput,
  createGameStateHostComponent: createBingoHostRepresentation,

  createGameStateCombinationRepresentationAndInputComponent: createBingoCombinationRepresentationAndInput,
}



export const BingoGameStateProcessor = createBfgGameEngineProcessor(
  BingoGameName,
  BingoGameStateSchema,
  BingoGameActionSchema,

  bingoProcessorImplementation,
  bingoRendererFactory,
);

