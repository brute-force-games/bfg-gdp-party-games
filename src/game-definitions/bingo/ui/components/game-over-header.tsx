import { Typography, Paper } from "@bfg-engine/ui/bfg-ui";
import { BingoGameState } from "../../engine/bingo-engine";

interface GameOverHeaderProps {
  gameState: BingoGameState;
  isWinner?: boolean;
  isEliminated?: boolean;
  currentPlayerSeat?: string;
}

export const GameOverHeader = ({ 
  gameState, 
  isWinner = false, 
  isEliminated = false, 
  currentPlayerSeat 
}: GameOverHeaderProps) => {
  const hasWinner = gameState.winner !== undefined;

  // Determine game outcome message based on perspective
  const getGameOutcomeMessage = () => {
    if (currentPlayerSeat) {
      // Player perspective
      if (isWinner) {
        return "🎉 Congratulations! You won! 🎉";
      } else if (isEliminated) {
        return "❌ You were eliminated ❌";
      } else if (hasWinner) {
        return `🏆 ${gameState.winner?.replace('p', 'Player ')} won the game! 🏆`;
      } else {
        return "🤝 Game ended in a draw 🤝";
      }
    } else {
      // Host/Observer perspective
      if (hasWinner) {
        return `🏆 ${gameState.winner?.replace('p', 'Player ')} won the game! 🏆`;
      } else {
        return "🤝 Game ended in a draw 🤝";
      }
    }
  };

  // Determine styling based on perspective and status
  const getHeaderStyling = () => {
    if (currentPlayerSeat) {
      // Player perspective
      if (isWinner) {
        return {
          backgroundColor: '#e8f5e8',
          border: '2px solid #4caf50',
          color: '#2e7d32'
        };
      } else if (isEliminated) {
        return {
          backgroundColor: '#ffeaea',
          border: '2px solid #f44336',
          color: '#c62828'
        };
      } else {
        return {
          backgroundColor: '#f5f5f5',
          border: '2px solid #9e9e9e',
          color: '#424242'
        };
      }
    } else {
      // Host/Observer perspective
      if (hasWinner) {
        return {
          backgroundColor: '#e8f5e8',
          border: '2px solid #4caf50',
          color: '#2e7d32'
        };
      } else {
        return {
          backgroundColor: '#f5f5f5',
          border: '2px solid #9e9e9e',
          color: '#424242'
        };
      }
    }
  };

  const styling = getHeaderStyling();

  return (
    <Paper elevation={3} style={{ 
      padding: '24px', 
      textAlign: 'center',
      backgroundColor: styling.backgroundColor,
      border: styling.border,
      borderRadius: '12px',
      minWidth: currentPlayerSeat ? '300px' : '400px'
    }}>
      <Typography variant="h4" gutterBottom style={{
        color: styling.color,
        fontWeight: 'bold'
      }}>
        GAME OVER
      </Typography>
      <Typography variant="h6" style={{
        color: styling.color,
        marginBottom: '16px'
      }}>
        {getGameOutcomeMessage()}
      </Typography>
      {gameState.outcomeSummary && (
        <Typography variant="body1" color="textSecondary">
          {gameState.outcomeSummary}
        </Typography>
      )}
    </Paper>
  );
};
