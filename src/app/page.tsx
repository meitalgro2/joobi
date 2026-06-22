import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const PROBLEMS = [
  {
    icon: "🌀",
    title: "Loss of Control",
    body: "20+ applications across spreadsheets, browser tabs, and sticky notes. Your search outgrows your system before you notice.",
  },
  {
    icon: "🤖",
    title: "Identity Erosion",
    body: "You feel like a data point instead of a leader — because every reply is a bot, and your outreach was never built for real people.",
  },
  {
    icon: "⏳",
    title: "Time Poverty",
    body: "Hours a day spent on manual tracking instead of networking, interview prep, or the people who matter.",
  },
];

const FEATURES = [
  {
    icon: "📋",
    title: "Visual Kanban Board",
    body: "Every opportunity in one workspace — drag through To Apply, Applied, Interviewing, Offer, and beyond.",
  },
  {
    icon: "📄",
    title: "Resume Version Tracker",
    body: "Upload tailored CVs per role and always know which version you sent to which company.",
  },
  {
    icon: "🎯",
    title: "ATS Match Score",
    body: "A 0–100 fit score with strengths and keyword gaps, so you know before you apply — not after the rejection.",
  },
  {
    icon: "🗒️",
    title: "Interview Prep Sheet",
    body: "Request a one-page briefing for any upcoming interview, built around the specific role and company.",
  },
];

const STEPS = [
  { step: "1", title: "Add your jobs", body: "Centralize every opportunity on one board the moment you find it." },
  { step: "2", title: "Match your resume", body: "Run an ATS check against the job description before you apply." },
  { step: "3", title: "Walk in prepared", body: "Request a prep sheet and walk into the interview with a real edge." },
];

const PRICING_ROWS = [
  { feature: "Kanban board & resume tracker", free: true },
  { feature: "ATS match score & keyword gaps", free: true, proNote: "Unlimited analyses" },
  {
    feature: "Interview prep sheet",
    free: true,
    freeNote: "Manual request, ~48h",
    proNote: "Instant AI generation, priority 4h",
  },
  { feature: "AI resume rewriter", free: false },
  { feature: "AI intro message generator", free: false },
  { feature: "AI cover letter generator", free: false },
  { feature: "1:1 career coach access", free: false },
];

export default async function Home() {
  const session = await auth();
  if (session) redirect("/board");

  return (
    <div className="flex flex-1 flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/90 px-6 py-4 backdrop-blur">
        <span className="text-lg font-bold text-indigo-600">Joobi</span>
        <nav className="flex items-center gap-3">
          <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            Log in
          </Link>
          <Link
            href="/register"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            Get Started
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="px-6 py-20 text-center">
        <div className="mx-auto max-w-2xl">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-1.5 text-sm font-medium text-indigo-700">
            AI-Powered Career Copilot
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Take back control of your job search.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-slate-600">
            Joobi turns the chaotic, fragmented process of job hunting into a structured,
            high-conversion project — so you stop being a passive applicant and start being
            a high-value candidate who commands the hiring process.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/register"
              className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
            >
              Get started — it&apos;s free
            </Link>
            <Link
              href="/login"
              className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Log in
            </Link>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="bg-slate-50 px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-2xl font-bold text-slate-900">
            Applying often feels like shouting into a black hole.
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {PROBLEMS.map((p) => (
              <div key={p.title} className="rounded-xl border border-slate-200 bg-white p-6">
                <span className="text-2xl">{p.icon}</span>
                <h3 className="mt-3 font-semibold text-slate-900">{p.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution / Features */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-2xl font-bold text-slate-900">
            One platform. Every step of the search.
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-xl border border-slate-200 bg-white p-6">
                <span className="text-2xl">{f.icon}</span>
                <h3 className="mt-3 font-semibold text-slate-900">{f.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-slate-50 px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-2xl font-bold text-slate-900">How it works</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.step} className="text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
                  {s.step}
                </div>
                <h3 className="mt-3 font-semibold text-slate-900">{s.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Joobi */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-slate-900">Why Joobi</h2>
          <p className="mt-4 text-lg text-slate-600">
            Most tools give you a tracker, or a resume checker — never both. Joobi connects
            application management, resume version control, and resume-job fit analysis into
            one guided workflow, so you always know what to do next for every role.
          </p>
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="bg-slate-50 px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-2xl font-bold text-slate-900">Simple pricing</h2>
          <p className="mt-2 text-center text-sm text-slate-500">
            Start free. Upgrade when you want an extra edge.
          </p>

          <div className="mt-10 overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="px-5 py-4 font-medium text-slate-500">Feature</th>
                  <th className="px-5 py-4 text-center">
                    <span className="font-semibold text-slate-900">Free</span>
                    <p className="mt-0.5 text-xs font-normal text-slate-500">$0</p>
                  </th>
                  <th className="px-5 py-4 text-center">
                    <span className="font-semibold text-indigo-700">Pro</span>
                    <p className="mt-0.5 text-xs font-normal text-slate-500">
                      $9.99 / month
                    </p>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {PRICING_ROWS.map((row) => (
                  <tr key={row.feature}>
                    <td className="px-5 py-3 text-slate-700">{row.feature}</td>
                    <td className="px-5 py-3 text-center">
                      {row.free ? (
                        <span className="text-emerald-600">✓</span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                      {row.freeNote && (
                        <p className="text-xs text-slate-400">{row.freeNote}</p>
                      )}
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span className="text-indigo-600">✓</span>
                      {row.proNote && (
                        <p className="text-xs text-slate-400">{row.proNote}</p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Link
              href="/register"
              className="rounded-lg bg-indigo-600 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-indigo-500"
            >
              Get started free
            </Link>
            <span className="rounded-lg border border-slate-200 px-4 py-2.5 text-center text-sm font-semibold text-slate-400">
              Pro — not available yet
            </span>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-20 text-center">
        <h2 className="text-3xl font-bold text-slate-900">
          Take back control of your future.
        </h2>
        <Link
          href="/register"
          className="mt-6 inline-block rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
        >
          Get started — it&apos;s free
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 px-6 py-8 text-center text-sm text-slate-500">
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/login" className="hover:text-slate-700">
            Log in
          </Link>
          <span>Terms</span>
          <span>Privacy</span>
        </div>
        <p className="mt-4">
          Running a career center or staffing agency?{" "}
          <a href="mailto:partners@joobi.app" className="font-medium text-indigo-600 hover:text-indigo-500">
            Get in touch for Career Centers &amp; Agencies
          </a>
        </p>
        <p className="mt-4">&copy; {new Date().getFullYear()} Joobi.</p>
      </footer>
    </div>
  );
}
