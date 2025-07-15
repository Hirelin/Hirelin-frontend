"use client";
import React, { useState } from "react";
import { type Assessment } from "~/lib/user";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { env } from "~/env";

interface AnswerState {
  [questionIdx: number]: string;
}

export default function AssessmentComponent({
  assessment,
}: {
  assessment: Assessment;
}) {
  const [answers, setAnswers] = useState<AnswerState>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleOptionChange = (qIdx: number, option: string) => {
    if (showResults) return;
    setAnswers((prev) => ({ ...prev, [qIdx]: option }));
  };

  const handleSubmit = async () => {
    setShowResults(true);
    let total = 0;
    assessment.questions.forEach((q, idx) => {
      if (answers[idx] === q.correct_answer) total += 1;
    });
    setScore(total);

    // Send score to server
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch(
        `${env.NEXT_PUBLIC_SERVER_URL}/api/jobs/user/submit-assessment-score`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            assessmentId: assessment.id,
            score: total,
          }),
        }
      );
      if (!res.ok) {
        throw new Error("Failed to submit score");
      }
      toast.success("Assessment submitted successfully!");
    } catch (err: any) {
      setSubmitError(err.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (assessment.score > 0) {
    return (
      <div className="max-w-2xl mx-auto bg-card rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-2 text-foreground">
          {/* {assessment.title}{" "} */}
          {
            assessment.learningPlan.planDetails?.[
              assessment.title as unknown as number
            ]?.title
          }
        </h2>
        <p className="mb-4 text-muted-foreground">{assessment.description}</p>
        <div className="mb-6 text-center">
          <div className="text-xl font-bold text-foreground">
            Assessment Completed
          </div>
          <div className="text-lg mt-2">
            Your Score:{" "}
            <span className="font-semibold">{assessment.score}</span> /{" "}
            {assessment.questions.length}
          </div>
        </div>
        <div>
          {assessment.questions.map((q, idx) => (
            <div key={idx} className="mb-8 border-b border-border pb-6">
              <div className="mb-2 font-semibold text-foreground">
                Q{idx + 1}: <ReactMarkdown>{q.question}</ReactMarkdown>
              </div>
              <div className="space-y-2">
                {Object.entries(q.options).map(([key, opt]) => (
                  <label
                    key={key}
                    className={[
                      "flex items-center gap-2 p-2 rounded-md border",
                      key === q.correct_answer
                        ? "bg-green-100 border-green-400 dark:bg-green-900/30 dark:border-green-600"
                        : "border-border",
                    ].join(" ")}
                  >
                    <input
                      type="radio"
                      name={`q${idx}`}
                      value={key}
                      disabled
                      checked={key === q.correct_answer}
                      className="accent-primary"
                      readOnly
                    />
                    <span className="text-foreground">
                      {key}. {opt}
                    </span>
                  </label>
                ))}
              </div>
              <div className="mt-2">
                <span className="text-green-600 font-semibold">
                  Correct Answer: {q.correct_answer}
                </span>
                <div className="mt-1 text-muted-foreground text-sm">
                  <ReactMarkdown>{q.explanation}</ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-card rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-2 text-foreground">
        {assessment.title}
      </h2>
      <p className="mb-4 text-muted-foreground">{assessment.description}</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        {assessment.questions.map((q, idx) => (
          <div key={idx} className="mb-8 border-b border-border pb-6">
            <div className="mb-2 font-semibold text-foreground">
              Q{idx + 1}: <ReactMarkdown>{q.question}</ReactMarkdown>
            </div>
            <div className="space-y-2">
              {Object.entries(q.options).map(([key, opt]) => (
                <label
                  key={key}
                  className={[
                    "flex items-center gap-2 p-2 rounded-md border cursor-pointer transition-colors",
                    showResults
                      ? key === q.correct_answer
                        ? "bg-green-100 border-green-400 dark:bg-green-900/30 dark:border-green-600"
                        : answers[idx] === key
                        ? "bg-red-100 border-red-400 dark:bg-red-900/30 dark:border-red-600"
                        : "border-border"
                      : answers[idx] === key
                      ? "bg-primary/10 border-primary"
                      : "border-border hover:bg-accent",
                  ].join(" ")}
                >
                  <input
                    type="radio"
                    name={`q${idx}`}
                    value={key}
                    disabled={showResults}
                    checked={answers[idx] === key}
                    onChange={() => handleOptionChange(idx, key)}
                    className="accent-primary"
                  />
                  <span className="text-foreground">
                    {key}. {opt}
                  </span>
                </label>
              ))}
            </div>
            {showResults && (
              <div className="mt-2">
                {answers[idx] === q.correct_answer ? (
                  <span className="text-green-600 font-semibold">Correct!</span>
                ) : (
                  <span className="text-red-600 font-semibold">Incorrect.</span>
                )}
                <div className="mt-1 text-muted-foreground text-sm">
                  <ReactMarkdown>{q.explanation}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        ))}
        {!showResults && (
          <button
            type="submit"
            className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md font-semibold transition-colors hover:bg-primary/90 disabled:opacity-60"
            disabled={
              Object.keys(answers).length !== assessment.questions.length ||
              submitting
            }
          >
            {submitting ? "Submitting..." : "Submit Assessment"}
          </button>
        )}
      </form>
      {showResults && (
        <div className="mt-6 text-center">
          <div className="text-xl font-bold text-foreground">
            Your Score: {score} / {assessment.questions.length}
          </div>
          {submitError && (
            <div className="text-red-600 mt-2">{submitError}</div>
          )}
        </div>
      )}
    </div>
  );
}
