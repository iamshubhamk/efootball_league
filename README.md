 # ⚽ eFootball League Tracker

A React application to track multiple eFootball leagues and match statistics between three players: Jassi, Lezter, and Kumar.

## Features

- **Multiple Leagues**: Create and manage multiple leagues
- **League Management**: Create, select, and end leagues with double confirmation
- **Match Entry Form**: Record match results between any two different players
- **League Table**: View player statistics including wins, draws, losses, goals, and form
- **Real-time Updates**: Statistics update automatically after each match
- **Form Tracking**: Shows last 5 match results for each player
- **League Protection**: Ended leagues cannot be modified
- **Responsive Design**: Works on desktop and mobile devices

## How to Run

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start the Development Server**:
   ```bash
   npm start
   ```

3. **Open in Browser**:
   The application will open automatically at `http://localhost:3000`

## How to Use

### Creating a League
1. Click "Create New League" button
2. Enter a league name
3. Click "Create League"
4. The new league will be automatically selected

### Managing Leagues
- **Select League**: Click "Select" on any league to view its statistics
- **End League**: Click "End League" to permanently end a league
  - Requires double confirmation for safety
  - Ended leagues cannot be modified
  - Ended leagues show "ENDED" badge

### Adding a Match
1. Select an active league
2. Select Player 1 from the dropdown
3. Select Player 2 from the dropdown (must be different from Player 1)
4. Choose the number of goals scored by each player (1-15)
5. Click "Submit Match Result"

### Viewing Statistics
- Each league maintains its own statistics
- Players are ranked by points, then goal difference, then goals scored
- Form shows the last 5 results (W = Win, D = Draw, L = Loss)
- Ended leagues show final standings

## Technical Details

- Built with React functional components
- Uses useState hook for state management
- Responsive CSS design
- Clean, commented code for easy understanding
- Modal dialogs for league ending confirmation

## File Structure

```
src/
├── components/
│   ├── LeagueManager.js     # League creation and management
│   ├── MatchEntryForm.js    # Form for adding match results
│   └── LeagueTable.js       # Table displaying player statistics
├── App.js                   # Main application component
├── App.css                  # App-specific styles
├── index.js                 # Application entry point
└── index.css                # Global styles
```

## Scoring System

- **Win**: 3 points
- **Draw**: 1 point
- **Loss**: 0 points

## Form Display

- **W** (Green): Win
- **D** (Orange): Draw  
- **L** (Red): Loss

The form shows the last 5 match results for each player, helping you track recent performance.

## League States

- **Active**: Can add matches and modify statistics
- **Ended**: Read-only, no modifications allowed
- **Ended leagues** are clearly marked and cannot be changed