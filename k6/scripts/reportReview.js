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

// Test on a POST'ed review not in original test data
export default function testPostedReview() {
  const res = http.put('http://localhost:8080/reviews/5928770/report');
  check(res, {
    'status is 204': (r) => r.status === 204,
  });
  sleep(1);
}
