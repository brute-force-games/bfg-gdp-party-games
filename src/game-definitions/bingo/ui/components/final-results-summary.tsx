import { Typography, Paper, Stack, Box } from "@bfg-engine/ui/bfg-ui";
import { BingoGameState } from "../../engine/bingo-engine";

interface FinalResultsSummaryProps {
  gameState: BingoGameState;
  currentPlayerSeat?: string;
  minWidth?: string;
  maxWidth?: string;
}

export const FinalResultsSummary = ({ 
  gameState, 
  currentPlayerSeat,
  minWidth = "400px",
  maxWidth = "600px"
}: FinalResultsSummaryProps) => {
  // Get all players for summary
  const allPlayers = Object.entries(gameState.playerCards)
    .filter(([_, card]) => card !== null)
    .map(([seat, _]) => ({
      seat: seat as keyof typeof gameState.playerCards,
      isEliminated: gameState.eliminatedPlayers.includes(seat as keyof typeof gameState.playerCards),
      isWinner: gameState.winner === seat
    }));

  return (
    <Paper elevation={1} style={{ 
      padding: '16px', 
      backgroundColor: '#f9f9f9',
      borderRadius: '8px',
      minWidth: minWidth,
      maxWidth: maxWidth
    }}>
      <Typography variant="h6" align="center" gutterBottom>
        Final Results Summary
      </Typography>
      <Stack spacing={1}>
        {allPlayers.map(({ seat, isWinner, isEliminated }) => (
          <Box key={seat} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '8px 12px',
            backgroundColor: currentPlayerSeat && seat === currentPlayerSeat 
              ? '#e3f2fd' 
              : isWinner 
                ? '#e8f5e8' 
                : isEliminated 
                  ? '#ffeaea' 
                  : '#ffffff',
            borderRadius: '4px',
            border: currentPlayerSeat && seat === currentPlayerSeat
              ? '1px solid #2196f3'
              : isWinner 
                ? '1px solid #4caf50' 
                : isEliminated 
                  ? '1px solid #f44336' 
                  : '1px solid #e0e0e0'
          }}>
            <Typography variant="body1" style={{
              fontWeight: (currentPlayerSeat && seat === currentPlayerSeat) || isWinner ? 'bold' : 'normal',
              color: isWinner ? '#2e7d32' : isEliminated ? '#c62828' : 'inherit'
            }}>
              {seat.replace('p', 'Player ')}
              {currentPlayerSeat && seat === currentPlayerSeat && ' (You)'}
            </Typography>
            <Typography variant="body2" style={{
              color: isWinner ? '#2e7d32' : isEliminated ? '#c62828' : '#666',
              fontWeight: 'bold'
            }}>
              {isWinner ? '🏆 Winner' : isEliminated ? '❌ Eliminated' : '🤝 Active'}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Paper>
  );
};
