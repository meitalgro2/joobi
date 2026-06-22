import type { Stage, PrepStatus } from "@/lib/constants";

export interface ResumeVersionDTO {
  id: string;
  fileName: string;
  filePath: string;
  roleCategory: string;
  notes: string | null;
  uploadedAt: string;
}

export interface JobCardDTO {
  id: string;
  title: string;
  company: string;
  link: string | null;
  stage: Stage;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  resumeVersionId: string | null;
  resumeVersion: ResumeVersionDTO | null;
}

export interface PrepRequestDTO {
  id: string;
  jobCardId: string;
  jobCard: JobCardDTO;
  interviewStage: string | null;
  interviewDate: string | null;
  concerns: string | null;
  status: PrepStatus;
  deliveryNote: string | null;
  createdAt: string;
  user?: { name: string; email: string };
}
