import { 
  BingoGameConfiguration, 
  BINGO_GAME_TABLE_ACTION_UPDATE_CONFIGURATION,
  BINGO_GAME_TABLE_ACTION_HOST_STARTS_GAME,
  BingoUpdateConfiguration,
  MIN_CALL_INTERVAL_MAX,
  MIN_CALL_INTERVAL_MIN,
  BingoGameState,
  BingoHostAction,
  BingoHostStartsGame,
  DEFAULT_BINGO_GAME_CONFIGURATION,
  BingoCallerId,
  isCallerBingoCardControlDisabled
} from "~/game-definitions/bingo/engine/bingo-engine";
import { 
  Typography, 
  Card, 
  Stack, 
  FormControl, 
  FormLabel, 
  FormHelperText,
  Switch,
  Button,
  Slider,
  Divider,
  Chip
} from "@bfg-engine/ui/bfg-ui";
import { GameHostComponentProps } from "@bfg-engine/models/game-engine/bfg-game-engine-types";
export const HostConfigurationView = (props: GameHostComponentProps<BingoGameState, BingoHostAction>) => {
  const { gameState, onHostAction } = props;
  const configuration = gameState.configuration;
  const canStartGame = configuration.canStartGame;

  // Use engine function to check if caller bingo card control should be disabled
  const isCallerBingoCardDisabled = isCallerBingoCardControlDisabled(gameState);

  const handleConfigurationChange = (field: keyof BingoGameConfiguration, value: any) => {
    // if (!onHostAction) {
    //   console.error("Cannot apply configuration: missing onHostAction");
    //   return;
    // }

    const updatedConfiguration = {
      ...configuration,
      [field]: value
    };
    
    const updateAction: BingoUpdateConfiguration = {
      hostActionType: BINGO_GAME_TABLE_ACTION_UPDATE_CONFIGURATION,
      source: 'host',
      update: updatedConfiguration
    };
    
    onHostAction(updateAction);
  };

  const handleCallerSelect = (seat: BingoCallerId) => {
    const updatedConfiguration: BingoGameConfiguration = {
      ...configuration,
      callerSeat: seat,
    };
    
    const updateAction: BingoUpdateConfiguration = {
      hostActionType: BINGO_GAME_TABLE_ACTION_UPDATE_CONFIGURATION,
      source: 'host',
      update: updatedConfiguration
    };

    onHostAction(updateAction);
  };

  const handleClearCallerCandidates = () => {
    // handleConfigurationChange('callerSeat', undefined);
    console.log('🎮 HOST SENDING CALLER CLEAR');

    const updatedConfiguration: BingoGameConfiguration = {
      ...configuration,
      callerSeat: undefined,
      callerCandidates: [],
    };
    
    const updateAction: BingoUpdateConfiguration = {
      hostActionType: BINGO_GAME_TABLE_ACTION_UPDATE_CONFIGURATION,
      source: 'host',
      update: updatedConfiguration
    };

    onHostAction(updateAction);
  };

  const handleResetConfiguration = () => {
    if (!onHostAction) {
      console.error("Cannot reset configuration: missing onHostAction");
      return;
    }

    const updateAction: BingoUpdateConfiguration = {
      hostActionType: BINGO_GAME_TABLE_ACTION_UPDATE_CONFIGURATION,
      source: 'host',
      update: DEFAULT_BINGO_GAME_CONFIGURATION
    };

    onHostAction(updateAction);
  };

  const handleStartGame = () => {
    if (!onHostAction) {
      console.error("Cannot start game: missing onHostAction");
      return;
    }

    const startGameAction: BingoHostStartsGame = {
      hostActionType: BINGO_GAME_TABLE_ACTION_HOST_STARTS_GAME,
      source: 'host',
      configuration: gameState.configuration
    };

    onHostAction(startGameAction);
  };

  const formatCallerSeat = (callerSeat: string | undefined) => {
    if (!callerSeat) {
      return "Caller not set";
    }
    return callerSeat.replace('p', 'Player ');
  };

  const formatMinCallInterval = (intervalMs: number) => {
    const seconds = Math.round(intervalMs / 1000);
    return `${intervalMs}ms (${seconds}s)`;
  };

  const formatCallerCandidates = (candidates: string[]): string[] => {
    if (candidates.length === 0) return [];
    return candidates.map(seat => seat.replace('p', 'Player '));
  };

  const callerCandidates = configuration.callerCandidates;

  return (
    <Stack spacing={3} style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <Card variant="outlined" style={{ border: '2px solid #1976d2' }}>
        <Stack spacing={2} style={{ padding: '20px' }}>
          <Typography variant="h5" gutterBottom style={{ color: '#1976d2', fontWeight: 'bold' }}>
            Ready to Start Bingo?
          </Typography>
          <Typography variant="body2" style={{ color: '#666' }}>
            Start the game with the current configuration. All players will be notified and the game will begin.
          </Typography>
          <Button 
            onClick={handleStartGame}
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            disabled={!canStartGame}
            style={{ 
              padding: '16px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              textTransform: 'none'
            }}
          >
            🎮 Start Game
          </Button>
        </Stack>
      </Card>
      
      {/* Configuration Form */}
      <Card>
        <Stack spacing={3} style={{ padding: '20px' }}>
          {/* Caller Seat Configuration */}
          <FormControl fullWidth>
            <FormLabel>Designate Caller</FormLabel>
            <Stack spacing={2}>
              
              <Stack direction="row" spacing={1} style={{ flexWrap: 'wrap', gap: '8px' }}>
                {callerCandidates.length > 0 ? (
                  callerCandidates.map((seat) => {
                    const isSelected = configuration.callerSeat === seat;
                    
                    return (
                      <Chip
                        key={seat}
                        label={seat.replace('p', 'Player ')}
                        variant={isSelected ? "filled" : "outlined"}
                        color={isSelected ? "primary" : "default"}
                        clickable={true}
                        onClick={() => handleCallerSelect(seat)}
                        style={{
                          transition: 'all 0.2s ease-in-out',
                          transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                          boxShadow: isSelected ? '0 2px 8px rgba(25, 118, 210, 0.3)' : 'none'
                        }}
                      />
                    );
                  })
                ) : (
                  <Typography variant="body2" color="secondary" style={{ fontStyle: 'italic', padding: '8px 0' }}>
                    No caller candidates available
                  </Typography>
                )}
                {configuration.callerSeat && (
                  <button
                    type="button"
                    onClick={handleClearCallerCandidates}
                    style={{ 
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      color: '#1976d2',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      alignSelf: 'center'
                    }}
                  >
                    Clear Selection
                  </button>
                )}
              </Stack>
              
              {configuration.callerSeat && (
                <Typography variant="caption" color="primary" style={{ marginTop: '4px', lineHeight: '1.4' }}>
                  {formatCallerSeat(configuration.callerSeat)} is selected as the designated caller
                </Typography>
              )}
              
              {!configuration.callerSeat && callerCandidates.length > 0 && (
                <Typography variant="caption" color="secondary" style={{ marginTop: '4px', lineHeight: '1.4' }}>
                  Click a chip to select a designated caller, or leave unselected to allow any player to call
                </Typography>
              )}
            </Stack>
          </FormControl>

          <FormControl fullWidth>
            <FormLabel>Minimum Call Interval</FormLabel>
            
            {/* Slider Component with Speech Bubble */}
            <Slider
              value={configuration.minCallIntervalInMs}
              min={MIN_CALL_INTERVAL_MIN}
              max={MIN_CALL_INTERVAL_MAX}
              step={1000}
              marks={[
                { value: MIN_CALL_INTERVAL_MIN, label: `${MIN_CALL_INTERVAL_MIN/1000}s` },
                { value: 10000, label: '10s' },
                { value: 30000, label: '30s' },
                { value: MIN_CALL_INTERVAL_MAX, label: `${MIN_CALL_INTERVAL_MAX/1000}s` }
              ]}
              valueLabelDisplay="off"
              showSpeechBubble={true}
              speechBubbleTimeout={2000}
              valueLabelFormat={(value) => formatMinCallInterval(value)}
              onChange={(_, value) => handleConfigurationChange('minCallIntervalInMs', value)}
              color="primary"
            />
            
            <FormHelperText>
              Minimum interval between calls ({formatMinCallInterval(configuration.minCallIntervalInMs)})
            </FormHelperText>
          </FormControl>

          {/* Lose for Failed Bingo Calls Configuration */}
          <FormControl fullWidth>
            <FormLabel>Failed Bingo Penalty</FormLabel>
            <Stack 
              direction="row" 
              spacing={2} 
              alignItems="center"
              onClick={() => handleConfigurationChange('loseForFailedBingoCalls', !configuration.loseForFailedBingoCalls)}
              style={{
                cursor: 'pointer',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '2px solid transparent',
                transition: 'all 0.2s ease-in-out',
                backgroundColor: configuration.loseForFailedBingoCalls ? '#e3f2fd' : '#f5f5f5',
                borderColor: configuration.loseForFailedBingoCalls ? '#1976d2' : '#e0e0e0',
                userSelect: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = configuration.loseForFailedBingoCalls ? '#bbdefb' : '#eeeeee';
                e.currentTarget.style.borderColor = configuration.loseForFailedBingoCalls ? '#1565c0' : '#bdbdbd';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = configuration.loseForFailedBingoCalls ? '#e3f2fd' : '#f5f5f5';
                e.currentTarget.style.borderColor = configuration.loseForFailedBingoCalls ? '#1976d2' : '#e0e0e0';
              }}
            >
              <Switch 
                checked={configuration.loseForFailedBingoCalls} 
                onChange={(e) => handleConfigurationChange('loseForFailedBingoCalls', e.target.checked)}
                style={{ pointerEvents: 'none' }}
              />
              <Typography variant="body1" style={{ fontWeight: '500' }}>
                {configuration.loseForFailedBingoCalls ? 'Enabled' : 'Disabled'}
              </Typography>
            </Stack>
            <FormHelperText>
              {configuration.loseForFailedBingoCalls 
                ? "Players lose the game if they claim bingo incorrectly"
                : "Players can claim bingo without penalty for incorrect claims"
              }
            </FormHelperText>
          </FormControl>

          {/* Caller Has Bingo Card Configuration */}
          <FormControl fullWidth>
            <FormLabel>Caller Bingo Card</FormLabel>
            <Stack 
              direction="row" 
              spacing={2} 
              alignItems="center"
              onClick={() => !isCallerBingoCardDisabled && handleConfigurationChange('callerHasBingoCard', !configuration.callerHasBingoCard)}
              style={{
                cursor: isCallerBingoCardDisabled ? 'not-allowed' : 'pointer',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '2px solid transparent',
                transition: 'all 0.2s ease-in-out',
                backgroundColor: isCallerBingoCardDisabled 
                  ? '#f5f5f5' 
                  : configuration.callerHasBingoCard ? '#e3f2fd' : '#f5f5f5',
                borderColor: isCallerBingoCardDisabled 
                  ? '#e0e0e0' 
                  : configuration.callerHasBingoCard ? '#1976d2' : '#e0e0e0',
                userSelect: 'none',
                opacity: isCallerBingoCardDisabled ? 0.6 : 1
              }}
              onMouseEnter={(e) => {
                if (!isCallerBingoCardDisabled) {
                  e.currentTarget.style.backgroundColor = configuration.callerHasBingoCard ? '#bbdefb' : '#eeeeee';
                  e.currentTarget.style.borderColor = configuration.callerHasBingoCard ? '#1565c0' : '#bdbdbd';
                }
              }}
              onMouseLeave={(e) => {
                if (!isCallerBingoCardDisabled) {
                  e.currentTarget.style.backgroundColor = configuration.callerHasBingoCard ? '#e3f2fd' : '#f5f5f5';
                  e.currentTarget.style.borderColor = configuration.callerHasBingoCard ? '#1976d2' : '#e0e0e0';
                }
              }}
            >
              <Switch 
                checked={configuration.callerHasBingoCard} 
                disabled={isCallerBingoCardDisabled}
                onChange={(e) => handleConfigurationChange('callerHasBingoCard', e.target.checked)}
                style={{ pointerEvents: 'none' }}
              />
              <Typography variant="body1" style={{ fontWeight: '500' }}>
                {configuration.callerHasBingoCard ? 'Enabled' : 'Disabled'}
              </Typography>
            </Stack>
            <FormHelperText>
              {isCallerBingoCardDisabled 
                ? "Caller bingo card is automatically enabled when there are fewer than 2 players"
                : configuration.callerHasBingoCard 
                  ? "The caller will receive a bingo card and can play along"
                  : "The caller will not receive a bingo card and only calls numbers"
              }
            </FormHelperText>
          </FormControl>

          {/* Show Called Number Hints Configuration */}
          <FormControl fullWidth>
            <FormLabel>Called Number Hints</FormLabel>
            <Stack 
              direction="row" 
              spacing={2} 
              alignItems="center"
              onClick={() => handleConfigurationChange('showCalledBingoNumberHints', !configuration.showCalledBingoNumberHints)}
              style={{
                cursor: 'pointer',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '2px solid transparent',
                transition: 'all 0.2s ease-in-out',
                backgroundColor: configuration.showCalledBingoNumberHints ? '#e3f2fd' : '#f5f5f5',
                borderColor: configuration.showCalledBingoNumberHints ? '#1976d2' : '#e0e0e0',
                userSelect: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = configuration.showCalledBingoNumberHints ? '#bbdefb' : '#eeeeee';
                e.currentTarget.style.borderColor = configuration.showCalledBingoNumberHints ? '#1565c0' : '#bdbdbd';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = configuration.showCalledBingoNumberHints ? '#e3f2fd' : '#f5f5f5';
                e.currentTarget.style.borderColor = configuration.showCalledBingoNumberHints ? '#1976d2' : '#e0e0e0';
              }}
            >
              <Switch 
                checked={configuration.showCalledBingoNumberHints} 
                onChange={(e) => handleConfigurationChange('showCalledBingoNumberHints', e.target.checked)}
                style={{ pointerEvents: 'none' }}
              />
              <Typography variant="body1" style={{ fontWeight: '500' }}>
                {configuration.showCalledBingoNumberHints ? 'Enabled' : 'Disabled'}
              </Typography>
            </Stack>
            <FormHelperText>
              {configuration.showCalledBingoNumberHints 
                ? "Called numbers will be highlighted on bingo cards to help players"
                : "Called numbers will not be highlighted on bingo cards (harder mode)"
              }
            </FormHelperText>
          </FormControl>
        </Stack>
      </Card>

      {/* Caller Candidates Management */}
      {/* <Card>
        <Stack spacing={3} style={{ padding: '20px' }}>
          <Typography variant="h6">Caller Candidates</Typography>
          <Typography variant="body2" color="secondary">
            Manage which players are eligible to be callers
          </Typography> */}
          
          {/* <Stack direction="row" spacing={1} style={{ flexWrap: 'wrap' }}>
            {callerCandidates.map(seat => {
              // const isCandidate = configuration.callerCandidates.includes(seat);
              return (
                <Chip
                  key={seat}
                  label={formatCallerSeat(seat)}
                  // color={isCandidate ? "primary" : "default"}
                  onClick={() => handleToggleCallerCandidate(seat, !isCandidate)}
                  clickable
                  // variant={isCandidate ? "filled" : "outlined"}
                />
              );
            })}
          </Stack> */}
          
          {/* <FormHelperText>
            Click chips to add/remove caller candidates. Current candidates: {formatCallerCandidates(configuration.callerCandidates).join(", ") || "None"}
          </FormHelperText>
        </Stack>
      </Card> */}

      {/* Reset Button */}
      <Card variant="outlined">
        <Stack spacing={2} style={{ padding: '20px' }}>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button 
              onClick={handleResetConfiguration}
              variant="outlined"
              color="secondary"
            >
              Reset to Defaults
            </Button>
          </Stack>
          <Typography variant="caption" color="secondary" style={{ textAlign: 'center' }}>
            Configuration changes are applied automatically. Use Reset to restore original settings.
          </Typography>
        </Stack>
      </Card>

      {/* Status Messages */}
      {/* {!onGameAction && (
        <Alert severity="warning">
          Configuration changes cannot be saved (no action handler available)
        </Alert>
      )}

      {!myPlayerSeat && (
        <Alert severity="error">
          You must be seated to modify configuration
        </Alert>
      )} */}

      {/* Current Configuration Summary */}
      <Card variant="outlined" style={{ backgroundColor: '#f8f9fa' }}>
        <Stack spacing={2} style={{ padding: '20px' }}>
          <Typography variant="h6" color="secondary">
            Current Configuration Summary
          </Typography>
          <Divider />
          <Stack spacing={1}>
            <Typography variant="body2">
              <strong>Designated Caller:</strong> {formatCallerSeat(configuration.callerSeat)}
            </Typography>
            <Typography variant="body2">
              <strong>Caller Candidates:</strong> {formatCallerCandidates(configuration.callerCandidates).length > 0 ? formatCallerCandidates(configuration.callerCandidates).join(", ") : "None"}
            </Typography>
            <Typography variant="body2">
              <strong>Min Call Interval:</strong> {formatMinCallInterval(configuration.minCallIntervalInMs)}
            </Typography>
            <Typography variant="body2">
              <strong>Failed Bingo Penalty:</strong> {configuration.loseForFailedBingoCalls ? 'Yes' : 'No'}
            </Typography>
            <Typography variant="body2">
              <strong>Caller Has Bingo Card:</strong> {configuration.callerHasBingoCard ? 'Yes' : 'No'}
            </Typography>
            <Typography variant="body2">
              <strong>Called Number Hints:</strong> {configuration.showCalledBingoNumberHints ? 'Yes' : 'No'}
            </Typography>
          </Stack>
        </Stack>
      </Card>
    </Stack>
  );
}
