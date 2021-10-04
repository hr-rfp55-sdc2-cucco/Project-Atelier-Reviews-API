const express = require('express');
const db = require('../database/index');

const app = express();
const port = 8080;

app.use(express.json());

app.get('/', (req, res) => {
  db.getHome((err, result) => {
    if (err) {
      res.status(404).send(err);
    } else {
      res.status(200).send(result.rows[0].now);
    }
  });
});

app.get('/reviews', (req, res) => {
  // console.log('reviews req.query,', req.query);
  const productId = req.query.product_id;
  const sort = req.query.sort || 'relevant';
  const page = Number.parseInt(req.query.page, 10) || 1;
  const count = Number.parseInt(req.query.count, 10) || 5;

  const paramsObj = {
    productId,
    sort,
    page,
    count,
  };
  // console.log('reviews params,', params);

  db.getReviews(paramsObj, (err, result) => {
    if (err) {
      res.status(404).send(`Error: Could not retrieve reviews. Data received: ${err}`);
    } else {
      const reviews = {
        product: productId,
        page,
        count,
        results: result.rows,
      };
      res.status(200).send(reviews);
    }
  });
});

app.get('/reviews/meta', (req, res) => {
  const productId = req.query.product_id;
  const params = [Number.parseInt(productId, 10)];
  Promise.all([db.getReviewMetaRatings(params),
  db.getReviewMetaRecs(params),
  db.getReviewMetaChar(params)])
    .then((result) => {
      // console.log('result', result[0].rows, result[1].rows, result[2].rows);
      const reviewMeta = {
        product_id: productId,
        ratings: result[0].rows[0].ratings,
        recommended: result[1].rows[0].recommended,
        characteristics: result[2].rows[0].characteristics,
      };
      res.status(200).send(reviewMeta);
    })
    .catch((err) => {
      // console.log('error', err);
      res.status(404).send(`Error: Could not retrieve review metadata. Data received: ${err}`);
    });
});

app.post('/reviews', (req, res) => {
  // console.log('post reviews req.body', req.body);
  if (!req.body) {
    res.status(422).send('Error: Must supply body parameters');
  }
  db.postReview(req.body)
    .then(() => {
      res.status(201).send('Success: Review added.');
    })
    .catch((err) => {
      res.status(404).send(`Error: Could not add the given review. Data received: ${err}`);
    });
});

app.put('/reviews/:review_id/helpful', (req, res) => {
  const reviewId = req.params.review_id;
  // const reviewId = req.query.review_id;
  const reviewsParams = [reviewId];
  db.updateReview(reviewsParams, (err, result) => {
    if (err) {
      res.status(404).send(`Error: Could not mark the review as helpful. Data received: ${err}`);
    } else {
      res.status(204).send(`Success: Review ${reviewId} marked as helpful. Data received: ${result.rows}`);
    }
  });
});

app.put('/reviews/:review_id/report', (req, res) => {
  const reviewId = req.params.review_id;
  // const reviewId = req.query.review_id;
  const reviewsParams = [reviewId];
  db.reportReview(reviewsParams, (err, result) => {
    if (err) {
      res.status(404).send(`Error: Could not report the review. Data received: ${err}`);
    } else {
      res.status(204).send(`Success: Review ${reviewId} reported. Data received: ${result.rows}`);
    }
  });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
