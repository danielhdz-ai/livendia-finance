import type { NextRequest } from "next/server";
import { clientsHandlers } from "@/lib/gscapital/sync-route";

export async function GET(request: NextRequest) {
  return clientsHandlers.GET(request);
}

export async function POST(request: NextRequest) {
  return clientsHandlers.POST(request);
}
