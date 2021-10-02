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
  // console.log('getReviews params:', params);

  const sortOptions = { helpful: 'helpfulness', newest: 'date', relevant: 'review_id' };
  const sortMethod = sortOptions[params.sort];
  const skipRows = (params.page - 1) * params.count;
  const countRows = params.count;
  const queryParams = [params.productId, sortMethod, skipRows, countRows];

  // console.log('getReviews queryParams:', queryParams);

  const psqlStatement = `SELECT
  reviews.id AS review_id,
  reviews.rating,
  reviews.summary,
  reviews.recommend,
  CASE WHEN reviews.response = 'null' THEN NULL ELSE reviews.response END as response,
  reviews.body,
  reviews.date,
  reviews.reviewer_name,
  reviews.helpfulness,
  COALESCE(
    JSON_AGG(
      json_build_object(
        'id', reviews_photos.id,
        'url', reviews_photos.url)
      ORDER BY reviews_photos.id ASC
      )
    FILTER (WHERE reviews_photos.id IS NOT NULL)
    , '[]')
    AS photos
  FROM reviews
  LEFT JOIN reviews_photos
  ON reviews.id = reviews_photos.review_id
  WHERE reviews.product_id = $1
  GROUP BY reviews.id
  ORDER BY $2 DESC
  OFFSET $3 ROWS
  FETCH NEXT $4 ROWS ONLY
  `;
  pool.query(psqlStatement, queryParams, callback);
};

const getReviewMetaRatings = (params) => {
  const psqlStatement = `SELECT
  json_object_agg(
    to_char(results.rating, 'FM9'),
    to_char(results.count, 'FM9')) AS ratings
  FROM
  (SELECT reviews.rating,
  COUNT(*)
  FROM reviews
  WHERE product_id = ${params[0]}
  GROUP BY 1
  ORDER BY 1) results
  `;
  return pool.query(psqlStatement);
};

const getReviewMetaRecs = (params) => {
  const psqlStatement = `SELECT
  json_build_object(
  'false', to_char(SUM(CASE WHEN "recommend" = false THEN 1 ELSE 0 END), 'FM9'),
  'true', to_char(SUM(CASE WHEN "recommend" = true THEN 1 ELSE 0 END), 'FM9')
  ) AS recommended
  FROM reviews
  WHERE reviews.product_id = ${params[0]}
  GROUP BY reviews.product_id
  `;
  return pool.query(psqlStatement);
};

const getReviewMetaChar = (params) => {
  const psqlStatement = `SELECT json_object_agg(results.name, results.json_build_object) AS characteristics FROM
  (SELECT
  characteristics.product_id as product_id,
  characteristics.name,
  json_build_object('id', characteristics.id, 'value', to_char(AVG(characteristic_reviews.value), 'FM9.0000000000000000'))
  FROM characteristics
  INNER JOIN characteristic_reviews
  ON characteristics.id = characteristic_reviews.characteristic_id
  WHERE characteristics.product_id = ${params[0]}
  GROUP BY
  characteristics.product_id,
  characteristics.id) results
  `;
  return pool.query(psqlStatement);
};

const postReview = (params, callback) => {
  console.log('postReview params', params);
  // reviews (product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness)

  const psqlStatement = `INSERT INTO
  reviews
  VALUES (5380375, ${params.product_id}, ${params.rating}, NOW(), ${params.summary}, ${params.body}, ${params.recommend}, false, ${params.name}, ${params.email}, null, 0)
  `;
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
