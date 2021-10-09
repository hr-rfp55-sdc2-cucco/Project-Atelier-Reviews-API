import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 1000,
  duration: '60s',
  thresholds: {
    http_req_failed: ['rate<0.01'], // http errors should be less than 1%
    http_req_duration: ['p(80) < 400', 'p(90) < 800', 'p(95) < 2000'], // 95% of requests should be below 200ms
  },
};

// Test for a random ID in the last 10% of table
export default function testIdLast10PercSlow() {
  const maxId = 1000011;
  const idLast10Perc = Math.floor(Math.random() * (maxId * 0.1)) + (Math.floor(maxId * 0.9) + 1);
  const res = http.get(`http://localhost:8080/reviews?product_id=${idLast10Perc}`);
  check(res, {
    'is status 200': (r) => r.status === 200,
  });
  sleep(1);
}

// CLI command: k6 run k6/scripts/<script>.js
