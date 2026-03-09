# ⚡ Professional Load Testing with k6

This project uses **k6** (by Grafana) for professional-grade performance and reliability testing. Load tests are designed to verify that the application can handle expected traffic and maintain performance thresholds.

---

## 🚀 Why k6?

*   **Scriptable in JS**: Write tests in JavaScript.
*   **High Performance**: Written in Go, uses minimal system resources.
*   **Threshold-Driven**: Fail builds if 95th percentile latency is too high or error rates exceed 1%.

---

## 📁 Project Structure

*   **Test Script**: `scripts/load-tests/basic_load_test.js`
*   **Package Script**: `npm run test:load` (inside `frontend/`)

---

## 🏃 Running Tests Locally

### 1. Install k6
Follow the [official k6 installation guide](https://k6.io/docs/getting-started/installation/).
For Linux:
```bash
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6
```

### 2. Execute Load Test
Run the test against your local instances:
```bash
cd frontend
npm run test:load
```

---

## 📊 Understanding the Test Script

The test implements a **Staged Load Pattern**:
1.  **Ramp-up**: 0 → 20 users in 30s.
2.  **Sustain**: 20 users for 1m.
3.  **Ramp-down**: 20 → 0 users in 20s.

### Performance Thresholds
The test will fail if:
*   `http_req_duration`: 95% of requests take longer than **500ms**.
*   `http_req_failed`: Error rate is greater than **1%**.

---

## ☁️ Running on Cloud Infrastructure

To test a deployed environment (e.g., Netlify, Vercel, or AWS), pass the `BASE_URL`:

```bash
k6 run -e BASE_URL=https://your-production-url.com ../scripts/load-tests/basic_load_test.js
```

For advanced CI/CD integration, you can use **k6 Cloud** to execute tests from multiple global regions.
