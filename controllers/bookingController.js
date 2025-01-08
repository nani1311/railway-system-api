const db = require('../config/db');

// Book a seat on a train
const bookSeat = (req, res) => {
  const { train_id } = req.body;
  const user_id = req.user.id; // Extracted from the token in middleware

  if (!train_id) {
    return res.status(400).json({ error: 'Train ID is required' });
  }

  // Check if the train exists and has available seats
  db.query('SELECT * FROM trains WHERE id = ?', [train_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Train not found' });

    const train = results[0];
    if (train.available_seats <= 0) return res.status(400).json({ message: 'No seats available' });

    // Deduct a seat and create a booking
    db.query(
      'UPDATE trains SET available_seats = available_seats - 1 WHERE id = ?',
      [train_id],
      (updateErr) => {
        if (updateErr) return res.status(500).json({ error: updateErr.message });

        db.query(
          'INSERT INTO bookings (user_id, train_id) VALUES (?, ?)',
          [user_id, train_id],
          (insertErr, result) => {
            if (insertErr) return res.status(500).json({ error: insertErr.message });

            res.status(201).json({ 
              message: 'Seat booked successfully!', 
              booking: { train_id, train_name: train.train_name }
            });
          }
        );
      }
    );
  });
};

// View bookings for the logged-in user
const getUserBookings = (req, res) => {
  const user_id = req.user.id; // Extracted from the token in middleware

  db.query(
    `SELECT 
       b.id AS booking_id, 
       t.train_name AS train_name, 
       t.source AS source_station, 
       t.destination AS destination_station, 
       b.booking_time AS booking_date
     FROM 
       bookings b 
     JOIN 
       trains t 
     ON 
       b.train_id = t.id 
     WHERE 
       b.user_id = ?`,
    [user_id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0) {
        return res.status(404).json({ message: 'No bookings found for this user' });
      }

      res.json(results);
    }
  );
};


const getTrainsByRoute = (req, res) => {
  const { source, destination } = req.query;

  db.query(
    'SELECT * FROM trains WHERE source = ? AND destination = ?',
    [source, destination],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0) return res.status(404).json({ message: 'No trains found for the given route' });

      res.json(results);
    }
  );
};

module.exports = { getTrainsByRoute };


module.exports = { bookSeat, getUserBookings };
