const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const port = 9500;

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'qwerty',
  database: 'test'
});

connection.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/search', (req, res) => {
  const searchTerm = req.query.term;
  const avgcost = req.query.avgcost;
  const category = req.query.category;
  // console.log(searchTerm, avgcost, category);
  let sql;
  let params = [];

  if (category === "restaurant") {
    if (searchTerm && avgcost) {
      sql = 'SELECT * FROM restaurants WHERE RestaurantName LIKE ? AND AverageCostForTwo < ?';
      params = [`%${searchTerm}%`, avgcost];
    } else if (searchTerm) {
      sql = 'SELECT * FROM restaurants WHERE RestaurantName LIKE ?';
      params = [`%${searchTerm}%`];
    } else if (avgcost) {
      sql = 'SELECT * FROM restaurants WHERE AverageCostForTwo < ?';
      params = [avgcost];
    } else {
      sql = 'SELECT * FROM restaurants LIMIT 20';
    }
  } else if (category === "city") {
    if (searchTerm && avgcost) {
      sql = 'SELECT * FROM restaurants WHERE City LIKE ? AND AverageCostForTwo < ?';
      params = [`%${searchTerm}%`, avgcost];
    } else if (searchTerm) {
      sql = 'SELECT * FROM restaurants WHERE City LIKE ?';
      params = [`%${searchTerm}%`];
    } else if (avgcost) {
      sql = 'SELECT * FROM restaurants WHERE AverageCostForTwo < ?';
      params = [avgcost];
    } else {
      sql = 'SELECT * FROM restaurants LIMIT 20';
    }
  }
  else{
    if (searchTerm && avgcost) {
      sql = 'SELECT * FROM restaurants WHERE Cuisines LIKE ? AND AverageCostForTwo < ?';
      params = [`%${searchTerm}%`, avgcost];
    } else if (searchTerm) {
      sql = 'SELECT * FROM restaurants WHERE Cuisines LIKE ?';
      params = [`%${searchTerm}%`];
    } else if (avgcost) {
      sql = 'SELECT * FROM restaurants WHERE AverageCostForTwo < ?';
      params = [avgcost];
    } else {
      sql = 'SELECT * FROM restaurants LIMIT 20';
    }
  }

  connection.query(sql, params, (err, results) => {
    if (err) {
      console.error('Error searching for restaurants:', err);
      return res.status(500).send('Error searching for restaurants');
    }

    if (results.length === 0) {
      return res.status(404).sendFile(path.join(__dirname, 'views', 'not-found.html'));
    } else {
      return res.json(results);
    }
  });
});

app.get('/restaurants', (req, res) => {
  const page = req.query.page || 1;
  const perPage = 20;
  const offset = (page - 1) * perPage;

  const sql = `SELECT * FROM restaurants LIMIT ?, ?`;
  connection.query(sql, [offset, perPage], (err, results) => {
    if (err) {
      console.error('Error fetching restaurants:', err);
      return res.status(500).send('Error fetching restaurants');
    }

    res.json(results);
  });
});

app.get('/restaurant', (req, res) => {
  const restaurantId = req.query.id;

  if (!restaurantId) {
    return res.status(400).send('Restaurant ID is required');
  }

  const sql = 'SELECT * FROM restaurants WHERE RestaurantID = ?';
  connection.query(sql, [restaurantId], (err, results) => {
    if (err) {
      console.error('Error fetching restaurant details:', err);
      return res.status(500).send('Error fetching restaurant details');
    }

    if (results.length === 0) {
      res.status(404).sendFile(path.join(__dirname, 'views', 'not-found.html'));
    } else {
      res.sendFile(path.join(__dirname, 'views', 'restaurant.html'));
    }
  });
});

app.get('/restaurant/details', (req, res) => {
  const restaurantId = req.query.id;

  if (!restaurantId) {
    return res.status(400).send('Restaurant ID is required');
  }

  const sql = 'SELECT * FROM restaurants WHERE RestaurantID = ?';
  connection.query(sql, [restaurantId], (err, results) => {
    if (err) {
      console.error('Error fetching restaurant details:', err);
      return res.status(500).send('Error fetching restaurant details');
    }

    if (results.length === 0) {
      res.status(404).sendFile(path.join(__dirname, 'views', 'not-found.html'));
    } else {
      res.json(results[0]);
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
