import { ObserverComponentProps } from "@bfg-engine/models/game-engine/bfg-game-engine-types";
import { BingoGameState } from "~/game-definitions/bingo/engine/bingo-engine-2";


export const ObserverActiveGameView = ({ gameState }: ObserverComponentProps<BingoGameState>) => {

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Bingo - Observer View</h2>
      <div>
        <strong>Called Numbers:</strong> {gameState.calledNumbers.length > 0 
          ? gameState.calledNumbers.join(', ') 
          : 'None yet'}
      </div>
    </div>
  );
}
