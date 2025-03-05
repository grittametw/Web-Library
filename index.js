const express = require('express')
const cors  = require('cors')
const mysql = require('mysql2')

const database = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'library_db',
});

const app = express()
app.use(cors())
app.use(express.json())

app.listen(3000, function () {
    console.log("Server listening on port: 3000")
})

app.get('/book', function (req, res, next) {
  database.query(
    'SELECT * FROM `book`',
    function(err, results, fields) {
      res.json(results);
    }
  );
})

app.get('/book/:id', function (req, res, next) {
  const id = req.params.id;
  database.query(
    'SELECT * FROM `book` WHERE `id` = ?',
    [id],
    function(err, results) {
      res.json(results);
    }
  );
})

app.post('/book', function (req, res, next) {
  database.query(
    'INSERT INTO `book`(`name`, `author`, `img`, `story`) VALUES (?, ?, ?)',
    [req.body.name, req.body.author, req.body.img],
    function(err, results) {
      res.json(results);
    }
  );
})

app.put('/book', function (req, res, next) {
  database.query(
    'UPDATE `book` SET `name` = ?, `author` = ?, `img` = ?, `story`= ? WHERE id = ?',
    [req.body.name, req.body.author, req.body.img, req.body.id],
    function(err, results) {
      res.json(results);
    }
  );
})

app.delete('/book', function (req, res, next) {
  database.query(
    'DELETE FROM `book` WHERE id = ?',
    [req.body.id],
    function(err, results) {
      res.json(results);
    }
  );
})