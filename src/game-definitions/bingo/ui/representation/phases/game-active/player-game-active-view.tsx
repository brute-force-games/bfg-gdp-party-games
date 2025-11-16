import { PlayerComponentProps } from "@bfg-engine/models/game-engine/bfg-game-engine-types";
import { BingoGameState, BingoPlayerAction, BINGO_GAME_TABLE_ACTION_CALL_NUMBER, BINGO_GAME_TABLE_ACTION_CLAIM_BINGO, BINGO_GAME_TABLE_ACTION_MARK_NUMBER, BingoNumber } from "../../../../engine/bingo-engine";
import { CalledBingoNumbersGrid } from "../../components/called-bingo-numbers-grid";
import { BingoCard } from "../../components/bingo-card";
import { Container, Button, Box, Stack } from "@bfg-engine/ui/bfg-ui";


export const PlayerActiveGameView = (props: PlayerComponentProps<BingoGameState, BingoPlayerAction, null>) => {
  const { gameState, currentPlayerSeat, onPlayerAction } = props;

  const myCard = gameState.playerCards[currentPlayerSeat];
  const myMarks = gameState.playerMarks[currentPlayerSeat];
  const isEliminated = gameState.eliminatedPlayers.includes(currentPlayerSeat);

  if (!myCard || !myMarks) {
    throw new Error(`Player card or marks not found for player seat: ${currentPlayerSeat}`);
  }

  const handleCallNumber = (number: number) => {
    onPlayerAction({
      playerActionType: BINGO_GAME_TABLE_ACTION_CALL_NUMBER,
      source: "player",
      seat: currentPlayerSeat,
      calledNumber: number as BingoNumber,
    });
  };

  const handleClaimBingo = () => {
    onPlayerAction({
      playerActionType: BINGO_GAME_TABLE_ACTION_CLAIM_BINGO,
      source: "player",
      seat: currentPlayerSeat,
    });
  };

  const handleMarkNumber = (number: number) => {
    onPlayerAction({
      playerActionType: BINGO_GAME_TABLE_ACTION_MARK_NUMBER,
      source: "player",
      seat: currentPlayerSeat,
      markedNumber: number as BingoNumber,
    });
  };

  // Check if this player can call numbers based on game configuration
  const canCallNumbers = gameState.configuration.callerSeat === currentPlayerSeat;

  return (
    <>
      <style>
        {`
          @media (max-width: 768px) {
            .bingo-player-layout {
              flex-direction: column !important;
              align-items: center !important;
            }
          }
        `}
      </style>
      <Container maxWidth="xl" disableGutters>
        <Stack 
          direction="row"
          spacing={4}
          alignItems="flex-start"
          justifyContent="center"
          flexWrap="wrap"
          className="bingo-player-layout"
          style={{ 
            padding: '16px'
          }}
        >
          {/* Bingo Card - First */}
          <Box style={{ 
            minWidth: '300px',
            flex: '0 0 auto'
          }}>
            <BingoCard 
              card={myCard}
              marks={myMarks}
              calledNumbers={gameState.calledNumbers}
              gridSize="medium"
              showCalledBingoNumberHints={gameState.configuration.showCalledBingoNumberHints}
              onMarkNumber={handleMarkNumber}
            />
            
            {/* Instructions */}
            <Box style={{ 
              textAlign: 'center', 
              marginTop: '8px',
              fontSize: '12px',
              color: '#666'
            }}>
              💡 Click on called numbers to mark them
            </Box>
            
            {/* BINGO Declaration Button or Elimination Message */}
            <Box style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              marginTop: '16px' 
            }}>
              {isEliminated ? (
                <Box style={{
                  backgroundColor: '#f44336',
                  color: 'white',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  minWidth: '140px'
                }}>
                  ❌ ELIMINATED ❌
                </Box>
              ) : (
                <Button
                  onClick={handleClaimBingo}
                  disabled={gameState.isGameOver}
                  variant="contained"
                  color="warning"
                  size="large"
                  style={{
                    backgroundColor: '#ff6b35',
                    color: 'white',
                    borderRadius: '8px',
                    padding: '12px 24px',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    transition: 'all 0.2s ease',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    minWidth: '140px'
                  }}
                  onMouseEnter={(e) => {
                    if (!gameState.isGameOver) {
                      e.currentTarget.style.backgroundColor = '#e55a2b';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!gameState.isGameOver) {
                      e.currentTarget.style.backgroundColor = '#ff6b35';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
                    }
                  }}
                >
                  🎉 BINGO! 🎉
                </Button>
              )}
            </Box>
          </Box>

          {/* Called Numbers Component - Second */}
          <Box style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            minWidth: 'fit-content',
            flex: '0 0 auto'
          }}>
            <CalledBingoNumbersGrid 
              calledNumbers={gameState.calledNumbers}
              onCallNumber={handleCallNumber}
              canCallNumbers={canCallNumbers}
              gridSize="small"
              autocallInterval={gameState.configuration.minCallIntervalInMs}
            />
          </Box>
        </Stack>
      </Container>
    </>
  );
}
