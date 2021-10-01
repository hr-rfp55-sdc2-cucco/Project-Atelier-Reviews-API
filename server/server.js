const express = require('express');
const db = require('../database/index');

const app = express();
const port = 8080;

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
  const reviewsParams = [page, count, sort, productId];
  db.getReviews(reviewsParams, (err, result) => {
    if (err) {
      res.status(404).send(err);
    } else {
      res.status(200).send(result.rows);
    }
  });
});

app.get('/reviews/meta', (req, res) => {
  db.getReviewMeta((err, result) => {
    if (err) {
      res.status(404).send(err);
    } else {
      res.status(200).send(result.rows);
    }
  });
});

app.post('/reviews', (req, res) => {
  db.postReview((err, result) => {
    if (err) {
      res.status(404).send(err);
    } else {
      res.status(201).send(result.rows);
    }
  });
});

app.put('/reviews/:review_id/helpful', (req, res) => {
  db.updateReview((err, result) => {
    if (err) {
      res.status(404).send(err);
    } else {
      res.status(204).send(result.rows);
    }
  });
});

app.put('/reviews/:review_id/report', (req, res) => {
  db.reportReview((err, result) => {
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
