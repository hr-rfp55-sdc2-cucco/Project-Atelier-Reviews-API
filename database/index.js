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
  reviews.response,
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

const getReviewMetaChar = (params, callback) => {
  const psqlStatement = `SELECT json_object_agg(results.name, results.json_build_object) as characteristics from
  (SELECT
  characteristics.product_id as product_id,
  characteristics.name,
  json_build_object('id', characteristics.id, 'value', AVG(characteristic_reviews.value))
  FROM characteristics
  INNER JOIN characteristic_reviews
  ON characteristics.id = characteristic_reviews.characteristic_id
  WHERE characteristics.product_id = ${params[0]}
  GROUP BY
  characteristics.product_id,
  characteristics.id) results
  `;
  pool.query(psqlStatement, callback);
};

const getReviewMetaRecs = (params, callback) => {
  const psqlStatement = `SELECT
  sum(case when "recommend" = false then 1 else 0 end) AS false,
  sum(case when "recommend" = true then 1 else 0 end) AS true
  FROM product
  INNER JOIN reviews
  ON product.id = reviews.product_id
  WHERE product.id = ${params[0]}
  `;
  pool.query(psqlStatement, callback);
};

const getReviewMetaRatings = (params, callback) => {
  const psqlStatement = `SELECT json_object_agg(results.rating, results.count) as ratings from
  (SELECT reviews.rating,
  COUNT(*)
  FROM reviews
  WHERE product_id = ${params[0]}
  GROUP BY 1
  ORDER BY 1) results
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
  getReviewMetaChar,
  getReviewMetaRecs,
  getReviewMetaRatings,
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






// const getReviewMetaChar = (params, callback) => {
//   const psqlStatements = [`SELECT json_object_agg(results.name, results.json_build_object) as characteristics from
//   (SELECT
//   product.id as product_id,
//   characteristics.name,
//   json_build_object('id', characteristics.id, 'value', AVG(characteristic_reviews.value))
//   FROM product
//   INNER JOIN characteristics
//   ON product.id = characteristics.product_id
//   INNER JOIN characteristic_reviews
//   ON characteristics.id = characteristic_reviews.characteristic_id
//   WHERE product.id = ${params[0]}
//   GROUP BY
//   product.id,
//   characteristics.id) results
//   `,

//    `SELECT json_object_agg(results.rating, results.count) as ratings from
//   (SELECT reviews.rating,
//   COUNT(*)
//   FROM reviews
//   WHERE product_id = ${params[0]}
//   GROUP BY 1
//   ORDER BY 1) results
//   `,

//    `
//   SELECT
//   sum(case when "recommend" = false then 1 else 0 end) AS false,
//   sum(case when "recommend" = true then 1 else 0 end) AS true
//   FROM product
//   INNER JOIN reviews
//   ON product.id = reviews.product_id
//   WHERE product.id = ${params[0]}
//   `];

//   const data = []
// pool.query(psqlStatements[0])
// .then((result) => {
//   data.push(result.rows);
//   pool.query(psqlStatements[1])
// })
// .then((result) => {
//   data.push(result.rows);
//   pool.query(psqlStatements[2])
// })
// .then((result) => {
//   data.push(result.rows);
//   console.log(data)
// })
// };
