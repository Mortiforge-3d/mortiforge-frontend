import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import { prisma } from "../../../lib/prisma";
import { z } from "zod";

export const runtime = "nodejs";

export async function GET() {
  try {
    // 1. Verify that the customer is signed in.
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // 2. Create a cart for this customer if one doesn't exist.
    const cart = await prisma.cart.upsert({
      where: { userId },
      create: { userId },
      update: {},
    });

    // 3. Fetch only this customer's purchasable cart items.
    const items = await prisma.cartItem.findMany({
      where: {
        cartId: cart.id,
        productVariant: {
          status: "ACTIVE",
          product: {
            status: "PUBLISHED",
          },
        },
      },
      select: {
        id: true,
        quantity: true,
        productVariant: {
          select: {
            id: true,
            color: true,
            sku: true,
            price: true,
            stock: true,
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                images: {
                  orderBy: { displayOrder: "asc" },
                  take: 1,
                  select: {
                    imageUrl: true,
                    altText: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // 4. Convert Prisma Decimal prices to JSON-friendly numbers.
    const formattedItems = items.map((item) => {
      const price = Number(item.productVariant.price);

      return {
        id: item.id,
        quantity: item.quantity,
        variant: {
          id: item.productVariant.id,
          color: item.productVariant.color,
          sku: item.productVariant.sku,
          price,
          stock: item.productVariant.stock,
          product: item.productVariant.product,
        },
        lineTotal: Number((price * item.quantity).toFixed(2)),
      };
    });

    const total = Number(
      formattedItems
        .reduce((sum, item) => sum + item.lineTotal, 0)
        .toFixed(2)
    );

    return NextResponse.json({
      cartId: cart.id,
      items: formattedItems,
      itemCount: formattedItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      ),
      total,
    });
  } catch (error) {
    console.error("GET /api/cart failed:", error);

    return NextResponse.json(
      { error: "Unable to retrieve cart." },
      { status: 500 }
    );
  }
}


export async function POST(request: Request) {
  try {
    // 1. Require a signed-in customer.
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    // 2. Read and validate the request body.
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON request body." },
        { status: 400 }
      );
    }

    const schema = z.object({
      productVariantId: z.string().trim().min(1),
      quantity: z.number().int().min(1).max(99).default(1),
    });

    const validation = schema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Invalid cart item data.",
          details: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { productVariantId, quantity } = validation.data;
    const userId = session.user.id;

    // 3. Only allow active variants of published products.
    const variant = await prisma.productVariant.findFirst({
      where: {
        id: productVariantId,
        status: "ACTIVE",
        product: {
          status: "PUBLISHED",
        },
      },
      select: {
        id: true,
        stock: true,
        status: true,
        product: {
          select: {
            name: true,
            status: true,
          },
        },
      },
    });

    if (!variant) {
      return NextResponse.json(
        { error: "Product variant not found or unavailable." },
        { status: 404 }
      );
    }

    // 4. Create or retrieve this customer's cart.
    const cart = await prisma.cart.upsert({
      where: { userId },
      create: { userId },
      update: {},
    });

    // 5. Check whether this variant is already in the cart.
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productVariantId: {
          cartId: cart.id,
          productVariantId: variant.id,
        },
      },
      select: {
        id: true,
        quantity: true,
      },
    });

    const newQuantity = (existingItem?.quantity ?? 0) + quantity;

    // 6. Prevent the cart quantity from exceeding available stock.
    if (newQuantity > variant.stock) {
      return NextResponse.json(
        {
          error: "Requested quantity exceeds available stock.",
          availableStock: variant.stock,
          quantityAlreadyInCart: existingItem?.quantity ?? 0,
        },
        { status: 409 }
      );
    }

    // 7. Insert the item or increase its existing quantity.
    const item = await prisma.cartItem.upsert({
      where: {
        cartId_productVariantId: {
          cartId: cart.id,
          productVariantId: variant.id,
        },
      },
      create: {
        cartId: cart.id,
        productVariantId: variant.id,
        quantity,
      },
      update: {
        quantity: newQuantity,
      },
      select: {
        id: true,
        quantity: true,
        productVariantId: true,
      },
    });

    return NextResponse.json(
      {
        message: "Item added to cart.",
        item,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("POST /api/cart failed:", error);

    return NextResponse.json(
      { error: "Unable to add item to cart." },
      { status: 500 }
    );
  }
}
