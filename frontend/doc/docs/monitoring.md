# 📊 Monitoring Architecture (Prometheus & Grafana)

This document explains the technical implementation of the monitoring stack for both the Next.js frontend and the FastAPI backend.

---

## 🏗️ Architecture Overview

The monitoring system consists of four main components orchestrated via Docker Compose:

1.  **Next.js Frontend**: Exposes metrics via `prom-client`.
2.  **FastAPI Backend**: Exposes metrics via `prometheus-fastapi-instrumentator`.
3.  **Prometheus**: Scrapes metrics from both services and stores them as time-series data.
4.  **Grafana**: Visualizes the data stored in Prometheus through pre-configured dashboards.

---

## 🌐 Frontend Implementation (Next.js)

### 1. Metrics Registry
We use a centralized registry to ensure metrics are consistent across the application and persist during development hot-reloads.

**File**: `frontend/src/lib/metrics.ts`
```ts
import client from "prom-client";

// Global registry to prevent duplicates in dev mode
const register = new client.Registry();
client.collectDefaultMetrics({ register });

export const metrics = {
  httpRequestsTotal: new client.Counter({
    name: "http_requests_total",
    help: "Total number of HTTP requests",
    labelNames: ["method", "route", "status_code"],
    registers: [register],
  }),
  // ... other metrics
};

export default register;
```

### 2. Automatic Instrumentation
Next.js **Middleware** is used to intercept every request and record performance data without manual boilerplace in every route.

**File**: `frontend/src/middleware.ts`
```ts
export function middleware(request: NextRequest) {
  const start = Date.now();
  const response = NextResponse.next();
  const duration = (Date.now() - start) / 1000;

  metrics.httpRequestsTotal.inc({ 
    method: request.method, 
    route: request.nextUrl.pathname, 
    status_code: response.status 
  });
  
  return response;
}
```

### 3. Prometheus Scrape Endpoint
Prometheus pulls data from this route.

**File**: `frontend/src/app/api/metrics/route.ts`
Exposes the internal registry as text at `/api/metrics`.

---

## ⚙️ Backend Implementation (FastAPI)

The backend is instrumented using the `prometheus-fastapi-instrumentator` package.

**File**: `backend/main.py`
```python
from prometheus_fastapi_instrumentator import Instrumentator

app = FastAPI()

# Instrument and expose /metrics
Instrumentator().instrument(app).expose(app)
```

---

## 🛠️ Infrastructure Setup

### Docker Compose
We use a dedicated bridge network for monitoring to allow service discovery by container name.

**File**: `docker-compose.yml`
```yaml
services:
  prometheus:
    image: prom/prometheus
    volumes:
      - ./monitoring/prometheus/prometheus.yml:/etc/prometheus/prometheus.yml

  grafana:
    image: grafana/grafana
    ports: ["3001:3000"]
    volumes:
      - ./monitoring/grafana/provisioning:/etc/grafana/provisioning
```

### Grafana Auto-Provisioning
Grafana is configured to automatically set up the Prometheus datasource and the "FinRisk Health Dashboard" on startup.

*   **Datasource**: `monitoring/grafana/provisioning/datasources/datasource.yml`
*   **Dashboards**: `monitoring/grafana/provisioning/dashboards/`

---

## 🚀 How to Access

1.  **Start the stack**: `docker-compose up --build`
2.  **Grafana**: [http://localhost:3001](http://localhost:3001) (User: `admin`, Pass: `admin`)
3.  **Prometheus Raw**: [http://localhost:9090](http://localhost:9090)
4.  **Frontend Metrics**: [http://localhost:3000/api/metrics](http://localhost:3000/api/metrics)
5.  **Backend Metrics**: [http://localhost:8000/metrics](http://localhost:8000/metrics)
