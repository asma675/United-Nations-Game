"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getQuestions, type CategoryId } from "@/lib/questions";
import { saveScore } from "@/lib/score";

type Props = {
  category: CategoryId | "all";
  seed: number;
};

type Phase = "playing" | "done";

export default function QuizGame({ category, seed }: Props) {
  const questions = useMemo(() => {
    return getQuestions({ category, count: 10, seed });
  }, [category, seed]);

  const [phase, setPhase] = useState<Phase>("playing");
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [streak, setStreak] = useState(0);

  const [timeLeft, setTimeLeft] = useState(18);
  const timerRef = useRef<number | null>(null);

  const [locked, setLocked] = useState(false);
  const [picked, setPicked] = useState<number | null>(null);

  const q = questions[index];

  useEffect(() => {
    setPhase("playing");
    setIndex(0);
    setScore(0);
    setCorrect(0);
    setAnswered(0);
    setStreak(0);
  }, [questions]);

  useEffect(() => {
    setLocked(false);
    setPicked(null);
    setTimeLeft(18);

    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [index, seed, category]);

  useEffect(() => {
    if (phase !== "playing") return;
    if (timeLeft > 0) return;
    if (!locked) {
      handleAnswer(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, phase]);

  function nextQuestion() {
    const next = index + 1;
    if (next >= questions.length) {
      finish();
      return;
    }
    setIndex(next);
  }

  function pointsFor(isCorrect: boolean, remaining: number, currentStreak: number) {
    if (!isCorrect) return 0;
    const base = 100;
    const timeBonus = Math.max(0, remaining) * 2;
    const streakBonus = Math.min(5, currentStreak) * 15;
    return base + timeBonus + streakBonus;
  }

  function handleAnswer(choiceIndex: number | null) {
    if (locked || phase !== "playing") return;
    setLocked(true);
    setPicked(choiceIndex);

    const isCorrect = choiceIndex !== null && choiceIndex === q.correctIndex;

    setAnswered((a) => a + 1);

    if (isCorrect) {
      setCorrect((c) => c + 1);
      setStreak((s) => {
        const nextStreak = s + 1;
        setScore((prev) => prev + pointsFor(true, timeLeft, nextStreak));
        return nextStreak;
      });
    } else {
      setStreak(0);
    }

    if (timerRef.current) window.clearInterval(timerRef.current);

    window.setTimeout(() => nextQuestion(), 900);
  }

  function finish() {
    setPhase("done");
    if (timerRef.current) window.clearInterval(timerRef.current);
  }

  function categoryLabel() {
    if (category === "all") return "All Categories";
    return q.categoryLabel;
  }

  function onSave() {
    const name = prompt("Enter your name for the leaderboard:", "Player")?.trim();
    if (!name) return;

    const accuracy = answered > 0 ? correct / answered : 0;

    saveScore({
      name,
      score,
      accuracy,
      categoryLabel: categoryLabel(),
    });

    alert("Saved! Check the leaderboard.");
  }

  if (!q) {
    return <div style={styles.note}>No questions found. Add more in lib/questions.ts</div>;
  }

  if (phase === "done") {
    const accuracy = answered > 0 ? correct / answered : 0;
    return (
      <div style={styles.doneWrap}>
        <h2 style={styles.h2}>Run complete ✅</h2>
        <div style={styles.stats}>
          <Stat label="Score" value={score} />
          <Stat label="Correct" value={`${correct}/${answered}`} />
          <Stat label="Accuracy" value={`${Math.round(accuracy * 100)}%`} />
          <Stat label="Best Streak" value={streak} />
        </div>

        <div style={styles.actions}>
          <button style={styles.primaryBtn} onClick={onSave}>
            Save to Leaderboard
          </button>
          <a href="/play" style={styles.secondaryBtn}>
            Play Again
          </a>
        </div>
      </div>
    );
  }

  const progress = `${index + 1} / ${questions.length}`;
  const accuracySoFar = answered > 0 ? Math.round((correct / answered) * 100) : 0;

  return (
    <section>
      <div style={styles.topBar}>
        <div style={styles.pill}>Question {progress}</div>
        <div style={styles.pill}>⏱️ {timeLeft}s</div>
        <div style={styles.pill}>Score {score}</div>
        <div style={styles.pill}>Acc {accuracySoFar}%</div>
      </div>

      <div style={styles.qCard}>
        <div style={styles.metaRow}>
          <div style={styles.tag}>{q.categoryLabel}</div>
          <div style={styles.tag2}>{q.difficulty}</div>
        </div>

        <h2 style={styles.question}>{q.prompt}</h2>

        <div style={styles.choices}>
          {q.choices.map((c, i) => {
            const isPicked = picked === i;
            const isAnswer = i === q.correctIndex;
            const show = locked;

            const bg = show
              ? isAnswer
                ? "rgba(90, 255, 160, 0.18)"
                : isPicked
                ? "rgba(255, 70, 90, 0.18)"
                : "rgba(255,255,255,0.08)"
              : "rgba(255,255,255,0.08)";

            const border = show
              ? isAnswer
                ? "1px solid rgba(90, 255, 160, 0.35)"
                : isPicked
                ? "1px solid rgba(255, 70, 90, 0.35)"
                : "1px solid rgba(255,255,255,0.14)"
              : "1px solid rgba(255,255,255,0.14)";

            return (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                disabled={locked}
                style={{
                  ...styles.choice,
                  background: bg,
                  border,
                  cursor: locked ? "not-allowed" : "pointer",
                  opacity: locked && !isPicked && !isAnswer ? 0.9 : 1,
                }}
              >
                <span style={styles.choiceLetter}>{String.fromCharCode(65 + i)}</span>
                <span style={styles.choiceText}>{c}</span>
              </button>
            );
          })}
        </div>

        {q.explanation && (
          <div style={styles.explain}>
            <b>Explanation:</b> {q.explanation}
          </div>
        )}

        <div style={styles.footer}>
          <button
            style={styles.skipBtn}
            onClick={() => handleAnswer(null)}
            disabled={locked}
            title="Counts as incorrect"
          >
            Skip
          </button>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: any }) {
  return (
    <div style={styles.stat}>
      <div style={styles.statLabel}>{label}</div>
      <div style={styles.statValue}>{value}</div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  topBar: { display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 12 },
  pill: {
    padding: "8px 10px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.07)",
    fontSize: 12,
    fontWeight: 800,
    opacity: 0.95,
  },
  qCard: {
    borderRadius: 18,
    padding: 16,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
  },
  metaRow: { display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 10 },
  tag: {
    padding: "6px 10px",
    borderRadius: 999,
    background: "rgba(75, 179, 253, 0.16)",
    border: "1px solid rgba(75, 179, 253, 0.35)",
    fontSize: 12,
    fontWeight: 800,
  },
  tag2: {
    padding: "6px 10px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.14)",
    fontSize: 12,
    fontWeight: 800,
    opacity: 0.9,
  },
  question: { margin: "10px 0 14px", fontSize: 20, lineHeight: 1.35 },
  choices: { display: "grid", gap: 10 },
  choice: {
    display: "flex",
    gap: 10,
    alignItems: "center",
    padding: "12px 12px",
    borderRadius: 14,
    textAlign: "left",
    color: "white",
  },
  choiceLetter: {
    width: 28,
    height: 28,
    borderRadius: 10,
    display: "grid",
    placeItems: "center",
    fontWeight: 900,
    background: "rgba(0,0,0,0.18)",
    border: "1px solid rgba(255,255,255,0.12)",
  },
  choiceText: { fontWeight: 700, lineHeight: 1.3 },
  explain: {
    marginTop: 12,
    padding: 12,
    borderRadius: 14,
    background: "rgba(0,0,0,0.18)",
    border: "1px solid rgba(255,255,255,0.10)",
    fontSize: 13,
    opacity: 0.95,
  },
  footer: { marginTop: 12, display: "flex", justifyContent: "flex-end" },
  skipBtn: {
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.16)",
    background: "rgba(255,255,255,0.08)",
    color: "white",
    fontWeight: 900,
    cursor: "pointer",
  },
  doneWrap: {
    marginTop: 14,
    padding: 16,
    borderRadius: 18,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
  },
  h2: { margin: 0, fontSize: 20 },
  stats: {
    marginTop: 12,
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: 10,
  },
  stat: {
    borderRadius: 14,
    padding: 12,
    background: "rgba(0,0,0,0.18)",
    border: "1px solid rgba(255,255,255,0.10)",
  },
  statLabel: { fontSize: 12, opacity: 0.8, fontWeight: 800 },
  statValue: { marginTop: 6, fontSize: 18, fontWeight: 900 },
  actions: { display: "flex", gap: 12, marginTop: 14, flexWrap: "wrap" },
  primaryBtn: {
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(0,0,0,0.1)",
    background: "#4bb3fd",
    color: "#0b1f3a",
    fontWeight: 950,
    cursor: "pointer",
  },
  secondaryBtn: {
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.16)",
    background: "rgba(255,255,255,0.08)",
    color: "white",
    fontWeight: 950,
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
  },
  note: {
    marginTop: 14,
    padding: 12,
    borderRadius: 14,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    opacity: 0.9,
  },
};
