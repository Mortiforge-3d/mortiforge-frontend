
import { auth } from "../../../auth";
import { prisma } from "../prisma";

export async function requireAdmin() {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      authorized: false as const,
      status: 401,
      error: "Authentication required.",
    };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (!user || user.role !== "ADMIN") {
    return {
      authorized: false as const,
      status: 403,
      error: "Admin access required.",
    };
  }

  return {
    authorized: true as const,
    userId: session.user.id,
  };
}
