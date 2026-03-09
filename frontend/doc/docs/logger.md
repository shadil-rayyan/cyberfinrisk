
# 📊 Logging & Metrics with Pino, Prometheus, and Grafana

This project integrates **Pino** for structured logging and **Prometheus + Grafana** for metrics monitoring. Together, they give deep insights into your application’s health and performance.

---

## 🔥 Why This Setup?

* **Pino** → Super-fast JSON logger for structured logs.
* **Prometheus** → Collects application metrics (CPU, memory, HTTP requests, etc.).
* **Grafana** → Visualizes Prometheus metrics in beautiful dashboards.

---

## 📝 Logging with Pino

We use `pino` in `lib/logger.ts`:

```ts title="lib/logger.ts"
import pino from "pino";

const isProd = process.env.NODE_ENV === "production";

const logger = pino(
  isProd
    ? { level: "info" } // JSON structured logs in production
    : {
        transport: {
          target: "pino-pretty",
          options: { colorize: true },
        },
        level: "debug", // verbose in development
      }
);

export default logger;
```

### Example Usage

```ts title="app/page.tsx"
import logger from "@/lib/logger";

export default function Page() {
  logger.info("Home page rendered");
  return <h1>Hello World</h1>;
}
```

* In **development**, logs appear colorized and human-readable.
* In **production**, logs are structured JSON (machine-parsable for log collectors).

---

## 📈 Metrics with Prometheus

Metrics are exposed at `/api/metrics`.

```ts title="app/api/metrics/route.ts"
import { NextResponse } from "next/server";
import client from "prom-client";

// Collect default Node.js metrics (CPU, memory, event loop)
client.collectDefaultMetrics();

// Custom histogram for request durations
const httpDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.1, 0.3, 1.5, 10],
});
client.register.registerMetric(httpDuration);

export async function GET() {
  return new NextResponse(await client.register.metrics(), {
    headers: { "Content-Type": client.register.contentType },
  });
}
```

### Example Response (`/api/metrics`)

```
# HELP process_cpu_user_seconds_total Total user CPU time spent in seconds.
# TYPE process_cpu_user_seconds_total counter
process_cpu_user_seconds_total 2.15

# HELP http_request_duration_seconds Duration of HTTP requests in seconds
# TYPE http_request_duration_seconds histogram
http_request_duration_seconds_bucket{le="0.1"} 3
http_request_duration_seconds_bucket{le="0.3"} 8
http_request_duration_seconds_sum 1.67
http_request_duration_seconds_count 10
```

---

## 📡 Setting up Prometheus

1. **Install Prometheus** (local or via Docker):

```bash
docker run -p 9090:9090 prom/prometheus
```

2. **Configure Prometheus** (`prometheus.yml`):

```yaml
scrape_configs:
  - job_name: "nextjs-app"
    scrape_interval: 5s
    static_configs:
      - targets: ["host.docker.internal:3000"] # Adjust if deployed
```

Here, Prometheus scrapes `http://localhost:3000/api/metrics`.

---

## 📊 Visualizing with Grafana

1. **Run Grafana**:

```bash
docker run -d -p 3001:3000 grafana/grafana
```

2. **Add Prometheus Data Source**:

   * Go to Grafana UI (`http://localhost:3001`)
   * Add **Prometheus** as a data source (`http://host.docker.internal:9090`)

3. **Import Dashboard**:

   * Use prebuilt Prometheus dashboards (e.g., [Node.js metrics](https://grafana.com/grafana/dashboards/8919/))
   * Or create custom charts (e.g., request latency, CPU usage, memory).

---

## ☁️ Cloud & Serverless Compatibility (Netlify/Cloudflare)

The logger is specifically configured to work in restrictive serverless/edge environments:
*   **Edge Registry**: Automatically avoids using `worker_threads` (via `pino-pretty`) in production, as these are blocked in most Edge runtimes (Cloudflare Workers, Netlify Edge).
*   **Standard Streams**: Logs are written to `stdout`, which is standardly captured by Netlify/Cloudflare log forwarders.
*   **Structured Output**: Every log line is valid JSON, ensuring compatibility with external log aggregators like Datadog, Logtail, or Cloudwatch.

---

## 🐍 Backend Logging (Python/FastAPI)

The Python backend uses a custom JSON formatter to match the frontend's observability pattern.

**File**: `backend/logging_config.py`
```python
# Logs are output as JSON by default in production
# Toggle via LOG_FORMAT=TEXT if human-readable logs are needed
setup_logging()
```

This ensures that regardless of which service generates a log, the format remains consistent for centralized analysis.

---

## ✅ Putting It All Together

* **Pino** → Structured logs (`info`, `warn`, `error`) for debugging & observability.
* **Prometheus** → Collects numerical metrics from `/api/metrics`.
* **Grafana** → Turns metrics into dashboards (performance, errors, request times).

-