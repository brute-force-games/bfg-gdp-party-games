import { PlayerComponentProps } from "@bfg-engine/models/game-engine/bfg-game-engine-types";
import { BingoGameState, BingoPlayerAction } from "~/game-definitions/bingo/engine/bingo-engine";
import { CalledBingoNumbersGrid } from "../../components/called-bingo-numbers-grid";
import { BingoCard } from "../../components/bingo-card";
import { GameOverHeader } from "../../../components/game-over-header";
import { GameStatistics } from "../../../components/game-statistics";
import { FinalResultsSummary } from "../../../components/final-results-summary";
import { Container, Box, Stack, Typography } from "@bfg-engine/ui/bfg-ui";


export const PlayerGameOverView = ({ gameState, currentPlayerSeat }: PlayerComponentProps<BingoGameState, BingoPlayerAction>) => {
  const myCard = gameState.playerCards[currentPlayerSeat];
  const myMarks = gameState.playerMarks[currentPlayerSeat];
  const isEliminated = gameState.eliminatedPlayers.includes(currentPlayerSeat);
  const isWinner = gameState.winner === currentPlayerSeat;

  if (!myCard || !myMarks) {
    throw new Error(`Player card or marks not found for player seat: ${currentPlayerSeat}`);
  }

  return (
    <>
      <style>
        {`
          @media (max-width: 768px) {
            .bingo-game-over-layout {
              flex-direction: column !important;
              align-items: center !important;
            }
          }
        `}
      </style>
      <Container maxWidth="xl" disableGutters>
        <Stack spacing={4} alignItems="center" style={{ padding: '16px' }}>
          {/* Game Over Header */}
          <GameOverHeader 
            gameState={gameState} 
            isWinner={isWinner}
            isEliminated={isEliminated}
            currentPlayerSeat={currentPlayerSeat}
          />


          {/* Player Summary */}
          <FinalResultsSummary 
            gameState={gameState} 
            currentPlayerSeat={currentPlayerSeat}
            minWidth="300px"
            maxWidth="600px"
          />

          {/* Game Statistics */}
          <GameStatistics gameState={gameState} minWidth="300px" />

          {/* Player's Card and Called Numbers */}
          <Stack 
            direction="row"
            spacing={4}
            alignItems="flex-start"
            justifyContent="center"
            flexWrap="wrap"
            className="bingo-game-over-layout"
          >
            {/* Player's Bingo Card */}
            <Box style={{ 
              minWidth: '300px',
              flex: '0 0 auto'
            }}>
              <Typography variant="h6" align="center" gutterBottom>
                Your Card
              </Typography>
              <BingoCard 
                card={myCard}
                marks={myMarks}
                calledNumbers={gameState.calledNumbers}
                gridSize="medium"
                showCalledBingoNumberHints={gameState.configuration.showCalledBingoNumberHints}
              />
              {isEliminated && (
                <Box style={{
                  backgroundColor: '#f44336',
                  color: 'white',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  marginTop: '16px'
                }}>
                  ❌ ELIMINATED ❌
                </Box>
              )}
              {isWinner && (
                <Box style={{
                  backgroundColor: '#4caf50',
                  color: 'white',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  marginTop: '16px'
                }}>
                  🏆 WINNER! 🏆
                </Box>
              )}
            </Box>

            {/* Called Numbers Grid */}
            <Box style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              minWidth: 'fit-content',
              flex: '0 0 auto'
            }}>
              <Stack spacing={2} alignItems="center">
                <Typography variant="h6" align="center">
                  Called Numbers
                </Typography>
                <CalledBingoNumbersGrid 
                  calledNumbers={gameState.calledNumbers}
                  canCallNumbers={false}
                  gridSize="small"
                />
              </Stack>
            </Box>
          </Stack>

        </Stack>
      </Container>
    </>
  );
};
