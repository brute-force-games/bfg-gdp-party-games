import { Container } from '@bfg-engine/ui/bfg-ui';

export interface BingoCardProps {
  card: number[][];
  marks: boolean[][];
  calledNumbers: number[];
  gridSize?: 'small' | 'medium' | 'large';
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
  gridSize = 'medium' 
}: BingoCardProps) => {
  const config = BINGO_CARD_CONFIG[gridSize];

  return (
    <Container maxWidth="sm" disableGutters>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
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
                } else if (isCalled) {
                  backgroundColor = '#E8F5E8'; // Light green for called but not marked
                }
                
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
                      fontWeight: (isMarked || isCalled) ? 'bold' : 'normal',
                      backgroundColor,
                      border: '1px solid #333',
                      color: (isMarked || isCalled) ? '#333' : '#666',
                      cursor: 'default',
                      position: 'relative',
                    }}
                  >
                    {isFreeSpace ? 'FREE' : number}
                    {isCalled && !isMarked && (
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
    </Container>
  );
};
