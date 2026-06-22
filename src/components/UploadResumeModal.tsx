"use client";

import { useRef, useState, type FormEvent } from "react";
import type { ResumeVersionDTO } from "@/lib/types";
import { SUPPORTED_RESUME_EXTENSIONS } from "@/lib/constants";

export function UploadResumeModal({
  onClose,
  onUploaded,
}: {
  onClose: () => void;
  onUploaded: (resume: ResumeVersionDTO) => void;
}) {
  const [name, setName] = useState("");
  const [roleCategory, setRoleCategory] = useState("");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!file) {
      setError("Please choose a resume file to upload.");
      return;
    }
    if (!name.trim() || !roleCategory.trim()) {
      setError("Resume name and role/category are required.");
      return;
    }

    const formData = new FormData();
    formData.set("file", file);
    formData.set("name", name);
    formData.set("roleCategory", roleCategory);
    formData.set("notes", notes);

    setSubmitting(true);
    try {
      const res = await fetch("/api/resumes", { method: "POST", body: formData });
      const data = await res.json().catch(() => null);

      if (!res.ok || !data) {
        setError(data?.error ?? "Upload failed. Please try again.");
        return;
      }

      onUploaded(data.resume);
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-30 flex items-end justify-center bg-black/40 sm:items-center">
      <div className="w-full max-w-sm rounded-t-2xl bg-white p-5 sm:rounded-2xl">
        <h2 className="text-lg font-bold text-slate-900">Upload a resume version</h2>
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Resume name *
            </label>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Senior PM — Fintech"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Role / category *
            </label>
            <input
              value={roleCategory}
              onChange={(e) => setRoleCategory(e.target.value)}
              placeholder="e.g. Product Management"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Resume file (PDF, DOC, DOCX) *
            </label>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-1 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm font-semibold text-indigo-600 hover:bg-slate-100"
            >
              {file ? `📄 ${file.name}` : "📎 Choose file"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept={SUPPORTED_RESUME_EXTENSIONS.join(",")}
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="hidden"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {error && (
            <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {error}
            </p>
          )}

          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
            >
              {submitting ? "Uploading…" : "Upload"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
