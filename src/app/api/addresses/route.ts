
import { auth } from "../../../../auth";
import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const addressSchema = z.object({
  recipientName: z.string().trim().min(2).max(100),
  recipientPhone: z.string().trim().regex(/^[6-9]\d{9}$/, {
    message: "Enter a valid 10-digit Indian mobile number.",
  }),
  line1: z.string().trim().min(3).max(200),
  line2: z.string().trim().max(200).optional().nullable(),
  city: z.string().trim().min(2).max(100),
  state: z.string().trim().min(2).max(100),
  postalCode: z.string().trim().regex(/^\d{6}$/, {
    message: "Enter a valid 6-digit Indian PIN code.",
  }),
  country: z.literal("India").default("India"),
  isDefault: z.boolean().optional().default(false),
});

export async function GET() {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({ addresses });
  } catch (error) {
    console.error("GET /api/addresses failed:", error);

    return NextResponse.json(
      { error: "Unable to fetch addresses." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const body: unknown = await request.json();
    const parsed = addressSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid address details.",
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const data = parsed.data;

    const address = await prisma.$transaction(async (tx) => {
      const existingCount = await tx.address.count({
        where: { userId },
      });

      // The first saved address becomes the default.
      const isDefault = existingCount === 0 || data.isDefault;

      if (isDefault) {
        await tx.address.updateMany({
          where: { userId, isDefault: true },
          data: { isDefault: false },
        });
      }

      return tx.address.create({
        data: {
          userId,
          recipientName: data.recipientName,
          recipientPhone: data.recipientPhone,
          line1: data.line1,
          line2: data.line2 || null,
          city: data.city,
          state: data.state,
          postalCode: data.postalCode,
          country: data.country,
          isDefault,
        },
      });
    });

    return NextResponse.json({ address }, { status: 201 });
  } catch (error) {
    console.error("POST /api/addresses failed:", error);

    return NextResponse.json(
      { error: "Unable to save address." },
      { status: 500 },
    );
  }
}
