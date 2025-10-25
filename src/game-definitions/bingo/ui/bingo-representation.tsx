// import { GameOverPhase } from "./representation/phases/gameover-phase";
// import { ConfigurationPhase } from "./representation/phases/configuration-phase";
// import { GamePhase } from "./representation/phases/game-phase";
// // import { BingoRepresentationProps } from "./types";


// export const BingoRepresentation = (props: BingoRepresentationProps) => {
//   const { gameState } = props;

//   if (!gameState.isGameStarted) {
//     return (
//       <ConfigurationPhase
//         {...props}
//       />
//     )
//   }

//   if (gameState.isGameOver) {
//     return (
//       <GameOverPhase
//         gameState={gameState}
//       />
//     );
//   }

//   return (
//     <GamePhase {...props} />
//   )

//   // if (myPlayerSeat === null) {
//   //   return (
//   //     <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
//   //       <h2>Bingo - Observer View</h2>
//   //       <div>
//   //         <strong>Called Numbers:</strong> {gameState.calledNumbers.length > 0 
//   //           ? gameState.calledNumbers.join(', ') 
//   //           : 'None yet'}
//   //       </div>
//   //     </div>
//   //   );
//   // }

//   // const myCard = gameState.playerCards[myPlayerSeat];
//   // const myMarks = gameState.playerMarks[myPlayerSeat];

//   // if (!myCard || !myMarks) {
//   //   return (
//   //     <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
//   //       <h2>Your Bingo Card</h2>
//   //       <div>Player data not found</div>
//   //     </div>
//   //   );
//   // }

//   // return (
//   //   <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
//   //     <h2>Your Bingo Card</h2>
      
//   //     {/* Called Numbers */}
//   //     <div style={{ marginBottom: '20px' }}>
//   //       <strong>Called Numbers ({gameState.calledNumbers.length}):</strong>
//   //       <div style={{ marginTop: '5px' }}>
//   //         {gameState.calledNumbers.length > 0 
//   //           ? gameState.calledNumbers.slice(-10).join(', ')
//   //           : 'None yet'}
//   //       </div>
//   //     </div>

//   //     {/* Bingo Card */}
//   //     <div style={{ display: 'inline-block', border: '2px solid #333' }}>
//   //       {/* Header */}
//   //       <div style={{ display: 'flex' }}>
//   //         {['B', 'I', 'N', 'G', 'O'].map((letter, idx) => (
//   //           <div 
//   //             key={idx}
//   //             style={{
//   //               width: '60px',
//   //               height: '40px',
//   //               display: 'flex',
//   //               alignItems: 'center',
//   //               justifyContent: 'center',
//   //               fontWeight: 'bold',
//   //               fontSize: '20px',
//   //               backgroundColor: '#4CAF50',
//   //               color: 'white',
//   //               border: '1px solid #333',
//   //             }}
//   //           >
//   //             {letter}
//   //           </div>
//   //         ))}
//   //       </div>

//   //       {/* Card Grid */}
//   //       {myCard.map((row, rowIdx) => (
//   //         <div key={rowIdx} style={{ display: 'flex' }}>
//   //           {row.map((number, colIdx) => {
//   //             const isMarked = myMarks[rowIdx][colIdx];
//   //             const isFreeSpace = rowIdx === 2 && colIdx === 2;
              
//   //             return (
//   //               <div 
//   //                 key={colIdx}
//   //                 style={{
//   //                   width: '60px',
//   //                   height: '60px',
//   //                   display: 'flex',
//   //                   alignItems: 'center',
//   //                   justifyContent: 'center',
//   //                   fontSize: '18px',
//   //                   fontWeight: isMarked ? 'bold' : 'normal',
//   //                   backgroundColor: isMarked ? '#FFD700' : 'white',
//   //                   border: '1px solid #333',
//   //                   color: isMarked ? '#333' : '#666',
//   //                   cursor: 'default',
//   //                 }}
//   //               >
//   //                 {isFreeSpace ? 'FREE' : number}
//   //               </div>
//   //             );
//   //           })}
//   //         </div>
//   //       ))}
//   //     </div>

//   //     {/* Game Status */}
//   //     {gameState.outcomeSummary && (
//   //       <div style={{ marginTop: '20px', fontStyle: 'italic' }}>
//   //         {gameState.outcomeSummary}
//   //       </div>
//   //     )}
//   //   </div>
//   // );
// }

