
import { beforeEach, describe, expect, it, vi } from "vitest";


const mocks = vi.hoisted(() => ({
  auth: vi.fn(),
  findFirst: vi.fn(),
  transaction: vi.fn(),
  fetchPayment: vi.fn(),
  verifySignature: vi.fn(),
  consumeReservation: vi.fn(),

  txFindFirst: vi.fn(),
  txUpdateMany: vi.fn(),
  txFindUnique: vi.fn(),
}));


vi.mock("server-only", () => ({}));

vi.mock("@/auth", () => ({
  auth: mocks.auth,
}));


vi.mock("../../../../../lib/prisma", () => ({
  prisma: {
    order: {
      findFirst: mocks.findFirst,
    },
    $transaction: mocks.transaction,
  },
}));


vi.mock("../../../../../lib/razorpay", () => ({
  razorpay: {
    payments: {
      fetch: mocks.fetchPayment,
    },
  },
}));

vi.mock("../../../../../lib/razorpay-signature", () => ({
  verifyRazorpaySignature: mocks.verifySignature,
}));

vi.mock("../../../../../lib/inventory", () => ({
  consumeReservation: mocks.consumeReservation,
}));

import { POST } from "./route";

function makeRequest(body: unknown): Request {
  return new Request(
    "http://localhost/api/payments/razorpay/verify",
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );
}

const validBody = {
  razorpay_order_id: "order_test_001",
  razorpay_payment_id: "pay_test_001",
  razorpay_signature: "a".repeat(64),
};

