
import { auth } from "../../../../../auth";
import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const updateAddressSchema = z.object({
  recipientName: z.string().trim().min(2).max(100).optional(),
  recipientPhone: z.string().trim().regex(/^[6-9]\d{9}$/).optional(),
  line1: z.string().trim().min(3).max(200).optional(),
  line2: z.string().trim().max(200).nullable().optional(),
  city: z.string().trim().min(2).max(100).optional(),
  state: z.string().trim().min(2).max(100).optional(),
  postalCode: z.string().trim().regex(/^\d{6}$/).optional(),
  country: z.literal("India").optional(),
  isDefault: z.boolean().optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: "Provide at least one field to update." },
);

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(
  request: Request,
  { params }: RouteContext,
) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { id } = await params;
    const body: unknown = await request.json();
    const parsed = updateAddressSchema.safeParse(body);

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
      const existing = await tx.address.findFirst({
        where: { id, userId },
      });

      if (!existing) {
        return null;
      }

      if (data.isDefault === true) {
        await tx.address.updateMany({
          where: { userId, isDefault: true },
          data: { isDefault: false },
        });
      }

      // Do not allow the current default to be unset
      // without choosing another default.
      const updateData = { ...data };

      if (
        data.isDefault === false &&
        existing.isDefault
      ) {
        throw new Error("DEFAULT_ADDRESS_CANNOT_BE_UNSET");
      }

      return tx.address.update({
        where: { id },
        data: updateData,
      });
    });

    if (!address) {
      return NextResponse.json(
        { error: "Address not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({ address });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "DEFAULT_ADDRESS_CANNOT_BE_UNSET"
    ) {
      return NextResponse.json(
        {
          error: "Choose another default address before unsetting this one.",
        },
        { status: 400 },
      );
    }

    console.error("PATCH /api/addresses/[id] failed:", error);

    return NextResponse.json(
      { error: "Unable to update address." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: RouteContext,
) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { id } = await params;

    const address = await prisma.address.findFirst({
      where: { id, userId },
    });

    if (!address) {
      return NextResponse.json(
        { error: "Address not found." },
        { status: 404 },
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.address.delete({
        where: { id },
      });

      if (address.isDefault) {
        const replacement = await tx.address.findFirst({
          where: { userId },
          orderBy: { createdAt: "desc" },
        });

        if (replacement) {
          await tx.address.update({
            where: { id: replacement.id },
            data: { isDefault: true },
          });
        }
      }
    });

    return NextResponse.json({
      message: "Address deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE /api/addresses/[id] failed:", error);

    return NextResponse.json(
      { error: "Unable to delete address." },
      { status: 500 },
    );
  }
}
