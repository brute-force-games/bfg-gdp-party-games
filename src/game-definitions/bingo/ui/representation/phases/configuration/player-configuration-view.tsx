import { 
  BINGO_GAME_TABLE_ACTION_UPDATE_CALLER_CANDIDATE,
  BingoGameState,
  BingoPlayerAction,
  BingoUpdateCallerCandidate,
} from "~/game-definitions/bingo/engine/bingo-engine-2";
import { 
  Typography, 
  Stack, 
  Checkbox
} from "@bfg-engine/ui/bfg-ui";
import { ConfigurationSummary } from "../../components/configuration-summary";
import { PlayerComponentProps } from "@bfg-engine/models/game-engine/bfg-game-engine-types";

export const PlayerConfigurationView = ({ 
  gameState,
  currentPlayerSeat,
  onPlayerAction
}: PlayerComponentProps<BingoGameState, BingoPlayerAction>) => {
  const config = gameState.configuration;
  
  const handlePlayerCallerCandidateChange = (checked: boolean) => {
    if (currentPlayerSeat === null) {
      return;
    }

    const updateAction: BingoUpdateCallerCandidate = {
      playerActionType: BINGO_GAME_TABLE_ACTION_UPDATE_CALLER_CANDIDATE,
      source: 'player',
      playerSeat: currentPlayerSeat,
      isCandidate: checked,
    };

    console.log('🎮 PLAYER SENDING CALLER CANDIDATE CHANGE:', updateAction);
    
    onPlayerAction(updateAction);
  };

  return (
    <Stack spacing={3} style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <Typography variant="h1" gutterBottom>
        Bingo Game Configuration
      </Typography>

      <ConfigurationSummary config={config} />
      <Checkbox 
        label="Volunteer to be caller" 
        checked={ currentPlayerSeat !== null && config.callerCandidates.includes(currentPlayerSeat)}
        onChange={e => handlePlayerCallerCandidateChange(e.target.checked)}
      />

      
      {/* <Card>
        <Stack spacing={3} style={{ padding: '20px' }}>
          <FormControl fullWidth>
            <FormLabel>Caller Candidates</FormLabel>
            <Stack direction="row" spacing={1} style={{ marginTop: '8px', flexWrap: 'wrap' }}>
              {formatCallerCandidates(config.callerCandidates).map((candidate: string, index: number) => (
                <Chip key={index} label={candidate} />
              ))}
              {config.callerCandidates.length === 0 && (
                <Typography variant="body2" color="disabled">None</Typography>
              )}
            </Stack>
            <Checkbox 
              label="Volunteer to be the caller" 
              disabled={myPlayerSeat === null || onGameAction === undefined}
              checked={ myPlayerSeat !== null && config.callerCandidates.includes(myPlayerSeat)}
              onChange={e => handlePlayerCallerCandidateChange(e.target.checked)}
            />

          </FormControl>

          <FormControl fullWidth>
            <FormLabel>Caller Seat</FormLabel>
            <Typography variant="body1" style={{ 
              padding: '8px 12px',
              backgroundColor: '#f5f5f5',
              border: '1px solid #e0e0e0',
              borderRadius: '4px',
              marginTop: '8px'
            }}>
              {formatCallerSeat(config.callerSeat)}
            </Typography>
            <FormHelperText>
              {config.callerSeat 
                ? "Only this player can call numbers" 
                : "Any player can call numbers"
              }
            </FormHelperText>
          </FormControl>

          <FormControl fullWidth>
            <FormLabel>Auto Call Interval</FormLabel>
            <Typography variant="body1" style={{ 
              padding: '8px 12px',
              backgroundColor: '#f5f5f5',
              border: '1px solid #e0e0e0',
              borderRadius: '4px',
              marginTop: '8px'
            }}>
              {formatAutoCallInterval(config.autoCallIntervalInMs)}
            </Typography>
            <FormHelperText>
              How often numbers are automatically called
            </FormHelperText>
          </FormControl>

          <FormControl fullWidth>
            <FormLabel>Lose for Failed Bingo Calls</FormLabel>
            <Stack direction="row" spacing={2} alignItems="center" style={{ marginTop: '8px' }}>
              <Switch 
                checked={config.loseForFailedBingoCalls} 
                disabled 
              />
              <Typography variant="body1">
                {config.loseForFailedBingoCalls ? 'Enabled' : 'Disabled'}
              </Typography>
            </Stack>
            <FormHelperText>
              {config.loseForFailedBingoCalls 
                ? "Players lose the game if they claim bingo incorrectly"
                : "Players can claim bingo without penalty for incorrect claims"
              }
            </FormHelperText>
          </FormControl>
        </Stack>
      </Card> */}

      {/* Configuration Summary */}
      {/* <Card variant="outlined" style={{ backgroundColor: '#f8f9fa' }}>
        <Stack spacing={2} style={{ padding: '15px' }}>
          <Typography variant="h6" color="secondary">
            Configuration Summary
          </Typography>
          <Stack spacing={1}>
            <Typography variant="body2">
              <strong>Caller:</strong> {formatCallerSeat(config.callerSeat)}
            </Typography>
            <Typography variant="body2">
              <strong>Candidates:</strong> {formatCallerCandidates(config.callerCandidates).length > 0 ? formatCallerCandidates(config.callerCandidates).join(", ") : "None"}
            </Typography>
            <Typography variant="body2">
              <strong>Auto Call:</strong> {formatAutoCallInterval(config.autoCallIntervalInMs)}
            </Typography>
            <Typography variant="body2">
              <strong>Failed Bingo Penalty:</strong> {config.loseForFailedBingoCalls ? 'Yes' : 'No'}
            </Typography>
          </Stack>
        </Stack>
      </Card> */}
    </Stack>
  );
}
