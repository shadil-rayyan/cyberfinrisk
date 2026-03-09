import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { metrics } from './lib/metrics';

export const runtime = 'nodejs';

export function middleware(request: NextRequest) {
    const start = Date.now();
    const response = NextResponse.next();

    // We capture metrics after the response is generated
    // Note: Standard Next.js middleware is edge/serverless-lite and can't easily 
    // write to a global registry if it's running in an edge runtime.
    // However, in a standard 'next start' (Node.js) it works fine.

    const duration = (Date.now() - start) / 1000;
    const { pathname } = request.nextUrl;
    const method = request.method;

    // Filter out static assets
    if (!pathname.includes('.') && !pathname.startsWith('/_next')) {
        response.headers.set('X-Response-Time', `${duration}s`);

        // Increment metrics
        // We use a simplified status code as middleware can't always know the final status 
        // before the page actually renders, but this gives us a good baseline.
        metrics.httpRequestsTotal.inc({ method, route: pathname, status_code: response.status });
        metrics.httpRequestDuration.observe({ method, route: pathname, status_code: response.status }, duration);
    }

    return response;
}

export const config = {
    matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};
