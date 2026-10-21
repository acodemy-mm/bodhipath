"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { QUIZ } from "@/lib/content";
import { useAppStore } from "@/lib/store";

type Phase = "intro" | "quiz" | "review";

export default function ExamPage() {
  const { submitQuiz, quizAttempts } = useAppStore();
  const questions = useMemo(
    () => [...QUIZ].sort((a, b) => a.order_index - b.order_index),
    [],
  );
  const [phase, setPhase] = useState<Phase>("intro");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    () => questions.map(() => null),
  );
  const [result, setResult] = useState<{
    score: number;
    merit: number;
  } | null>(null);

  const current = questions[index];

  function choose(choiceIndex: number) {
    setAnswers((prev) => {
      const next = [...prev];
      next[index] = choiceIndex;
      return next;
    });
  }

  function next() {
    if (index < questions.length - 1) {
      setIndex(index + 1);
      return;
    }
    const score = answers.reduce<number>((acc, a, i) => {
      return acc + (a === questions[i].correct_index ? 1 : 0);
    }, 0);
    const { merit } = submitQuiz(score, questions.length);
    setResult({ score, merit });
    setPhase("review");
  }

  function restart() {
    setAnswers(questions.map(() => null));
    setIndex(0);
    setResult(null);
    setPhase("quiz");
  }

  return (
    <section className="mx-auto max-w-2xl animate-grow-in">
      <h1 className="font-display text-3xl text-gold-soft">
        စာမေးပွဲ · Exam
      </h1>
      <p className="mt-2 text-cream/65">
        နမူနာ MCQ · အပြည့်အစုံ past papers ကို Phase 2 တွင် ထည့်သွင်းမည်
      </p>

      {phase === "intro" && (
        <div className="mt-8 rounded-2xl border border-mist bg-bg-soft/40 p-6">
          <h2 className="font-display text-xl text-cream">နမူနာ Pre-test</h2>
          <p className="mt-2 text-sm text-cream/70">
            မေးခွန်း {questions.length} ခု · ချက်ချင်း အမှတ်နှင့် ရှင်းလင်းချက်
          </p>
          {quizAttempts[0] && (
            <p className="mt-3 text-sm text-gold-soft">
              နောက်ဆုံး: {quizAttempts[0].score}/{quizAttempts[0].total}
            </p>
          )}
          <button
            type="button"
            onClick={() => setPhase("quiz")}
            className="mt-6 rounded-xl bg-gold px-6 py-3 font-medium text-ink"
          >
            စတင်ဖြေဆိုမည်
          </button>
          <p className="mt-6 text-xs text-cream/45">
            Coming soon: အဘိဓမ္မာ past papers အပြည့်အစုံ
          </p>
        </div>
      )}

      {phase === "quiz" && current && (
        <div className="mt-8">
          <p className="text-sm text-cream/50">
            {index + 1} / {questions.length}
          </p>
          <h2 className="mt-2 text-xl text-cream">{current.prompt_mm}</h2>
          <p className="text-sm text-cream/55">{current.prompt_en}</p>
          <ul className="mt-6 space-y-2">
            {current.choices.map((c, i) => (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => choose(i)}
                  className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                    answers[index] === i
                      ? "border-gold bg-leaf/30"
                      : "border-mist bg-bg-soft/40 hover:border-leaf-bright/40"
                  }`}
                >
                  {c}
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            disabled={answers[index] === null}
            onClick={next}
            className="mt-6 rounded-xl bg-gold px-6 py-3 font-medium text-ink disabled:opacity-40"
          >
            {index === questions.length - 1 ? "တင်သွင်းမည်" : "ရှေ့သို့"}
          </button>
        </div>
      )}

      {phase === "review" && result && (
        <div className="mt-8">
          <h2 className="font-display text-2xl text-gold-soft">
            ရလဒ် · {result.score}/{questions.length}
          </h2>
          <p className="mt-1 text-cream/70">+{result.merit} merit</p>

          <ul className="mt-6 space-y-4">
            {questions.map((q, i) => {
              const correct = answers[i] === q.correct_index;
              return (
                <li
                  key={q.id}
                  className="rounded-xl border border-mist bg-bg-soft/30 p-4"
                >
                  <p className="text-cream">{q.prompt_mm}</p>
                  <p
                    className={`mt-2 text-sm ${
                      correct ? "text-leaf-bright" : "text-red-300"
                    }`}
                  >
                    သင့်အဖြေ: {answers[i] !== null ? q.choices[answers[i]!] : "—"}{" "}
                    {correct ? "✓" : "✗"}
                  </p>
                  {!correct && (
                    <p className="text-sm text-gold-soft">
                      မှန်ကန်သောအဖြေ: {q.choices[q.correct_index]}
                    </p>
                  )}
                  <p className="mt-2 text-sm text-cream/55">{q.explanation_mm}</p>
                </li>
              );
            })}
          </ul>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={restart}
              className="rounded-xl bg-gold px-6 py-3 font-medium text-ink"
            >
              ထပ်မံဖြေမည်
            </button>
            <Link
              href="/home"
              className="rounded-xl border border-mist px-6 py-3 text-cream"
            >
              အိမ်သို့
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
