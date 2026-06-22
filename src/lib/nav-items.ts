export const NAV_ITEMS = [
  { href: "/board", label: "Board", icon: "📋" },
  { href: "/resumes", label: "Resumes", icon: "📄" },
  { href: "/ats", label: "ATS Score", icon: "🎯" },
  { href: "/prep-requests", label: "Prep Sheets", icon: "🗒️" },
] as const;

export const LOCKED_NAV_ITEMS = [
  { label: "Analytics", icon: "📊" },
  { label: "Network CRM", icon: "🤝" },
  { label: "Career Coach", icon: "🎓" },
  { label: "Salary Lookup", icon: "💰" },
] as const;
