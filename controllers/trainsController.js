const db = require('../config/db');

// Add a new train
const addTrain = (req, res) => {
    console.log(req.body);
    const { train_name, source, destination, total_seats, available_seats } = req.body;
  
    if (!train_name || !source || !destination || !total_seats || !available_seats) {
      return res.status(400).json({ error: "All fields are required" });
    }
  
    db.query(
      'INSERT INTO trains (train_name, source, destination, total_seats, available_seats) VALUES (?, ?, ?, ?, ?)',
      [train_name, source, destination, total_seats, available_seats],
      (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Train added successfully!' });
      }
    );
  };
  

// Get all trains
const getAllTrains = (req, res) => {
  db.query('SELECT * FROM trains', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// Get a single train by ID
const getTrainById = (req, res) => {
  const { id } = req.params;

  db.query('SELECT * FROM trains WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Train not found' });
    res.json(results[0]);
  });
};

// Update a train by ID
const updateTrain = (req, res) => {
    const { id } = req.params;
    const { train_name, source, destination, total_seats, available_seats } = req.body;
  
    if (!train_name || !source || !destination || !total_seats || !available_seats) {
      return res.status(400).json({ error: 'All fields are required' });
    }
  
    db.query(
      'UPDATE trains SET train_name = ?, source = ?, destination = ?, total_seats = ?, available_seats = ? WHERE id = ?',
      [train_name, source, destination, total_seats, available_seats, id],
      (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Train not found' });
        res.json({ message: 'Train details updated successfully!' });
      }
    );
  };

// Delete a train by ID
const deleteTrain = (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM trains WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Train deleted successfully!' });
  });
};

const getTrainsByRoute = (req, res) => {
  const { source, destination } = req.query;

  console.log('Source:', source, 'Destination:', destination);

  db.query(
      'SELECT * FROM trains WHERE source = ? AND destination = ?',
      [source, destination],
      (err, results) => {
          if (err) {
              console.error('Database error:', err.message);
              return res.status(500).json({ error: err.message });
          }
          console.log('Database query results:', results);
          if (results.length === 0) {
              console.log(`No trains found for source: ${source} and destination: ${destination}`);
              return res.status(404).json({ message: 'Train not found' });
          }
          res.json(results);
      }
  );
};





module.exports = { addTrain, getAllTrains, getTrainById, updateTrain, deleteTrain, getTrainsByRoute };
