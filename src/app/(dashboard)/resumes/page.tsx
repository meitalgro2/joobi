"use client";

import { useEffect, useState } from "react";
import type { ResumeVersionDTO } from "@/lib/types";
import { UploadResumeModal } from "@/components/UploadResumeModal";
import { LinkResumeModal } from "@/components/LinkResumeModal";
import { LockedFeatureButton } from "@/components/ProTeaser";

export default function ResumesPage() {
  const [resumes, setResumes] = useState<ResumeVersionDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [linkTarget, setLinkTarget] = useState<ResumeVersionDTO | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function loadResumes() {
    try {
      const res = await fetch("/api/resumes");
      const data = await res.json();
      if (res.ok) setResumes(data.resumes);
      else setError("Could not load your resumes. Please refresh and try again.");
    } catch {
      setError("Could not reach the server. Please refresh and try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadResumes();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this resume version? This cannot be undone.")) return;
    setError(null);
    try {
      const res = await fetch(`/api/resumes/${id}`, { method: "DELETE" });
      if (res.ok) {
        setResumes((prev) => prev.filter((r) => r.id !== id));
      } else {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Could not delete this resume.");
      }
    } catch {
      setError("Could not reach the server. Please try again.");
    }
  }

  return (
    <div className="flex flex-col gap-4 px-4 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">Resume Versions</h1>
        <button
          onClick={() => setShowUpload(true)}
          className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
        >
          + Upload
        </button>
      </div>

      {notice && (
        <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {notice}
        </p>
      )}

      {error && (
        <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>
      )}

      {loading ? (
        <p className="text-sm text-slate-500">Loading your resumes…</p>
      ) : resumes.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-10 text-center">
          <p className="text-sm text-slate-500">
            No resume versions yet. Upload your first one to get started.
          </p>
          <button
            onClick={() => setShowUpload(true)}
            className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            Upload New Resume
          </button>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {resumes.map((resume) => (
            <li
              key={resume.id}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-slate-900">{resume.fileName}</p>
                  <p className="text-xs text-slate-500">
                    {resume.roleCategory} ·{" "}
                    {new Date(resume.uploadedAt).toLocaleDateString()}
                  </p>
                  {resume.notes && (
                    <p className="mt-1 text-sm text-slate-600">{resume.notes}</p>
                  )}
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => setLinkTarget(resume)}
                  className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Link to job
                </button>
                <button
                  onClick={() => handleDelete(resume.id)}
                  className="rounded-md border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                >
                  Delete
                </button>
                <LockedFeatureButton icon="✨" label="AI Rewrite" />
              </div>
            </li>
          ))}
        </ul>
      )}

      {showUpload && (
        <UploadResumeModal
          onClose={() => setShowUpload(false)}
          onUploaded={(resume) => {
            setResumes((prev) => [resume, ...prev]);
            setShowUpload(false);
          }}
        />
      )}

      {linkTarget && (
        <LinkResumeModal
          resume={linkTarget}
          onClose={() => setLinkTarget(null)}
          onLinked={() => {
            setNotice(`Linked "${linkTarget.fileName}" to the selected job.`);
            setLinkTarget(null);
          }}
        />
      )}
    </div>
  );
}
