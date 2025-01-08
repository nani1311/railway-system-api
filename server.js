require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const authRoute = require('./routes/authRoute'); // Ensure this path is correct
const verifyToken = require('./routes/authMiddleware');
const trainRoutes = require('./routes/trainRoutes');
const bookingRoutes = require('./routes/bookingRoutes');


const app = express();





// Middleware to parse JSON
app.use(bodyParser.json());

// API Routes
app.use('/api/auth', authRoute);
app.use('/api/trains', trainRoutes);
app.use('/api/bookings', bookingRoutes);


// Protected Route
app.get('/api/protected', verifyToken, (req, res) => {
  res.json({
    message: 'This is a protected route',
    userId: req.userId,
    role: req.userRole,
  });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
