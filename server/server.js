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
  console.log(req.query);
  const page = req.query.page || 1;
  const count = req.query.count || 5;
  const sort = req.query.sort || 'id';
  const productId = req.query.product_id;
  const params = [page, count, sort, productId];
  db.getReviews(params, (err, result) => {
    if (err) {
      res.status(404).send(err);
    } else {
      // const responseObj = {
      //   product: productId,
      //   page: 0,
      //   count: 100,
      //   results: result.rows,
      // };
      res.status(200).send(result.rows);
    }
  });
});

app.get('/reviews/meta', (req, res) => {
  const productId = req.query.product_id;
  const params = [Number.parseInt(productId, 10)];
  const dbQueries = [db.getReviewMetaRatings, db.getReviewMetaRecs, db.getReviewMetaChar];
  const data = [];
});

app.post('/reviews', (req, res) => {
  const productId = req.query.product_id;
  const rating = req.query.rating;
  const summary = req.query.summary;
  const body = req.query.body;
  const recommend = req.query.recommend;
  const name = req.query.name;
  const email = req.query.email;
  const photos = req.query.photos || [];
  const characteristics = req.query.characteristics;
  const reviewsParams = [productId, rating, summary, body,
    recommend, name, email, photos, characteristics];
  db.postReview(reviewsParams, (err, result) => {
    if (err) {
      res.status(404).send(err);
    } else {
      res.status(201).send(result.rows);
    }
  });
});

app.put('/reviews/:review_id/helpful', (req, res) => {
  const reviewId = req.query.review_id;
  const reviewsParams = [reviewId];
  db.updateReview(reviewsParams, (err, result) => {
    if (err) {
      res.status(404).send(err);
    } else {
      res.status(204).send(result.rows);
    }
  });
});

app.put('/reviews/:review_id/report', (req, res) => {
  const reviewId = req.query.review_id;
  const reviewsParams = [reviewId];
  db.reportReview(reviewsParams, (err, result) => {
    if (err) {
      res.status(404).send(err);
    } else {
      res.status(204).send(result.rows);
    }
  });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
