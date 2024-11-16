const express = require('express');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
const PORT = 3001;

// Enable CORS
app.use(cors());
// Middleware to parse JSON
app.use(express.json());

// Create a MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'DeeBee200331',
  database: 'wings_cafe_inventory'
});

// Connect to the database
db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database.');
});

// API endpoint to get products
app.get('/products', (req, res) => {
  db.query('SELECT * FROM products', (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Error retrieving products' });
    } else {
      res.json(results);
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
// Route to add a product
app.post('/api/products', (req, res) => {
  const { name, description, category, price, quantity } = req.body;
  const query = 'INSERT INTO products (name, description, category, price, quantity) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [name, description, category, price, quantity], (err, result) => {
    if (err) return res.status(500).json(err);
    res.status(200).json({ message: 'Product added successfully' });
  });
});

// Route to get all products
app.get('/api/products', (req, res) => {
  const query = 'SELECT * FROM products';
  db.query(query, (err, results) => {
    if (err) return res.status(500).json(err);
    res.status(200).json(results);
  });
});

// Route to update a product
app.put('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const { name, description, category, price, quantity } = req.body;
  const query = 'UPDATE products SET name = ?, description = ?, category = ?, price = ?, quantity = ? WHERE id = ?';
  db.query(query, [name, description, category, price, quantity, id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.status(200).json({ message: 'Product updated successfully' });
  });
});

// Route to delete a product
app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM products WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.status(200).json({ message: 'Product deleted successfully' });
  });
});
