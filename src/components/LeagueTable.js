import React from 'react';

const LeagueTable = ({ playerStats, leagueName, leagueStatus }) => {
  // Calculate additional statistics for each player
  const calculatePlayerStats = (playerName, stats) => {
    const goalDifference = stats.goalsFor - stats.goalsAgainst;
    const points = (stats.wins * 3) + (stats.draws * 1);
    
    return {
      ...stats,
      goalDifference,
      points
    };
  };

  // Convert player stats object to array and sort by points (descending)
  const sortedPlayers = Object.entries(playerStats)
    .map(([playerName, stats]) => ({
      name: playerName,
      ...calculatePlayerStats(playerName, stats)
    }))
    .sort((a, b) => {
      // Sort by points (descending)
      if (b.points !== a.points) {
        return b.points - a.points;
      }
      // If points are equal, sort by goal difference (descending)
      if (b.goalDifference !== a.goalDifference) {
        return b.goalDifference - a.goalDifference;
      }
      // If goal difference is equal, sort by goals scored (descending)
      if (b.goalsFor !== a.goalsFor) {
        return b.goalsFor - a.goalsFor;
      }
      // If all are equal, sort alphabetically by name
      return a.name.localeCompare(b.name);
    });

  // Render form letters (last 5 results)
  const renderForm = (form) => {
    return (
      <div className="form-letters">
        {form.map((result, index) => (
          <div
            key={index}
            className={`form-letter form-${result.toLowerCase()}`}
            title={`${result === 'W' ? 'Win' : result === 'D' ? 'Draw' : 'Loss'}`}
          >
            {result}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="table-container">
      <h2 className="table-title">
        🏆 {leagueName} League Table
        {leagueStatus === 'ended' && <span className="ended-badge">ENDED</span>}
      </h2>
      
      <table className="league-table">
        <thead>
          <tr>
            <th>Pos</th>
            <th>Player</th>
            <th>MP</th>
            <th>W</th>
            <th>D</th>
            <th>L</th>
            <th>GF</th>
            <th>GA</th>
            <th>GD</th>
            <th>Pts</th>
            <th>Form</th>
          </tr>
        </thead>
        <tbody>
          {sortedPlayers.map((player, index) => (
            <tr key={player.name}>
              <td>{index + 1}</td>
              <td className="player-name">{player.name}</td>
              <td>{player.matches}</td>
              <td>{player.wins}</td>
              <td>{player.draws}</td>
              <td>{player.losses}</td>
              <td>{player.goalsFor}</td>
              <td>{player.goalsAgainst}</td>
              <td>{player.goalDifference > 0 ? `+${player.goalDifference}` : player.goalDifference}</td>
              <td><strong>{player.points}</strong></td>
              <td>{renderForm(player.form)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <p><strong>Legend:</strong></p>
        <p>MP = Matches Played | W = Wins | D = Draws | L = Losses | GF = Goals For | GA = Goals Against | GD = Goal Difference | Pts = Points</p>
        <p>Form: <span className="form-letter form-w">W</span> = Win | <span className="form-letter form-d">D</span> = Draw | <span className="form-letter form-l">L</span> = Loss</p>
      </div>
    </div>
  );
};

export default LeagueTable;