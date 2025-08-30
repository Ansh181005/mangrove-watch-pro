const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const db = admin.firestore();

// GET all incidents
router.get('/', async (req, res) => {
  try {
    const incidentsSnapshot = await db.collection('incidents').get();
    const incidents = [];
    incidentsSnapshot.forEach(doc => {
      incidents.push({ id: doc.id, ...doc.data() });
    });
    res.status(200).json(incidents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST a new incident
router.post('/', async (req, res) => {
  try {
    const newIncident = await db.collection('incidents').add(req.body);
    res.status(201).json({ id: newIncident.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
