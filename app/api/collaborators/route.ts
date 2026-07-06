import type { NextRequest } from "next/server";
import { collaboratorsHandlers } from "@/lib/gscapital/sync-route";

export async function GET(request: NextRequest) {
  return collaboratorsHandlers.GET(request);
}

export async function POST(request: NextRequest) {
  return collaboratorsHandlers.POST(request);
}
