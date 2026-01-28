"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { type ScoreEntry, loadScores, clearScores } from "@/lib/score";

export default function LeaderboardPage() {
  const [scores, setScores] = useState<ScoreEntry[]>([]);

  useEffect(() => {
    setScores(loadScores());
  }, []);

  const top = useMemo(() => scores.slice(0, 20), [scores]);

  return (
    <main style={styles.main}>
      <div style={styles.card}>
        <div style={styles.row}>
          <Link href="/" style={styles.back}>
            ← Home
          </Link>
          <h1 style={styles.h1}>Leaderboard</h1>
          <div />
        </div>

        {top.length === 0 ? (
          <p style={styles.p}>No scores yet. Play a round to create your first score.</p>
        ) : (
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>#</th>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Score</th>
                  <th style={styles.th}>Accuracy</th>
                  <th style={styles.th}>Category</th>
                  <th style={styles.th}>Date</th>
                </tr>
              </thead>
              <tbody>
                {top.map((s, i) => (
                  <tr key={s.id} style={styles.tr}>
                    <td style={styles.td}>{i + 1}</td>
                    <td style={styles.td}>{s.name}</td>
                    <td style={styles.td}>
                      <b>{s.score}</b>
                    </td>
                    <td style={styles.td}>{Math.round(s.accuracy * 100)}%</td>
                    <td style={styles.td}>{s.categoryLabel}</td>
                    <td style={styles.td}>{new Date(s.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div style={styles.actions}>
          <Link href="/play" style={styles.primaryBtn}>
            Play
          </Link>
          <button
            style={styles.dangerBtn}
            onClick={() => {
              clearScores();
              setScores([]);
            }}
          >
            Clear
          </button>
        </div>
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
    width: "min(980px, 100%)",
    borderRadius: 18,
    padding: 20,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.14)",
    boxShadow: "0 20px 50px rgba(0,0,0,0.35)",
    backdropFilter: "blur(10px)",
  },
  row: { display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center" },
  back: { color: "rgba(255,255,255,0.85)", textDecoration: "none", fontWeight: 700 },
  h1: { margin: 0, fontSize: 22, letterSpacing: -0.2, textAlign: "center" },
  p: { opacity: 0.9, marginTop: 14 },
  tableWrap: {
    overflowX: "auto",
    marginTop: 14,
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.12)",
  },
  table: { width: "100%", borderCollapse: "collapse", minWidth: 760 },
  th: {
    textAlign: "left",
    padding: 12,
    fontSize: 12,
    opacity: 0.8,
    borderBottom: "1px solid rgba(255,255,255,0.12)",
  },
  tr: {},
  td: { padding: 12, borderBottom: "1px solid rgba(255,255,255,0.08)", fontSize: 13 },
  actions: { display: "flex", gap: 12, marginTop: 16 },
  primaryBtn: {
    padding: "10px 12px",
    borderRadius: 12,
    textDecoration: "none",
    fontWeight: 900,
    background: "#4bb3fd",
    color: "#0b1f3a",
    border: "1px solid rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  dangerBtn: {
    padding: "10px 12px",
    borderRadius: 12,
    fontWeight: 900,
    background: "rgba(255, 70, 90, 0.15)",
    color: "white",
    border: "1px solid rgba(255, 70, 90, 0.35)",
    cursor: "pointer",
  },
};
