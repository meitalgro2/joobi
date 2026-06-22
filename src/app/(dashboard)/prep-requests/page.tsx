"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PREP_STATUS_LABELS, type PrepStatus } from "@/lib/constants";
import type { PrepRequestDTO } from "@/lib/types";
import { ProBadge } from "@/components/ProTeaser";

type Tab = "mine" | "team";

export default function PrepRequestsPage() {
  const [tab, setTab] = useState<Tab>("mine");
  const [mine, setMine] = useState<PrepRequestDTO[]>([]);
  const [all, setAll] = useState<PrepRequestDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      const [mineRes, allRes] = await Promise.all([
        fetch("/api/prep-requests"),
        fetch("/api/prep-requests/all"),
      ]);
      const mineData = await mineRes.json();
      const allData = await allRes.json();
      setMine(mineData.prepRequests ?? []);
      setAll(allData.prepRequests ?? []);
    } catch {
      setError("Could not reach the server. Please refresh and try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function setStatus(id: string, status: PrepStatus, deliveryNote: string) {
    setError(null);
    try {
      const res = await fetch(`/api/prep-requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, deliveryNote }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Could not update this request.");
        return;
      }
      load();
    } catch {
      setError("Could not reach the server. Please try again.");
    }
  }

  return (
    <div className="flex flex-col gap-4 px-4 py-4">
      <h1 className="text-xl font-bold text-slate-900">Interview Prep Sheets</h1>

      {error && (
        <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>
      )}

      <div className="flex gap-2 rounded-lg bg-slate-100 p-1">
        <button
          onClick={() => setTab("mine")}
          className={`flex-1 rounded-md py-1.5 text-sm font-semibold ${
            tab === "mine" ? "bg-white shadow-sm text-indigo-600" : "text-slate-500"
          }`}
        >
          My Requests
        </button>
        <button
          onClick={() => setTab("team")}
          className={`flex-1 rounded-md py-1.5 text-sm font-semibold ${
            tab === "team" ? "bg-white shadow-sm text-indigo-600" : "text-slate-500"
          }`}
        >
          Team Console
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-slate-500">Loading…</p>
      ) : tab === "mine" ? (
        <MineList requests={mine} />
      ) : (
        <TeamConsole requests={all} onSetStatus={setStatus} />
      )}
    </div>
  );
}

function MineList({ requests }: { requests: PrepRequestDTO[] }) {
  if (requests.length === 0) {
    return (
      <p className="text-sm text-slate-500">
        You haven&apos;t requested an interview prep sheet yet. Open a job card on
        your board to request one.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {requests.map((req) => (
        <li key={req.id} className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <Link
              href={`/jobs/${req.jobCardId}`}
              className="font-semibold text-slate-900 hover:underline"
            >
              {req.jobCard.title} — {req.jobCard.company}
            </Link>
            <StatusBadge status={req.status} />
          </div>
          {req.interviewStage && (
            <p className="mt-1 text-sm text-slate-600">Stage: {req.interviewStage}</p>
          )}
          {req.status === "REQUESTED" && (
            <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
              Standard delivery: within 48 hours · priority 4h delivery with <ProBadge />
            </p>
          )}
          {req.deliveryNote && req.status === "DELIVERED" && (
            <p className="mt-2 whitespace-pre-wrap rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">
              {req.deliveryNote}
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}

function TeamConsole({
  requests,
  onSetStatus,
}: {
  requests: PrepRequestDTO[];
  onSetStatus: (id: string, status: PrepStatus, note: string) => void;
}) {
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  if (requests.length === 0) {
    return <p className="text-sm text-slate-500">No requests have come in yet.</p>;
  }

  return (
    <ul className="flex flex-col gap-3">
      {requests.map((req) => (
        <li key={req.id} className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-slate-900">
              {req.jobCard.title} — {req.jobCard.company}
            </p>
            <StatusBadge status={req.status} />
          </div>
          <p className="text-xs text-slate-500">
            Requested by {req.user?.name ?? "a user"} (
            {new Date(req.createdAt).toLocaleString()})
          </p>
          {req.interviewStage && (
            <p className="mt-1 text-sm text-slate-600">Stage: {req.interviewStage}</p>
          )}
          {req.interviewDate && (
            <p className="text-sm text-slate-600">
              Interview date: {new Date(req.interviewDate).toLocaleDateString()}
            </p>
          )}
          {req.concerns && (
            <p className="mt-1 text-sm text-slate-600">Concerns: {req.concerns}</p>
          )}

          {req.status === "REQUESTED" && (
            <div className="mt-3 flex flex-col gap-2">
              <textarea
                placeholder="Paste the prep sheet content to deliver…"
                value={drafts[req.id] ?? ""}
                onChange={(e) =>
                  setDrafts((prev) => ({ ...prev, [req.id]: e.target.value }))
                }
                rows={3}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => onSetStatus(req.id, "DELIVERED", drafts[req.id] ?? "")}
                  className="flex-1 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
                >
                  Mark Delivered
                </button>
                <button
                  onClick={() =>
                    onSetStatus(
                      req.id,
                      "DECLINED",
                      drafts[req.id] || "We can't prepare a brief for this role."
                    )
                  }
                  className="flex-1 rounded-lg border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50"
                >
                  Decline
                </button>
              </div>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

function StatusBadge({ status }: { status: PrepStatus }) {
  const colors: Record<PrepStatus, string> = {
    REQUESTED: "bg-amber-100 text-amber-700",
    DELIVERED: "bg-emerald-100 text-emerald-700",
    DECLINED: "bg-rose-100 text-rose-700",
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${colors[status]}`}>
      {PREP_STATUS_LABELS[status]}
    </span>
  );
}
