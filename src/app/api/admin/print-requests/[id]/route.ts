import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { requireAdmin } from "@/src/lib/auth/require-admin";
import { PrintRequestStatus, Prisma } from "@prisma/client";
import { z } from "zod";

const updateSchema = z.object({
  status: z.nativeEnum(PrintRequestStatus).optional(),
  adminNotes: z.string().max(5000).nullable().optional(),
  quotedPrice: z.number().positive().max(99999999.99).nullable().optional(),
});

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const admin = await requireAdmin();

    if (!admin.authorized) {
      return NextResponse.json(
        { error: admin.error },
        { status: admin.status },
      );
    }

    const { id } = await params;

    const printRequest = await prisma.printRequest.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!printRequest) {
      return NextResponse.json(
        { error: "Request not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      request: {
        ...printRequest,
        quotedPrice: printRequest.quotedPrice?.toString() ?? null,
      },
    });
  } catch (error) {
    console.error("GET admin print request failed:", error);

    return NextResponse.json(
      { error: "Unable to fetch request." },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const admin = await requireAdmin();

    if (!admin.authorized) {
      return NextResponse.json(
        { error: admin.error },
        { status: admin.status },
      );
    }

    const { id } = await params;
    const body: unknown = await request.json();
    const parsed = updateSchema.safeParse(body);

    if (!parsed.success || Object.keys(parsed.data ?? {}).length === 0) {
      return NextResponse.json(
        { error: "Invalid update details." },
        { status: 400 },
      );
    }

    const data: Prisma.PrintRequestUpdateInput = {
      ...(parsed.data.status !== undefined && {
        status: parsed.data.status,
      }),
      ...(parsed.data.adminNotes !== undefined && {
        adminNotes: parsed.data.adminNotes,
      }),
      ...(parsed.data.quotedPrice !== undefined && {
        quotedPrice:
          parsed.data.quotedPrice === null
            ? null
            : new Prisma.Decimal(parsed.data.quotedPrice),
      }),
    };

    const result = await prisma.printRequest.updateMany({
      where: { id },
      data,
    });

    if (result.count === 0) {
      return NextResponse.json(
        { error: "Request not found." },
        { status: 404 },
      );
    }

    const updatedRequest = await prisma.printRequest.findUnique({
      where: { id },
    });

    return NextResponse.json({
      message: "Request updated successfully.",
      request: {
        ...updatedRequest,
        quotedPrice: updatedRequest?.quotedPrice?.toString() ?? null,
      },
    });
  } catch (error) {
    console.error("PATCH admin print request failed:", error);

    return NextResponse.json(
      { error: "Unable to update request." },
      { status: 500 },
    );
  }
}