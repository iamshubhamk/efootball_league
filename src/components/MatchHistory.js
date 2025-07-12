import React, { useState } from 'react';

const MatchHistory = ({ leagues }) => {
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [selectedLeague, setSelectedLeague] = useState('');
  const [sortBy, setSortBy] = useState('date');

  // Get all matches from all leagues
  const getAllMatches = () => {
    const allMatches = [];
    leagues.forEach(league => {
      league.matches.forEach(match => {
        allMatches.push({
          ...match,
          leagueName: league.name,
          leagueId: league._id,
          date: new Date(match.date)
        });
      });
    });
    return allMatches;
  };

  // Filter and sort matches
  const getFilteredMatches = () => {
    let matches = getAllMatches();

    // Filter by player
    if (selectedPlayer) {
      matches = matches.filter(match => 
        match.player1 === selectedPlayer || match.player2 === selectedPlayer
      );
    }

    // Filter by league
    if (selectedLeague) {
      matches = matches.filter(match => match.leagueId === selectedLeague);
    }

    // Sort matches
    matches.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return b.date - a.date; // Newest first
        case 'league':
          return a.leagueName.localeCompare(b.leagueName);
        case 'player1':
          return a.player1.localeCompare(b.player1);
        case 'player2':
          return a.player2.localeCompare(b.player2);
        case 'goals':
          return (b.goals1 + b.goals2) - (a.goals1 + a.goals2);
        default:
          return b.date - a.date;
      }
    });

    return matches;
  };

  // Get unique players and leagues for filters
  const players = ['Jassi', 'Lezter', 'Kumar'];
  const filteredMatches = getFilteredMatches();

  // Format date for display
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get match result
  const getMatchResult = (match) => {
    if (match.goals1 > match.goals2) {
      return `${match.player1} won`;
    } else if (match.goals1 < match.goals2) {
      return `${match.player2} won`;
    } else {
      return 'Draw';
    }
  };

  return (
    <div className="match-history-container">
      <h2 className="history-title">📜 Match History</h2>
      
      {/* Filters */}
      <div className="history-filters">
        <div className="filter-group">
          <label htmlFor="playerFilter">Filter by Player:</label>
          <select
            id="playerFilter"
            value={selectedPlayer}
            onChange={(e) => setSelectedPlayer(e.target.value)}
          >
            <option value="">All Players</option>
            {players.map(player => (
              <option key={player} value={player}>{player}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="leagueFilter">Filter by League:</label>
          <select
            id="leagueFilter"
            value={selectedLeague}
            onChange={(e) => setSelectedLeague(e.target.value)}
          >
            <option value="">All Leagues</option>
            {leagues.map(league => (
              <option key={league._id} value={league._id}>{league.name}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="sortBy">Sort by:</label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date">Date (Newest)</option>
            <option value="league">League</option>
            <option value="player1">Player 1</option>
            <option value="player2">Player 2</option>
            <option value="goals">Total Goals</option>
          </select>
        </div>
      </div>

      {/* Match Count */}
      <div className="match-count">
        <p>Showing {filteredMatches.length} matches</p>
        {selectedPlayer && (
          <p>Filtered by: {selectedPlayer}</p>
        )}
        {selectedLeague && (
          <p>League: {leagues.find(l => l._id === selectedLeague)?.name}</p>
        )}
      </div>

      {/* Matches Table */}
      {filteredMatches.length > 0 ? (
        <div className="matches-table-container">
          <table className="matches-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>League</th>
                <th>Player 1</th>
                <th>Score</th>
                <th>Player 2</th>
                <th>Result</th>
                <th>Total Goals</th>
              </tr>
            </thead>
            <tbody>
              {filteredMatches.map((match, index) => (
                <tr key={`${match.leagueId}-${index}`}>
                  <td>{formatDate(match.date)}</td>
                  <td>{match.leagueName}</td>
                  <td className="player-name">{match.player1}</td>
                  <td className="score">
                    <span className="goals">{match.goals1}</span>
                    <span className="separator">-</span>
                    <span className="goals">{match.goals2}</span>
                  </td>
                  <td className="player-name">{match.player2}</td>
                  <td className="result">{getMatchResult(match)}</td>
                  <td className="total-goals">{match.goals1 + match.goals2}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-matches">
          <p>No matches found with the current filters.</p>
          {selectedPlayer && (
            <p>Try removing the player filter to see all matches.</p>
          )}
        </div>
      )}

      {/* Summary Statistics */}
      {filteredMatches.length > 0 && (
        <div className="history-summary">
          <h3>📊 Summary</h3>
          <div className="summary-stats">
            <div className="stat-item">
              <span className="stat-label">Total Matches:</span>
              <span className="stat-value">{filteredMatches.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Total Goals:</span>
              <span className="stat-value">
                {filteredMatches.reduce((sum, match) => sum + match.goals1 + match.goals2, 0)}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Average Goals per Match:</span>
              <span className="stat-value">
                {(filteredMatches.reduce((sum, match) => sum + match.goals1 + match.goals2, 0) / filteredMatches.length).toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchHistory;