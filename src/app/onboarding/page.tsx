import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { OnboardingWizard } from "@/components/OnboardingWizard";

export default async function OnboardingPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) redirect("/api/force-logout");
  if (user.onboardingCompletedAt) redirect("/board");

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-12">
      <OnboardingWizard />
    </main>
  );
}
