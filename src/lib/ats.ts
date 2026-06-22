interface SkillEntry {
  term: string;
  section: "Skills" | "Summary" | "Experience";
}

// Curated, real-world keywords/phrases. Matching against this dictionary (instead
// of raw word frequency) keeps results meaningful instead of surfacing generic
// JD boilerplate words with no real signal.
const SKILL_DICTIONARY: SkillEntry[] = [
  // Tech / engineering
  { term: "python", section: "Skills" },
  { term: "java", section: "Skills" },
  { term: "javascript", section: "Skills" },
  { term: "typescript", section: "Skills" },
  { term: "react", section: "Skills" },
  { term: "node", section: "Skills" },
  { term: "node.js", section: "Skills" },
  { term: "next.js", section: "Skills" },
  { term: "aws", section: "Skills" },
  { term: "azure", section: "Skills" },
  { term: "gcp", section: "Skills" },
  { term: "docker", section: "Skills" },
  { term: "kubernetes", section: "Skills" },
  { term: "terraform", section: "Skills" },
  { term: "sql", section: "Skills" },
  { term: "nosql", section: "Skills" },
  { term: "postgresql", section: "Skills" },
  { term: "mongodb", section: "Skills" },
  { term: "rest api", section: "Skills" },
  { term: "graphql", section: "Skills" },
  { term: "microservices", section: "Skills" },
  { term: "ci/cd", section: "Skills" },
  { term: "git", section: "Skills" },
  { term: "linux", section: "Skills" },
  { term: "machine learning", section: "Skills" },
  { term: "deep learning", section: "Skills" },
  { term: "data pipelines", section: "Skills" },
  { term: "system design", section: "Skills" },
  { term: "distributed systems", section: "Skills" },
  { term: "unit testing", section: "Skills" },
  { term: "automation", section: "Skills" },

  // Methodologies
  { term: "agile", section: "Skills" },
  { term: "scrum", section: "Skills" },
  { term: "kanban", section: "Skills" },
  { term: "lean", section: "Skills" },
  { term: "six sigma", section: "Skills" },
  { term: "waterfall", section: "Skills" },

  // Design / product
  { term: "figma", section: "Skills" },
  { term: "wireframing", section: "Skills" },
  { term: "user research", section: "Skills" },
  { term: "a/b testing", section: "Skills" },
  { term: "roadmap", section: "Experience" },
  { term: "product strategy", section: "Experience" },
  { term: "go-to-market", section: "Experience" },

  // Data / analytics
  { term: "excel", section: "Skills" },
  { term: "tableau", section: "Skills" },
  { term: "power bi", section: "Skills" },
  { term: "looker", section: "Skills" },
  { term: "google analytics", section: "Skills" },
  { term: "forecasting", section: "Experience" },
  { term: "data analysis", section: "Skills" },
  { term: "kpi", section: "Experience" },
  { term: "kpis", section: "Experience" },

  // Marketing / sales
  { term: "seo", section: "Skills" },
  { term: "sem", section: "Skills" },
  { term: "crm", section: "Skills" },
  { term: "salesforce", section: "Skills" },
  { term: "hubspot", section: "Skills" },
  { term: "content marketing", section: "Experience" },
  { term: "lead generation", section: "Experience" },
  { term: "b2b", section: "Experience" },
  { term: "b2c", section: "Experience" },
  { term: "pipeline management", section: "Experience" },
  { term: "negotiation", section: "Summary" },

  // Finance / accounting
  { term: "gaap", section: "Skills" },
  { term: "ifrs", section: "Skills" },
  { term: "reconciliation", section: "Experience" },
  { term: "accounts payable", section: "Experience" },
  { term: "accounts receivable", section: "Experience" },
  { term: "financial reporting", section: "Experience" },
  { term: "budgeting", section: "Experience" },
  { term: "audit", section: "Experience" },
  { term: "sap", section: "Skills" },
  { term: "quickbooks", section: "Skills" },
  { term: "p&l", section: "Experience" },

  // Operations / project management
  { term: "jira", section: "Skills" },
  { term: "confluence", section: "Skills" },
  { term: "project management", section: "Experience" },
  { term: "program management", section: "Experience" },
  { term: "vendor management", section: "Experience" },
  { term: "supply chain", section: "Experience" },
  { term: "logistics", section: "Experience" },
  { term: "process improvement", section: "Experience" },

  // HR / recruiting
  { term: "talent acquisition", section: "Experience" },
  { term: "onboarding", section: "Experience" },
  { term: "performance management", section: "Experience" },
  { term: "compensation", section: "Experience" },

  // Soft skills / leadership
  { term: "leadership", section: "Summary" },
  { term: "team leadership", section: "Summary" },
  { term: "people management", section: "Summary" },
  { term: "stakeholder management", section: "Summary" },
  { term: "cross-functional", section: "Summary" },
  { term: "cross functional", section: "Summary" },
  { term: "communication", section: "Summary" },
  { term: "presentation", section: "Summary" },
  { term: "mentoring", section: "Summary" },
  { term: "mentorship", section: "Summary" },
  { term: "collaboration", section: "Summary" },
  { term: "problem solving", section: "Summary" },
  { term: "ownership", section: "Summary" },
  { term: "strategic planning", section: "Summary" },
  { term: "decision making", section: "Summary" },

  // Languages / certifications
  { term: "cpa", section: "Skills" },
  { term: "pmp", section: "Skills" },
  { term: "cfa", section: "Skills" },
];

