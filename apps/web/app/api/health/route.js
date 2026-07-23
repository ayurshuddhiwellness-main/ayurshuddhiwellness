// GET /api/health — liveness probe for Cloud Run health checks and a quick
// confirmation that the API layer is reachable. No auth, no Firestore.

export async function GET() {
  return Response.json({ status: 'ok', timestamp: new Date().toISOString() })
}
