import { NextRequest, NextResponse } from "next/server";

// TODO: Replace with backend webhook endpoint when ready
export async function POST(req: NextRequest): Promise<NextResponse> {
  return NextResponse.json({ message: "Webhook endpoint — to be configured" });
}