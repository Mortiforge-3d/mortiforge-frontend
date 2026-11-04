import { auth } from "../../../auth";
import { prisma } from "@/src/lib/prisma";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  // User must be logged in.
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/admin");
  }

  // Always verify the role against the database.
  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      role: true,
    },
  });

  // Only administrators can access admin pages.
  if (!user || user.role !== "ADMIN") {
    redirect("/");
  }

  return <div className="pt-8">{children}</div>;
}