import { GameTableSeat } from "@bfg-engine/models/game-table/game-table";
import { BingoGameAction, BingoGameState } from "../engine/bingo-engine";
import { BingoRepresentation } from "./bingo-representation";
import { BingoInput } from "./bingo-input";
import { GameTable } from "@bfg-engine/models/game-table/game-table";
import { getActivePlayerSeatsForGameTable } from "@bfg-engine/ops/game-table-ops/player-seat-utils";



export const createBingoRepresentation = (
  myPlayerSeat: GameTableSeat | null,
  gameState: BingoGameState,
  mostRecentAction: BingoGameAction
) => {
  return (
    <BingoRepresentation 
      myPlayerSeat={myPlayerSeat} 
      gameState={gameState} 
      mostRecentAction={mostRecentAction}
    />
  );
  
}

export const createBingoInput = (
  myPlayerSeat: GameTableSeat,
  gameState: BingoGameState,
  mostRecentAction: BingoGameAction,
  onGameAction: (gameState: BingoGameState, gameAction: BingoGameAction) => void
) => {
  return (
    <BingoInput 
      myPlayerSeat={myPlayerSeat} 
      gameState={gameState} 
      mostRecentAction={mostRecentAction}
      onGameAction={onGameAction}
    />
  );
}


export const createBingoCombinationRepresentationAndInput = (
  myPlayerSeat: GameTableSeat,
  gameState: BingoGameState,
  mostRecentAction: BingoGameAction,
  onGameAction: (gameState: BingoGameState, gameAction: BingoGameAction) => void
) => {
  return (
    <>
      <BingoRepresentation 
        myPlayerSeat={myPlayerSeat} 
        gameState={gameState} 
        mostRecentAction={mostRecentAction}
      />
      <BingoInput 
        myPlayerSeat={myPlayerSeat} 
        gameState={gameState} 
        mostRecentAction={mostRecentAction}
        onGameAction={onGameAction}
      />
    </>
  )
}


export const createBingoHostRepresentation = (
  gameTable: GameTable,
  gameState: BingoGameState,
  mostRecentAction: BingoGameAction,
  _onGameAction: (gameState: BingoGameState, gameAction: BingoGameAction) => void
) => {

  const activePlayerSeats = getActivePlayerSeatsForGameTable(gameTable);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
      {activePlayerSeats.map(playerSeat => (
        <div key={playerSeat} style={{ border: '2px solid #ddd', borderRadius: '8px', padding: '10px' }}>
          <h3>Player {playerSeat}</h3>
          <BingoRepresentation 
            myPlayerSeat={playerSeat} 
            gameState={gameState} 
            mostRecentAction={mostRecentAction}
          />
        </div>
      ))}
    </div>
  )
}

