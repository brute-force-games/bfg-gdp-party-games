import { useState, useEffect, useRef } from 'react';
import { Container } from '@bfg-engine/ui/bfg-ui';

export interface BingoCardProps {
  card: number[][];
  marks: boolean[][];
  calledNumbers: number[];
  gridSize?: 'small' | 'medium' | 'large';
  showCalledBingoNumberHints?: boolean;
  onMarkNumber?: (number: number) => void;
}

// Grid size configurations for bingo cards
const BINGO_CARD_CONFIG = {
  small: {
    cellWidth: '40px',
    cellHeight: '40px',
    headerHeight: '30px',
    fontSize: '14px',
    headerFontSize: '16px'
  },
  medium: {
    cellWidth: '60px',
    cellHeight: '60px',
    headerHeight: '40px',
    fontSize: '18px',
    headerFontSize: '20px'
  },
  large: {
    cellWidth: '80px',
    cellHeight: '80px',
    headerHeight: '50px',
    fontSize: '22px',
    headerFontSize: '24px'
  }
};

export const BingoCard = ({ 
  card, 
  marks, 
  calledNumbers,
  gridSize = 'medium',
  showCalledBingoNumberHints = true,
  onMarkNumber
}: BingoCardProps) => {
  const [animationNumber, setAnimationNumber] = useState<number | null>(null);
  const animationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const config = BINGO_CARD_CONFIG[gridSize];

  // Animation effect - detect when a new number is called
  useEffect(() => {
    if (calledNumbers.length > 0) {
      const lastCalledNumber = calledNumbers[calledNumbers.length - 1];
      setAnimationNumber(lastCalledNumber);
      
      // Clear any existing animation timer
      if (animationTimerRef.current) {
        clearTimeout(animationTimerRef.current);
      }
      
      // Hide animation after 2 seconds
      animationTimerRef.current = setTimeout(() => {
        setAnimationNumber(null);
      }, 2000);
    }

    // Cleanup on unmount
    return () => {
      if (animationTimerRef.current) {
        clearTimeout(animationTimerRef.current);
      }
    };
  }, [calledNumbers]);

  const getLetterForNumber = (number: number) => {
    if (number >= 1 && number <= 15) return 'B';
    if (number >= 16 && number <= 30) return 'I';
    if (number >= 31 && number <= 45) return 'N';
    if (number >= 46 && number <= 60) return 'G';
    if (number >= 61 && number <= 75) return 'O';
    return '';
  };

  return (
    <>
      <style>
        {`
          @keyframes bounceIn {
            0% {
              transform: translate(-50%, -50%) scale(0.3);
              opacity: 0;
            }
            50% {
              transform: translate(-50%, -50%) scale(1.05);
            }
            70% {
              transform: translate(-50%, -50%) scale(0.9);
            }
            100% {
              transform: translate(-50%, -50%) scale(1);
              opacity: 1;
            }
          }
          
          @keyframes fadeOut {
            0% {
              opacity: 1;
            }
            100% {
              opacity: 0;
            }
          }
        `}
      </style>
      <Container maxWidth="sm" disableGutters>
        <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
        <div style={{ display: 'inline-block', border: '2px solid #333', borderRadius: '8px', overflow: 'hidden' }}>
          {/* Header */}
          <div style={{ display: 'flex' }}>
            {['B', 'I', 'N', 'G', 'O'].map((letter, idx) => (
              <div 
                key={idx}
                style={{
                  width: config.cellWidth,
                  height: config.headerHeight,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: config.headerFontSize,
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: '1px solid #333',
                }}
              >
                {letter}
              </div>
            ))}
          </div>

          {/* Card Grid */}
          {card.map((row, rowIdx) => (
            <div key={rowIdx} style={{ display: 'flex' }}>
              {row.map((number, colIdx) => {
                const isMarked = marks[rowIdx][colIdx];
                const isFreeSpace = rowIdx === 2 && colIdx === 2;
                const isCalled = calledNumbers.includes(number);
                
                // Determine background color based on state
                let backgroundColor = 'white';
                if (isMarked) {
                  backgroundColor = '#FFD700'; // Gold for manually marked
                } else if (isCalled && showCalledBingoNumberHints) {
                  backgroundColor = '#E8F5E8'; // Light green for called but not marked (only if hints enabled)
                }
                
                const canMark = onMarkNumber && isCalled && !isMarked && !isFreeSpace;
                
                return (
                  <div 
                    key={colIdx}
                    style={{
                      width: config.cellWidth,
                      height: config.cellHeight,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: config.fontSize,
                      fontWeight: (isMarked || (isCalled && showCalledBingoNumberHints)) ? 'bold' : 'normal',
                      backgroundColor,
                      border: '1px solid #333',
                      color: (isMarked || (isCalled && showCalledBingoNumberHints)) ? '#333' : '#666',
                      cursor: canMark ? 'pointer' : 'default',
                      position: 'relative',
                      transition: 'all 0.2s ease',
                    }}
                    onClick={() => {
                      if (canMark) {
                        onMarkNumber(number);
                      }
                    }}
                    onMouseEnter={(e) => {
                      if (canMark) {
                        e.currentTarget.style.backgroundColor = '#C8E6C9';
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (canMark) {
                        e.currentTarget.style.backgroundColor = backgroundColor;
                        e.currentTarget.style.transform = 'scale(1)';
                      }
                    }}
                  >
                    {isFreeSpace ? 'FREE' : number}
                    {isCalled && !isMarked && showCalledBingoNumberHints && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '2px',
                          right: '2px',
                          fontSize: '10px',
                          color: '#4CAF50',
                          fontWeight: 'bold',
                        }}
                      >
                        ●
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      
      {/* Animation Overlay */}
      {animationNumber && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1000,
          pointerEvents: 'none',
          animation: 'bounceIn 0.5s ease-out, fadeOut 0.5s ease-in 1.5s forwards'
        }}>
          <div style={{
            backgroundColor: '#FFD700',
            color: '#333',
            padding: '20px 30px',
            borderRadius: '12px',
            border: '3px solid #FF6B35',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            fontSize: '48px',
            fontWeight: 'bold',
            textAlign: 'center',
            minWidth: '120px'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '4px' }}>
              {getLetterForNumber(animationNumber)}
            </div>
            <div>
              {animationNumber}
            </div>
          </div>
        </div>
      )}
    </Container>
    </>
  );
};
