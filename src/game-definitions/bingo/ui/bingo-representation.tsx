import { GameTableSeat } from "@bfg-engine/models/game-table/game-table";
import { BingoGameAction, BingoGameState } from "../engine/bingo-engine";


interface BingoRepresentationProps {
  myPlayerSeat: GameTableSeat | null;
  gameState: BingoGameState;
  mostRecentAction: BingoGameAction;
}

export const BingoRepresentation = (props: BingoRepresentationProps) => {
  const { myPlayerSeat, gameState } = props;

  if (gameState.isGameOver) {
    return (
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <h2>Game Over!</h2>
        <div style={{ fontSize: '18px', marginTop: '10px' }}>
          {gameState.outcomeSummary}
        </div>
      </div>
    );
  }

  if (myPlayerSeat === null) {
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

  const myCard = gameState.playerCards[myPlayerSeat];
  const myMarks = gameState.playerMarks[myPlayerSeat];

  const getBingoLetter = (col: number): string => {
    return ['B', 'I', 'N', 'G', 'O'][col];
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Your Bingo Card</h2>
      
      {/* Called Numbers */}
      <div style={{ marginBottom: '20px' }}>
        <strong>Called Numbers ({gameState.calledNumbers.length}):</strong>
        <div style={{ marginTop: '5px' }}>
          {gameState.calledNumbers.length > 0 
            ? gameState.calledNumbers.slice(-10).join(', ')
            : 'None yet'}
        </div>
      </div>

      {/* Bingo Card */}
      <div style={{ display: 'inline-block', border: '2px solid #333' }}>
        {/* Header */}
        <div style={{ display: 'flex' }}>
          {['B', 'I', 'N', 'G', 'O'].map((letter, idx) => (
            <div 
              key={idx}
              style={{
                width: '60px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '20px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: '1px solid #333',
              }}
            >
              {letter}
            </div>
          ))}
        </div>

        {/* Card Grid */}
        {myCard.map((row, rowIdx) => (
          <div key={rowIdx} style={{ display: 'flex' }}>
            {row.map((number, colIdx) => {
              const isMarked = myMarks[rowIdx][colIdx];
              const isFreeSpace = rowIdx === 2 && colIdx === 2;
              
              return (
                <div 
                  key={colIdx}
                  style={{
                    width: '60px',
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    fontWeight: isMarked ? 'bold' : 'normal',
                    backgroundColor: isMarked ? '#FFD700' : 'white',
                    border: '1px solid #333',
                    color: isMarked ? '#333' : '#666',
                    cursor: 'default',
                  }}
                >
                  {isFreeSpace ? 'FREE' : number}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Game Status */}
      {gameState.outcomeSummary && (
        <div style={{ marginTop: '20px', fontStyle: 'italic' }}>
          {gameState.outcomeSummary}
        </div>
      )}
    </div>
  );
}

