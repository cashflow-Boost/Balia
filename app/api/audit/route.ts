import { NextResponse } from "next/server";
import { getStore } from "@/lib/store";

export async function GET(): Promise<NextResponse> {
  const entries = await getStore().listAudit();
  return NextResponse.json({ entries });
}
