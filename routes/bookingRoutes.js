const express = require('express');
const { bookSeat, getUserBookings } = require('../controllers/bookingController');
const verifyToken = require('./authMiddleware');
const router = express.Router();

// Booking routes
router.post('/', verifyToken, bookSeat); // Book a seat on a train
router.get('/', verifyToken, getUserBookings); // View bookings for the logged-in user

module.exports = router;
