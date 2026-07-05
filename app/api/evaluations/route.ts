import { NextResponse } from "next/server";
import {
  createServerClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import type { Answers, QualificationResult } from "@/lib/types";

type EvaluationPayload = {
  result: QualificationResult;
  answers: Answers;
};

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase no está configurado en el servidor" },
      { status: 503 },
    );
  }

  try {
    const body = (await request.json()) as EvaluationPayload;
    const { result, answers } = body;

    if (!result || !answers) {
      return NextResponse.json(
        { error: "Datos de evaluación incompletos" },
        { status: 400 },
      );
    }

    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("evaluations")
      .insert({
        score: result.score,
        level: result.level,
        answers,
        category_scores: result.categoryScores,
        recommendations: result.recommendations,
      })
      .select("id")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ id: data.id });
  } catch {
    return NextResponse.json(
      { error: "Error al procesar la evaluación" },
      { status: 500 },
    );
  }
}
