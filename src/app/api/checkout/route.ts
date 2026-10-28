
import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";

import { auth } from "../../../../auth";
import { prisma } from "../../../lib/prisma";
import { reserveInventory } from "../../../lib/inventory";

const checkoutSchema = z.object({
  addressId: z.string().min(1),
});

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
    const parsed = checkoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "A valid addressId is required." },
        { status: 400 },
      );
    }

    const { addressId } = parsed.data;

    const order = await prisma.$transaction(async (tx) => {
      const address = await tx.address.findFirst({
        where: { id: addressId, userId },
      });

      if (!address) {
        throw new Error("ADDRESS_NOT_FOUND");
      }

      const cart = await tx.cart.findUnique({
        where: { userId },
        include: {
          items: {
            include: {
              productVariant: {
                include: { product: true },
              },
            },
          },
        },
      });

      if (!cart || cart.items.length === 0) {
        throw new Error("CART_EMPTY");
      }

      let subtotal = new Prisma.Decimal(0);

      for (const item of cart.items) {
        const variant = item.productVariant;

        if (
          variant.status !== "ACTIVE" ||
          variant.product.status !== "PUBLISHED"
        ) {
          throw new Error("PRODUCT_UNAVAILABLE");
        }

        if (
          !Number.isInteger(item.quantity) ||
          item.quantity < 1 ||
          item.quantity > 99
        ) {
          throw new Error("INVALID_CART_QUANTITY");
        }

        subtotal = subtotal.add(
          variant.price.mul(item.quantity),
        );
      }

      const shipping = new Prisma.Decimal(0);
      const discount = new Prisma.Decimal(0);
      const total = subtotal.add(shipping).sub(discount);

      const createdOrder = await tx.order.create({
        data: {
          orderNumber: `MF-${randomUUID()}`,
          userId,
          addressId: address.id,
          status: "PENDING",
          paymentStatus: "PENDING",
          subtotal,
          shipping,
          discount,
          total,

          shippingRecipientName: address.recipientName,
          shippingRecipientPhone: address.recipientPhone,
          shippingAddressLine1: address.line1,
          shippingAddressLine2: address.line2,
          shippingCity: address.city,
          shippingState: address.state,
          shippingPostalCode: address.postalCode,
          shippingCountry: address.country,
        },
      });

      for (const item of cart.items) {
        const variant = item.productVariant;

        await reserveInventory(tx, {
          orderId: createdOrder.id,
          productVariantId: variant.id,
          quantity: item.quantity,
        });

        await tx.orderItem.create({
          data: {
            orderId: createdOrder.id,
            productVariantId: variant.id,
            productName: variant.product.name,
            variantName: variant.color,
            sku: variant.sku,
            unitPrice: variant.price,
            quantity: item.quantity,
            subtotal: variant.price.mul(item.quantity),
          },
        });
      }

      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return createdOrder;
    });

    return NextResponse.json(
      {
        message: "Order created and inventory reserved.",
        order: {
          id: order.id,
          orderNumber: order.orderNumber,
          status: order.status,
          paymentStatus: order.paymentStatus,
          subtotal: order.subtotal.toString(),
          shipping: order.shipping.toString(),
          discount: order.discount.toString(),
          total: order.total.toString(),
          currency: "INR",
          reservationExpiresInMinutes: 15,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof Error) {
      const errors: Record<
        string,
        { status: number; message: string }
      > = {
        ADDRESS_NOT_FOUND: {
          status: 404,
          message: "Address not found.",
        },
        CART_EMPTY: {
          status: 400,
          message: "Your cart is empty.",
        },
        PRODUCT_UNAVAILABLE: {
          status: 409,
          message: "A product in your cart is unavailable.",
        },
        INVALID_CART_QUANTITY: {
          status: 400,
          message: "A cart item has an invalid quantity.",
        },
        INSUFFICIENT_OR_UNAVAILABLE_STOCK: {
          status: 409,
          message: "A product has insufficient available stock.",
        },
        INVALID_RESERVATION_QUANTITY: {
          status: 400,
          message: "A cart item has an invalid quantity.",
        },
      };

      const known = errors[error.message];

      if (known) {
        return NextResponse.json(
          { error: known.message },
          { status: known.status },
        );
      }
    }

    console.error("POST /api/checkout failed:", error);

    return NextResponse.json(
      { error: "Unable to create your order." },
      { status: 500 },
    );
  }
}
