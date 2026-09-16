// Minimal fixed-window rate limiter, in-memory, zero dependencies.
//
// Counters live per server instance: on serverless each instance keeps its
// own window, so treat limits as a floor against naive abuse rather than a
// hard global guarantee. Swap for a shared store (e.g. @upstash/ratelimit)
// if strict limits are ever needed.

import { fail } from './api-response.js'

const WINDOW_MS = 60_000
const buckets = new Map() // "route:ip" -> { count, windowStart }

/* How many proxies sit between this app and the real client.

   x-forwarded-for is a chain that each proxy appends to, so everything to the
   LEFT of your own edge arrived from the caller and is spoofable: send
   "x-forwarded-for: <random>" per request and you get a fresh bucket every
   time, which defeats the limit entirely. Only entries your own
   infrastructure appended can be trusted.

   The correct number is a property of the deployment, not of this code, and
   getting it wrong is costly in both directions — too low and the limit is
   bypassable, too high and every visitor collapses into one bucket and starts
   429ing each other. So it is configuration, and the default preserves the
   behaviour this has always had rather than silently guessing:

     unset / 0  left-most entry — correct only if your edge OVERWRITES the
                header (Vercel does this), spoofable if it appends.
     1          skip the last hop: your edge appended one entry.
     n          skip n hops.

   Set RATE_LIMIT_TRUSTED_HOPS once you know which your platform does. */
const TRUSTED_HOPS = Math.max(0, Number(process.env.RATE_LIMIT_TRUSTED_HOPS) || 0)

function clientIp(request) {
  const fwd = request.headers.get('x-forwarded-for')
  if (fwd) {
    const chain = fwd
      .split(',')
      .map((part) => part.trim())
      .filter(Boolean)

    if (chain.length) {
      // Count in from the right, which is the end this app can actually vouch
      // for. 0 hops keeps the original left-most read.
      const index = TRUSTED_HOPS === 0 ? 0 : Math.max(0, chain.length - 1 - TRUSTED_HOPS)
      return chain[index]
    }
  }
  return request.headers.get('x-real-ip') || 'unknown'
}

// Throws a 429 Response (caught by guard) once `limit` requests per minute
// is exceeded for this route+IP. Call first thing inside guard():
//   enforceRateLimit(request, 'slots', 60)
export function enforceRateLimit(request, routeKey, limit) {
  const now = Date.now()
  const key = `${routeKey}:${clientIp(request)}`

  let bucket = buckets.get(key)
  if (!bucket || now - bucket.windowStart >= WINDOW_MS) {
    bucket = { count: 0, windowStart: now }
    buckets.set(key, bucket)
  }
  bucket.count += 1

  // Opportunistic sweep so the map cannot grow without bound.
  if (buckets.size > 10_000) {
    for (const [k, v] of buckets) {
      if (now - v.windowStart >= WINDOW_MS) buckets.delete(k)
    }
  }

  if (bucket.count > limit) {
    throw fail(429, 'Too many requests — please try again shortly')
  }
}
