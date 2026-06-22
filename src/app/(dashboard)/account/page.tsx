import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { AccountView } from "@/components/AccountView";

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) redirect("/api/force-logout");

  return (
    <div className="px-4 py-4">
      <AccountView
        name={user.name}
        email={user.email}
        authProvider={user.authProvider}
        desiredRole={user.desiredRole}
        seniority={user.seniority}
      />
    </div>
  );
}
