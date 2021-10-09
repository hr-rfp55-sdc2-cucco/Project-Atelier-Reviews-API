import http from 'k6/http';
import { check, sleep } from 'k6';

// Low RPS
// Use duration 60s to ensure data is sent to New Relic
// Use duration over iterations b/c can't specify time with iterations; we want 60s
export const options = {
  vus: 10,
  duration: '60s',
};

// // Mid RPS
// export const options = {
//   stages: [
//     { duration: '10s', target: 20 }, // below normal load
//     { duration: '20s', target: 40 }, // normal load
//     { duration: '10s', target: 60 }, // around the breaking point
//     { duration: '10s', target: 80 }, // beyond the breaking point
//     { duration: '10s', target: 0 }, // taper down
//   ],
// };

// // High RPS
// export const options = {
//   stages: [
//     { duration: '10s', target: 100 }, // below normal load
//     { duration: '20s', target: 200 }, // normal load
//     { duration: '10s', target: 300 }, // around the breaking point
//     { duration: '10s', target: 400 }, // beyond the breaking point
//     { duration: '20s', target: 0 }, // taper down
//   ],
// };

// Test for a random ID
// export default function testRandomId() {
//   const maxId = 1000011;
//   const randomId = Math.floor(Math.random() * maxId) + 1;
//   http.get(`http://localhost:8080/reviews?product_id=${randomId}`);
//   sleep(1);
// }

// Test for a random ID in the last 10% of table
export default function testIdLast10PercSlow() {
  const maxId = 1000011;
  const idLast10Perc = Math.floor(Math.random() * (maxId * 0.1)) + (Math.floor(maxId * 0.9) + 1);
  const res = http.get(`http://localhost:8080/reviews/meta?product_id=${idLast10Perc}`);
  check(res, {
    'is status 200': (r) => r.status === 200,
  });
  sleep(1);
}

// CLI command: k6 run k6/scripts/<script>.js
