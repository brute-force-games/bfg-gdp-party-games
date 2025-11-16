import { BingoGameState } from "../../../engine/bingo-engine";


interface GameOverPhaseProps {
  gameState: BingoGameState;
}

export const GameOverPhase = (props: GameOverPhaseProps) => {
  const { gameState } = props;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Game Over!</h2>
      <div style={{ fontSize: '18px', marginTop: '10px' }}>
        {gameState.outcomeSummary}
      </div>
    </div>
  );
}