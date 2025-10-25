// import { PlayerProfileId } from "@bfg-engine/models/types/bfg-branded-ids";
// // import { BingoGameAction, BingoGameState } from "../engine/bingo-engine";
// import { GameTableSeat } from "@bfg-engine/models/game-table/game-table";
// import { GameAccessRole, ViewLevel } from "@bfg-engine/models/game-engine/bfg-game-engine-types";


// export interface BingoRepresentationProps {
//   gameState: BingoGameState;
//   myPlayerSeat: GameTableSeat | null;
//   amICaller: boolean;
//   gameAccessRole: GameAccessRole;
//   viewLevel: ViewLevel;
//   mostRecentAction: BingoGameAction;
//   onGameAction?: (gameState: BingoGameState, gameAction: BingoGameAction) => void;
//   onHostAction?: (gameState: BingoGameState, hostAction: BingoGameAction) => void;
// }

// export const createBingoRepresentationProps = (
//   gameState: BingoGameState,
//   hostPlayerProfileId: PlayerProfileId,
//   myPlayerProfileId: PlayerProfileId | null,
//   myPlayerSeat: GameTableSeat | null,
//   viewLevel: ViewLevel,
//   mostRecentAction: BingoGameAction,
//   onGameAction?: (gameState: BingoGameState, gameAction: BingoGameAction) => void,
//   onHostAction?: (gameState: BingoGameState, hostAction: BingoGameAction) => void
// ): BingoRepresentationProps => {

//   const amICaller = gameState.configuration.callerSeat === myPlayerSeat;
//   const amIHost = myPlayerProfileId === hostPlayerProfileId;
//   const amIPlayer = myPlayerSeat !== null;
//   const gameAccessRole = amIHost ? 'host-role' : amIPlayer ? 'player-role' : 'observer-role';

//   const retValue: BingoRepresentationProps = {
//     gameState,
//     myPlayerSeat,
//     amICaller,
//     gameAccessRole,
//     viewLevel,
//     mostRecentAction,
//     onGameAction,
//     onHostAction,
//   }

//   return retValue;
// }
