import { BfgAllPublicKnowledgeGameEngineComponents, GameHistoryComponentProps, GameHostComponentProps, ObserverComponentProps, PlayerComponentProps } from "@bfg-engine/models/game-engine/bfg-game-engine-types";
import { Typography } from "@bfg-engine/ui/bfg-ui";
import { BingoGameState, BingoHostAction, BingoPlayerAction } from "../engine/bingo-engine";
import { HostConfigurationView } from "./representation/phases/configuration/host-configuration-view";
import { ObserverConfigurationView } from "./representation/phases/configuration/observer-configuration-view";
import { PlayerConfigurationView } from "./representation/phases/configuration/player-configuration-view";
import { PlayerActiveGameView } from "./representation/phases/game-active/player-game-active-view";
import { ObserverActiveGameView } from "./representation/phases/game-active/observer-game-active-view";
import { HostActiveGameView } from "./representation/phases/game-active/host-game-active-view";
import { PlayerGameOverView } from "./representation/phases/game-over/player-game-over-view";
import { HostGameOverView } from "./representation/phases/game-over/host-game-over-view";
import { ObserverGameOverView } from "./representation/phases/game-over/observer-game-over-view";


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
    <ObserverGameOverView
      {...props}
    />
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
    <PlayerGameOverView
      {...props}
    />
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
      <HostActiveGameView
        {...props}
      />
    )
  }

  return (
    <HostGameOverView
      {...props}
    />
  );
}


export const BingoHistoryComponent = (_props: GameHistoryComponentProps) =>  {
  return (
    <div>
      <Typography variant="body1">Bingo History Component</Typography>
    </div>
  );
}


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
