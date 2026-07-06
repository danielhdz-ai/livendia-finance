import type { NextRequest } from "next/server";
import { inmobiliariosHandlers } from "@/lib/gscapital/sync-route";

export async function GET(request: NextRequest) {
  return inmobiliariosHandlers.GET(request);
}

export async function POST(request: NextRequest) {
  return inmobiliariosHandlers.POST(request);
}
