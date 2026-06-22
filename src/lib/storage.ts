import { supabaseAdmin } from "@/lib/supabase";

const BUCKET = "jobi";

export async function saveResumeFile(
  userId: string,
  originalName: string,
  buffer: Buffer
): Promise<string> {
  const safeName = originalName.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  const path = `resumes/${userId}/${Date.now()}-${safeName}`;

  const { error } = await supabaseAdmin.storage.from(BUCKET).upload(path, buffer, {
    contentType: "application/octet-stream",
    upsert: false,
  });
  if (error) throw error;

  return path;
}

export async function deleteResumeFile(path: string): Promise<void> {
  await supabaseAdmin.storage.from(BUCKET).remove([path]);
}
