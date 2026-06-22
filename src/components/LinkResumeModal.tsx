"use client";

import { useEffect, useState } from "react";
import type { JobCardDTO, ResumeVersionDTO } from "@/lib/types";

export function LinkResumeModal({
  resume,
  onClose,
  onLinked,
}: {
  resume: ResumeVersionDTO;
  onClose: () => void;
  onLinked: () => void;
}) {
  const [jobCards, setJobCards] = useState<JobCardDTO[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/job-cards")
      .then((res) => res.json())
      .then((data) => setJobCards(data.jobCards ?? []))
      .catch(() => setError("Could not load your jobs. Please close and try again."))
      .finally(() => setLoading(false));
  }, []);

  async function handleLink() {
    if (!selectedId) {
      setError("Please choose a job application.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/job-cards/${selectedId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeVersionId: resume.id }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Could not link this resume.");
        return;
      }

      onLinked();
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-30 flex items-end justify-center bg-black/40 sm:items-center">
      <div className="w-full max-w-sm rounded-t-2xl bg-white p-5 sm:rounded-2xl">
        <h2 className="text-lg font-bold text-slate-900">
          Link &ldquo;{resume.fileName}&rdquo; to a job
        </h2>

        {loading ? (
          <p className="mt-4 text-sm text-slate-500">Loading your jobs…</p>
        ) : jobCards.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">
            You don&apos;t have any job cards yet. Add one from the board first.
          </p>
        ) : (
          <div className="mt-4 flex flex-col gap-2">
            {jobCards.map((card) => (
              <label
                key={card.id}
                className="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-2 text-sm"
              >
                <input
                  type="radio"
                  name="jobCard"
                  value={card.id}
                  checked={selectedId === card.id}
                  onChange={() => setSelectedId(card.id)}
                />
                <span>
                  <span className="font-medium text-slate-900">{card.title}</span>{" "}
                  <span className="text-slate-500">— {card.company}</span>
                </span>
              </label>
            ))}
          </div>
        )}

        {error && (
          <p className="mt-3 rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {error}
          </p>
        )}

        <div className="mt-4 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={handleLink}
            disabled={submitting || jobCards.length === 0}
            className="flex-1 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
          >
            {submitting ? "Linking…" : "Link resume"}
          </button>
        </div>
      </div>
    </div>
  );
}
