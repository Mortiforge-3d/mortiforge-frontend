
import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "../../../../../../auth";
import { prisma } from "../../../../../lib/prisma";

const updateCartItemSchema = z.object({
  quantity: z.number().int().min(1).max(99),
});

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(
  request: Request,
  { params }: RouteContext
) {
  try {
    // 1. Verify the user is signed in.
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { message: "You must sign in to update your cart." },
        { status: 401 }
      );
    }

    // 2. Validate the requested quantity.
    const body: unknown = await request.json();
    const validation = updateCartItemSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Invalid quantity.",
          errors: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { quantity } = validation.data;
    const { id } = await params;

    // 3. Find the item only if it belongs to this user's cart.
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id,
        cart: {
          userId,
        },
      },
      include: {
        productVariant: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cartItem) {
      return NextResponse.json(
        { message: "Cart item not found." },
        { status: 404 }
      );
    }

    // 4. Ensure the product is still available.
    if (
      cartItem.productVariant.status !== "ACTIVE" ||
      cartItem.productVariant.product.status !== "PUBLISHED"
    ) {
      return NextResponse.json(
        { message: "This product is no longer available." },
        { status: 409 }
      );
    }

    // 5. Check stock availability.
    if (quantity > cartItem.productVariant.stock) {
      return NextResponse.json(
        {
          message: "Requested quantity exceeds available stock.",
          availableStock: cartItem.productVariant.stock,
        },
        { status: 409 }
      );
    }

    // 6. Update the existing cart item.
    const updatedItem = await prisma.cartItem.update({
      where: {
        id: cartItem.id,
      },
      data: {
        quantity,
      },
      select: {
        id: true,
        productVariantId: true,
        quantity: true,
      },
    });

    return NextResponse.json({
      message: "Cart item quantity updated.",
      item: updatedItem,
    });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { message: "Invalid JSON body." },
        { status: 400 }
      );
    }

    console.error("Update cart item error:", error);

    return NextResponse.json(
      { message: "Unable to update cart item." },
      { status: 500 }
    );
  }
}


export async function DELETE(
  _request: Request,
  { params }: RouteContext
) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { message: "You must sign in to modify your cart." },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Verify that this item belongs to the signed-in user's cart.
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id,
        cart: {
          userId,
        },
      },
      select: {
        id: true,
      },
    });

    if (!cartItem) {
      return NextResponse.json(
        { message: "Cart item not found." },
        { status: 404 }
      );
    }

    await prisma.cartItem.delete({
      where: {
        id: cartItem.id,
      },
    });

    return NextResponse.json({
      message: "Cart item removed successfully.",
    });
  } catch (error) {
    console.error("Remove cart item error:", error);

    return NextResponse.json(
      { message: "Unable to remove cart item." },
      { status: 500 }
    );
  }
}
