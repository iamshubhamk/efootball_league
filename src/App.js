import React, { useState, useEffect } from 'react';
import LeagueManager from './components/LeagueManager';
import MatchEntryForm from './components/MatchEntryForm';
import LeagueTable from './components/LeagueTable';
import ApiService from './services/api';
import './App.css';

function App() {
  // State to store all leagues
  const [leagues, setLeagues] = useState([]);
  
  // State to track the currently selected league
  const [currentLeagueId, setCurrentLeagueId] = useState(null);
  
  // State for loading and error handling
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get the current league object
  const currentLeague = leagues.find(league => league._id === currentLeagueId);

  // Load leagues on component mount
  useEffect(() => {
    loadLeagues();
  }, []);

  // Function to load all leagues
  const loadLeagues = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getLeagues();
      setLeagues(data);
      setError(null);
    } catch (err) {
      setError('Failed to load leagues. Please check your connection.');
      console.error('Error loading leagues:', err);
    } finally {
      setLoading(false);
    }
  };

  // Function to create a new league
  const createLeague = async (leagueName) => {
    try {
      const newLeague = await ApiService.createLeague(leagueName);
      setLeagues(prevLeagues => [...prevLeagues, newLeague]);
      
      // Automatically select the newly created league
      setCurrentLeagueId(newLeague._id);
      setError(null);
    } catch (err) {
      setError('Failed to create league. Please try again.');
      console.error('Error creating league:', err);
    }
  };

  // Function to select a league
  const selectLeague = (leagueId) => {
    setCurrentLeagueId(leagueId);
  };

  // Function to end a league
  const endLeague = async (leagueId) => {
    try {
      const updatedLeague = await ApiService.endLeague(leagueId);
      setLeagues(prevLeagues => 
        prevLeagues.map(league => 
          league._id === leagueId ? updatedLeague : league
        )
      );
      setError(null);
    } catch (err) {
      setError('Failed to end league. Please try again.');
      console.error('Error ending league:', err);
    }
  };

  // Function to add a new match to the current league
  const addMatch = async (matchData) => {
    if (!currentLeague || currentLeague.status === 'ended') {
      alert('Cannot add matches to an ended league!');
      return;
    }

    try {
      const updatedLeague = await ApiService.addMatch(currentLeagueId, matchData);
      setLeagues(prevLeagues => 
        prevLeagues.map(league => 
          league._id === currentLeagueId ? updatedLeague : league
        )
      );
      setError(null);
    } catch (err) {
      setError('Failed to add match. Please try again.');
      console.error('Error adding match:', err);
    }
  };



  return (
    <div className="App">
      <div className="container">
        <header className="header">
          <h1>⚽ eFootball League Tracker</h1>
        </header>
        
        <LeagueManager 
          leagues={leagues}
          currentLeagueId={currentLeagueId}
          currentLeague={currentLeague}
          onCreateLeague={createLeague}
          onSelectLeague={selectLeague}
          onEndLeague={endLeague}
        />
        
        {currentLeague && (
          <>
            <MatchEntryForm 
              onAddMatch={addMatch} 
              leagueStatus={currentLeague.status}
            />
            <LeagueTable 
              playerStats={currentLeague.playerStats}
              leagueName={currentLeague.name}
              leagueStatus={currentLeague.status}
            />
          </>
        )}
        
        {loading && (
          <div className="loading">
            <h2>Loading...</h2>
            <p>Please wait while we fetch your leagues.</p>
          </div>
        )}
        
        {error && (
          <div className="error-message">
            <h3>⚠️ Error</h3>
            <p>{error}</p>
            <button onClick={loadLeagues} className="retry-btn">
              Retry
            </button>
          </div>
        )}
        
        {!loading && !error && !currentLeague && leagues.length === 0 && (
          <div className="no-leagues">
            <h2>Welcome to eFootball League Tracker!</h2>
            <p>Create your first league to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;