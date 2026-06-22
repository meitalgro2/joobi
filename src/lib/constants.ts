export const STAGES = [
  "TO_APPLY",
  "APPLIED",
  "INTERVIEWING",
  "OFFER",
  "REJECTED",
  "ACCEPTED",
] as const;

export type Stage = (typeof STAGES)[number];

export const STAGE_LABELS: Record<Stage, string> = {
  TO_APPLY: "To Apply",
  APPLIED: "Applied",
  INTERVIEWING: "Interviewing",
  OFFER: "Offer",
  REJECTED: "Rejected",
  ACCEPTED: "Accepted",
};

export const PREP_STATUSES = ["REQUESTED", "DELIVERED", "DECLINED"] as const;
export type PrepStatus = (typeof PREP_STATUSES)[number];

export const PREP_STATUS_LABELS: Record<PrepStatus, string> = {
  REQUESTED: "Requested",
  DELIVERED: "Delivered",
  DECLINED: "Declined",
};

export const SUPPORTED_RESUME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const SUPPORTED_RESUME_EXTENSIONS = [".pdf", ".doc", ".docx"];

export const MAX_RESUME_SIZE_BYTES = 5 * 1024 * 1024;

export const SENIORITY_OPTIONS = ["0-2", "3-5", "6-10", "10+"] as const;
export type Seniority = (typeof SENIORITY_OPTIONS)[number];

export const SENIORITY_LABELS: Record<Seniority, string> = {
  "0-2": "0-2 yrs",
  "3-5": "3-5 yrs",
  "6-10": "6-10 yrs",
  "10+": "10+ yrs",
};
