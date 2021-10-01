const { Pool } = require('pg');

const pool = new Pool({
  user: 'bandito',
  host: 'localhost',
  database: 'sdc_reviews',
  port: 5432,
});

const getHome = (callback) => {
  const psqlStatement = 'SELECT NOW()';
  pool.query(psqlStatement, callback);
};

const getReviews = (reviewsParams, callback) => {
  console.log(reviewsParams);
  const psqlStatement = 'SELECT NOW()';
  pool.query(psqlStatement, callback);
};

const getReviewMeta = (callback) => {
  const psqlStatement = 'SELECT NOW()';
  pool.query(psqlStatement, callback);
};

const postReview = (callback) => {
  const psqlStatement = 'SELECT NOW()';
  pool.query(psqlStatement, callback);
};

const updateReview = (callback) => {
  const psqlStatement = 'SELECT NOW()';
  pool.query(psqlStatement, callback);
};

const reportReview = (callback) => {
  const psqlStatement = 'SELECT NOW()';
  pool.query(psqlStatement, callback);
};

module.exports = {
  getHome,
  getReviews,
  getReviewMeta,
  postReview,
  updateReview,
  reportReview,
};

// module.exports = {
//   query: (text, params, callback) => pool.query(text, params, callback),
// };

// const query = (text, params, callback) => {
//   const start = Date.now();
//   return pool.query(text, params, (err, res) => {
//     const duration = Date.now() - start;
//     console.log('executed query', { text, duration, rows: res.rowCount });
//     callback(err, res);
//   });
// },

// pool.query('SELECT NOW()', (err, res) => {
//   console.log('pool error:', err);
//   console.log('pool result:', res);
//   pool.end();
// });
