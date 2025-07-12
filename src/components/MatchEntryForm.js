import React, { useState } from 'react';

const MatchEntryForm = ({ onAddMatch, leagueStatus }) => {
  // State to store form data
  const [formData, setFormData] = useState({
    player1: '',
    player2: '',
    goals1: 1,
    goals2: 1
  });

  // Available players
  const players = ['Jassi', 'Lezter', 'Kumar'];
  
  // Available goal options (1 to 15)
  const goalOptions = Array.from({ length: 15 }, (_, i) => i + 1);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page refresh
    
    // Check if both players are the same
    if (formData.player1 === formData.player2) {
      alert('Players must be different!');
      return;
    }
    
    // Check if both players are selected
    if (!formData.player1 || !formData.player2) {
      alert('Please select both players!');
      return;
    }
    
    // Add the match
    onAddMatch(formData);
    
    // Reset form
    setFormData({
      player1: '',
      player2: '',
      goals1: 1,
      goals2: 1
    });
  };

  return (
    <div className="form-container">
      <h2 className="form-title">
        📝 Add Match Result
        {leagueStatus === 'ended' && <span className="ended-notice"> (League Ended - Read Only)</span>}
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="player1">Player 1:</label>
            <select
              id="player1"
              name="player1"
              value={formData.player1}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Player 1</option>
              {players.map(player => (
                <option key={player} value={player}>
                  {player}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="goals1">Goals:</label>
            <select
              id="goals1"
              name="goals1"
              value={formData.goals1}
              onChange={handleInputChange}
              required
            >
              {goalOptions.map(goals => (
                <option key={goals} value={goals}>
                  {goals}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="player2">Player 2:</label>
            <select
              id="player2"
              name="player2"
              value={formData.player2}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Player 2</option>
              {players.map(player => (
                <option key={player} value={player}>
                  {player}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="goals2">Goals:</label>
            <select
              id="goals2"
              name="goals2"
              value={formData.goals2}
              onChange={handleInputChange}
              required
            >
              {goalOptions.map(goals => (
                <option key={goals} value={goals}>
                  {goals}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <button 
          type="submit" 
          className="submit-btn"
          disabled={leagueStatus === 'ended'}
        >
          {leagueStatus === 'ended' ? '🚫 League Ended' : '🚀 Submit Match Result'}
        </button>
      </form>
    </div>
  );
};

export default MatchEntryForm;