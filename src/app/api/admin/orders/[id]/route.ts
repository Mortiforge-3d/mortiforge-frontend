import { NextResponse } from "next/server";
import { z } from "zod";
import { OrderStatus } from "@prisma/client";
import { prisma } from "@/src/lib/prisma";
import { requireAdmin } from "@/src/lib/auth/require-admin";

const updateSchema = z.object({
  status: z.nativeEnum(OrderStatus),
});

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

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid order status." },
        { status: 400 },
      );
    }

    const result = await prisma.order.updateMany({
      where: { id },
      data: { status: parsed.data.status },
    });

    if (result.count === 0) {
      return NextResponse.json(
        { error: "Order not found." },
        { status: 404 },
      );
    }

    const updatedOrder = await prisma.order.findUnique({
      where: { id },
      select: {
        id: true,
        orderNumber: true,
        status: true,
        paymentStatus: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      message: "Order status updated successfully.",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("PATCH admin order failed:", error);

    return NextResponse.json(
      { error: "Unable to update order status." },
      { status: 500 },
    );
  }
}