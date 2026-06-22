"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { SUPPORTED_RESUME_EXTENSIONS } from "@/lib/constants";
import type { ResumeVersionDTO } from "@/lib/types";
import { LockedFeatureButton, ProBadge } from "@/components/ProTeaser";

interface AtsResultData {
  score: number;
  explanation: string;
  strengths: string[];
  gaps: { keyword: string; section: string }[];
  resumeFileName: string;
}

type Step = "upload" | "describe" | "result";

export default function AtsPage() {
  const [step, setStep] = useState<Step>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [resumeVersionId, setResumeVersionId] = useState("");
  const [savedResumes, setSavedResumes] = useState<ResumeVersionDTO[]>([]);
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<AtsResultData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/resumes")
      .then((res) => res.json())
      .then((data) => setSavedResumes(data.resumes ?? []));
  }, []);

  function canContinueFromUpload() {
    return Boolean(file || resumeVersionId);
  }

  async function handleAnalyze() {
    setError(null);
    if (!jobDescription.trim()) {
      setError("Please paste the job description before continuing.");
      return;
    }

    const formData = new FormData();
    if (file) formData.set("file", file);
    else formData.set("resumeVersionId", resumeVersionId);
    formData.set("jobDescription", jobDescription);

    setAnalyzing(true);
    try {
      const res = await fetch("/api/ats/analyze", { method: "POST", body: formData });
      const data = await res.json().catch(() => null);

      if (!res.ok || !data) {
        setError(data?.error ?? "ATS analysis failed. Please try again.");
        return;
      }

      setResult(data.analysis);
      setStep("result");
    } catch {
      setError("Could not reach the server. Please check your connection and try again.");
    } finally {
      setAnalyzing(false);
    }
  }

  function reset() {
    setStep("upload");
    setFile(null);
    setResumeVersionId("");
    setJobDescription("");
    setResult(null);
    setError(null);
  }

  return (
    <div className="flex flex-col gap-4 px-4 py-4">
      <h1 className="text-xl font-bold text-slate-900">ATS Match Score</h1>

      {step === "upload" && (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-slate-600">
            Upload your resume, or pick one you already saved in Resume Versions.
          </p>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Upload a resume file
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
              onChange={(e) => {
                setFile(e.target.files?.[0] ?? null);
                setResumeVersionId("");
              }}
              className="hidden"
            />
            <p className="mt-1 text-xs text-slate-500">
              Supported formats: {SUPPORTED_RESUME_EXTENSIONS.join(", ")} · up to 5 MB
            </p>
          </div>

          {savedResumes.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Or choose a saved resume version
              </label>
              <select
                value={resumeVersionId}
                onChange={(e) => {
                  setResumeVersionId(e.target.value);
                  setFile(null);
                }}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
                <option value="">— None —</option>
                {savedResumes.map((resume) => (
                  <option key={resume.id} value={resume.id}>
                    {resume.fileName} ({resume.roleCategory})
                  </option>
                ))}
              </select>
            </div>
          )}

          {error && (
            <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {error}
            </p>
          )}

          <button
            disabled={!canContinueFromUpload()}
            onClick={() => {
              setError(null);
              setStep("describe");
            }}
            className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-40"
          >
            Continue
          </button>
        </div>
      )}

      {step === "describe" && (
        <div className="flex flex-col gap-4">
          <label className="block text-sm font-medium text-slate-700">
            Paste the job description
          </label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={10}
            placeholder="Paste the full job description here…"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />

          {error && (
            <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {error}
            </p>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => setStep("upload")}
              className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Back
            </button>
            <button
              disabled={!jobDescription.trim() || analyzing}
              onClick={handleAnalyze}
              className="flex-1 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-40"
            >
              {analyzing ? "Analyzing…" : "Analyze Match"}
            </button>
          </div>
        </div>
      )}

      {step === "result" && result && (
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-5 text-center">
            <p className="text-sm font-medium text-indigo-700">ATS Match Score</p>
            <p className="text-5xl font-bold text-indigo-700">{result.score}</p>
            <p className="mt-2 text-sm text-slate-700">{result.explanation}</p>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-indigo-600">
              <ProBadge /> Unlimited analyses, included with Pro
            </p>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-slate-800">Strengths</h2>
            {result.strengths.length === 0 ? (
              <p className="mt-1 text-sm text-slate-500">
                No strong keyword matches found yet.
              </p>
            ) : (
              <div className="mt-2 flex flex-wrap gap-2">
                {result.strengths.map((kw) => (
                  <span
                    key={kw}
                    className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-800">
                Areas for improvement
              </h2>
              <LockedFeatureButton icon="✨" label="Auto-fix with AI" />
            </div>
            {result.gaps.length === 0 ? (
              <p className="mt-1 text-sm text-slate-500">
                Great coverage — no major keyword gaps found.
              </p>
            ) : (
              <ul className="mt-2 flex flex-col gap-2">
                {result.gaps.map((gap) => (
                  <li
                    key={gap.keyword}
                    className="flex items-center justify-between rounded-lg border border-amber-100 bg-amber-50 px-3 py-2 text-sm"
                  >
                    <span className="font-medium text-amber-800">{gap.keyword}</span>
                    <span className="text-xs text-amber-600">
                      Add to: {gap.section}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={reset}
              className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Analyze Another Job
            </button>
            <Link
              href="/board"
              className="flex-1 rounded-lg bg-indigo-600 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-indigo-500"
            >
              Back to Board
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
