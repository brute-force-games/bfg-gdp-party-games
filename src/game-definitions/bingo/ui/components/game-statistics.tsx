import { Typography, Paper, Stack, Box } from "@bfg-engine/ui/bfg-ui";
import { BingoGameState } from "../../engine/bingo-engine";

interface GameStatisticsProps {
  gameState: BingoGameState;
  minWidth?: string;
}

export const GameStatistics = ({ gameState, minWidth = "400px" }: GameStatisticsProps) => {
  // Calculate player statistics
  const allPlayers = Object.entries(gameState.playerCards)
    .filter(([_, card]) => card !== null)
    .map(([seat, _card]) => ({
      seat: seat as keyof typeof gameState.playerCards,
      isEliminated: gameState.eliminatedPlayers.includes(seat as keyof typeof gameState.playerCards),
    }));

  const activePlayers = allPlayers.filter(player => !player.isEliminated);
  const eliminatedPlayers = allPlayers.filter(player => player.isEliminated);

  return (
    <Paper elevation={2} style={{ 
      padding: '20px', 
      textAlign: 'center',
      backgroundColor: '#fafafa',
      borderRadius: '8px',
      minWidth: minWidth
    }}>
      <Typography variant="h6" gutterBottom>
        Game Statistics
      </Typography>
      <Stack direction="row" spacing={4} justifyContent="center" flexWrap="wrap">
        <Box>
          <Typography variant="h4" color="primary">
            {gameState.calledNumbers.length}
          </Typography>
          <Typography variant="body2" color="secondary">
            Numbers Called
          </Typography>
        </Box>
        <Box>
          <Typography variant="h4" color="secondary">
            {activePlayers.length}
          </Typography>
          <Typography variant="body2" color="secondary">
            Active Players
          </Typography>
        </Box>
        <Box>
          <Typography variant="h4" color="error">
            {eliminatedPlayers.length}
          </Typography>
          <Typography variant="body2" color="secondary">
            Eliminated
          </Typography>
        </Box>
        <Box>
          <Typography variant="h4" color="secondary">
            {allPlayers.length}
          </Typography>
          <Typography variant="body2" color="secondary">
            Total Players
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
};
