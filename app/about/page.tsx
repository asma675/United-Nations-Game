import Link from "next/link";

export default function AboutPage() {
  return (
    <main style={styles.main}>
      <div style={styles.card}>
        <Link href="/" style={styles.back}>
          ← Home
        </Link>
        <h1 style={styles.h1}>About</h1>
        <p style={styles.p}>
          This is a lightweight MVP for a UN Nations quiz game. Expand it by adding:
        </p>
        <ul style={styles.ul}>
          <li>More questions (by category + difficulty)</li>
          <li>Daily challenge + streaks</li>
          <li>Multiplayer battles</li>
          <li>Teacher/classroom mode</li>
        </ul>
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
    width: "min(760px, 100%)",
    borderRadius: 18,
    padding: 20,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.14)",
  },
  back: { color: "rgba(255,255,255,0.85)", textDecoration: "none", fontWeight: 700 },
  h1: { marginTop: 14, marginBottom: 8 },
  p: { opacity: 0.9, lineHeight: 1.6 },
  ul: { opacity: 0.9, lineHeight: 1.8 },
};
