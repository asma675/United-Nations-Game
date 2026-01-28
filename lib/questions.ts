export type CategoryId = "un" | "sdg" | "human_rights" | "climate" | "global_health";

export const CATEGORIES: { id: CategoryId; label: string }[] = [
  { id: "un", label: "United Nations" },
  { id: "sdg", label: "Sustainable Development Goals" },
  { id: "human_rights", label: "Human Rights" },
  { id: "climate", label: "Climate & Environment" },
  { id: "global_health", label: "Global Health" },
];

export type Difficulty = "easy" | "medium" | "hard";

export type Question = {
  id: string;
  category: CategoryId;
  categoryLabel: string;
  difficulty: Difficulty;
  prompt: string;
  choices: string[];
  correctIndex: number;
  explanation?: string;
};

const LABEL: Record<CategoryId, string> = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.label])) as any;

const BANK: Question[] = [
  {
    id: "un-001",
    category: "un",
    categoryLabel: LABEL.un,
    difficulty: "easy",
    prompt: "What year was the United Nations founded?",
    choices: ["1919", "1945", "1955", "1961"],
    correctIndex: 1,
    explanation: "The UN was established after World War II in 1945.",
  },
  {
    id: "un-002",
    category: "un",
    categoryLabel: LABEL.un,
    difficulty: "easy",
    prompt: "Which city hosts the UN Headquarters?",
    choices: ["Geneva", "New York City", "Paris", "Vienna"],
    correctIndex: 1,
    explanation: "The main UN Headquarters is in New York City.",
  },
  {
    id: "un-003",
    category: "un",
    categoryLabel: LABEL.un,
    difficulty: "medium",
    prompt: "Which UN organ is primarily responsible for international peace and security?",
    choices: ["General Assembly", "Security Council", "ICJ", "ECOSOC"],
    correctIndex: 1,
  },
  {
    id: "sdg-001",
    category: "sdg",
    categoryLabel: LABEL.sdg,
    difficulty: "easy",
    prompt: "How many Sustainable Development Goals (SDGs) are there?",
    choices: ["10", "12", "17", "21"],
    correctIndex: 2,
  },
  {
    id: "sdg-002",
    category: "sdg",
    categoryLabel: LABEL.sdg,
    difficulty: "medium",
    prompt: "Which SDG focuses on climate action?",
    choices: ["SDG 7", "SDG 11", "SDG 13", "SDG 15"],
    correctIndex: 2,
  },
  {
    id: "human-001",
    category: "human_rights",
    categoryLabel: LABEL.human_rights,
    difficulty: "easy",
    prompt: "What does UDHR stand for?",
    choices: [
      "Universal Declaration of Human Rights",
      "United Democracy & Human Rights",
      "Union of Diplomatic Human Rights",
      "Universal Duty of Human Rules",
    ],
    correctIndex: 0,
  },
  {
    id: "human-002",
    category: "human_rights",
    categoryLabel: LABEL.human_rights,
    difficulty: "medium",
    prompt: "Which UN body is a forum for addressing human rights issues globally?",
    choices: ["Human Rights Council", "Security Council", "UNICEF", "WFP"],
    correctIndex: 0,
  },
  {
    id: "climate-001",
    category: "climate",
    categoryLabel: LABEL.climate,
    difficulty: "easy",
    prompt: "Which gas is most associated with human-caused global warming?",
    choices: ["CO₂", "Neon", "Helium", "Argon"],
    correctIndex: 0,
  },
  {
    id: "climate-002",
    category: "climate",
    categoryLabel: LABEL.climate,
    difficulty: "medium",
    prompt: "Which agreement aims to limit global temperature rise to well below 2°C?",
    choices: ["Kyoto Protocol", "Paris Agreement", "Montreal Protocol", "Basel Convention"],
    correctIndex: 1,
  },
  {
    id: "health-001",
    category: "global_health",
    categoryLabel: LABEL.global_health,
    difficulty: "easy",
    prompt: "Which UN agency is primarily responsible for international public health?",
    choices: ["WHO", "UNDP", "UNHCR", "FAO"],
    correctIndex: 0,
  },
  {
    id: "health-002",
    category: "global_health",
    categoryLabel: LABEL.global_health,
    difficulty: "medium",
    prompt: "What does 'pandemic' mean?",
    choices: [
      "A disease outbreak in a single city",
      "A disease outbreak across multiple countries/continents",
      "A seasonal allergy pattern",
      "An animal-only disease",
    ],
    correctIndex: 1,
  },
];

function mulberry32(seed: number) {
  let t = seed >>> 0;
  return function () {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(arr: T[], rnd: () => number) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function getQuestions(opts: { category: CategoryId | "all"; count: number; seed: number }) {
  const rnd = mulberry32(opts.seed);
  const filtered = opts.category === "all" ? BANK : BANK.filter((q) => q.category === opts.category);
  const shuffled = shuffle(filtered, rnd);
  return shuffled.slice(0, Math.min(opts.count, shuffled.length));
}
