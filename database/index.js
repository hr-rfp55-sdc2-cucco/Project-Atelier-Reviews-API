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
  const sortOptions = { helpful: 'helpfulness', newest: 'date', relevant: 'review_id' };
  const sortMethod = sortOptions[params.sort];
  const skipRows = (params.page - 1) * params.count;
  const countRows = params.count;
  const queryParams = [params.productId, sortMethod, skipRows, countRows];

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
    AND reviews.reported = false
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
    to_char(results.count, 'FM9999999')) AS ratings
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
  'false', to_char(SUM(CASE WHEN "recommend" = false THEN 1 ELSE 0 END), 'FM9999999'),
  'true', to_char(SUM(CASE WHEN "recommend" = true THEN 1 ELSE 0 END), 'FM9999999')
  ) AS recommended
  FROM reviews
  WHERE reviews.product_id = ${params[0]}
  GROUP BY reviews.product_id
  `;

  return pool.query(psqlStatement);
};

const getReviewMetaChar = (params) => {
  const psqlStatement = `SELECT
  json_object_agg(results.name, results.json_build_object) AS characteristics FROM
  (SELECT
  characteristics.product_id as product_id,
  characteristics.name,
   json_build_object(
     'id', MAX(characteristics.id),
     'value', to_char(AVG(characteristic_reviews.value), 'FM9.0000000000000000')
   )
  FROM characteristics
  INNER JOIN characteristic_reviews
  ON characteristics.id = characteristic_reviews.characteristic_id
  WHERE characteristics.product_id = ${params[0]}
  GROUP BY
  characteristics.product_id,
  characteristics.name) results
  `;

  return pool.query(psqlStatement);
};

const postReviewPhotos = (reviewId, photos) => {
  if (photos === undefined || photos.length === 0) {
    return null;
  }

  const photosSQL = photos.map((url, index) => {
    if (index === photos.length - 1) {
      return `(${reviewId}, '${url}')`;
    }
    return `(${reviewId}, '${url}'), `;
  }).join(' ');

  const psqlStatement = `INSERT INTO
  reviews_photos (review_id, url)
  VALUES ${photosSQL};`;

  return pool.query(psqlStatement);
};

const postReviewCharReviews = (reviewId, characteristicEntries, characteristicIds) => {
  const characteristicReviewsSQL = characteristicEntries.map((characteristic, index) => {
    if (index === characteristicEntries.length - 1) {
      return `(${characteristicIds[index].id}, ${reviewId}, ${characteristic[1]})`;
    }
    return `(${characteristicIds[index].id}, ${reviewId}, ${characteristic[1]}), `;
  }).join(' ');

  const psqlStatement = `INSERT INTO
  characteristic_reviews (characteristic_id, review_id, value)
  VALUES ${characteristicReviewsSQL}
  RETURNING id
  `;

  return pool.query(psqlStatement);
};

const postReviewCharacteristics = (productId, reviewId, characteristics) => {
  const characteristicOptions = [
    'Width',
    'Quality',
    'Fit',
    'Comfort',
    'Length',
    'Size',
  ];

  if (characteristics === undefined
    || Object.values(characteristics).length === 0
    || Object.values(characteristics).length > characteristicOptions.length) {
    return null;
  }

  const characteristicEntries = Object.entries(characteristics);
  const characteristicsSQL = characteristicEntries.map((characteristic, index) => {
    // Pick a random characteristic to populate, ensuring no duplicates
    // (Because the API specification given doesn't make sense!)
    const randomIndex = Math.floor(Math.random() * characteristicOptions.length);
    const randomCharacteristic = characteristicOptions.splice(randomIndex, 1)[0];
    if (index === characteristicEntries.length - 1) {
      return `(${productId}, '${randomCharacteristic}')`;
    }
    return `(${productId}, '${randomCharacteristic}'), `;
  }).join(' ');

  const psqlStatement = `INSERT INTO
  characteristics (product_id, name)
  VALUES ${characteristicsSQL}
  RETURNING id
  `;

  return pool.query(psqlStatement)
    .then((result) => postReviewCharReviews(reviewId, characteristicEntries, result.rows));
};

const postReview = (params) => {
  const paramsArray = [
    params.product_id,
    params.rating,
    params.summary,
    params.body,
    params.recommend,
    params.name,
    params.email,
  ];

  const psqlStatementArray = `INSERT INTO
  reviews (product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness)
  VALUES ($1, $2, NOW(), $3, $4, $5, false, $6, $7, null, 0)
  RETURNING id
  `;

  return pool.query(psqlStatementArray, paramsArray)
    .then((result) => {
      const reviewId = result.rows[0].id;
      return Promise.all([
        postReviewPhotos(reviewId, params.photos),
        postReviewCharacteristics(params.product_id, reviewId, params.characteristics),
      ]);
    });
};

const markHelpful = (reviewId) => {
  const psqlStatement = `UPDATE reviews
  SET "helpfulness" = CASE
    WHEN helpfulness IS NULL THEN 1
    ELSE helpfulness + 1
    END
  WHERE id = ${reviewId}
  RETURNING id
  `;

  return pool.query(psqlStatement)
    .then((result) => {
      // If no rows were updated, the row doesn't exist
      if (result.rows.length === 0) {
        throw new Error('Error: Could not mark the review as helpful.');
      }
      return result;
    });
};

const reportReview = (reviewId) => {
  const psqlStatement = `UPDATE reviews
  SET "reported" = true
  WHERE id = ${reviewId}
  RETURNING id
  `;

  return pool.query(psqlStatement)
    .then((result) => {
      // If no rows were updated, the row doesn't exist
      if (result.rows.length === 0) {
        throw new Error('Error: Could not report the review.');
      }
      return result;
    });
};

module.exports = {
  getHome,
  getReviews,
  getReviewMetaChar,
  getReviewMetaRecs,
  getReviewMetaRatings,
  postReview,
  markHelpful,
  reportReview,
};
