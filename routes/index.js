const express = require('express');
const router = express.Router();
const pg = require('pg');
const path = require('path');
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/todo';
var bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


module.exports = router;


/* GET home page. */

router.post('/api/v1/product', (req, res, next) => {
  const results = [];
  // Grab data from http request
  const data = {name: req.body.name, description: req.body.description, precio_unitario: req.body.price, stock: req.body.stock,
    delivery_date: req.body.delivery_date, start_date: req.body.start_date, category: req.body.category,};
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Insert Data
    client.query('INSERT INTO product(name, description, precio_unitario, stock, delivery_date, limit_date, id_category ) values($1, $2, $3, $4, $5, $6, $7)',
    [data.name, data.description, data.precio_unitario, data.stock, data.delivery_date, data.start_date, data.category]);
    return res.json(results);
    // SQL Query > Select Data
  });
});

router.post('/api/v1/r', (req, res, next) => {
  const results = [];
  // Grab data from http request
  const data = {name: req.body.name, email: req.body.email, password: req.body.password};
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Insert Data
    client.query('INSERT INTO user_(name, email, password) values($1, $2, $3)',
    [data.name, data.email, data.password]);
    // SQL Query > Select Data
    const query = client.query('SELECT * FROM product');
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});

router.get('/api/v1/todos', (req, res, next) => {
  const results = [];
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Select Data
    const query = client.query('SELECT * FROM user_ ');
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});

router.put('/api/v1/todos/:todo_id?', (req, res, next) => {
  const results = [];
  // Grab data from the URL parameters
  const id = req.params.todo_id;
  // Grab data from http request
  const data = {text: req.body.text, complete: req.body.complete};
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Update Data
    client.query('UPDATE items SET text=($1), complete=($2) WHERE id=($3)',
    [data.text, data.complete, id]);
    // SQL Query > Select Data
    const query = client.query("SELECT * FROM items ORDER BY id ASC");
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', function() {
      done();
      return res.json(results);
    });
  });
});

router.delete('/api/v1/todos/:todo_id?', (req, res, next) => {
  const results = [];
  // Grab data from the URL parameters
  const id = req.params.todo_id;
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Delete Data
    client.query('DELETE FROM items WHERE id=($1)', [id]);
    // SQL Query > Select Data
    var query = client.query('SELECT * FROM items ORDER BY id ASC');
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});

router.post('/api/v1/login', (req, res, next) => {
  // Grab data from http request
  const results = [];
  const data = {user_name: req.body.user_name, password: req.body.password};
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.json({success: false, data: err});
    }
    const query = client.query('SELECT id_user, user_name, password FROM user_ where user_name = $1 and password = $2', 
    [data.user_name, data.password]);
   
    query.on('row', (row) => {
      results.push(row);
    });
    query.on('end', () => {
      done();
      if(results[0] ==null) {
        return res.json(results);      
       } else {
         return res.json(results)
  }
    });

  });
});



