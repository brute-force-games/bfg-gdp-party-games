import { ObserverComponentProps } from "@bfg-engine/models/game-engine/bfg-game-engine-types";
import { BingoGameState } from "~/game-definitions/bingo/engine/bingo-engine";
import { CalledBingoNumbersGrid } from "../../components/called-bingo-numbers-grid";
import { BingoCard } from "../../components/bingo-card";
import { GameOverHeader } from "../../../components/game-over-header";
import { GameStatistics } from "../../../components/game-statistics";
import { FinalResultsSummary } from "../../../components/final-results-summary";
import { Container, Stack, Typography, Paper } from "@bfg-engine/ui/bfg-ui";


export const ObserverGameOverView = ({ gameState, observedPlayerSeat }: ObserverComponentProps<BingoGameState>) => {
  // Get all players (including eliminated ones)
  const allPlayers = Object.entries(gameState.playerCards)
    .filter(([_, card]) => card !== null)
    .map(([seat, card]) => ({
      seat: seat as keyof typeof gameState.playerCards,
      card: card!,
      marks: gameState.playerMarks[seat as keyof typeof gameState.playerMarks]!,
      isEliminated: gameState.eliminatedPlayers.includes(seat as keyof typeof gameState.playerCards),
      isWinner: gameState.winner === seat
    }));

  const activePlayers = allPlayers.filter(player => !player.isEliminated);
  const eliminatedPlayers = allPlayers.filter(player => player.isEliminated);

  // Determine which players to show based on view perspective
  const playersToShow = observedPlayerSeat 
    ? allPlayers.filter(player => player.seat === observedPlayerSeat)
    : allPlayers; // Show all players if no specific perspective selected

  return (
    <Container maxWidth="xl" disableGutters>
      <Stack spacing={4} alignItems="center" style={{ padding: '16px' }}>
        {/* Game Over Header */}
        <GameOverHeader gameState={gameState} />

        {/* Final Results Summary */}
        <FinalResultsSummary gameState={gameState} />

        {/* Game Statistics */}
        <GameStatistics gameState={gameState} />

        {/* Called Numbers Grid */}
        <Paper elevation={2} style={{ 
          padding: '20px', 
          backgroundColor: '#fafafa',
          borderRadius: '8px'
        }}>
          <Typography variant="h6" align="center" gutterBottom>
            All Called Numbers
          </Typography>
          <CalledBingoNumbersGrid 
            calledNumbers={gameState.calledNumbers}
            canCallNumbers={false}
            gridSize="medium"
          />
        </Paper>

        {/* Player Cards - Driven by View Perspective */}
        {playersToShow.length > 0 && (
          <Paper elevation={2} style={{ 
            padding: '20px', 
            backgroundColor: '#fafafa',
            borderRadius: '8px',
            width: '100%'
          }}>
            <Typography variant="h6" align="center" gutterBottom>
              {observedPlayerSeat 
                ? `${observedPlayerSeat.replace('p', 'Player ')}'s Card`
                : `All Player Cards (${activePlayers.length} active, ${eliminatedPlayers.length} eliminated)`
              }
            </Typography>
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: '24px', 
              justifyContent: 'center',
              maxWidth: '100%'
            }}>
              {playersToShow.map(({ seat, card, marks, isEliminated, isWinner }) => (
                <div key={seat} style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  opacity: isEliminated ? 0.6 : 1,
                  position: 'relative',
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: isWinner ? '#e8f5e8' : isEliminated ? '#ffeaea' : '#ffffff',
                  border: isWinner ? '2px solid #4caf50' : isEliminated ? '2px solid #f44336' : '1px solid #e0e0e0'
                }}>
                  <Typography variant="body2" gutterBottom style={{
                    color: isWinner ? '#2e7d32' : isEliminated ? '#c62828' : 'inherit',
                    fontWeight: isWinner ? 'bold' : 'normal'
                  }}>
                    {seat.replace('p', 'Player ')}
                    {isWinner && ' 🏆'}
                    {isEliminated && ' ❌'}
                  </Typography>
                  <BingoCard 
                    card={card}
                    marks={marks}
                    calledNumbers={gameState.calledNumbers}
                    gridSize={observedPlayerSeat ? "medium" : "small"}
                    showCalledBingoNumberHints={gameState.configuration.showCalledBingoNumberHints}
                  />
                  {(isEliminated || isWinner) && (
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      backgroundColor: isWinner ? 'rgba(76, 175, 80, 0.9)' : 'rgba(244, 67, 54, 0.9)',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '4px',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      pointerEvents: 'none'
                    }}>
                      {isWinner ? 'WINNER' : 'ELIMINATED'}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Paper>
        )}

        {/* No Players Message */}
        {playersToShow.length === 0 && (
          <Typography variant="body1" color="secondary" align="center">
            {observedPlayerSeat 
              ? `${observedPlayerSeat.replace('p', 'Player ')} is not in the game`
              : "No players in the game"
            }
          </Typography>
        )}
      </Stack>
    </Container>
  );
};
