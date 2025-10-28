import { useState, useEffect, useRef } from 'react';
import { Button, Container, Stack, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from '@bfg-engine/ui/bfg-ui';


// Grid size configurations
const CALL_GRID_CONFIG = {
  small: {
    cellWidth: '40px',
    cellHeight: '30px',
    headerHeight: '30px',
    fontSize: '12px',
    headerFontSize: '14px',
    crossFontSize: '14px'
  },
  medium: {
    cellWidth: '60px',
    cellHeight: '45px',
    headerHeight: '35px',
    fontSize: '14px',
    headerFontSize: '18px',
    crossFontSize: '16px'
  },
  large: {
    cellWidth: '80px',
    cellHeight: '40px',
    headerHeight: '40px',
    fontSize: '16px',
    headerFontSize: '20px',
    crossFontSize: '20px'
  }
};


export interface CalledNumbersProps {
  calledNumbers: number[];
  onCallNumber?: (number: number) => void;
  canCallNumbers?: boolean;
  gridSize?: keyof typeof CALL_GRID_CONFIG;
  autocallInterval?: number; // milliseconds between autocalls
}

export const CalledBingoNumbersGrid = ({ 
  calledNumbers, 
  onCallNumber, 
  canCallNumbers = false,
  gridSize = 'small',
  autocallInterval
}: CalledNumbersProps) => {
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [isCallHistoryExpanded, setIsCallHistoryExpanded] = useState(true);
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [numberToConfirm, setNumberToConfirm] = useState<number | null>(null);
  const [isAutocallEnabled, setIsAutocallEnabled] = useState(false);
  const [countdownSeconds, setCountdownSeconds] = useState(0);
  const autocallTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  // BINGO number ranges
  const bingoRanges = [
    { letter: 'B', min: 1, max: 15 },
    { letter: 'I', min: 16, max: 30 },
    { letter: 'N', min: 31, max: 45 },
    { letter: 'G', min: 46, max: 60 },
    { letter: 'O', min: 61, max: 75 },
  ];

  const handleCallNumber = () => {
    if (selectedNumber && onCallNumber) {
      onCallNumber(selectedNumber);
      setSelectedNumber(null);
    }
  };

  const handleNumberClick = (number: number) => {
    if (canCallNumbers && !isNumberCalled(number)) {
      setNumberToConfirm(number);
      setConfirmationDialogOpen(true);
    }
  };

  const handleConfirmCall = () => {
    if (numberToConfirm && onCallNumber) {
      onCallNumber(numberToConfirm);
      setConfirmationDialogOpen(false);
      setNumberToConfirm(null);
    }
  };

  const handleCancelCall = () => {
    setConfirmationDialogOpen(false);
    setNumberToConfirm(null);
  };

  const handleRandomCall = () => {
    if (onCallNumber) {
      // Get all uncalled numbers
      const uncalledNumbers = [];
      for (let i = 1; i <= 75; i++) {
        if (!calledNumbers.includes(i)) {
          uncalledNumbers.push(i);
        }
      }
      
      if (uncalledNumbers.length > 0) {
        const randomIndex = Math.floor(Math.random() * uncalledNumbers.length);
        onCallNumber(uncalledNumbers[randomIndex]);
      }
    }
  };

  const handleAutocallToggle = (checked: boolean) => {
    if (!autocallInterval) return; // Don't allow toggle if no interval provided
    
    setIsAutocallEnabled(checked);
    if (checked) {
      // Start countdown when autocall is enabled
      setCountdownSeconds(Math.ceil(autocallInterval / 1000));
    } else {
      // Clear countdown when autocall is disabled
      setCountdownSeconds(0);
    }
  };

  // Autocall effect
  useEffect(() => {
    if (isAutocallEnabled && canCallNumbers && onCallNumber && autocallInterval) {
      // Clear any existing timers
      if (autocallTimerRef.current) {
        clearInterval(autocallTimerRef.current);
      }
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
      }

      // Set up countdown timer (updates every second)
      countdownTimerRef.current = setInterval(() => {
        setCountdownSeconds(prev => {
          if (prev <= 1) {
            return Math.ceil(autocallInterval / 1000); // Reset to full interval
          }
          return prev - 1;
        });
      }, 1000);

      // Set up autocall timer
      autocallTimerRef.current = setInterval(() => {
        // Get all uncalled numbers
        const uncalledNumbers = [];
        for (let i = 1; i <= 75; i++) {
          if (!calledNumbers.includes(i)) {
            uncalledNumbers.push(i);
          }
        }
        
        if (uncalledNumbers.length > 0) {
          const randomIndex = Math.floor(Math.random() * uncalledNumbers.length);
          onCallNumber(uncalledNumbers[randomIndex]);
        } else {
          // All numbers called, stop autocall
          setIsAutocallEnabled(false);
          setCountdownSeconds(0);
        }
      }, autocallInterval);
    } else {
      // Clear timers when autocall is disabled
      if (autocallTimerRef.current) {
        clearInterval(autocallTimerRef.current);
        autocallTimerRef.current = null;
      }
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
        countdownTimerRef.current = null;
      }
      setCountdownSeconds(0);
    }

    // Cleanup on unmount
    return () => {
      if (autocallTimerRef.current) {
        clearInterval(autocallTimerRef.current);
      }
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
      }
    };
  }, [isAutocallEnabled, canCallNumbers, onCallNumber, autocallInterval, calledNumbers]);

  const isNumberCalled = (number: number) => calledNumbers.includes(number);

  const currentConfig = CALL_GRID_CONFIG[gridSize];

  return (
    <Container maxWidth="md" disableGutters>
      <div style={{ 
        display: 'flex', 
        alignItems: 'flex-start', 
        gap: '16px',
        justifyContent: 'center'
      }}>
        <Stack spacing={3} alignItems="center" style={{ flex: '0 0 auto' }}>
        {/* Header */}
        {/* <Typography variant="h6" align="center">
          Called Numbers ({calledNumbers.length}/75)
        </Typography> */}

        {/* {isCallHistoryExpanded && calledNumbers.length > 0 && (
          <Stack spacing={2} alignItems="center">
            <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap" useFlexGap>
              {calledNumbers.slice(-10).reverse().map((number) => (
                <Chip
                  key={number}
                  label={number.toString()}
                  color="primary"
                  variant="filled"
                  size="small"
                />
              ))}
            </Stack>
          </Stack>
        )} */}

        {/* Call Number Controls */}
        {canCallNumbers && (
          <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
            {isAutocallEnabled ? (
              <Typography variant="body2" style={{ 
                color: '#1976d2', 
                fontWeight: 'bold',
                textAlign: 'center',
                padding: '8px 16px',
                backgroundColor: '#f0f8ff',
                borderRadius: '4px',
                border: '1px solid #1976d2'
              }}>
                Next call in {countdownSeconds}s
              </Typography>
            ) : (
              <Button
                variant="contained"
                color="success"
                onClick={handleRandomCall}
                disabled={calledNumbers.length >= 75}
              >
                Call Random Number
              </Button>
            )}
            
            {selectedNumber && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleCallNumber}
              >
                Call {selectedNumber}
              </Button>
            )}
          </Stack>
        )}

        {/* BINGO Letters and Number Grid - Always Visible */}
        <div style={{ 
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          gap: '16px'
        }}>
          <div style={{ 
            display: 'inline-block', 
            border: '2px solid #333',
            borderRadius: '8px',
            overflow: 'hidden'
          }}>
            {/* Header Row with Letters */}
            <div style={{ display: 'flex' }}>
              {bingoRanges.map((range) => (
                <div 
                  key={range.letter}
                  style={{
                    width: currentConfig.cellWidth,
                    height: currentConfig.headerHeight,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: currentConfig.headerFontSize,
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: '1px solid #333',
                  }}
                >
                  {range.letter}
                </div>
              ))}
            </div>

            {/* Number Rows */}
            {Array.from({ length: 15 }, (_, rowIndex) => (
              <div key={rowIndex} style={{ display: 'flex' }}>
                {bingoRanges.map((range) => {
                  const number = range.min + rowIndex;
                  const isCalled = isNumberCalled(number);
                  
                  return (
                    <div 
                      key={`${range.letter}-${number}`}
                      style={{
                        width: currentConfig.cellWidth,
                        height: currentConfig.cellHeight,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: currentConfig.fontSize,
                        fontWeight: isCalled ? 'bold' : 'normal',
                        backgroundColor: isCalled ? '#FFD700' : 'white',
                        border: '1px solid #333',
                        color: isCalled ? '#333' : '#666',
                        cursor: canCallNumbers && !isCalled ? 'pointer' : 'default',
                        position: 'relative',
                        transition: 'all 0.2s ease',
                      }}
                      onClick={() => handleNumberClick(number)}
                      onMouseEnter={(e) => {
                        if (canCallNumbers && !isCalled) {
                          e.currentTarget.style.backgroundColor = '#E8F5E8';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (canCallNumbers && !isCalled) {
                          e.currentTarget.style.backgroundColor = 'white';
                        }
                      }}
                    >
                      {number}
                      {isCalled && (
                        <div
                          style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            fontSize: currentConfig.crossFontSize,
                            color: '#FF4444',
                            fontWeight: 'bold',
                          }}
                        >
                          ✕
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Called Numbers List Column */}
          {isCallHistoryExpanded && (
            <div style={{ 
              flex: '0 0 auto',
              minWidth: '40px',
              maxHeight: '400px',
              overflowY: 'auto',
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '8px',
              backgroundColor: '#f9f9f9'
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: 'bold',
                textAlign: 'center',
                marginBottom: '8px',
                color: '#333'
              }}>
                {calledNumbers.length} called
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {calledNumbers.slice().reverse().map((number, index) => (
                  <div
                    key={calledNumbers.length - 1 - index}
                    style={{
                      padding: '4px 8px',
                      backgroundColor: '#FFD700',
                      borderRadius: '4px',
                      textAlign: 'center',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      color: '#333',
                      border: '1px solid #ccc'
                    }}
                  >
                    {number}
                  </div>
                ))}
                {calledNumbers.length === 0 && (
                  <div style={{
                    padding: '8px',
                    textAlign: 'center',
                    fontSize: '12px',
                    color: '#666',
                    fontStyle: 'italic'
                  }}>
                    No numbers called yet
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        </Stack>
      </div>

      {/* Show/Hide Called Numbers List Button */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        marginTop: '16px',
        width: '100%'
      }}>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => setIsCallHistoryExpanded(!isCallHistoryExpanded)}
        >
          {isCallHistoryExpanded ? 'Hide' : 'Show'} Called Numbers
        </Button>
      </div>

      {/* Autocall Button */}
      {canCallNumbers && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          marginTop: '16px',
          width: '100%',
          gap: '12px'
        }}>
          <Button
            variant={isAutocallEnabled ? "contained" : "outlined"}
            color={isAutocallEnabled ? "error" : "primary"}
            onClick={() => handleAutocallToggle(!isAutocallEnabled)}
            disabled={calledNumbers.length >= 75 || !autocallInterval}
          >
            {isAutocallEnabled ? 'Stop Autocall' : 'Start Autocall'}
          </Button>
          {autocallInterval && (
            <Typography variant="caption" style={{ color: '#999', fontSize: '12px' }}>
              ({autocallInterval / 1000}s interval)
            </Typography>
          )}
        </div>
      )}

      {/* Confirmation Dialog */}
        <Dialog open={confirmationDialogOpen} onClose={handleCancelCall}>
          <DialogTitle>
            Confirm Number Call
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1">
              Are you sure you want to call number <strong>{numberToConfirm}</strong>?
            </Typography>
            <Typography variant="body2" style={{ marginTop: '8px', color: '#666' }}>
              This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={handleCancelCall}
              variant="outlined"
              color="secondary"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmCall}
              variant="contained"
              color="primary"
            >
              Call {numberToConfirm}
            </Button>
          </DialogActions>
        </Dialog>
    </Container>
  );
};
