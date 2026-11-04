export type ApiCartItem = {
  id: string;
  quantity: number;
  variant: {
    id: string;
    color: string;
    sku: string | null;
    price: number;
    stock: number;
    product: {
      id: string;
      name: string;
      slug: string;
      images: {
        imageUrl: string;
        altText: string | null;
      }[];
    };
  };
  lineTotal: number;
};

export type ApiCartResponse = {
  cartId: string;
  items: ApiCartItem[];
  itemCount: number;
  total: number;
};

export type CartMutationResponse = {
  message?: string;
  error?: string;
  item?: {
    id: string;
    quantity: number;
    productVariantId: string;
  };
  availableStock?: number;
  quantityAlreadyInCart?: number;
};
