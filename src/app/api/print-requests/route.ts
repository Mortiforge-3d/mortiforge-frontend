import { auth } from "../../../../auth";
import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const printRequestSchema = z.object({
  title: z.string().trim().min(3).max(120),
  projectType: z.enum([
    "prototype",
    "miniature",
    "decor",
    "functional-part",
    "replacement-part",
    "cosplay",
    "other",
  ]),
  quantity: z.coerce.number().int().min(1).max(1000),
  description: z.string().trim().min(20).max(3000),
});

export async function GET() {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const requests = await prisma.printRequest.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        projectType: true,
        quantity: true,
        description: true,
        status: true,
        quotedPrice: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      requests: requests.map((item) => ({
        ...item,
        quotedPrice: item.quotedPrice?.toString() ?? null,
      })),
    });
  } catch (error) {
    console.error("GET /api/print-requests failed:", error);

    return NextResponse.json(
      { error: "Unable to fetch print requests." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: unknown = await request.json();
    const parsed = printRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid print request details.",
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const printRequest = await prisma.printRequest.create({
      data: {
        userId,
        ...parsed.data,
      },
      select: {
        id: true,
        title: true,
        projectType: true,
        quantity: true,
        status: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      { message: "Print request submitted successfully.", request: printRequest },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/print-requests failed:", error);

    return NextResponse.json(
      { error: "Unable to submit print request." },
      { status: 500 },
    );
  }
}