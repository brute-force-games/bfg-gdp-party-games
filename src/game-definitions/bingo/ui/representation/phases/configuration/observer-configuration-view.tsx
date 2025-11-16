import { Typography, Stack, } from "@bfg-engine/ui/bfg-ui";
import { ConfigurationSummary } from "../../components/configuration-summary";
import { ObserverComponentProps } from "@bfg-engine/models/game-engine/bfg-game-engine-types";
import { BingoGameState } from "../../../../engine/bingo-engine";


export const ObserverConfigurationView = ({ gameState }: ObserverComponentProps<BingoGameState>) => {

  const config = gameState.configuration;

  return (
    <Stack spacing={3} style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <Typography variant="h1" gutterBottom>
        Bingo Game Configuration - Observer View
      </Typography>
      <ConfigurationSummary config={config} />
    </Stack>
  );
}
