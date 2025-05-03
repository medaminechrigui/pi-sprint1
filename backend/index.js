const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const recetteRoutes = require('./routes/recetteRoutes');
const cors = require('cors');
const app = express();

// Middlewares
app.use(cors({
  origin: 'http://localhost:5173', // Adjust this to your frontend URL and port
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/recettes', recetteRoutes);

// Connexion à MongoDB Atlas
mongoose.connect('mongodb+srv://alleleya93:2aB2Hz0IBwAF1foo@cluster0.03spdaf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => {
    console.log('MongoDB connected');
    app.listen(3000, () => console.log('Server running on port 3000'));
  })
  .catch(err => console.error('DB connection error:', err));
