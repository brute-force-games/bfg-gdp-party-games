import { 
  BINGO_GAME_TABLE_ACTION_UPDATE_CALLER_CANDIDATE,
  BingoGameState,
  BingoPlayerAction,
  BingoUpdateCallerCandidate,
} from "~/game-definitions/bingo/engine/bingo-engine";
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
    </Stack>
  );
}
