import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, token: string) {
  const verifyUrl = `${process.env.APP_URL}/api/verify-email?token=${token}`;

  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM ?? "Joobi <onboarding@resend.dev>",
    to: email,
    subject: "Verify your Joobi account",
    html: `
      <div style="font-family: sans-serif; max-width: 480px;">
        <h2>Welcome to Joobi</h2>
        <p>Click the button below to verify your email and start managing your job search.</p>
        <p>
          <a href="${verifyUrl}" style="display:inline-block;background:#4f46e5;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;">
            Verify my email
          </a>
        </p>
        <p>This link expires in 1 hour. If you didn't create a Joobi account, you can ignore this email.</p>
      </div>
    `,
  });

  if (error) {
    console.error("Resend failed to send verification email:", error);
  }
}
