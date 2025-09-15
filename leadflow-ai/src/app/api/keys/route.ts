import { NextResponse } from "next/server";
import { getKeyStatus } from "@/lib/env";

export async function GET() {
  const status = getKeyStatus();
  return NextResponse.json(status);
}

