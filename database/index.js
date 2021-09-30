const { Pool, Client } = require('pg');

const pool = new Pool({
  user: 'bandito',
  host: 'localhost',
  database: 'sdc_reviews',
  port: 5432,
});

pool.query('SELECT NOW()', (err, res) => {
  console.log('pool error:', err);
  console.log('pool result:', res);
  pool.end();
});

const client = new Client({
  user: 'bandito',
  host: 'localhost',
  database: 'sdc_reviews',
  port: 5432,
});

client.connect();
client.query('SELECT NOW()', (err, res) => {
  console.log('client error:', err);
  console.log('client result:', res);
  client.end();
});
