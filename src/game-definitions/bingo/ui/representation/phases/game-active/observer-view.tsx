import { BingoRepresentationProps } from "../../types";


export const ObserverView = (props: BingoRepresentationProps) => {
  const { gameState } = props;

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
