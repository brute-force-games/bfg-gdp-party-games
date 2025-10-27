import { Card, Stack, Typography, Chip } from "@bfg-engine";
import { BingoGameConfiguration } from "~/game-definitions/bingo/engine/bingo-engine";


interface ConfigurationSummaryProps {
  config: BingoGameConfiguration
}

export const ConfigurationSummary = ({
  config
}: ConfigurationSummaryProps) => {

  const formatCallerSeat = (callerSeat: string | undefined) => {
    if (!callerSeat) return "No caller designated";
    return `Caller: ${callerSeat.replace('seat-', 'Seat ').replace('-', ' ')}`;
  };

  const formatAutoCallInterval = (intervalMs: number) => {
    const seconds = Math.round(intervalMs / 1000);
    return `${intervalMs}ms (${seconds}s)`;
  };

  const formatCallerCandidates = (candidates: string[]): string[] => {
    return candidates.map(seat => 
      seat.replace('seat-', 'Seat ').replace('-', ' '));
  };

  return (
    <Card variant="outlined" style={{ backgroundColor: '#f8f9fa' }}>
      <Stack spacing={2} style={{ padding: '15px' }}>
        <Typography variant="h6" color="secondary">
          Configuration Summary
        </Typography>
        <Stack spacing={2}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2" color="secondary">
              <strong>Caller:</strong>
            </Typography>
            <Chip
              label={formatCallerSeat(config.callerSeat)}
              variant="outlined"
              color="primary"
              size="small"
            />
          </Stack>
          <Stack spacing={1}>
            <Typography variant="body2" color="secondary">
              <strong>Caller Candidates:</strong>
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {formatCallerCandidates(config.callerCandidates).length > 0 ? (
                formatCallerCandidates(config.callerCandidates).map((candidate, index) => (
                  <Chip
                    key={index}
                    label={candidate}
                    variant="outlined"
                    color="default"
                    size="small"
                  />
                ))
              ) : (
                <Typography variant="body2" color="secondary">
                  None
                </Typography>
              )}
            </Stack>
          </Stack>
          <Typography variant="body2">
            <strong>Auto Call:</strong> {formatAutoCallInterval(config.autoCallIntervalInMs)}
          </Typography>
          <Typography variant="body2">
            <strong>Failed Bingo Penalty:</strong> {config.loseForFailedBingoCalls ? 'Yes' : 'No'}
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
};