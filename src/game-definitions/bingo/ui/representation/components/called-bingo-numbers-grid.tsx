import { useState } from 'react';
import { Button, Chip, Container, Stack } from '@bfg-engine/ui/bfg-ui';


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
}

export const CalledBingoNumbersGrid = ({ 
  calledNumbers, 
  onCallNumber, 
  canCallNumbers = false,
  gridSize = 'small'
}: CalledNumbersProps) => {
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [isCallHistoryExpanded, setIsCallHistoryExpanded] = useState(false);

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

  const isNumberCalled = (number: number) => calledNumbers.includes(number);

  const currentConfig = CALL_GRID_CONFIG[gridSize];

  return (
    <Container maxWidth="md" disableGutters>
      <Stack spacing={3} alignItems="center">
        {/* Header */}
        {/* <Typography variant="h6" align="center">
          Called Numbers ({calledNumbers.length}/75)
        </Typography> */}

        {/* Recent Called Numbers - Expandable */}
        {isCallHistoryExpanded && calledNumbers.length > 0 && (
          <Stack spacing={2} alignItems="center">
            {/* <Typography variant="body2">
              Recent Calls:
            </Typography> */}
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
        )}

        {/* Call Number Controls */}
        {canCallNumbers && (
          <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
            <Button
              variant="contained"
              color="success"
              onClick={handleRandomCall}
              disabled={calledNumbers.length >= 75}
            >
              Call Random Number
            </Button>
            
            {selectedNumber && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleCallNumber}
              >
                Call {selectedNumber}
              </Button>
            )}

            <Button
              variant="outlined"
              color="secondary"
              onClick={() => setIsCallHistoryExpanded(!isCallHistoryExpanded)}
            >
              {isCallHistoryExpanded ? 'Hide' : 'Show'} [{calledNumbers.length}] Recent Calls
            </Button>
          </Stack>
        )}

        {/* BINGO Letters and Number Grid - Always Visible */}
        <div style={{ 
          display: 'flex',
          justifyContent: 'center'
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
                      onClick={() => {
                        if (canCallNumbers && !isCalled) {
                          setSelectedNumber(number);
                        }
                      }}
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
        </div>
      </Stack>
    </Container>
  );
};
