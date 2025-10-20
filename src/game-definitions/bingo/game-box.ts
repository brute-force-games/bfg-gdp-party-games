import { BfgSupportedGameTitle, GameDefinition } from "@bfg-engine";


export const BingoGameName = 'Bingo' as BfgSupportedGameTitle;

export const BingoGameDefinition: GameDefinition = {
  title: BingoGameName,
  minNumPlayersForGame: 2,
  maxNumPlayersForGame: 8
};

