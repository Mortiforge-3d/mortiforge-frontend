import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { requireAdmin } from "@/src/lib/auth/require-admin";
import { PrintRequestStatus } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const admin = await requireAdmin();

    if (!admin.authorized) {
      return NextResponse.json(
        { error: admin.error },
        { status: admin.status },
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search")?.trim();

    const validStatuses = [
      "SUBMITTED",
      "CONTACTED",
      "DISCUSSING",
      "WAITING_FOR_CUSTOMER",
      "PRICE_FINALIZED",
      "PAYMENT_PENDING",
      "PRINTING",
      "COMPLETED",
      "CLOSED",
    ];

    const requests = await prisma.printRequest.findMany({
      where: {
        ...(status && status !== "all" && validStatuses.includes(status)
          ? { status: status as PrintRequestStatus }
          : {}),
        ...(search
          ? {
              OR: [
                { title: { contains: search, mode: "insensitive" } },
                {
                  user: {
                    name: { contains: search, mode: "insensitive" },
                  },
                },
                {
                  user: {
                    email: { contains: search, mode: "insensitive" },
                  },
                },
              ],
            }
          : {}),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return NextResponse.json({
      requests: requests.map((item) => ({
        ...item,
        quotedPrice: item.quotedPrice?.toString() ?? null,
      })),
    });
  } catch (error) {
    console.error("GET /api/admin/print-requests failed:", error);

    return NextResponse.json(
      { error: "Unable to fetch print requests." },
      { status: 500 },
    );
  }
}