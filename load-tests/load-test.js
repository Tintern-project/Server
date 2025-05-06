import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');

export const options = {
  scenarios: {
    constant_request_rate: {
      executor: 'constant-arrival-rate',
      rate: 50, // 50 RPS
      timeUnit: '1s',
      duration: '10s',
      preAllocatedVUs: 100,
      maxVUs: 200,
    },
  },
  thresholds: {
    'errors': ['rate<0.1'], // Error rate should be less than 10%
    'http_req_duration': ['p(90)<4000'], // 90% of requests should be below 4s
  },
};

const BASE_URL = 'http://localhost:3000/api/v1';

// Health check function
function checkHealth() {
  const healthResponse = http.get(`${BASE_URL}/jobs`, {
    headers: {
      'Accept': 'application/json',
    },
  });
  check(healthResponse, {
    'health check status is 200': (r) => r.status === 200,
  });
  return healthResponse.status === 200;
}

export default function () {
  // First check if the server is healthy
  if (!checkHealth()) {
    console.error('Server health check failed');
    errorRate.add(1);
    return;
  }

  // Test GET /jobs
  const jobsResponse = http.get(`${BASE_URL}/jobs`, {
    headers: {
      'Accept': 'application/json',
    },
  });
  
  check(jobsResponse, {
    'jobs status is 200': (r) => r.status === 200,
    'jobs response is valid': (r) => r.status === 200 && Array.isArray(r.json()),
  }) || errorRate.add(1);

  // Test GET /jobs/unique-filters
  const filtersResponse = http.get(`${BASE_URL}/jobs/unique-filters`, {
    headers: {
      'Accept': 'application/json',
    },
  });
  
  check(filtersResponse, {
    'filters status is 200': (r) => r.status === 200,
    'filters response is valid': (r) => r.status === 200 && r.json() !== null,
  }) || errorRate.add(1);

  // Test POST /jobs/filter with a simple filter
  const filterPayload = JSON.stringify({
    keyword: "",
    country: "",
    city: "",
    role: "",
    industry: "",
    type: ""
  });

  const filterResponse = http.post(`${BASE_URL}/jobs/filter`, filterPayload, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  check(filterResponse, {
    'filter status is 201': (r) => r.status === 201,
    'filter response is valid': (r) => r.status === 201 && Array.isArray(r.json()),
  }) || errorRate.add(1);

  // Add a small random sleep between 0.5 and 1.5 seconds
  sleep(Math.random() * 1 + 0.5);
} 