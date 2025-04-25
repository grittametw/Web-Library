import express, { Request, Response } from 'express';
import mysql from 'mysql2';
import cors from 'cors';

const app = express();
const PORT = 3000;

// Enable CORS
app.use(cors());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost', // หรือ 'db' ถ้าใช้ Docker Network
  user: 'root',
  password: '1234',
  database: 'library_db',
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// API endpoint to fetch books
app.get('/api/books', (req: Request, res: Response) => {
  const query = 'SELECT id, name, author, story, image, price, rate FROM books';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).send('Error fetching data');
      return;
    }
    res.json(results);
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});