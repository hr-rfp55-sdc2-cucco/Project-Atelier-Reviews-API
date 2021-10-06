import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 3,
  duration: '3s',
};

// Test for a random ID
// export default function testRandomId() {
//   const maxId = 1000011;
//   const randomId = Math.floor(Math.random() * maxId) + 1;
//   http.get(`http://localhost:8080/reviews?product_id=${randomId}`);
//   sleep(1);
// }

// Test for a random ID in the last 10% of table
export default function testIdLast10Perc() {
  const maxId = 1000011;
  const idLast10Perc = Math.floor(Math.random() * (maxId * 0.1)) + (Math.floor(maxId * 0.9) + 1);
  http.get(`http://localhost:8080/reviews?product_id=${idLast10Perc}`);
  sleep(1);
}

// CLI command: k6 run k6/scripts/<script>.js
