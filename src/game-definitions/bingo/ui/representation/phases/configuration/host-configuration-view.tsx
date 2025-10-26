import { useState, useEffect } from "react";
import { 
  BingoGameConfiguration, 
  BINGO_GAME_TABLE_ACTION_UPDATE_CONFIGURATION,
  BINGO_GAME_TABLE_ACTION_HOST_STARTS_GAME,
  BingoUpdateConfiguration,
  AUTO_CALL_INTERVAL_MAX,
  AUTO_CALL_INTERVAL_MIN,
  BingoGameState,
  BingoHostAction,
  BingoHostStartsGame
} from "~/game-definitions/bingo/engine/bingo-engine-2";
import { 
  Typography, 
  Card, 
  Stack, 
  FormControl, 
  FormLabel, 
  FormHelperText,
  Switch,
  Button,
  Select,
  Option,
  Slider,
  Alert,
  Divider
} from "@bfg-engine/ui/bfg-ui";
import { GameHostComponentProps } from "@bfg-engine/models/game-engine/bfg-game-engine-types";

export const HostConfigurationView = (props: GameHostComponentProps<BingoGameState, BingoHostAction>) => {
  const { gameState, onHostAction } = props;
  const [configuration, setConfiguration] = useState<BingoGameConfiguration>(gameState.configuration);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setConfiguration(gameState.configuration);
    setIsDirty(false);
  }, [gameState.configuration]);

  const handleConfigurationChange = (field: keyof BingoGameConfiguration, value: any) => {
    console.log("🎮 HOST CONFIGURATION CHANGE:", field, value);
    setConfiguration(prev => ({
      ...prev,
      [field]: value
    }));
    setIsDirty(true);
  };

  const handleSaveConfiguration = () => {
    if (!onHostAction) {
      console.error("Cannot save configuration: missing onHostAction or myPlayerSeat");
      return;
    }

    const updateAction: BingoUpdateConfiguration = {
      hostActionType: BINGO_GAME_TABLE_ACTION_UPDATE_CONFIGURATION,
      source: 'host',
      update: configuration
    };

    onHostAction(updateAction);
    setIsDirty(false);
  };

  const handleResetConfiguration = () => {
    setConfiguration(gameState.configuration);
    setIsDirty(false);
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

  // const handleToggleCallerCandidate = (seat: GameTableSeat, isCandidate: boolean) => {
  //   if (!onGameAction || !myPlayerSeat) {
  //     console.error("Cannot update caller candidate: missing onGameAction or myPlayerSeat");
  //     return;
  //   }

  //   const updateAction: BingoUpdateCallerCandidate = {
  //     actionType: BINGO_GAME_TABLE_ACTION_UPDATE_CALLER_CANDIDATE,
  //     playerSeat: seat,
  //     isCandidate
  //   };

  //   onGameAction(gameState, updateAction);
  // };

  const formatCallerSeat = (callerSeat: string | undefined) => {
    if (!callerSeat) return "Any player";
    return callerSeat.replace('p', 'Player ');
  };

  const formatAutoCallInterval = (intervalMs: number) => {
    const seconds = Math.round(intervalMs / 1000);
    return `${intervalMs}ms (${seconds}s)`;
  };

  const formatCallerCandidates = (candidates: string[]): string[] => {
    if (candidates.length === 0) return [];
    return candidates.map(seat => seat.replace('p', 'Player '));
  };

  // const availableSeats: GameTableSeat[] = [
  //   'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8'
  // ];
  // const playerSeats = gameState.table.playerSeats;
  // const availableSeats = playerSeats.filter(seat => seat !== 'auto-caller');
  const callerCandidates = configuration.callerCandidates;

  return (
    <Stack spacing={3} style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <Typography variant="h1" gutterBottom>
        Host Configuration
      </Typography>
      {/* Start Game Button */}
      <Card variant="outlined" style={{ border: '2px solid #1976d2' }}>
        <Stack spacing={2} style={{ padding: '20px' }}>
          <Typography variant="h5" gutterBottom style={{ color: '#1976d2', fontWeight: 'bold' }}>
            Ready to Start?
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
            disabled={isDirty}
            style={{ 
              padding: '16px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              textTransform: 'none'
            }}
          >
            🎮 Start Game
          </Button>
          {isDirty && (
            <Typography variant="caption" style={{ textAlign: 'center', color: '#ed6c02' }}>
              Please save your configuration changes before starting the game
            </Typography>
          )}
        </Stack>
      </Card>
      
      {/* Configuration Form */}
      <Card>
        <Stack spacing={3} style={{ padding: '20px' }}>
          {/* Caller Seat Configuration */}
          <FormControl fullWidth>
            <FormLabel>Designated Caller</FormLabel>
            <Select
              value={configuration.callerSeat || ''}
              onChange={(e) => handleConfigurationChange('callerSeat', e.target.value || undefined)}
            >
              {callerCandidates.map(seat => (
                <Option key={seat} value={seat}>
                  {formatCallerSeat(seat)}
                </Option>
              ))}
            </Select>
            <FormHelperText>
              {configuration.callerSeat 
                ? "Only this player can call numbers" 
                : "Any player can call numbers"
              }
            </FormHelperText>
          </FormControl>

          {/* Auto Call Interval Configuration */}
          <FormControl fullWidth>
            <FormLabel>Auto Call Interval</FormLabel>
            
            {/* Slider Component */}
            <Slider
              value={configuration.autoCallIntervalInMs}
              min={AUTO_CALL_INTERVAL_MIN}
              max={AUTO_CALL_INTERVAL_MAX}
              step={1000}
              marks={[
                { value: AUTO_CALL_INTERVAL_MIN, label: `${AUTO_CALL_INTERVAL_MIN/1000}s` },
                { value: 10000, label: '10s' },
                { value: 30000, label: '30s' },
                { value: AUTO_CALL_INTERVAL_MAX, label: `${AUTO_CALL_INTERVAL_MAX/1000}s` }
              ]}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `${value/1000}s`}
              onChange={(_, value) => handleConfigurationChange('autoCallIntervalInMs', value)}
              color="primary"
            />
            
            {/* Number Input */}
            {/* <TextField
              type="number"
              value={configuration.autoCallIntervalInMs}
              onChange={(e) => handleConfigurationChange('autoCallIntervalInMs', parseInt(e.target.value))}
              helperText={`Range: ${AUTO_CALL_INTERVAL_MIN}-${AUTO_CALL_INTERVAL_MAX}ms`}
            /> */}
            <FormHelperText>
              How often numbers are automatically called ({formatAutoCallInterval(configuration.autoCallIntervalInMs)})
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

      {/* Action Buttons */}
      <Card variant="outlined">
        <Stack spacing={2} style={{ padding: '20px' }}>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button 
              onClick={handleResetConfiguration}
              disabled={!isDirty}
              variant="outlined"
            >
              Reset
            </Button>
            <Button 
              onClick={handleSaveConfiguration}
              disabled={!isDirty}
              variant="contained"
            >
              Save Configuration
            </Button>
          </Stack>
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

      {isDirty && (
        <Alert severity="info">
          You have unsaved changes
        </Alert>
      )}

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
              <strong>Auto Call Interval:</strong> {formatAutoCallInterval(configuration.autoCallIntervalInMs)}
            </Typography>
            <Typography variant="body2">
              <strong>Failed Bingo Penalty:</strong> {configuration.loseForFailedBingoCalls ? 'Yes' : 'No'}
            </Typography>
          </Stack>
        </Stack>
      </Card>
    </Stack>
  );
}
