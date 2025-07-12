const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  // Get all leagues
  static async getLeagues() {
    try {
      const response = await fetch(`${API_BASE_URL}/leagues`);
      if (!response.ok) throw new Error('Failed to fetch leagues');
      return await response.json();
    } catch (error) {
      console.error('Error fetching leagues:', error);
      throw error;
    }
  }

  // Create a new league
  static async createLeague(name) {
    try {
      const response = await fetch(`${API_BASE_URL}/leagues`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });
      if (!response.ok) throw new Error('Failed to create league');
      return await response.json();
    } catch (error) {
      console.error('Error creating league:', error);
      throw error;
    }
  }

  // Get a specific league
  static async getLeague(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/leagues/${id}`);
      if (!response.ok) throw new Error('Failed to fetch league');
      return await response.json();
    } catch (error) {
      console.error('Error fetching league:', error);
      throw error;
    }
  }

  // Add a match to a league
  static async addMatch(leagueId, matchData) {
    try {
      const response = await fetch(`${API_BASE_URL}/leagues/${leagueId}/matches`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(matchData),
      });
      if (!response.ok) throw new Error('Failed to add match');
      return await response.json();
    } catch (error) {
      console.error('Error adding match:', error);
      throw error;
    }
  }

  // End a league
  static async endLeague(leagueId) {
    try {
      const response = await fetch(`${API_BASE_URL}/leagues/${leagueId}/end`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to end league');
      return await response.json();
    } catch (error) {
      console.error('Error ending league:', error);
      throw error;
    }
  }

  // Health check
  static async healthCheck() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      if (!response.ok) throw new Error('API health check failed');
      return await response.json();
    } catch (error) {
      console.error('Health check error:', error);
      throw error;
    }
  }
}

export default ApiService;