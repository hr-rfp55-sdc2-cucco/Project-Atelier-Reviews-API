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

const getReviews = (params, callback) => {
  console.log('getReviews params:', params);
  const psqlStatement = `SELECT
  reviews.id as review_id,
  reviews.rating,
  reviews.summary,
  reviews.recommend,
  reviews.body,
  to_char(reviews.date at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as date,
  reviews.reviewer_name,
  reviews.helpfulness,
  JSON_AGG(json_build_object('id', reviews_photos.id, 'url', reviews_photos.url)) as photos
  FROM reviews
  LEFT JOIN reviews_photos
  ON reviews.id = reviews_photos.review_id
  WHERE reviews.product_id = ${params[3]}
  GROUP BY reviews.id
  ORDER BY date DESC`;
  pool.query(psqlStatement, callback);
};

const getReviewMeta = (params, callback) => {
  const psqlStatement = `SELECT
  reviews.rating,
  COUNT(*)
  FROM reviews
  WHERE product_id = ${params[0]}
  GROUP BY 1
  ORDER BY 1
  `;
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
