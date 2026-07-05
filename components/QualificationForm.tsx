"use client";

import { useEffect, useMemo, useState } from "react";
import { ProgressBar } from "@/components/ProgressBar";
import { ResultCard } from "@/components/ResultCard";
import { questions } from "@/lib/questions";
import { saveEvaluation } from "@/lib/supabase/client";
import { calculateQualification } from "@/lib/scoring";
import type { Answers } from "@/lib/types";

export function QualificationForm() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [finished, setFinished] = useState(false);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const currentQuestion = questions[step];
  const result = useMemo(
    () => (finished ? calculateQualification(answers) : null),
    [answers, finished],
  );

  useEffect(() => {
    if (!finished || !result) {
      return;
    }

    let cancelled = false;

    async function persistEvaluation() {
      setSaveStatus("saving");
      setSaveMessage(null);

      const response = await saveEvaluation(result!, answers);

      if (cancelled) {
        return;
      }

      if (response.ok) {
        setSaveStatus("saved");
        setSaveMessage("Evaluación guardada en Supabase.");
        return;
      }

      setSaveStatus("error");
      setSaveMessage(response.error);
    }

    void persistEvaluation();

    return () => {
      cancelled = true;
    };
  }, [finished, result, answers]);

  function handleSelect(value: string | number) {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
  }

  function handleNext() {
    if (step < questions.length - 1) {
      setStep((prev) => prev + 1);
      return;
    }
    setFinished(true);
  }

  function handleBack() {
    if (finished) {
      setFinished(false);
      setSaveStatus("idle");
      setSaveMessage(null);
      return;
    }
    setStep((prev) => Math.max(prev - 1, 0));
  }

  function handleRestart() {
    setStep(0);
    setAnswers({});
    setFinished(false);
    setSaveStatus("idle");
    setSaveMessage(null);
  }

  if (finished && result) {
    return (
      <ResultCard
        result={result}
        onRestart={handleRestart}
        onBack={handleBack}
        saveStatus={saveStatus}
        saveMessage={saveMessage}
      />
    );
  }

  const selectedValue = answers[currentQuestion.id];

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card sm:p-8">
      <ProgressBar current={step + 1} total={questions.length} />

      <div className="mt-8 space-y-6">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-brand-600">
            {currentQuestion.category}
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">
            {currentQuestion.title}
          </h2>
          {currentQuestion.description ? (
            <p className="mt-2 text-slate-600">{currentQuestion.description}</p>
          ) : null}
        </div>

        <div className="grid gap-3">
          {currentQuestion.options.map((option) => {
            const isSelected = selectedValue === option.value;

            return (
              <button
                key={String(option.value)}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={`rounded-2xl border px-4 py-4 text-left transition ${
                  isSelected
                    ? "border-brand-600 bg-brand-50 text-brand-900"
                    : "border-slate-200 bg-slate-50 text-slate-700 hover:border-brand-300 hover:bg-white"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={handleBack}
            disabled={step === 0}
            className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Anterior
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={selectedValue === undefined}
            className="rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {step === questions.length - 1 ? "Ver resultado" : "Siguiente"}
          </button>
        </div>
      </div>
    </div>
  );
}
