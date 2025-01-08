const express = require('express');
console.log("Loading train controller...");
const { addTrain, getAllTrains, getTrainById, updateTrain, deleteTrain } = require('../controllers/trainsController');
console.log("Train controller loaded.");

const verifyToken = require('./authMiddleware');
const { getTrainsByRoute } = require('../controllers/trainsController');

const router = express.Router();
// CRUD routes for trains
router.post('/', verifyToken, addTrain); // Add a new train (only for admin)
router.get('/', verifyToken, getAllTrains); // Get all trains
router.get('/:id', verifyToken, getTrainById); // Get train details by ID
router.put('/:id', verifyToken, updateTrain); // Update train details
router.delete('/:id', verifyToken, deleteTrain); // Delete a train
router.get('/availability', getTrainsByRoute);

module.exports = router;
