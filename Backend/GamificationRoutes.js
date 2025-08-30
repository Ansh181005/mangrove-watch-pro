const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const db = admin.firestore();

// GET leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const usersSnapshot = await db.collection('users').orderBy('points', 'desc').limit(10).get();
    const leaderboard = [];
    usersSnapshot.forEach(doc => {
      leaderboard.push({ id: doc.id, ...doc.data() });
    });
    res.status(200).json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET reward tiers
router.get('/rewards', async (req, res) => {
    try {
      const rewardsSnapshot = await db.collection('rewards').get();
      const rewards = [];
      rewardsSnapshot.forEach(doc => {
        rewards.push({ id: doc.id, ...doc.data() });
      });
      res.status(200).json(rewards);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

module.exports = router;
