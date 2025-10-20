# Bingo Game

A classic Bingo game implementation for the BFG Engine party games collection.

## Game Overview

Traditional 5x5 Bingo with the following features:
- Random card generation for each player
- Free space in the center (always marked)
- Numbers range from 1-75 organized by columns:
  - **B**: 1-15
  - **I**: 16-30
  - **N**: 31-45
  - **G**: 46-60
  - **O**: 61-75

## Game Rules

1. Each player receives a randomly generated 5x5 bingo card with a free space in the center
2. Players can call numbers (random or specific)
3. Players mark numbers on their cards when they're called
4. First player to complete a line (horizontal, vertical, or diagonal) and claim "BINGO!" wins

## Player Actions

- **Call Random Number**: Randomly calls a number from 1-75
- **Call Specific Number**: Enter and call a specific number
- **Mark Number**: Mark called numbers on your card
- **Claim BINGO**: Claim victory when you have a winning pattern
- **Cancel Game**: End the game early

## Winning Patterns

- Any horizontal row (5 in a row)
- Any vertical column (5 in a column)
- Diagonal (top-left to bottom-right)
- Diagonal (top-right to bottom-left)

## Player Count

- **Minimum**: 2 players
- **Maximum**: 8 players

## Technical Details

### Files Structure

- `game-box.ts` - Game definition and metadata
- `engine/bingo-engine.ts` - Game state management and logic
- `ui/bingo-representation.tsx` - Visual representation of game state
- `ui/bingo-input.tsx` - Player input controls
- `ui/bingo-components.tsx` - Component factory functions

### Game State

The game maintains:
- Individual bingo cards for each player
- Marked numbers on each player's card
- List of all called numbers
- Game status (in progress/completed)
- Winner information

### Game Actions

- `START_GAME` - Initialize the game with random cards
- `CALL_NUMBER` - Call a bingo number
- `MARK_NUMBER` - Mark a number on player's card
- `CLAIM_BINGO` - Attempt to win the game
- `CANCEL_GAME` - Abandon the game

## UI Features

- Color-coded card display (marked numbers highlighted in gold)
- Called numbers history
- Quick-mark for last called number
- List of unmarked numbers that have been called
- Host view showing all player cards

