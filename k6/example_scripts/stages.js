import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '3s', target: 5 },
    { duration: '1s', target: 2 },
    { duration: '2s', target: 0 },
  ],
};

export default function () {
  const res = http.get('https://httpbin.org/');
  check(res, { 'status was 200': (r) => r.status === 200 });
  sleep(1);
}
