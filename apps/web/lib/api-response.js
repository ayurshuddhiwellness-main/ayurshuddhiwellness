// Standard API envelope shared by every route: { success, data, error }.
// Every route returns one of these so the client can rely on a single shape.

export function ok(data = null, init = {}) {
  const { headers, status = 200 } = init
  return Response.json({ success: true, data, error: null }, { status, headers })
}

export function created(data = null) {
  return Response.json({ success: true, data, error: null }, { status: 201 })
}

export function fail(status, error, data = null) {
  return Response.json({ success: false, data, error }, { status })
}

// Wraps a handler body so that:
//  - a thrown Response (e.g. from requireAuth) is returned as-is
//  - any other error becomes a 500 with the envelope shape
// Usage: export async function GET(req) { return guard(() => { ... }) }
export async function guard(fn) {
  try {
    return await fn()
  } catch (err) {
    if (err instanceof Response) return err
    console.error('[api] unhandled error:', err)
    const body = { success: false, data: null, error: 'Internal server error' }
    // In development, surface the real cause so failures are debuggable.
    // Production stays generic so internals are never leaked to clients.
    if (process.env.NODE_ENV !== 'production') {
      body.error = err?.message || String(err)
      body.stack = err?.stack
    }
    return Response.json(body, { status: 500 })
  }
}
