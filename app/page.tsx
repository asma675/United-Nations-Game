"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main style={styles.main}>
      <div style={styles.card}>
        <div style={styles.headerRow}>
          <div style={styles.badge}>UN</div>
          <h1 style={styles.h1}>UN Nations Quiz</h1>
        </div>

        <p style={styles.p}>
          Learn the UN, SDGs, human rights, climate, and global health through a fast quiz game.
        </p>

        <div style={styles.grid}>
          <Link href="/play" style={styles.primaryBtn}>
            Play
          </Link>
          <Link href="/leaderboard" style={styles.secondaryBtn}>
            Leaderboard
          </Link>
          <Link href="/about" style={styles.ghostBtn}>
            About
          </Link>
        </div>

        <div style={styles.small}>
          Tip: Add questions in <code>lib/questions.ts</code>
        </div>
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: 24,
    background: "radial-gradient(circle at top, #1b3b6f 0%, #081a33 55%, #040b16 100%)",
    color: "white",
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji"',
  },
  card: {
    width: "min(720px, 100%)",
    borderRadius: 18,
    padding: 24,
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.14)",
    boxShadow: "0 20px 50px rgba(0,0,0,0.35)",
    backdropFilter: "blur(10px)",
  },
  headerRow: { display: "flex", gap: 12, alignItems: "center" },
  badge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    display: "grid",
    placeItems: "center",
    fontWeight: 800,
    background: "rgba(110, 200, 255, 0.2)",
    border: "1px solid rgba(110, 200, 255, 0.35)",
  },
  h1: { margin: 0, fontSize: 34, letterSpacing: -0.4 },
  p: { marginTop: 12, marginBottom: 18, lineHeight: 1.6, opacity: 0.92 },
  grid: { display: "grid", gap: 12, gridTemplateColumns: "1fr", marginTop: 16 },
  primaryBtn: btn("#4bb3fd", "#0b1f3a"),
  secondaryBtn: btn("rgba(255,255,255,0.12)", "white", true),
  ghostBtn: btn("transparent", "rgba(255,255,255,0.85)", true, true),
  small: { marginTop: 14, fontSize: 13, opacity: 0.8 },
};

function btn(bg: string, fg: string, outline = false, ghost = false): React.CSSProperties {
  return {
    padding: "12px 14px",
    borderRadius: 12,
    textDecoration: "none",
    fontWeight: 700,
    textAlign: "center",
    background: bg,
    color: fg,
    border: ghost
      ? "1px dashed rgba(255,255,255,0.35)"
      : outline
      ? "1px solid rgba(255,255,255,0.24)"
      : "1px solid rgba(0,0,0,0.1)",
  };
}