// All-caps tokens (2-6 letters) found in the JD are almost always tool/tech
// acronyms (AWS, ATS, ERP, SaaS...). A small denylist filters common non-keyword
// acronyms that show up in everyday English.
const ACRONYM_DENYLIST = new Set([
  "I", "A", "OK", "US", "EU", "UK", "CEO", "CFO", "CTO", "VP", "HR", "PM",
  "FAQ", "ETC", "NOTE",
]);

function findAcronyms(text: string): string[] {
  const matches = text.match(/\b[A-Z][A-Z0-9.]{2,5}\b/g) ?? [];
  const seen = new Set<string>();
  for (const m of matches) {
    const clean = m.replace(/\.$/, "");
    // Drop 2-letter acronyms entirely — too noisy (UI, PM, BI...) to trust
    // without surrounding context, per how real ATS tools weight by signal.
    if (clean.length < 3 || ACRONYM_DENYLIST.has(clean)) continue;
    seen.add(clean);
  }
  return Array.from(seen);
}

const GENERIC_STOPWORDS = new Set(
  `a about above after again against all am an and any are as at be because been before being
  below between both but by can cannot could did do does doing down during each few for from
  further had has have having he her here hers herself him himself his how i if in into is it
  its itself just me more most my myself no nor not now of off on once only or other our ours
  ourselves out over own same she should so some such than that the their theirs them themselves
  then there these they this those through to too under until up very was we were what when
  where which while who whom why will with would you your yours yourself yourselves etc using
  used use also within across via per year years experience experienced work working team teams
  role roles job jobs company companies including include ability strong excellent good great new
  join joining looking opportunity opportunities must should required requirement requirements
  responsibilities responsibility preferred candidate candidates seeking needed need needs ideal
  degree related minimum plus environment background skill skills knowledge understanding`
    .split(/\s+/)
    .filter(Boolean)
);

function extractFallbackKeywords(text: string, exclude: Set<string>): string[] {
  const tokens = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length >= 5 && !GENERIC_STOPWORDS.has(t) && !/^\d+$/.test(t));

  const freq = new Map<string, number>();
  for (const t of tokens) {
    if (exclude.has(t)) continue;
    freq.set(t, (freq.get(t) ?? 0) + 1);
  }

  return Array.from(freq.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([term]) => term);
}

export interface AtsResult {
  score: number;
  explanation: string;
  strengths: string[];
  gaps: { keyword: string; section: string }[];
}

export function analyzeAts(resumeText: string, jobDescription: string): AtsResult {
  const jdLower = jobDescription.toLowerCase();
  const resumeLower = resumeText.toLowerCase();

  const sectionByTerm = new Map<string, SkillEntry["section"]>();
  const freq = new Map<string, number>();

  for (const entry of SKILL_DICTIONARY) {
    const re = new RegExp(`\\b${entry.term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi");
    const count = (jdLower.match(re) ?? []).length;
    if (count > 0) {
      freq.set(entry.term, count);
      sectionByTerm.set(entry.term, entry.section);
    }
  }

  const dictionaryTerms = Array.from(freq.keys());

  for (const acronym of findAcronyms(jobDescription)) {
    const key = acronym.toLowerCase();
    const overlapsExistingTerm = dictionaryTerms.some((term) => term.includes(key));
    if (!freq.has(key) && !overlapsExistingTerm) {
      const re = new RegExp(`\\b${acronym}\\b`, "g");
      const count = (jobDescription.match(re) ?? []).length;
      // A 3-letter acronym mentioned only once is more likely incidental noise
      // than a real requirement — require it to repeat before trusting it.
      if (acronym.length === 3 && count < 2) continue;
      freq.set(key, count);
      sectionByTerm.set(key, "Skills");
    }
  }

  const dictionaryTermSet = new Set(dictionaryTerms);
  let keywords = Array.from(freq.entries())
    .sort((a, b) => {
      const weightA = a[1] + (dictionaryTermSet.has(a[0]) ? 0.5 : 0);
      const weightB = b[1] + (dictionaryTermSet.has(b[0]) ? 0.5 : 0);
      return weightB - weightA;
    })
    .map(([term]) => term);

  if (keywords.length < 6) {
    const fallback = extractFallbackKeywords(jobDescription, new Set(keywords));
    for (const term of fallback) {
      if (keywords.length >= 8) break;
      keywords.push(term);
      sectionByTerm.set(term, "Experience");
    }
  }

  keywords = keywords.slice(0, 20);

  const matched: string[] = [];
  const missing: string[] = [];

  for (const keyword of keywords) {
    const isPhrase = keyword.includes(" ") || keyword.includes("/");
    const re = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
    const present = isPhrase ? resumeLower.includes(keyword) : re.test(resumeLower);
    if (present) matched.push(keyword);
    else missing.push(keyword);
  }

  const score =
    keywords.length === 0 ? 0 : Math.round((matched.length / keywords.length) * 100);

  let band: string;
  if (score >= 80) band = "Excellent match";
  else if (score >= 60) band = "Good match";
  else if (score >= 40) band = "Fair match";
  else band = "Needs improvement";

  const explanation = `${band}: your resume contains ${matched.length} of the ${keywords.length} most relevant keywords from this job description.`;

  const strengths = matched.slice(0, 8);
  const gaps = missing.slice(0, 10).map((keyword) => ({
    keyword,
    section: sectionByTerm.get(keyword) ?? "Experience",
  }));

  return { score, explanation, strengths, gaps };
}
