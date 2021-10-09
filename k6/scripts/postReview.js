import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  vus: 1000,
  duration: '60s',
  thresholds: {
    http_req_failed: ['rate<0.01'], // http errors should be less than 1%
    http_req_duration: ['p(80) < 400', 'p(90) < 800', 'p(95) < 2000'], // 95% of requests should be below 200ms
  },
};

export default function postReview() {
  const url = 'http://localhost:8080/reviews';
  const payload = JSON.stringify({
    product_id: 1,
    rating: 5,
    summary: 'this is the summary',
    body: 'this is the body',
    recommend: true,
    name: 'reviewer name',
    email: 'reviewer email',
    photos: ['https://pbs.twimg.com/profile_images/653700295395016708/WjGTnKGQ.png'],
    characteristics: {
      100: 4,
      200: 5,
    },
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post(url, payload, params);
  check(res, {
    'status is 201': (r) => r.status === 201,
  });
  sleep(1);
}
