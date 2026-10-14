// Not under /api: that prefix is routed to the backend.
export function GET() {
  return Response.json({ status: "ok" });
}
