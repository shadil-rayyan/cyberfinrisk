import { NextResponse } from "next/server";
import { register } from "@/lib/metrics";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const metricsContent = await register.metrics();
    return new NextResponse(metricsContent, {
      headers: {
        "Content-Type": "text/plain; version=0.0.4; charset=utf-8",
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error) {
    return new NextResponse("Error generating metrics", { status: 500 });
  }
}
