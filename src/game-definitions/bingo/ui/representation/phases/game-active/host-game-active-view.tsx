import { GameHostComponentProps } from "@bfg-engine/models/game-engine/bfg-game-engine-types";
import { BingoGameState, BingoHostAction } from "../../../../engine/bingo-engine";
import { CalledBingoNumbersGrid } from "../../components/called-bingo-numbers-grid";
import { BingoCard } from "../../components/bingo-card";
import { Container, Stack, Typography } from "@bfg-engine/ui/bfg-ui";


export const HostActiveGameView = (props: GameHostComponentProps<BingoGameState, BingoHostAction>) => {
  const { gameState } = props;
  
  // Get all players (including eliminated ones)
  const allPlayers = Object.entries(gameState.playerCards)
    .filter(([_, card]) => card !== null)
    .map(([seat, card]) => ({
      seat: seat as keyof typeof gameState.playerCards,
      card: card!,
      marks: gameState.playerMarks[seat as keyof typeof gameState.playerMarks]!,
      isEliminated: gameState.eliminatedPlayers.includes(seat as keyof typeof gameState.playerCards)
    }));

  // Separate active and eliminated players
  const activePlayers = allPlayers.filter(player => !player.isEliminated);
  const eliminatedPlayers = allPlayers.filter(player => player.isEliminated);

  // Host always sees all players
  const playersToShow = allPlayers;

  return (
    <Container maxWidth="xl" disableGutters>
      <Stack spacing={4} alignItems="center" style={{ padding: '16px' }}>
        {/* Called Numbers Grid */}
        <CalledBingoNumbersGrid 
          calledNumbers={gameState.calledNumbers}
          canCallNumbers={false}
          gridSize="medium"
        />

        {/* Player Cards - Host sees all */}
        {playersToShow.length > 0 && (
          <>
            <Typography variant="h6" align="center">
              Player Cards ({activePlayers.length} active, {eliminatedPlayers.length} eliminated)
            </Typography>
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: '24px', 
              justifyContent: 'center',
              maxWidth: '100%'
            }}>
              {playersToShow.map(({ seat, card, marks, isEliminated }) => (
                <div key={seat} style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  opacity: isEliminated ? 0.6 : 1,
                  position: 'relative'
                }}>
                  <Typography variant="body2" gutterBottom style={{
                    color: isEliminated ? '#f44336' : 'inherit',
                    fontWeight: isEliminated ? 'bold' : 'normal'
                  }}>
                    {seat.replace('p', 'Player ')}
                    {isEliminated && ' ❌'}
                  </Typography>
                  <BingoCard 
                    card={card}
                    marks={marks}
                    calledNumbers={gameState.calledNumbers}
                    gridSize="small"
                    showCalledBingoNumberHints={gameState.configuration.showCalledBingoNumberHints}
                  />
                  {isEliminated && (
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      backgroundColor: 'rgba(244, 67, 54, 0.8)',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '4px',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      pointerEvents: 'none'
                    }}>
                      ELIMINATED
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* No Players Message */}
        {playersToShow.length === 0 && (
          <Typography variant="body1" color="secondary" align="center">
            No players in the game
          </Typography>
        )}
      </Stack>
    </Container>
  );
}
