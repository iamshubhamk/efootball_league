const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/efootball_league', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB successfully!');
});

// League Schema
const leagueSchema = new mongoose.Schema({
  name: { type: String, required: true },
  status: { type: String, enum: ['active', 'ended'], default: 'active' },
  matches: [{
    player1: String,
    player2: String,
    goals1: Number,
    goals2: Number,
    date: { type: Date, default: Date.now }
  }],
  playerStats: {
    Jassi: {
      matches: { type: Number, default: 0 },
      wins: { type: Number, default: 0 },
      draws: { type: Number, default: 0 },
      losses: { type: Number, default: 0 },
      goalsFor: { type: Number, default: 0 },
      goalsAgainst: { type: Number, default: 0 },
      form: [String]
    },
    Lezter: {
      matches: { type: Number, default: 0 },
      wins: { type: Number, default: 0 },
      draws: { type: Number, default: 0 },
      losses: { type: Number, default: 0 },
      goalsFor: { type: Number, default: 0 },
      goalsAgainst: { type: Number, default: 0 },
      form: [String]
    },
    Kumar: {
      matches: { type: Number, default: 0 },
      wins: { type: Number, default: 0 },
      draws: { type: Number, default: 0 },
      losses: { type: Number, default: 0 },
      goalsFor: { type: Number, default: 0 },
      goalsAgainst: { type: Number, default: 0 },
      form: [String]
    }
  },
  createdAt: { type: Date, default: Date.now },
  endedAt: { type: Date, default: null }
});

const League = mongoose.model('League', leagueSchema);

// API Routes

// Get all leagues
app.get('/api/leagues', async (req, res) => {
  try {
    const leagues = await League.find().sort({ createdAt: -1 });
    res.json(leagues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new league
app.post('/api/leagues', async (req, res) => {
  try {
    const { name } = req.body;
    const league = new League({ name });
    const savedLeague = await league.save();
    res.status(201).json(savedLeague);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get a specific league
app.get('/api/leagues/:id', async (req, res) => {
  try {
    const league = await League.findById(req.params.id);
    if (!league) {
      return res.status(404).json({ message: 'League not found' });
    }
    res.json(league);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a match to a league
app.post('/api/leagues/:id/matches', async (req, res) => {
  try {
    const { player1, player2, goals1, goals2 } = req.body;
    const league = await League.findById(req.params.id);
    
    if (!league) {
      return res.status(404).json({ message: 'League not found' });
    }
    
    if (league.status === 'ended') {
      return res.status(400).json({ message: 'Cannot add matches to an ended league' });
    }
    
    // Add the match
    league.matches.push({ player1, player2, goals1, goals2 });
    
    // Update player statistics
    const goals1Num = parseInt(goals1, 10);
    const goals2Num = parseInt(goals2, 10);
    
    // Update Player 1 stats
    league.playerStats[player1].matches += 1;
    league.playerStats[player1].goalsFor += goals1Num;
    league.playerStats[player1].goalsAgainst += goals2Num;
    
    // Update Player 2 stats
    league.playerStats[player2].matches += 1;
    league.playerStats[player2].goalsFor += goals2Num;
    league.playerStats[player2].goalsAgainst += goals1Num;
    
    // Determine match result and update wins/draws/losses
    if (goals1Num > goals2Num) {
      // Player 1 wins
      league.playerStats[player1].wins += 1;
      league.playerStats[player2].losses += 1;
      
      // Update form (only keep last 5 results)
      league.playerStats[player1].form.push('W');
      league.playerStats[player1].form = league.playerStats[player1].form.slice(-5);
      league.playerStats[player2].form.push('L');
      league.playerStats[player2].form = league.playerStats[player2].form.slice(-5);
    } else if (goals1Num < goals2Num) {
      // Player 2 wins
      league.playerStats[player2].wins += 1;
      league.playerStats[player1].losses += 1;
      
      // Update form (only keep last 5 results)
      league.playerStats[player2].form.push('W');
      league.playerStats[player2].form = league.playerStats[player2].form.slice(-5);
      league.playerStats[player1].form.push('L');
      league.playerStats[player1].form = league.playerStats[player1].form.slice(-5);
    } else {
      // Draw
      league.playerStats[player1].draws += 1;
      league.playerStats[player2].draws += 1;
      
      // Update form (only keep last 5 results)
      league.playerStats[player1].form.push('D');
      league.playerStats[player1].form = league.playerStats[player1].form.slice(-5);
      league.playerStats[player2].form.push('D');
      league.playerStats[player2].form = league.playerStats[player2].form.slice(-5);
    }
    
    const updatedLeague = await league.save();
    res.json(updatedLeague);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// End a league
app.put('/api/leagues/:id/end', async (req, res) => {
  try {
    const league = await League.findById(req.params.id);
    
    if (!league) {
      return res.status(404).json({ message: 'League not found' });
    }
    
    league.status = 'ended';
    league.endedAt = new Date();
    
    const updatedLeague = await league.save();
    res.json(updatedLeague);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a league
app.delete('/api/leagues/:id', async (req, res) => {
  try {
    const league = await League.findById(req.params.id);
    
    if (!league) {
      return res.status(404).json({ message: 'League not found' });
    }
    
    await League.findByIdAndDelete(req.params.id);
    res.json({ message: 'League deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'eFootball League API is running' });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});