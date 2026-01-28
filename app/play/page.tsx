"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CATEGORIES, type CategoryId } from "@/lib/questions";
import QuizGame from "@/components/QuizGame";

export default function PlayPage() {
  const [category, setCategory] = useState<CategoryId | "all">("all");
  const [seed, setSeed] = useState<number>(() => Date.now());

  const title = useMemo(() => {
    if (category === "all") return "All Categories";
    return CATEGORIES.find((c) => c.id === category)?.label ?? "Category";
  }, [category]);

  return (
    <main style={styles.main}>
      <div style={styles.card}>
        <div style={styles.row}>
          <Link href="/" style={styles.back}>
            ← Home
          </Link>
          <div style={{ fontWeight: 800, opacity: 0.95 }}>{title}</div>
        </div>

        <div style={styles.filters}>
          <label style={styles.label}>
            Category
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              style={styles.select}
            >
              <option value="all">All</option>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>

          <button
            style={styles.button}
            onClick={() => setSeed(Date.now())}
            title="Start a fresh randomized run"
          >
            New Run
          </button>
        </div>

        <QuizGame category={category} seed={seed} />
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    minHeight: "100vh",
    padding: 24,
    background: "linear-gradient(180deg, #061428 0%, #040b16 100%)",
    color: "white",
    display: "grid",
    placeItems: "start center",
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji"',
  },
  card: {
    width: "min(860px, 100%)",
    borderRadius: 18,
    padding: 20,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.14)",
    boxShadow: "0 20px 50px rgba(0,0,0,0.35)",
    backdropFilter: "blur(10px)",
  },
  row: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  back: { color: "rgba(255,255,255,0.85)", textDecoration: "none", fontWeight: 700 },
  filters: {
    display: "flex",
    gap: 12,
    alignItems: "end",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginTop: 14,
    marginBottom: 14,
  },
  label: { display: "grid", gap: 6, fontSize: 13, opacity: 0.9 },
  select: {
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(0,0,0,0.25)",
    color: "white",
    outline: "none",
  },
  button: {
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(255,255,255,0.10)",
    color: "white",
    fontWeight: 800,
    cursor: "pointer",
  },
};
