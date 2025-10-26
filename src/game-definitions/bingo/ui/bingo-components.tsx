import { BfgAllPublicKnowledgeGameEngineComponents, GameHistoryComponentProps, GameHostComponentProps, ObserverComponentProps, PlayerComponentProps } from "@bfg-engine/models/game-engine/bfg-game-engine-types";
import { Typography } from "@bfg-engine/ui/bfg-ui";
import { BingoGameState, BingoHostAction, BingoPlayerAction } from "../engine/bingo-engine-2";
import { HostConfigurationView } from "./representation/phases/configuration/host-configuration-view";
import { ObserverConfigurationView } from "./representation/phases/configuration/observer-configuration-view";
import { PlayerConfigurationView } from "./representation/phases/configuration/player-configuration-view";
import { PlayerActiveGameView } from "./representation/phases/game-active/player-view";
import { ObserverActiveGameView } from "./representation/phases/game-active/observer-view";


export const BingoObserverComponent = (props: ObserverComponentProps<BingoGameState>) => {
  if (!props.gameState.isGameStarted) {
    return (
      <ObserverConfigurationView
        {...props}
      />
    )
  }

  if (!props.gameState.isGameOver) {
    return (
      <ObserverActiveGameView
        {...props}
      />
    )
  }

  return (
    <div>
      <Typography variant="body1">Game over - Bingo Observer Component!!</Typography>
    </div>
  );
}


export const BingoPlayerComponent = (props: PlayerComponentProps<BingoGameState, BingoPlayerAction>) => {
  if (!props.gameState.isGameStarted) {
    return (
      <PlayerConfigurationView
        {...props}
      />
    )
  }


  if (!props.gameState.isGameOver) {
    return (
      <PlayerActiveGameView
        {...props}
      />
    )
  }

  return (
    <div>
      <Typography variant="body1">Game over - Bingo Player Component!!</Typography>
    </div>
  );
}


export const BingoHostComponent = (props: GameHostComponentProps<BingoGameState, BingoHostAction>) => {
  if (!props.gameState.isGameStarted) {
    return (
      <HostConfigurationView
        {...props}
      />
    )
  }
  
  if (!props.gameState.isGameOver) {
    return (
      <div>Host - Bingo game in progress</div>
    )
  }

  return (
    <div>
      <Typography variant="body1">Game over - Bingo Host Component!!</Typography>
    </div>
  );
}


export const BingoHistoryComponent = (_props: GameHistoryComponentProps) =>  {
  return (
    <div>
      <Typography variant="body1">Bingo History Component</Typography>
    </div>
  );
}


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


export const BingoGameComponents: BfgAllPublicKnowledgeGameEngineComponents<
  BingoGameState,
  BingoPlayerAction,
  BingoHostAction
> = {
  ObserverComponent: BingoObserverComponent,
  PlayerComponent: BingoPlayerComponent,
  HostComponent: BingoHostComponent,
  HistoryComponent: BingoHistoryComponent,
}