// import { useState, useEffect } from "react";
// import { BingoRepresentationProps } from "../../types";
// import { 
//   BingoGameConfiguration, 
//   BINGO_GAME_TABLE_ACTION_UPDATE_CONFIGURATION,
//   BingoUpdateConfiguration,
//   AUTO_CALL_INTERVAL_MAX,
//   AUTO_CALL_INTERVAL_MIN
// } from "../../../engine/bingo-engine";
// import { 
//   Button, 
//   Card, 
//   Typography, 
//   TextField, 
//   Checkbox, 
//   Alert, 
//   Stack,
//   FormControl,
//   FormLabel,
//   FormHelperText,
//   Chip
// } from "@bfg-engine/ui/bfg-ui";

// interface ConfigurationViewProps extends BingoRepresentationProps {
//   onGameAction?: (gameState: any, gameAction: any) => void;
// }

// export const ConfigurationView = ({ gameState: _gameState, myPlayerSeat: _myPlayerSeat, onGameAction: _onGameAction }: ConfigurationViewProps) => {
//   const [configuration, setConfiguration] = useState<BingoGameConfiguration>(_gameState.configuration);
//   const [isDirty, setIsDirty] = useState(false);

//   useEffect(() => {
//     setConfiguration(_gameState.configuration);
//     setIsDirty(false);
//   }, [_gameState.configuration]);

//   const handleConfigurationChange = (field: keyof BingoGameConfiguration, value: any) => {
//     setConfiguration(prev => ({
//       ...prev,
//       [field]: value
//     }));
//     setIsDirty(true);
//   };

//   const handleSaveConfiguration = () => {
//     if (!_onGameAction || !_myPlayerSeat) {
//       console.error("Cannot save configuration: missing onGameAction or myPlayerSeat");
//       return;
//     }

//     const updateAction: BingoUpdateConfiguration = {
//       actionType: BINGO_GAME_TABLE_ACTION_UPDATE_CONFIGURATION,
//       seat: _myPlayerSeat,
//       update: configuration
//     };

//     _onGameAction(_gameState, updateAction);
//     setIsDirty(false);
//   };


//   const handleResetConfiguration = () => {
//     setConfiguration(_gameState.configuration);
//     setIsDirty(false);
//   };

//   return (
//     <Stack spacing={3} style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
//       <Typography variant="h1" gutterBottom>
//         Bingo Game Configuration
//       </Typography>
      
//       <Card>
//         <Stack spacing={3} style={{ padding: '20px' }}>
//           {/* Caller Seat Configuration */}
//           <FormControl fullWidth>
//             <FormLabel>Caller Seat (Optional)</FormLabel>
//             <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
//               <Chip
//                 label="Anyone can call"
//                 variant={!configuration.callerSeat ? 'filled' : 'outlined'}
//                 color={!configuration.callerSeat ? 'primary' : 'default'}
//                 clickable
//                 onClick={() => handleConfigurationChange('callerSeat', undefined)}
//               />
//               {['seat-1', 'seat-2', 'seat-3', 'seat-4', 'seat-5', 'seat-6'].map((seat) => (
//                 <Chip
//                   key={seat}
//                   label={`Seat ${seat.split('-')[1]}`}
//                   variant={configuration.callerSeat === seat ? 'filled' : 'outlined'}
//                   color={configuration.callerSeat === seat ? 'primary' : 'default'}
//                   clickable
//                   onClick={() => handleConfigurationChange('callerSeat', seat)}
//                 />
//               ))}
//             </Stack>
//             <FormHelperText>
//               Select who can call numbers. If no specific caller is selected, anyone can call.
//             </FormHelperText>
//           </FormControl>

//           {/* Current Caller Display */}
//           {configuration.callerSeat && (
//             <FormControl>
//               <FormLabel>Current Caller</FormLabel>
//               <Chip
//                 label={`Seat ${configuration.callerSeat.split('-')[1]} is the caller`}
//                 variant="filled"
//                 color="success"
//                 size="medium"
//               />
//             </FormControl>
//           )}

//           {/* Auto Call Interval Configuration */}
//           <FormControl fullWidth>
//             <FormLabel>Auto Call Interval (milliseconds)</FormLabel>
//             <TextField
//               type="number"
//               min={AUTO_CALL_INTERVAL_MIN}
//               max={AUTO_CALL_INTERVAL_MAX}
//               step="1000"
//               value={configuration.autoCallIntervalInMs}
//               onChange={(e) => handleConfigurationChange('autoCallIntervalInMs', parseInt(e.target.value))}
//             />
//             <FormHelperText>
//               How often to automatically call numbers ({AUTO_CALL_INTERVAL_MIN}-{AUTO_CALL_INTERVAL_MAX}ms). Current: {configuration.autoCallIntervalInMs}ms ({Math.round(configuration.autoCallIntervalInMs / 1000)}s)
//             </FormHelperText>
//           </FormControl>

//           {/* Lose for Failed Bingo Calls Configuration */}
//           <FormControl>
//             <Checkbox
//               checked={configuration.loseForFailedBingoCalls}
//               onChange={(e) => handleConfigurationChange('loseForFailedBingoCalls', e.target.checked)}
//               label="Lose for Failed Bingo Calls"
//             />
//             <FormHelperText>
//               If enabled, players lose the game if they claim bingo incorrectly.
//             </FormHelperText>
//           </FormControl>

//           {/* Action Buttons */}
//           <Stack direction="row" spacing={2} justifyContent="flex-end">
//             <Button 
//               onClick={handleResetConfiguration}
//               disabled={!isDirty}
//               variant="outlined"
//               color="secondary"
//             >
//               Reset
//             </Button>
//             <Button 
//               onClick={handleSaveConfiguration}
//               disabled={!isDirty || !_onGameAction || !_myPlayerSeat}
//               variant="contained"
//               color="primary"
//             >
//               Save Configuration
//             </Button>
//           </Stack>

//           {/* Status Messages */}
//           {!_onGameAction && (
//             <Alert severity="warning">
//               Configuration changes cannot be saved (no action handler available)
//             </Alert>
//           )}

//           {!_myPlayerSeat && (
//             <Alert severity="error">
//               You must be seated to modify configuration
//             </Alert>
//           )}

//           {isDirty && (
//             <Alert severity="info">
//               You have unsaved changes
//             </Alert>
//           )}
//         </Stack>
//       </Card>
//     </Stack>
//   );
// }