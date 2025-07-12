import React from 'react';

const HeadToHeadTable = ({ league }) => {
  const players = ['Jassi', 'Lezter', 'Kumar'];

  // Calculate head-to-head statistics
  const calculateHeadToHead = () => {
    const headToHead = {};

    // Initialize head-to-head data
    players.forEach(player1 => {
      headToHead[player1] = {};
      players.forEach(player2 => {
        if (player1 !== player2) {
          headToHead[player1][player2] = {
            matches: 0,
            wins: 0,
            draws: 0,
            losses: 0,
            goalsFor: 0,
            goalsAgainst: 0
          };
        }
      });
    });

    // Calculate from matches
    league.matches.forEach(match => {
      const { player1, player2, goals1, goals2 } = match;
      
      if (player1 !== player2) {
        // Player 1 vs Player 2
        headToHead[player1][player2].matches += 1;
        headToHead[player1][player2].goalsFor += goals1;
        headToHead[player1][player2].goalsAgainst += goals2;

        // Player 2 vs Player 1
        headToHead[player2][player1].matches += 1;
        headToHead[player2][player1].goalsFor += goals2;
        headToHead[player2][player1].goalsAgainst += goals1;

        // Determine result
        if (goals1 > goals2) {
          headToHead[player1][player2].wins += 1;
          headToHead[player2][player1].losses += 1;
        } else if (goals1 < goals2) {
          headToHead[player2][player1].wins += 1;
          headToHead[player1][player2].losses += 1;
        } else {
          headToHead[player1][player2].draws += 1;
          headToHead[player2][player1].draws += 1;
        }
      }
    });

    return headToHead;
  };

  const headToHeadData = calculateHeadToHead();

  // Get record display
  const getRecord = (data) => {
    return `${data.wins}W-${data.draws}D-${data.losses}L`;
  };

  // Get goal difference
  const getGoalDifference = (data) => {
    const diff = data.goalsFor - data.goalsAgainst;
    return diff > 0 ? `+${diff}` : diff.toString();
  };

  // Get win percentage
  const getWinPercentage = (data) => {
    if (data.matches === 0) return '0%';
    return `${((data.wins / data.matches) * 100).toFixed(1)}%`;
  };

  return (
    <div className="head-to-head-container">
      <h3 className="head-to-head-title">🤝 Head-to-Head Records</h3>
      <p className="head-to-head-subtitle">
        Matches played between each pair of players in {league.name}
      </p>

      <div className="head-to-head-tables">
        {players.map(player1 => (
          <div key={player1} className="player-head-to-head">
            <h4 className="player-name">{player1} vs Others</h4>
            <table className="head-to-head-table">
              <thead>
                <tr>
                  <th>Opponent</th>
                  <th>Matches</th>
                  <th>Record</th>
                  <th>Goals For</th>
                  <th>Goals Against</th>
                  <th>Goal Diff</th>
                  <th>Win %</th>
                </tr>
              </thead>
              <tbody>
                {players
                  .filter(player2 => player2 !== player1)
                  .map(player2 => {
                    const data = headToHeadData[player1][player2];
                    return (
                      <tr key={player2}>
                        <td className="opponent-name">{player2}</td>
                        <td className="matches">{data.matches}</td>
                        <td className="record">{getRecord(data)}</td>
                        <td className="goals-for">{data.goalsFor}</td>
                        <td className="goals-against">{data.goalsAgainst}</td>
                        <td className={`goal-diff ${data.goalsFor > data.goalsAgainst ? 'positive' : data.goalsFor < data.goalsAgainst ? 'negative' : 'neutral'}`}>
                          {getGoalDifference(data)}
                        </td>
                        <td className="win-percentage">{getWinPercentage(data)}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="head-to-head-summary">
        <h4>📋 Summary</h4>
        <div className="summary-grid">
          {players.map(player => {
            const totalMatches = players
              .filter(opponent => opponent !== player)
              .reduce((sum, opponent) => sum + headToHeadData[player][opponent].matches, 0);
            
            const totalWins = players
              .filter(opponent => opponent !== player)
              .reduce((sum, opponent) => sum + headToHeadData[player][opponent].wins, 0);
            
            const totalGoals = players
              .filter(opponent => opponent !== player)
              .reduce((sum, opponent) => sum + headToHeadData[player][opponent].goalsFor, 0);

            return (
              <div key={player} className="player-summary">
                <h5>{player}</h5>
                <p>Total Matches: {totalMatches}/38</p>
                <p>Total Wins: {totalWins}</p>
                <p>Total Goals: {totalGoals}</p>
                <p>Win Rate: {totalMatches > 0 ? `${((totalWins / totalMatches) * 100).toFixed(1)}%` : '0%'}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HeadToHeadTable;