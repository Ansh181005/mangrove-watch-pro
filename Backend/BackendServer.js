// Import required modules
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
require('dotenv').config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin SDK
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Routes
app.get('/', (req, res) => {
  res.send('Mangrove Watch Community Backend is running!');
});

// Incidents Routes
const incidentsRouter = require('./IncidentsRoutes');
app.use('/incidents', incidentsRouter);

// Users Routes
const usersRouter = require('./UsersRoutes');
app.use('/users', usersRouter);

// Gamification Routes
const gamificationRouter = require('./GamificationRoutes');
app.use('/gamification', gamificationRouter);   


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
