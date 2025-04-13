const fs = require('fs');
const csv = require('csv-parser');
const mysql = require('mysql2');

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

  createTableIfNotExists();
});

function createTableIfNotExists() {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS restaurants (
      RestaurantID INT PRIMARY KEY,
      RestaurantName VARCHAR(255),
      CountryCode VARCHAR(255),
      City VARCHAR(255),
      Address VARCHAR(255),
      Locality VARCHAR(255),
      LocalityVerbose VARCHAR(255),
      Longitude DECIMAL(10, 6),
      Latitude DECIMAL(10, 6),
      Cuisines VARCHAR(255),
      AverageCostForTwo INT,
      Currency VARCHAR(100),
      HasTableBooking VARCHAR(10),
      HasOnlineDelivery VARCHAR(10),
      IsDeliveringNow VARCHAR(10),
      SwitchToOrderMenu VARCHAR(10),
      PriceRange INT,
      AggregateRating DECIMAL(3, 1),
      RatingColor VARCHAR(20),
      RatingText VARCHAR(20),
      Votes INT
    )
  `;
  
  connection.query(createTableSQL, (err, result) => {
    if (err) {
      console.error('Error creating table:', err);
      connection.end();
      return;
    }
    console.log('Table created or already exists');
    importCSVData();
  });
}

function importCSVData() {
  const results = [];
  fs.createReadStream('zomato.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      const sql = 'INSERT INTO restaurants (RestaurantID, RestaurantName, CountryCode, City, Address, Locality, LocalityVerbose, Longitude, Latitude, Cuisines, AverageCostForTwo, Currency, HasTableBooking, HasOnlineDelivery, IsDeliveringNow, SwitchToOrderMenu, PriceRange, AggregateRating, RatingColor, RatingText, Votes) VALUES ?';
      const values = results.map(row => [
        parseInt(row['Restaurant ID']),
        row['Restaurant Name'],
        row['Country Code'],
        row['City'],
        row['Address'],
        row['Locality'],
        row['Locality Verbose'],
        parseFloat(row['Longitude']),
        parseFloat(row['Latitude']),
        row['Cuisines'],
        parseInt(row['Average Cost for two']),
        row['Currency'],
        row['Has Table booking'],
        row['Has Online delivery'],
        row['Is delivering now'],
        row['Switch to order menu'],
        parseInt(row['Price range']),
        parseFloat(row['Aggregate rating']),
        row['Rating color'],
        row['Rating text'],
        parseInt(row['Votes'])
      ]);

      connection.query(sql, [values], (err, results) => {
        if (err) {
          console.error('Error inserting data:', err);
          return;
        }
        console.log('Successfully inserted', results.affectedRows, 'rows');
        connection.end(); 
      });
    });
}
