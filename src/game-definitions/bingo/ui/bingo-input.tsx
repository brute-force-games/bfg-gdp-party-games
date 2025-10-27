import { GameTableSeat } from "@bfg-engine/models/game-table/game-table";
import { 
  BINGO_GAME_TABLE_ACTION_CALL_NUMBER,
  BINGO_GAME_TABLE_ACTION_MARK_NUMBER,
  BINGO_GAME_TABLE_ACTION_CLAIM_BINGO,
  BINGO_GAME_TABLE_ACTION_CANCEL_GAME,
  BingoPlayerAction, 
  BingoGameState,
  BingoNumber
} from "../engine/bingo-engine";
import { Button } from "@bfg-engine/ui/bfg-ui";
import { useState } from "react";


interface BingoInputProps {
  myPlayerSeat: GameTableSeat;
  gameState: BingoGameState;
  mostRecentAction: BingoPlayerAction;
  onGameAction: (gameState: BingoGameState, gameAction: BingoPlayerAction) => void;
}

export const BingoInput = (props: BingoInputProps) => {
  const { myPlayerSeat, gameState, onGameAction } = props;
  const [selectedNumber, setSelectedNumber] = useState<number>(1);

  if (gameState.isGameOver) {
    return (
      <div style={{ padding: '20px', borderTop: '2px solid #ddd' }}>
        <div>Game has ended</div>
      </div>
    );
  }

  const callNumber = () => {
    const numberToCall = Math.floor(Math.random() * 75) + 1;
    
    onGameAction(gameState, { 
      playerActionType: BINGO_GAME_TABLE_ACTION_CALL_NUMBER, 
      source: "player",
      seat: myPlayerSeat,
      calledNumber: numberToCall as BingoNumber,
    });
  }

  const callSpecificNumber = () => {
    onGameAction(gameState, { 
      playerActionType: BINGO_GAME_TABLE_ACTION_CALL_NUMBER, 
      source: "player",
      seat: myPlayerSeat,
      calledNumber: selectedNumber as BingoNumber,
    });
  }

  const markNumber = (number: number) => {
    onGameAction(gameState, { 
      playerActionType: BINGO_GAME_TABLE_ACTION_MARK_NUMBER,
      source: "player",
      seat: myPlayerSeat,
      markedNumber: number as BingoNumber,
    });
  }

  const markLastCalledNumber = () => {
    if (gameState.calledNumbers.length > 0) {
      const lastNumber = gameState.calledNumbers[gameState.calledNumbers.length - 1];
      markNumber(lastNumber);
    }
  }

  const claimBingo = () => {
    onGameAction(gameState, { 
      playerActionType: BINGO_GAME_TABLE_ACTION_CLAIM_BINGO,
      source: "player",
      seat: myPlayerSeat,
    });
  }

  const cancelGame = () => {
    onGameAction(gameState, {
      playerActionType: BINGO_GAME_TABLE_ACTION_CANCEL_GAME,
      source: "player",
      seat: myPlayerSeat,
      cancellationReason: `Game cancelled by ${myPlayerSeat}`,
    });
  }

  const myCard = gameState.playerCards[myPlayerSeat];
  const myMarks = gameState.playerMarks[myPlayerSeat];

  // Get all unmarked numbers on my card
  const unmarkedNumbers: number[] = [];
  
  if (myCard && myMarks) {
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        const number = myCard[row][col];
        const isMarked = myMarks[row][col];
        if (number !== 0 && !isMarked && gameState.calledNumbers.includes(number)) {
          unmarkedNumbers.push(number);
        }
      }
    }
  }


  return (
    <div style={{ padding: '20px', borderTop: '2px solid #ddd', fontFamily: 'Arial, sans-serif' }}>
      <h3>Actions</h3>
      
      {/* Call Numbers Section */}
      <div style={{ marginBottom: '15px' }}>
        <h4>Call Numbers</h4>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          <Button onClick={callNumber}>Call Random Number</Button>
          <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
            <input 
              type="number" 
              min="1" 
              max="75" 
              value={selectedNumber}
              onChange={(e) => setSelectedNumber(parseInt(e.target.value) || 1)}
              style={{ width: '60px', padding: '5px' }}
            />
            <Button onClick={callSpecificNumber}>Call This Number</Button>
          </div>
        </div>
      </div>

      {/* Mark Numbers Section */}
      <div style={{ marginBottom: '15px' }}>
        <h4>Mark Numbers</h4>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Button 
            onClick={markLastCalledNumber}
            disabled={gameState.calledNumbers.length === 0}
          >
            Mark Last Called ({gameState.calledNumbers.length > 0 
              ? gameState.calledNumbers[gameState.calledNumbers.length - 1] 
              : '-'})
          </Button>
        </div>
        {unmarkedNumbers.length > 0 && (
          <div style={{ marginTop: '10px' }}>
            <div style={{ fontSize: '14px', marginBottom: '5px' }}>
              Unmarked numbers on your card: 
            </div>
            <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
              {unmarkedNumbers.map(num => (
                <Button 
                  key={num}
                  onClick={() => markNumber(num)}
                  style={{ minWidth: '40px' }}
                >
                  {num}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Claim Bingo Section */}
      <div style={{ marginBottom: '15px' }}>
        <h4>Claim Victory</h4>
        <Button onClick={claimBingo}>BINGO!</Button>
      </div>

      {/* Game Control */}
      <div>
        <h4>Game Control</h4>
        <Button onClick={cancelGame}>Cancel Game</Button>
      </div>
    </div>
  );
}

