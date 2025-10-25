// // import { BingoGameAction, BingoGameActionSchema, BingoGameState, BingoGameStateSchema } from "../engine/bingo-engine";
// import { BingoGameStateSchema, BingoPlayerActionSchema, BingoHostActionSchema } from "../engine/bingo-engine-2";
// import { BingoRepresentation } from "./bingo-representation";
// import { BingoInput } from "./bingo-input";
// import { GameStateActionInputProps, GameStateCombinationRepresentationAndInputProps, GameStateHostComponentProps, GameStateRepresentationProps } from "@bfg-engine/models/game-engine/bfg-game-engines";
// import { createBingoRepresentationProps } from "./types";


// export const createBingoRepresentation = (
//   props: GameStateRepresentationProps<typeof BingoGameStateSchema, typeof BingoGameActionSchema>,
// ) => {
//   const { gameState, myPlayerProfileId, myPlayerSeat, viewLevel, mostRecentAction, hostPlayerProfileId } = props;
//   const bingoProps = createBingoRepresentationProps(gameState, hostPlayerProfileId, myPlayerProfileId, myPlayerSeat, viewLevel, mostRecentAction);
//   return (
//     <BingoRepresentation {...bingoProps} />
//   );
// }

// export const createBingoInput = (
//   props: GameStateActionInputProps<typeof BingoGameStateSchema, typeof BingoGameActionSchema>,
// ) => {
//   const { myPlayerSeat, gameState, mostRecentAction, onGameAction } = props;
//   return (
//     <BingoInput 
//       myPlayerSeat={myPlayerSeat} 
//       gameState={gameState} 
//       mostRecentAction={mostRecentAction}
//       onGameAction={onGameAction}
//     />
//   );
// }


// export const createBingoCombinationRepresentationAndInput = (
//   props: GameStateCombinationRepresentationAndInputProps<typeof BingoGameStateSchema, typeof BingoGameActionSchema>,
// ) => {
//   const { myPlayerSeat, gameState, mostRecentAction, onGameAction, hostPlayerProfileId, myPlayerProfileId } = props;
//   const bingoProps = createBingoRepresentationProps(gameState, hostPlayerProfileId, myPlayerProfileId, myPlayerSeat, 'player-level', mostRecentAction, onGameAction);
//   return (
//     <>
//       <BingoRepresentation
//         {...bingoProps}
//       />
//       <BingoInput 
//         myPlayerSeat={myPlayerSeat} 
//         gameState={gameState} 
//         mostRecentAction={mostRecentAction}
//         onGameAction={onGameAction}
//       />
//     </>
//   )
// }


// export const createBingoHostRepresentation = (
//   props: GameStateHostComponentProps<typeof BingoGameStateSchema, typeof BingoGameActionSchema>,
// ) => {

//   const { gameState, gameTable, mostRecentAction, hostPlayerProfileId, myPlayerProfileId, myPlayerSeat, onGameAction } = props;

//   const onHostGameAction = (gameState: BingoGameState, gameAction: BingoGameAction) => {
//     if (onGameAction === undefined) {
//       throw new Error("onGameAction is undefined");
//     }

//     onGameAction(gameTable, gameState, gameAction);
//   }

//   const bingoProps = createBingoRepresentationProps(gameState, hostPlayerProfileId, myPlayerProfileId, myPlayerSeat, 'host-level', mostRecentAction, onHostGameAction);

//   console.log('cffdfcreateBingoHostRepresentation', bingoProps);
//   return (
//     <BingoRepresentation
//       {...bingoProps}
//     />
//   )
// }
