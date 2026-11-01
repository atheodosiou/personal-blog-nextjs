import dbConnect from "@/app/api/lib/dbConnect";
import Views from "@/app/api/models/Views";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    await dbConnect();
    const views = await Views.countDocuments({ slug });
    return NextResponse.json({ views });
  } catch {
    return NextResponse.json({ error: "Could not read historical view counts." }, { status: 500 });
  }
}

// Both legacy writer endpoints are retired; historical records are preserved.
export function POST() {
  return NextResponse.json({ error: "View registration has been retired." }, {
    status: 410,
    headers: { "Cache-Control": "no-store" },
  });
}
