// app/api/metrics/route.ts
import { NextResponse } from "next/server";
import client from "prom-client";
export const dynamic = "force-static";
export const revalidate = false;

// Collect default metrics (CPU, memory, etc.)
client.collectDefaultMetrics();

// Optional: a custom histogram metric
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
