import { mkdir, writeFile, unlink } from "fs/promises";
import path from "path";

const STORAGE_ROOT = path.join(process.cwd(), "storage", "resumes");

export async function saveResumeFile(
  userId: string,
  originalName: string,
  buffer: Buffer
): Promise<string> {
  const userDir = path.join(STORAGE_ROOT, userId);
  await mkdir(userDir, { recursive: true });

  const safeName = originalName.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  const fileName = `${Date.now()}-${safeName}`;
  const fullPath = path.join(userDir, fileName);

  await writeFile(fullPath, buffer);
  return path.join("storage", "resumes", userId, fileName);
}

export async function deleteResumeFile(relativePath: string): Promise<void> {
  const fullPath = path.join(process.cwd(), relativePath);
  await unlink(fullPath).catch(() => undefined);
}
