import type { NextRequest } from "next/server";
import { tasadoresHandlers } from "@/lib/gscapital/sync-route";

export async function GET(request: NextRequest) {
  return tasadoresHandlers.GET(request);
}

export async function POST(request: NextRequest) {
  return tasadoresHandlers.POST(request);
}
