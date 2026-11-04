
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/src/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { error: "Please sign in to view this order." },
        { status: 401 },
      );
    }

    const { id } = await params;

    const order = await prisma.order.findFirst({
      where: {
        id,
        userId,
      },
      select: {
        id: true,
        orderNumber: true,
        status: true,
        paymentStatus: true,
        subtotal: true,
        shipping: true,
        discount: true,
        total: true,
        shippingRecipientName: true,
        shippingRecipientPhone: true,
        shippingAddressLine1: true,
        shippingAddressLine2: true,
        shippingCity: true,
        shippingState: true,
        shippingPostalCode: true,
        shippingCountry: true,
        createdAt: true,
        items: {
          select: {
            id: true,
            productName: true,
            variantName: true,
            sku: true,
            unitPrice: true,
            quantity: true,
            subtotal: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      order: {
        ...order,
        subtotal: order.subtotal.toString(),
        shipping: order.shipping.toString(),
        discount: order.discount.toString(),
        total: order.total.toString(),
        items: order.items.map((item) => ({
          ...item,
          unitPrice: item.unitPrice.toString(),
          subtotal: item.subtotal.toString(),
        })),
      },
    });
  } catch (error) {
    console.error("GET /api/orders/[id] failed:", error);

    return NextResponse.json(
      { error: "Unable to fetch order details." },
      { status: 500 },
    );
  }
}
