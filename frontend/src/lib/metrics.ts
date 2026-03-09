import client from "prom-client";

// Use a global to prevent multiple registries in development
const globalForProm = global as unknown as {
    register: client.Registry;
    httpRequestsTotal: client.Counter;
    httpRequestDuration: client.Histogram;
};

export const register = globalForProm.register || new client.Registry();

if (!globalForProm.register) {
    client.collectDefaultMetrics({ register });

    globalForProm.httpRequestsTotal = new client.Counter({
        name: "http_requests_total",
        help: "Total number of HTTP requests",
        labelNames: ["method", "route", "status_code"],
        registers: [register],
    });

    globalForProm.httpRequestDuration = new client.Histogram({
        name: "http_request_duration_seconds",
        help: "Duration of HTTP requests in seconds",
        labelNames: ["method", "route", "status_code"],
        buckets: [0.1, 0.5, 1, 2, 5],
        registers: [register],
    });

    globalForProm.register = register;
}

export const metrics = {
    httpRequestsTotal: globalForProm.httpRequestsTotal,
    httpRequestDuration: globalForProm.httpRequestDuration,
};

export default register;
