import React, { useState } from 'react';

const LeagueManager = ({ leagues, currentLeagueId, currentLeague, onCreateLeague, onSelectLeague, onEndLeague, onDeleteLeague }) => {
  const [newLeagueName, setNewLeagueName] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [leagueToEnd, setLeagueToEnd] = useState(null);
  const [confirmStep, setConfirmStep] = useState(1); // 1 for first confirmation, 2 for second
  const [leagueToDelete, setLeagueToDelete] = useState(null);
  const [deleteConfirmStep, setDeleteConfirmStep] = useState(1); // 1 for first confirmation, 2 for second, 3 for third
  const [showStatsModal, setShowStatsModal] = useState(false);

  // Handle creating a new league
  const handleCreateLeague = (e) => {
    e.preventDefault();
    if (newLeagueName.trim()) {
      onCreateLeague(newLeagueName.trim());
      setNewLeagueName('');
      setShowCreateForm(false);
    }
  };

  // Handle ending a league with double confirmation
  const handleEndLeague = (league) => {
    setLeagueToEnd(league);
    setConfirmStep(1);
  };

  // First confirmation
  const confirmEndLeague = () => {
    setConfirmStep(2);
  };

  // Second confirmation - actually end the league
  const finalConfirmEndLeague = () => {
    onEndLeague(leagueToEnd._id);
    setLeagueToEnd(null);
    setConfirmStep(1);
  };

  // Cancel ending league
  const cancelEndLeague = () => {
    setLeagueToEnd(null);
    setConfirmStep(1);
  };

  // Handle deleting a league with triple confirmation
  const handleDeleteLeague = (league) => {
    setLeagueToDelete(league);
    setDeleteConfirmStep(1);
  };

  // First confirmation for delete
  const confirmDeleteLeague = () => {
    setDeleteConfirmStep(2);
  };

  // Second confirmation for delete
  const confirmDeleteLeague2 = () => {
    setDeleteConfirmStep(3);
  };

  // Third confirmation - actually delete the league
  const finalConfirmDeleteLeague = () => {
    onDeleteLeague(leagueToDelete._id);
    setLeagueToDelete(null);
    setDeleteConfirmStep(1);
  };

  // Cancel deleting league
  const cancelDeleteLeague = () => {
    setLeagueToDelete(null);
    setDeleteConfirmStep(1);
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Calculate overall statistics across all leagues
  const calculateOverallStats = () => {
    const playerStats = {};
    
    leagues.forEach(league => {
      Object.entries(league.playerStats).forEach(([playerName, stats]) => {
        if (!playerStats[playerName]) {
          playerStats[playerName] = {
            totalWins: 0,
            totalGoals: 0,
            leaguesWon: 0
          };
        }
        
        playerStats[playerName].totalWins += stats.wins;
        playerStats[playerName].totalGoals += stats.goalsFor;
        
        // Check if this player won this league
        if (league.status === 'ended') {
          const players = Object.entries(league.playerStats).map(([name, stat]) => ({
            name,
            points: (stat.wins * 3) + stat.draws,
            goalDifference: stat.goalsFor - stat.goalsAgainst,
            goalsFor: stat.goalsFor
          }));
          
          players.sort((a, b) => {
            if (b.points !== a.points) return b.points - a.points;
            if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
            return b.goalsFor - a.goalsFor;
          });
          
          if (players[0].name === playerName) {
            playerStats[playerName].leaguesWon += 1;
          }
        }
      });
    });
    
    return playerStats;
  };

  return (
    <div className="league-manager">
      {/* Stats Button */}
      <div className="stats-button-container">
        <button 
          className="stats-btn"
          onClick={() => setShowStatsModal(true)}
        >
          📊 Stats
        </button>
      </div>
      
      {/* Create League Section */}
      <div className="create-league-section">
        {!showCreateForm ? (
          <button 
            className="create-league-btn"
            onClick={() => setShowCreateForm(true)}
          >
            ➕ Create New League
          </button>
        ) : (
          <div className="create-league-form">
            <h3>Create New League</h3>
            <form onSubmit={handleCreateLeague}>
              <div className="form-group">
                <label htmlFor="leagueName">League Name:</label>
                <input
                  type="text"
                  id="leagueName"
                  value={newLeagueName}
                  onChange={(e) => setNewLeagueName(e.target.value)}
                  placeholder="Enter league name..."
                  required
                  autoFocus
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="submit-btn">
                  Create League
                </button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewLeagueName('');
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* League Selection Section */}
      {leagues.length > 0 && (
        <div className="league-selection">
          <h3>Select League</h3>
          <div className="league-dropdown-container">
            <select 
              className="league-dropdown"
              value={currentLeagueId || ''}
              onChange={(e) => onSelectLeague(e.target.value || null)}
            >
              <option value="">Select a league...</option>
              {leagues.map(league => (
                <option key={league._id} value={league._id}>
                  {league.name} {league.status === 'ended' ? '(ENDED)' : ''} - {league.matches.length} matches
                </option>
              ))}
            </select>
            
            {currentLeague && currentLeague.status === 'active' && (
              <button 
                className="end-league-btn"
                onClick={() => handleEndLeague(currentLeague)}
              >
                End League
              </button>
            )}
            
            {currentLeague && (
              <button 
                className="delete-league-btn"
                onClick={() => handleDeleteLeague(currentLeague)}
              >
                Delete League
              </button>
            )}
          </div>
          
          {/* League Info Display */}
          {currentLeague && (
            <div className="league-info-display">
              <div className="league-header">
                <h4>{currentLeague.name}</h4>
                <span className={`status-badge ${currentLeague.status}`}>
                  {currentLeague.status === 'ended' ? 'ENDED' : 'ACTIVE'}
                </span>
              </div>
              <div className="league-details">
                <span>Created: {formatDate(currentLeague.createdAt)}</span>
                {currentLeague.status === 'ended' && (
                  <span>Ended: {formatDate(currentLeague.endedAt)}</span>
                )}
                <span>Matches: {currentLeague.matches.length}</span>
              </div>
              
              {/* Winner Display for Ended Leagues */}
              {currentLeague.status === 'ended' && (
                <div className="winner-display">
                  {(() => {
                    const stats = currentLeague.playerStats;
                    const players = Object.entries(stats).map(([name, stat]) => ({
                      name,
                      points: (stat.wins * 3) + stat.draws,
                      goalDifference: stat.goalsFor - stat.goalsAgainst,
                      goalsFor: stat.goalsFor
                    }));
                    
                    players.sort((a, b) => {
                      if (b.points !== a.points) return b.points - a.points;
                      if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
                      return b.goalsFor - a.goalsFor;
                    });
                    
                    const winner = players[0];
                    return (
                      <div className="winner-info">
                        <h5>🏆 League Winner</h5>
                        <div className="winner-name">{winner.name}</div>
                        <div className="winner-stats">
                          {winner.points} points • {winner.goalsFor} goals • +{winner.goalDifference} GD
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* End League Confirmation Modal */}
      {leagueToEnd && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>End League Confirmation</h3>
            
            {confirmStep === 1 ? (
              <>
                <p>
                  Are you sure you want to end the league <strong>"{leagueToEnd.name}"</strong>?
                </p>
                <p className="warning">
                  ⚠️ This action cannot be undone. Once ended, no more matches can be added to this league.
                </p>
                <div className="modal-actions">
                  <button 
                    className="confirm-btn"
                    onClick={confirmEndLeague}
                  >
                    Yes, I want to end this league
                  </button>
                  <button 
                    className="cancel-btn"
                    onClick={cancelEndLeague}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <p>
                  <strong>Final Confirmation:</strong> You are about to end the league <strong>"{leagueToEnd.name}"</strong>.
                </p>
                <p className="warning">
                  ⚠️ This is your last chance to cancel. After this, the league will be permanently ended.
                </p>
                <div className="modal-actions">
                  <button 
                    className="confirm-btn danger"
                    onClick={finalConfirmEndLeague}
                  >
                    Yes, end the league permanently
                  </button>
                  <button 
                    className="cancel-btn"
                    onClick={cancelEndLeague}
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Stats Modal */}
      {showStatsModal && (
        <div className="modal-overlay">
          <div className="modal stats-modal">
            <h3>📊 Overall Statistics</h3>
            
            {leagues.length === 0 ? (
              <p>No leagues created yet.</p>
            ) : (
              <>
                {/* Max League Wins Table */}
                <div className="stats-section">
                  <h4>🏆 Most League Wins</h4>
                  {(() => {
                    const overallStats = calculateOverallStats();
                    const sortedByWins = Object.entries(overallStats)
                      .map(([name, stats]) => ({ name, ...stats }))
                      .sort((a, b) => b.leaguesWon - a.leaguesWon);
                    
                    return (
                      <table className="stats-table">
                        <thead>
                          <tr>
                            <th>Rank</th>
                            <th>Player</th>
                            <th>Leagues Won</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sortedByWins.map((player, index) => (
                            <tr key={player.name}>
                              <td>{index + 1}</td>
                              <td>{player.name}</td>
                              <td>{player.leaguesWon}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    );
                  })()}
                </div>

                {/* Max Scorer Table */}
                <div className="stats-section">
                  <h4>⚽ Top Scorers</h4>
                  {(() => {
                    const overallStats = calculateOverallStats();
                    const sortedByGoals = Object.entries(overallStats)
                      .map(([name, stats]) => ({ name, ...stats }))
                      .sort((a, b) => b.totalGoals - a.totalGoals);
                    
                    return (
                      <table className="stats-table">
                        <thead>
                          <tr>
                            <th>Rank</th>
                            <th>Player</th>
                            <th>Total Goals</th>
                            <th>Total Wins</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sortedByGoals.map((player, index) => (
                            <tr key={player.name}>
                              <td>{index + 1}</td>
                              <td>{player.name}</td>
                              <td>{player.totalGoals}</td>
                              <td>{player.totalWins}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    );
                  })()}
                </div>
              </>
            )}
            
            <div className="modal-actions">
              <button 
                className="cancel-btn"
                onClick={() => setShowStatsModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete League Confirmation Modal */}
      {leagueToDelete && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>🗑️ Delete League Confirmation</h3>
            
            {deleteConfirmStep === 1 ? (
              <>
                <p>
                  Are you sure you want to delete the league <strong>"{leagueToDelete.name}"</strong>?
                </p>
                <p className="warning">
                  ⚠️ This action will permanently delete ALL data including matches, statistics, and player records.
                </p>
                <div className="modal-actions">
                  <button 
                    className="confirm-btn"
                    onClick={confirmDeleteLeague}
                  >
                    Yes, I want to delete this league
                  </button>
                  <button 
                    className="cancel-btn"
                    onClick={cancelDeleteLeague}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : deleteConfirmStep === 2 ? (
              <>
                <p>
                  <strong>Second Confirmation:</strong> You are about to delete <strong>"{leagueToDelete.name}"</strong>.
                </p>
                <p className="warning">
                  ⚠️ This will permanently remove {leagueToDelete.matches.length} matches and all player statistics.
                </p>
                <div className="modal-actions">
                  <button 
                    className="confirm-btn"
                    onClick={confirmDeleteLeague2}
                  >
                    Yes, I understand the consequences
                  </button>
                  <button 
                    className="cancel-btn"
                    onClick={cancelDeleteLeague}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <p>
                  <strong>FINAL WARNING:</strong> You are about to permanently delete <strong>"{leagueToDelete.name}"</strong>.
                </p>
                <p className="warning">
                  ⚠️ This is your LAST chance to cancel. After this, the league and ALL its data will be gone forever.
                </p>
                <div className="modal-actions">
                  <button 
                    className="confirm-btn danger"
                    onClick={finalConfirmDeleteLeague}
                  >
                    Yes, delete the league permanently
                  </button>
                  <button 
                    className="cancel-btn"
                    onClick={cancelDeleteLeague}
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LeagueManager;