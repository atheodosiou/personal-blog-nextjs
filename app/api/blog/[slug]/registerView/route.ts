import { NextResponse } from "next/server";

// Retired: the unused endpoint identified visitors from IP/user-agent hashes.
// Do not collect fingerprints or write new entries to the legacy views database.
export function GET() {
  return NextResponse.json({ error: "View registration has been retired." }, {
    status: 410,
    headers: { "Cache-Control": "no-store" },
  });
}