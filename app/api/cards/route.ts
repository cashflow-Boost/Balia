import { NextResponse } from "next/server";
import { getStore } from "@/lib/store";

export async function GET(): Promise<NextResponse> {
  const cards = await getStore().listCards();
  return NextResponse.json({ cards });
}
