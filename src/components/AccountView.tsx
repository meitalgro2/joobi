"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { searchRoles, type RoleOption } from "@/lib/roles";
import { SENIORITY_OPTIONS, SENIORITY_LABELS, type Seniority } from "@/lib/constants";
import { ProBadge } from "@/components/ProTeaser";

const PRO_FEATURES = [
  "Automated interview prep generation — instant AI briefs instead of the manual concierge queue",
  "Unlimited ATS match analyses",
  "Priority concierge turnaround on requests that still need a human",
  "AI resume rewriter — one-click CV builder",
  "AI intro message generator for recruiters",
  "AI cover letter generator",
  "1:1 career coach access",
];

export function AccountView({
  name: initialName,
  email,
  authProvider,
  desiredRole: initialDesiredRole,
  seniority: initialSeniority,
}: {
  name: string;
  email: string;
  authProvider: string;
  desiredRole: string | null;
  seniority: string | null;
}) {
  return (
    <div className="flex flex-col gap-6 pb-10">
      <h1 className="text-xl font-bold text-slate-900">Account</h1>

      <ProfileSection
        initialName={initialName}
        email={email}
        authProvider={authProvider}
      />

      {authProvider === "credentials" ? (
        <PasswordSection />
      ) : (
        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-slate-800">Password</h2>
          <p className="mt-1 text-sm text-slate-500">
            You signed in with Google, so there&apos;s no Joobi password to manage here.
          </p>
        </section>
      )}

      <ProfessionalSection
        initialDesiredRole={initialDesiredRole}
        initialSeniority={initialSeniority}
      />

      <UpgradeSection />

      <DangerZone />
    </div>
  );
}

function ProfileSection({
  initialName,
  email,
  authProvider,
}: {
  initialName: string;
  email: string;
  authProvider: string;
}) {
  const [name, setName] = useState(initialName);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Could not save your changes.");
        return;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4">
      <h2 className="text-sm font-semibold text-slate-800">Profile</h2>

      <div className="mt-3">
        <label className="block text-sm font-medium text-slate-700">Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      <div className="mt-3">
        <label className="block text-sm font-medium text-slate-700">Email</label>
        <p className="mt-1 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-500">
          {email}
        </p>
      </div>

      <div className="mt-3">
        <span className="text-xs font-medium text-slate-500">Account type: </span>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
          {authProvider === "google" ? "Signed in with Google" : "Email & password"}
        </span>
      </div>

      {error && (
        <p className="mt-3 rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>
      )}

      <button
        onClick={handleSave}
        disabled={saving || !name.trim()}
        className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
      >
        {saving ? "Saving…" : "Save changes"}
      </button>
      {saved && <span className="ml-2 text-sm text-emerald-600">Saved ✓</span>}
    </section>
  );
}

function PasswordSection() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError("New passwords don't match.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/account/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Could not change your password.");
        return;
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSuccess(true);
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4">
      <h2 className="text-sm font-semibold text-slate-800">Password</h2>
      <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-700">
            Current password
          </label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700">
            New password
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700">
            Confirm new password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>

        {error && (
          <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>
        )}
        {success && (
          <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            Password updated.
          </p>
        )}

        <button
          type="submit"
          disabled={submitting || !currentPassword || !newPassword}
          className="self-start rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
        >
          {submitting ? "Updating…" : "Update password"}
        </button>
      </form>
    </section>
  );
}

function ProfessionalSection({
  initialDesiredRole,
  initialSeniority,
}: {
  initialDesiredRole: string | null;
  initialSeniority: string | null;
}) {
  const [roleQuery, setRoleQuery] = useState(initialDesiredRole ?? "");
  const [desiredRole, setDesiredRole] = useState(initialDesiredRole ?? "");
  const [seniority, setSeniority] = useState<Seniority | "">(
    (initialSeniority as Seniority) ?? ""
  );
  const [suggestions, setSuggestions] = useState<RoleOption[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleRoleInput(value: string) {
    setRoleQuery(value);
    setDesiredRole("");
    setSuggestions(value ? searchRoles(value) : []);
  }

  function selectRole(role: RoleOption) {
    setDesiredRole(role.title);
    setRoleQuery(role.title);
    setSuggestions([]);
  }

  async function handleSave() {
    if (!desiredRole.trim()) {
      setError("Please select your desired role from the list.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ desiredRole, seniority: seniority || null }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Could not save your changes.");
        return;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4">
      <h2 className="text-sm font-semibold text-slate-800">Professional profile</h2>

      <div className="mt-3">
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

      <div className="mt-4">
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

      {error && (
        <p className="mt-3 rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>
      )}

      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
      >
        {saving ? "Saving…" : "Save changes"}
      </button>
      {saved && <span className="ml-2 text-sm text-emerald-600">Saved ✓</span>}
    </section>
  );
}

function UpgradeSection() {
  return (
    <section className="rounded-xl border border-indigo-200 bg-indigo-50 p-4">
      <div className="flex items-center gap-2">
        <h2 className="text-sm font-semibold text-indigo-900">Joobi Pro</h2>
        <ProBadge />
      </div>
      <p className="mt-1 text-sm text-indigo-800">
        You&apos;re on the free plan. Pro is coming soon and will include:
      </p>
      <ul className="mt-3 flex flex-col gap-1.5">
        {PRO_FEATURES.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-indigo-900">
            <span className="mt-0.5">✦</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <button
        type="button"
        disabled
        title="Coming soon"
        className="mt-4 rounded-lg bg-indigo-300 px-4 py-2 text-sm font-semibold text-white"
      >
        Upgrade — Coming soon
      </button>
    </section>
  );
}

function DangerZone() {
  const router = useRouter();
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    if (confirmText !== "DELETE") return;
    if (
      !confirm(
        "This permanently deletes your account and all your data — job cards, resumes, ATS analyses, and prep requests. This cannot be undone."
      )
    ) {
      return;
    }

    setDeleting(true);
    setError(null);
    try {
      const res = await fetch("/api/account", { method: "DELETE" });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Could not delete your account.");
        return;
      }

      router.push("/");
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <section className="rounded-xl border border-rose-200 bg-rose-50 p-4">
      <h2 className="text-sm font-semibold text-rose-800">Delete account</h2>
      <p className="mt-1 text-sm text-rose-700">
        This permanently deletes your account and all associated data. Type{" "}
        <strong>DELETE</strong> to confirm.
      </p>
      <input
        value={confirmText}
        onChange={(e) => setConfirmText(e.target.value)}
        placeholder="DELETE"
        className="mt-3 w-full max-w-xs rounded-lg border border-rose-300 px-3 py-2 text-sm"
      />
      {error && (
        <p className="mt-3 rounded-md bg-rose-100 px-3 py-2 text-sm text-rose-800">{error}</p>
      )}
      <button
        onClick={handleDelete}
        disabled={confirmText !== "DELETE" || deleting}
        className="mt-3 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-500 disabled:opacity-40"
      >
        {deleting ? "Deleting…" : "Delete my account"}
      </button>
    </section>
  );
}