describe("Razorpay payment verification route", () => {

beforeEach(() => {
  vi.clearAllMocks();

  mocks.auth.mockResolvedValue({
    user: { id: "user_test_001" },
  });

  mocks.verifySignature.mockReturnValue(true);

  mocks.transaction.mockImplementation(
    async (callback: (tx: unknown) => Promise<unknown>) =>
      callback({
        order: {
          findFirst: mocks.txFindFirst,
          updateMany: mocks.txUpdateMany,
          findUnique: mocks.txFindUnique,
        },
      })
  );
});


  it("rejects unauthenticated requests", async () => {
    mocks.auth.mockResolvedValue(null);

    const response = await POST(makeRequest(validBody));
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Please sign in to continue.");
    expect(mocks.findFirst).not.toHaveBeenCalled();
    expect(mocks.fetchPayment).not.toHaveBeenCalled();
  });

  it("rejects invalid request bodies", async () => {
    const response = await POST(
      makeRequest({
        razorpay_order_id: "order_test_001",
      })
    );
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe(
      "Invalid payment verification details."
    );
    expect(mocks.verifySignature).not.toHaveBeenCalled();
  });

  it("rejects an invalid payment signature", async () => {
    mocks.verifySignature.mockReturnValue(false);

    const response = await POST(makeRequest(validBody));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid payment signature.");
    expect(mocks.findFirst).not.toHaveBeenCalled();
    expect(mocks.fetchPayment).not.toHaveBeenCalled();
  });

  it("returns 404 when the order does not exist for the user", async () => {
    mocks.findFirst.mockResolvedValue(null);

    const response = await POST(makeRequest(validBody));
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe("Order not found.");
    expect(mocks.fetchPayment).not.toHaveBeenCalled();
  });


  it("rejects a payment linked to a different Razorpay order", async () => {
    mocks.findFirst.mockResolvedValue({
      id: "local_order_001",
      orderNumber: "MF-001",
      total: 499,
      paymentStatus: "PENDING",
      status: "PENDING",
      razorpayPaymentId: null,
      reservations: [
        {
          id: "reservation_001",
          status: "ACTIVE",
          expiresAt: new Date(Date.now() + 60_000),
        },
      ],
    });

    mocks.fetchPayment.mockResolvedValue({
      order_id: "order_someone_else",
      currency: "INR",
      amount: 49900,
      status: "captured",
    });

    const response = await POST(makeRequest(validBody));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe(
      "Payment details do not match this order."
    );
    expect(mocks.transaction).not.toHaveBeenCalled();
  });

  it("rejects payments in a currency other than INR", async () => {
    mocks.findFirst.mockResolvedValue({
      id: "local_order_001",
      orderNumber: "MF-001",
      total: 499,
      paymentStatus: "PENDING",
      status: "PENDING",
      razorpayPaymentId: null,
      reservations: [
        {
          id: "reservation_001",
          status: "ACTIVE",
          expiresAt: new Date(Date.now() + 60_000),
        },
      ],
    });

    mocks.fetchPayment.mockResolvedValue({
      order_id: validBody.razorpay_order_id,
      currency: "USD",
      amount: 49900,
      status: "captured",
    });

    const response = await POST(makeRequest(validBody));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe(
      "Payment details do not match this order."
    );
    expect(mocks.transaction).not.toHaveBeenCalled();
  });

  it("rejects a payment whose amount differs from the order total", async () => {
    mocks.findFirst.mockResolvedValue({
      id: "local_order_001",
      orderNumber: "MF-001",
      total: 499,
      paymentStatus: "PENDING",
      status: "PENDING",
      razorpayPaymentId: null,
      reservations: [
        {
          id: "reservation_001",
          status: "ACTIVE",
          expiresAt: new Date(Date.now() + 60_000),
        },
      ],
    });

    mocks.fetchPayment.mockResolvedValue({
      order_id: validBody.razorpay_order_id,
      currency: "INR",
      amount: 10000,
      status: "captured",
    });

    const response = await POST(makeRequest(validBody));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe(
      "Payment amount does not match the order."
    );
    expect(mocks.transaction).not.toHaveBeenCalled();
  });

  it("does not confirm a payment that has not been captured", async () => {
    mocks.findFirst.mockResolvedValue({
      id: "local_order_001",
      orderNumber: "MF-001",
      total: 499,
      paymentStatus: "PENDING",
      status: "PENDING",
      razorpayPaymentId: null,
      reservations: [
        {
          id: "reservation_001",
          status: "ACTIVE",
          expiresAt: new Date(Date.now() + 60_000),
        },
      ],
    });

    mocks.fetchPayment.mockResolvedValue({
      order_id: validBody.razorpay_order_id,
      currency: "INR",
      amount: 49900,
      status: "authorized",
    });

    const response = await POST(makeRequest(validBody));
    const data = await response.json();

    expect(response.status).toBe(409);
    expect(data.error).toBe(
      "Payment has not been captured yet. Please wait for confirmation."
    );
    expect(mocks.transaction).not.toHaveBeenCalled();
  });


it("returns success when the same payment was already verified", async () => {
  mocks.findFirst.mockResolvedValue({
    id: "local_order_001",
    orderNumber: "MF-001",
    total: 499,
    paymentStatus: "PAID",
    status: "CONFIRMED",
    razorpayPaymentId: validBody.razorpay_payment_id,
    reservations: [],
  });

  mocks.fetchPayment.mockResolvedValue({
    order_id: validBody.razorpay_order_id,
    currency: "INR",
    amount: 49900,
    status: "captured",
  });

  const response = await POST(makeRequest(validBody));
  const data = await response.json();

  expect(response.status).toBe(200);
  expect(data.success).toBe(true);
  expect(data.message).toBe("Payment already verified.");
  expect(data.orderId).toBe("local_order_001");
  expect(mocks.transaction).not.toHaveBeenCalled();
});

it("rejects a different payment for an already-paid order", async () => {
  mocks.findFirst.mockResolvedValue({
    id: "local_order_001",
    orderNumber: "MF-001",
    total: 499,
    paymentStatus: "PAID",
    status: "CONFIRMED",
    razorpayPaymentId: "pay_previous_payment",
    reservations: [],
  });

  mocks.fetchPayment.mockResolvedValue({
    order_id: validBody.razorpay_order_id,
    currency: "INR",
    amount: 49900,
    status: "captured",
  });

  const response = await POST(makeRequest(validBody));
  const data = await response.json();

  expect(response.status).toBe(409);
  expect(data.error).toBe("This order has already been paid.");
  expect(mocks.transaction).not.toHaveBeenCalled();
});



it("rejects an order that is no longer pending", async () => {
  mocks.findFirst.mockResolvedValue({
    id: "local_order_001",
    orderNumber: "MF-001",
    total: 499,
    paymentStatus: "PENDING",
    status: "CANCELLED",
    razorpayPaymentId: null,
    reservations: [
      {
        id: "reservation_001",
        status: "ACTIVE",
        expiresAt: new Date(Date.now() + 60_000),
      },
    ],
  });

  mocks.fetchPayment.mockResolvedValue({
    order_id: validBody.razorpay_order_id,
    currency: "INR",
    amount: 49900,
    status: "captured",
  });

  const response = await POST(makeRequest(validBody));
  const data = await response.json();

  expect(response.status).toBe(409);
  expect(data.error).toBe("This order cannot be confirmed.");
  expect(mocks.transaction).not.toHaveBeenCalled();
});

it("rejects an order with an expired reservation", async () => {
  mocks.findFirst.mockResolvedValue({
    id: "local_order_001",
    orderNumber: "MF-001",
    total: 499,
    paymentStatus: "PENDING",
    status: "PENDING",
    razorpayPaymentId: null,
    reservations: [
      {
        id: "reservation_001",
        status: "ACTIVE",
        expiresAt: new Date(Date.now() - 60_000),
      },
    ],
  });

  mocks.fetchPayment.mockResolvedValue({
    order_id: validBody.razorpay_order_id,
    currency: "INR",
    amount: 49900,
    status: "captured",
  });

  const response = await POST(makeRequest(validBody));
  const data = await response.json();

  expect(response.status).toBe(409);
  expect(data.error).toContain("reservation needs reconciliation");
  expect(mocks.transaction).not.toHaveBeenCalled();
});


it("confirms the order and consumes its reservation in a transaction", async () => {
  const reservation = {
    id: "reservation_001",
    status: "ACTIVE",
    expiresAt: new Date(Date.now() + 60_000),
  };

  mocks.findFirst.mockResolvedValue({
    id: "local_order_001",
    orderNumber: "MF-001",
    total: 499,
    paymentStatus: "PENDING",
    status: "PENDING",
    razorpayPaymentId: null,
    reservations: [reservation],
  });

  mocks.fetchPayment.mockResolvedValue({
    order_id: validBody.razorpay_order_id,
    currency: "INR",
    amount: 49900,
    status: "captured",
  });

  mocks.txFindFirst.mockResolvedValue({
    id: "local_order_001",
    userId: "user_test_001",
    razorpayOrderId: validBody.razorpay_order_id,
    orderNumber: "MF-001",
    total: 499,
    paymentStatus: "PENDING",
    status: "PENDING",
    razorpayPaymentId: null,
    reservations: [reservation],
  });

  mocks.txUpdateMany.mockResolvedValue({ count: 1 });
  mocks.consumeReservation.mockResolvedValue(true);

  const response = await POST(makeRequest(validBody));
  const data = await response.json();

  expect(response.status).toBe(200);
  expect(data.success).toBe(true);
  expect(data.message).toBe("Payment verified successfully.");
  expect(data.orderId).toBe("local_order_001");

  expect(mocks.transaction).toHaveBeenCalledOnce();
  expect(mocks.txUpdateMany).toHaveBeenCalledWith({
    where: {
      id: "local_order_001",
      userId: "user_test_001",
      razorpayOrderId: validBody.razorpay_order_id,
      paymentStatus: "PENDING",
      status: "PENDING",
    },
    data: {
      paymentStatus: "PAID",
      status: "CONFIRMED",
      razorpayPaymentId: validBody.razorpay_payment_id,
    },
  });

  expect(mocks.consumeReservation).toHaveBeenCalledWith(
    expect.any(Object),
    "reservation_001"
  );
});


it("fails verification when reservation consumption fails", async () => {
  const reservation = {
    id: "reservation_001",
    status: "ACTIVE",
    expiresAt: new Date(Date.now() + 60_000),
  };

  mocks.findFirst.mockResolvedValue({
    id: "local_order_001",
    orderNumber: "MF-001",
    total: 499,
    paymentStatus: "PENDING",
    status: "PENDING",
    razorpayPaymentId: null,
    reservations: [reservation],
  });

  mocks.fetchPayment.mockResolvedValue({
    order_id: validBody.razorpay_order_id,
    currency: "INR",
    amount: 49900,
    status: "captured",
  });

  mocks.txFindFirst.mockResolvedValue({
    id: "local_order_001",
    userId: "user_test_001",
    razorpayOrderId: validBody.razorpay_order_id,
    orderNumber: "MF-001",
    total: 499,
    paymentStatus: "PENDING",
    status: "PENDING",
    razorpayPaymentId: null,
    reservations: [reservation],
  });

  mocks.txUpdateMany.mockResolvedValue({ count: 1 });
  mocks.consumeReservation.mockResolvedValue(false);

  const response = await POST(makeRequest(validBody));
  const data = await response.json();

  expect(response.status).toBe(500);
  expect(data.error).toBe(
    "Unable to verify payment. Please contact support if money was deducted."
  );

  expect(mocks.transaction).toHaveBeenCalledOnce();
  expect(mocks.txUpdateMany).toHaveBeenCalledOnce();
  expect(mocks.consumeReservation).toHaveBeenCalledWith(
    expect.any(Object),
    "reservation_001"
  );
});


it("rejects confirmation when the pending-order update loses a race", async () => {
  const reservation = {
    id: "reservation_001",
    status: "ACTIVE",
    expiresAt: new Date(Date.now() + 60_000),
  };

  mocks.findFirst.mockResolvedValue({
    id: "local_order_001",
    orderNumber: "MF-001",
    total: 499,
    paymentStatus: "PENDING",
    status: "PENDING",
    razorpayPaymentId: null,
    reservations: [reservation],
  });

  mocks.fetchPayment.mockResolvedValue({
    order_id: validBody.razorpay_order_id,
    currency: "INR",
    amount: 49900,
    status: "captured",
  });

  mocks.txFindFirst.mockResolvedValue({
    id: "local_order_001",
    userId: "user_test_001",
    razorpayOrderId: validBody.razorpay_order_id,
    orderNumber: "MF-001",
    total: 499,
    paymentStatus: "PENDING",
    status: "PENDING",
    razorpayPaymentId: null,
    reservations: [reservation],
  });

  mocks.txUpdateMany.mockResolvedValue({ count: 0 });

  // Another request won the race, but it used a different payment ID.
  mocks.txFindUnique.mockResolvedValue({
    paymentStatus: "PAID",
    razorpayPaymentId: "pay_other_request",
  });

  const response = await POST(makeRequest(validBody));
  const data = await response.json();

  expect(response.status).toBe(500);
  expect(data.error).toBe(
    "Unable to verify payment. Please contact support if money was deducted."
  );

  expect(mocks.txUpdateMany).toHaveBeenCalledOnce();
  expect(mocks.txFindUnique).toHaveBeenCalledOnce();
  expect(mocks.consumeReservation).not.toHaveBeenCalled();
});


it("accepts a retry when another request completed the same payment", async () => {
  const reservation = {
    id: "reservation_001",
    status: "ACTIVE",
    expiresAt: new Date(Date.now() + 60_000),
  };

  mocks.findFirst.mockResolvedValue({
    id: "local_order_001",
    orderNumber: "MF-001",
    total: 499,
    paymentStatus: "PENDING",
    status: "PENDING",
    razorpayPaymentId: null,
    reservations: [reservation],
  });

  mocks.fetchPayment.mockResolvedValue({
    order_id: validBody.razorpay_order_id,
    currency: "INR",
    amount: 49900,
    status: "captured",
  });

  mocks.txFindFirst.mockResolvedValue({
    id: "local_order_001",
    userId: "user_test_001",
    razorpayOrderId: validBody.razorpay_order_id,
    orderNumber: "MF-001",
    total: 499,
    paymentStatus: "PENDING",
    status: "PENDING",
    razorpayPaymentId: null,
    reservations: [reservation],
  });

  mocks.txUpdateMany.mockResolvedValue({ count: 0 });

  mocks.txFindUnique.mockResolvedValue({
    paymentStatus: "PAID",
    razorpayPaymentId: validBody.razorpay_payment_id,
  });

  const response = await POST(makeRequest(validBody));
  const data = await response.json();

  expect(response.status).toBe(200);
  expect(data.success).toBe(true);
  expect(data.message).toBe("Payment already verified.");
  expect(data.orderId).toBe("local_order_001");

  expect(mocks.txFindUnique).toHaveBeenCalledOnce();
  expect(mocks.consumeReservation).not.toHaveBeenCalled();
});


});
