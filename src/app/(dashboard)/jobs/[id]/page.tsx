"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { STAGES, STAGE_LABELS, PREP_STATUS_LABELS, type Stage } from "@/lib/constants";
import type { JobCardDTO, PrepRequestDTO, ResumeVersionDTO } from "@/lib/types";
import { LockedFeatureButton } from "@/components/ProTeaser";

interface JobCardDetail extends JobCardDTO {
  prepRequests: PrepRequestDTO[];
}

export default function JobDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [job, setJob] = useState<JobCardDetail | null>(null);
  const [resumes, setResumes] = useState<ResumeVersionDTO[]>([]);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showPrepForm, setShowPrepForm] = useState(false);

  async function loadJob() {
    try {
      const res = await fetch(`/api/job-cards/${params.id}`);
      if (!res.ok) {
        setError("Job card not found.");
        return;
      }
      const data = await res.json();
      setJob(data.jobCard);
      setNotes(data.jobCard.notes ?? "");
    } catch {
      setError("Could not reach the server. Please refresh and try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadJob();
    fetch("/api/resumes")
      .then((res) => res.json())
      .then((data) => setResumes(data.resumes ?? []))
      .catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only refetch when the job id changes
  }, [params.id]);

  async function updateJob(patch: Record<string, unknown>): Promise<boolean> {
    if (!job) return false;
    try {
      const res = await fetch(`/api/job-cards/${job.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data) {
        setJob(data.jobCard);
        return true;
      }
      setActionError(data?.error ?? "Could not save your changes.");
      return false;
    } catch {
      setActionError("Could not reach the server. Please try again.");
      return false;
    }
  }

  async function handleSaveNotes() {
    setActionError(null);
    const ok = await updateJob({ notes });
    if (ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  }

  async function handleDelete() {
    if (!job) return;
    if (!confirm("Delete this job card? This cannot be undone.")) return;
    setDeleting(true);
    setActionError(null);
    try {
      const res = await fetch(`/api/job-cards/${job.id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/board");
        return;
      }
      const data = await res.json().catch(() => null);
      setActionError(data?.error ?? "Could not delete this job card.");
    } catch {
      setActionError("Could not reach the server. Please try again.");
    } finally {
      setDeleting(false);
    }
  }

  if (loading) return <p className="px-4 py-6 text-sm text-slate-500">Loading…</p>;
  if (error || !job)
    return <p className="px-4 py-6 text-sm text-rose-600">{error}</p>;

  return (
    <div className="flex flex-col gap-5 px-4 py-4">
      <Link
        href="/board"
        className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-700"
      >
        ← Back to board
      </Link>

      {actionError && (
        <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{actionError}</p>
      )}

      <div>
        <h1 className="text-xl font-bold text-slate-900">{job.title}</h1>
        <p className="text-sm text-slate-500">{job.company}</p>
        {job.link && (
          <a
            href={job.link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-block text-sm text-indigo-600 hover:underline"
          >
            View job posting ↗
          </a>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Stage</label>
        <select
          value={job.stage}
          onChange={(e) => updateJob({ stage: e.target.value as Stage })}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        >
          {STAGES.map((s) => (
            <option key={s} value={s}>
              {STAGE_LABELS[s]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">
          Linked resume version
        </label>
        <select
          value={job.resumeVersionId ?? ""}
          onChange={(e) => updateJob({ resumeVersionId: e.target.value || null })}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="">— None —</option>
          {resumes.map((r) => (
            <option key={r.id} value={r.id}>
              {r.fileName} ({r.roleCategory})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">
          Private notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={5}
          placeholder="Interview details, recruiter contacts, next steps…"
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        <button
          onClick={handleSaveNotes}
          className="mt-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          Save notes
        </button>
        {saved && <span className="ml-2 text-sm text-emerald-600">Saved ✓</span>}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-800">
            Interview Prep Sheet
          </h2>
          {!showPrepForm && (
            <div className="flex items-center gap-2">
              <LockedFeatureButton icon="⚡" label="Auto-generate now" />
              <button
                onClick={() => setShowPrepForm(true)}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                Request
              </button>
            </div>
          )}
        </div>

        {(job.prepRequests?.length ?? 0) > 0 && (
          <ul className="mt-3 flex flex-col gap-2">
            {job.prepRequests.map((req) => (
              <li
                key={req.id}
                className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-800">
                    {PREP_STATUS_LABELS[req.status]}
                  </span>
                  <span className="text-xs text-slate-500">
                    {new Date(req.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {req.status === "REQUESTED" && (
                  <p className="mt-1 text-xs text-slate-500">
                    The team will deliver your brief within 48 hours.
                  </p>
                )}
                {req.status === "DECLINED" && (
                  <p className="mt-1 text-xs text-rose-600">
                    This request was declined and won&apos;t be delivered.
                    {req.deliveryNote ? ` ${req.deliveryNote}` : ""}
                  </p>
                )}
                {req.status === "DELIVERED" && req.deliveryNote && (
                  <p className="mt-1 whitespace-pre-wrap text-xs text-slate-700">
                    {req.deliveryNote}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}

        {showPrepForm && (
          <PrepRequestForm
            jobCardId={job.id}
            onClose={() => setShowPrepForm(false)}
            onCreated={() => {
              setShowPrepForm(false);
              loadJob();
            }}
          />
        )}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="text-sm font-semibold text-slate-800">AI Outreach</h2>
        <p className="mt-1 text-xs text-slate-500">
          Generate tailored messages for this job in seconds.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <LockedFeatureButton icon="✉️" label="Generate intro message" />
          <LockedFeatureButton icon="📄" label="Generate cover letter" />
        </div>
      </div>

      <button
        onClick={handleDelete}
        disabled={deleting}
        className="mt-2 rounded-lg border border-rose-200 px-4 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 disabled:opacity-60"
      >
        {deleting ? "Deleting…" : "Delete job card"}
      </button>
    </div>
  );
}

function PrepRequestForm({
  jobCardId,
  onClose,
  onCreated,
}: {
  jobCardId: string;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [interviewStage, setInterviewStage] = useState("");
  const [interviewDate, setInterviewDate] = useState("");
  const [concerns, setConcerns] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/prep-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobCardId, interviewStage, interviewDate, concerns }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Could not submit your request.");
        return;
      }

      onCreated();
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-3 border-t border-slate-100 pt-3">
      <div>
        <label className="block text-xs font-medium text-slate-700">
          Interview stage
        </label>
        <input
          value={interviewStage}
          onChange={(e) => setInterviewStage(e.target.value)}
          placeholder="e.g. System Design round"
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-700">
          Interview date
        </label>
        <input
          type="date"
          value={interviewDate}
          onChange={(e) => setInterviewDate(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-700">
          Specific concerns or questions
        </label>
        <textarea
          value={concerns}
          onChange={(e) => setConcerns(e.target.value)}
          rows={3}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
      </div>

      {error && (
        <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
        >
          {submitting ? "Submitting…" : "Submit request"}
        </button>
      </div>
    </form>
  );
}
