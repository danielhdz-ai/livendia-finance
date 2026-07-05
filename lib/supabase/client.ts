import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { Answers, QualificationResult } from "@/lib/types";

export type EvaluationRecord = {
  id: string;
  score: number;
  level: QualificationResult["level"];
  answers: Answers;
  category_scores: Record<string, number>;
  recommendations: string[];
  created_at: string;
};

let browserClient: SupabaseClient | null = null;

export function getBrowserClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  if (!browserClient) {
    browserClient = createClient(url, anonKey);
  }

  return browserClient;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export async function saveEvaluation(
  result: QualificationResult,
  answers: Answers,
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const response = await fetch("/api/evaluations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ result, answers }),
  });

  const data = (await response.json()) as
    | { id: string }
    | { error: string };

  if (!response.ok) {
    return {
      ok: false,
      error: "error" in data ? data.error : "No se pudo guardar la evaluación",
    };
  }

  return { ok: true, id: "id" in data ? data.id : "" };
}
