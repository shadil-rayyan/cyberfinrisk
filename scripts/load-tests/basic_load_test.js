import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        { duration: '30s', target: 20 }, // ramp up to 20 users
        { duration: '1m', target: 20 },  // stay at 20 users
        { duration: '20s', target: 0 },  // ramp down to 0 users
    ],
    thresholds: {
        http_req_duration: ['p(95)<500'], // 95% of requests must complete below 500ms
        http_req_failed: ['rate<0.01'],    // less than 1% errors
    },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
    // Test Frontend
    const res = http.get(`${BASE_URL}/`);
    check(res, {
        'status is 200': (r) => r.status === 200,
        'page contains Hello': (r) => r.body.includes('Hello') || r.body.includes('FinRisk'),
    });

    // Small sleep to simulate user behavior
    sleep(1);
}
