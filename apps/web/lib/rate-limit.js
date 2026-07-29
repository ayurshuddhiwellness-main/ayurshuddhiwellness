// Minimal fixed-window rate limiter, in-memory, zero dependencies.
//
// Counters live per server instance: on serverless each instance keeps its
// own window, so treat limits as a floor against naive abuse rather than a
// hard global guarantee. Swap for a shared store (e.g. @upstash/ratelimit)
// if strict limits are ever needed.

import { fail } from './api-response'

const WINDOW_MS = 60_000
const buckets = new Map() // "route:ip" -> { count, windowStart }

function clientIp(request) {
  const fwd = request.headers.get('x-forwarded-for')
  if (fwd) return fwd.split(',')[0].trim()
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
