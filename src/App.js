import React, { useState, useEffect } from 'react';
import LeagueManager from './components/LeagueManager';
import MatchEntryForm from './components/MatchEntryForm';
import LeagueTable from './components/LeagueTable';
import MatchHistory from './components/MatchHistory';
import HeadToHeadTable from './components/HeadToHeadTable';
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
  const [showMatchHistory, setShowMatchHistory] = useState(false);
  const [showHeadToHead, setShowHeadToHead] = useState(false);

  // Get the current league object
  const currentLeague = leagues.find(league => league._id === currentLeagueId);

  console.log('Current league:', currentLeague); // Debug log
  console.log('Show match history:', showMatchHistory); // Debug log

  // Load leagues on component mount
  useEffect(() => {
    loadLeagues();
  }, []);

  // Function to load all leagues
  const loadLeagues = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getLeagues();
      console.log('Loaded leagues:', data); // Debug log
      setLeagues(data);
      setError(null);
    } catch (err) {
      console.error('Error loading leagues:', err);
      setError('Failed to load leagues. Please check your connection.');
      
      // Add test data for development
      const testLeagues = [
        {
          _id: 'test1',
          name: 'Test League 1',
          status: 'active',
          matches: [
            { player1: 'Jassi', player2: 'Lezter', goals1: 3, goals2: 1, date: new Date() },
            { player1: 'Lezter', player2: 'Kumar', goals1: 2, goals2: 2, date: new Date() },
            { player1: 'Kumar', player2: 'Jassi', goals1: 1, goals2: 4, date: new Date() }
          ],
          playerStats: {
            Jassi: { matches: 2, wins: 1, draws: 0, losses: 1, goalsFor: 7, goalsAgainst: 2, form: ['W', 'L'] },
            Lezter: { matches: 2, wins: 0, draws: 1, losses: 1, goalsFor: 3, goalsAgainst: 5, form: ['D', 'L'] },
            Kumar: { matches: 2, wins: 0, draws: 1, losses: 1, goalsFor: 3, goalsAgainst: 6, form: ['D', 'L'] }
          },
          createdAt: new Date(),
          endedAt: null
        },
        {
          _id: 'test2',
          name: 'Test League 2',
          status: 'ended',
          matches: [
            { player1: 'Jassi', player2: 'Lezter', goals1: 2, goals2: 0, date: new Date() },
            { player1: 'Lezter', player2: 'Kumar', goals1: 1, goals2: 1, date: new Date() },
            { player1: 'Kumar', player2: 'Jassi', goals1: 0, goals2: 3, date: new Date() }
          ],
          playerStats: {
            Jassi: { matches: 2, wins: 2, draws: 0, losses: 0, goalsFor: 5, goalsAgainst: 0, form: ['W', 'W'] },
            Lezter: { matches: 2, wins: 0, draws: 1, losses: 1, goalsFor: 1, goalsAgainst: 3, form: ['L', 'D'] },
            Kumar: { matches: 2, wins: 0, draws: 1, losses: 1, goalsFor: 1, goalsAgainst: 4, form: ['D', 'L'] }
          },
          createdAt: new Date(),
          endedAt: new Date()
        }
      ];
      setLeagues(testLeagues);
      setCurrentLeagueId('test1'); // Auto-select first test league
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
    console.log('Selecting league:', leagueId); // Debug log
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

  // Function to delete a league
  const deleteLeague = async (leagueId) => {
    try {
      console.log('Deleting league:', leagueId); // Debug log
      await ApiService.deleteLeague(leagueId);
      setLeagues(prevLeagues => 
        prevLeagues.filter(league => league._id !== leagueId)
      );
      
      // If the deleted league was selected, clear selection
      if (currentLeagueId === leagueId) {
        setCurrentLeagueId(null);
      }
      
      setError(null);
    } catch (err) {
      setError('Failed to delete league. Please try again.');
      console.error('Error deleting league:', err);
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
          onDeleteLeague={deleteLeague}
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
            
            {/* Head-to-Head Table */}
            <HeadToHeadTable league={currentLeague} />
            
            {/* Match History Button */}
            <div className="history-buttons">
              <button 
                className="history-btn"
                onClick={() => setShowMatchHistory(!showMatchHistory)}
              >
                {showMatchHistory ? '📜 Hide Match History' : '📜 Show Match History'}
              </button>
            </div>
            
            {/* Match History Component */}
            {showMatchHistory && (
              <MatchHistory leagues={leagues} />
            )}
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