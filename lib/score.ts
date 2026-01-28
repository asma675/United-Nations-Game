export type ScoreEntry = {
  id: string;
  name: string;
  score: number;
  accuracy: number; // 0..1
  categoryLabel: string;
  createdAt: number;
};

const KEY = "un_quiz_scores_v1";

function safeParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function loadScores(): ScoreEntry[] {
  if (typeof window === "undefined") return [];
  const list = safeParse<ScoreEntry[]>(localStorage.getItem(KEY), []);
  return [...list].sort((a, b) => b.score - a.score || b.createdAt - a.createdAt);
}

export function saveScore(input: Omit<ScoreEntry, "id" | "createdAt">) {
  if (typeof window === "undefined") return;
  const list = loadScores();
  const entry: ScoreEntry = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
  };
  const next = [entry, ...list].slice(0, 200);
  localStorage.setItem(KEY, JSON.stringify(next));
}

export function clearScores() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}
