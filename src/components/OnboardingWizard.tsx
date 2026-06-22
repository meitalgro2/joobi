"use client";

import { useState, useRef, type DragEvent } from "react";
import { useRouter } from "next/navigation";
import { searchRoles, type RoleOption } from "@/lib/roles";
import {
  SENIORITY_OPTIONS,
  SENIORITY_LABELS,
  SUPPORTED_RESUME_EXTENSIONS,
  type Seniority,
} from "@/lib/constants";

type Step = "profile" | "resume";

export function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("profile");

  const [roleQuery, setRoleQuery] = useState("");
  const [desiredRole, setDesiredRole] = useState("");
  const [seniority, setSeniority] = useState<Seniority | "">("");
  const [suggestions, setSuggestions] = useState<RoleOption[]>([]);
  const [profileError, setProfileError] = useState<string | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleRoleInput(value: string) {
    setRoleQuery(value);
    setDesiredRole("");
    setSuggestions(searchRoles(value));
  }

  function selectRole(role: RoleOption) {
    setDesiredRole(role.title);
    setRoleQuery(role.title);
    setSuggestions([]);
  }

  function handleContinueFromProfile() {
    if (!desiredRole.trim()) {
      setProfileError("Please select your desired role from the list.");
      return;
    }
    setProfileError(null);
    setStep("resume");
  }

  async function finish(uploadedFile: File | null) {
    setSubmitting(true);
    setUploadError(null);

    const formData = new FormData();
    formData.set("desiredRole", desiredRole);
    if (seniority) formData.set("seniority", seniority);
    if (uploadedFile) formData.set("file", uploadedFile);

    try {
      const res = await fetch("/api/onboarding", { method: "POST", body: formData });
      const data = await res.json().catch(() => null);

      if (!res.ok || !data) {
        setUploadError(data?.error ?? "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }

      router.push("/board");
    } catch {
      setUploadError("Could not reach the server. Please try again.");
      setSubmitting(false);
    }
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) {
      setFile(dropped);
      finish(dropped);
    }
  }

  if (step === "profile") {
    return (
      <div className="w-full max-w-sm">
        <ProgressDots active={0} />
        <h1 className="mt-4 text-xl font-bold text-slate-900">Tell us about you</h1>
        <p className="mt-1 text-sm text-slate-600">
          We&apos;ll help you find the right opportunities
        </p>

        <div className="mt-6">
          <label className="block text-sm font-medium text-slate-700">Desired role</label>
          <input
            value={roleQuery}
            onChange={(e) => handleRoleInput(e.target.value)}
            placeholder="e.g. Product Manager"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          {suggestions.length > 0 && (
            <ul className="mt-1 max-h-56 overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-sm">
              {suggestions.map((role) => (
                <li key={role.title}>
                  <button
                    type="button"
                    onClick={() => selectRole(role)}
                    className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-indigo-50"
                  >
                    <span className="font-medium text-indigo-700">{role.title}</span>
                    <span className="text-xs text-slate-400">{role.category}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-5">
          <label className="block text-sm font-medium text-slate-700">Seniority</label>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {SENIORITY_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setSeniority(option)}
                className={`rounded-full border px-2 py-1.5 text-xs font-medium ${
                  seniority === option
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                    : "border-slate-300 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {SENIORITY_LABELS[option]}
              </button>
            ))}
          </div>
        </div>

        {profileError && (
          <p className="mt-4 rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {profileError}
          </p>
        )}

        <button
          onClick={handleContinueFromProfile}
          className="mt-6 w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          Continue
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <ProgressDots active={1} />
      <h1 className="mt-4 text-xl font-bold text-slate-900">Upload your resume</h1>
      <p className="mt-1 text-sm text-slate-600">
        We&apos;ll use it for ATS analysis &amp; suggestions
      </p>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`mt-6 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-10 text-center ${
          dragOver ? "border-indigo-400 bg-indigo-50" : "border-slate-300 bg-slate-50"
        }`}
      >
        <span className="text-2xl">⬆️</span>
        {file ? (
          <p className="text-sm font-medium text-slate-700">{file.name}</p>
        ) : (
          <>
            <p className="text-sm font-medium text-slate-700">
              Drag here or tap to upload
            </p>
            <p className="text-xs text-slate-400">Up to 5MB</p>
          </>
        )}
        <div className="mt-1 flex gap-1.5">
          {SUPPORTED_RESUME_EXTENSIONS.map((ext) => (
            <span
              key={ext}
              className="rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-medium uppercase text-slate-500"
            >
              {ext.replace(".", "")}
            </span>
          ))}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept={SUPPORTED_RESUME_EXTENSIONS.join(",")}
          className="hidden"
          onChange={(e) => {
            const picked = e.target.files?.[0] ?? null;
            setFile(picked);
            if (picked) finish(picked);
          }}
        />
      </div>

      {uploadError && (
        <p className="mt-4 rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {uploadError}
        </p>
      )}

      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={submitting}
        className="mt-4 w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
      >
        {submitting ? "Uploading…" : "Choose file"}
      </button>
      <button
        onClick={() => finish(null)}
        disabled={submitting}
        className="mt-2 w-full text-center text-sm font-medium text-slate-500 hover:text-slate-700"
      >
        You can do this later — Skip for now
      </button>

      <div className="mt-5 rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
        <strong>Why upload?</strong> Joobi will analyze your CV and show a match score
        for every job you add.
      </div>
    </div>
  );
}

function ProgressDots({ active }: { active: 0 | 1 }) {
  return (
    <div className="flex gap-1.5">
      {[0, 1].map((i) => (
        <span
          key={i}
          className={`h-1 flex-1 rounded-full ${i <= active ? "bg-indigo-600" : "bg-slate-200"}`}
        />
      ))}
    </div>
  );
}
