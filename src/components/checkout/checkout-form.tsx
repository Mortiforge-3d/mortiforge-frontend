
"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import Script from "next/script";
import { useRouter } from "next/navigation";

import { Field, Input } from "@/src/components/ui/form";

type Address = {
  id: string;
  recipientName: string;
  recipientPhone: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
};

type AddressesResponse = {
  addresses?: Address[];
  error?: string;
};

type AddressForm = {
  recipientName: string;
  recipientPhone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
  country: "India";
};

type CheckoutResponse = {
  order?: {
    id: string;
    orderNumber: string;
    total: number | string;
  };
  error?: string;
  message?: string;
};

type PaymentOrderResponse = {
  keyId?: string;
  razorpayOrderId?: string;
  orderId?: string;
  amount?: number;
  currency?: string;
  error?: string;
};

type VerifyResponse = {
  success?: boolean;
  orderId?: string;
  orderNumber?: string;
  error?: string;
  message?: string;
};

type RazorpaySuccessResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpaySuccessResponse) => void | Promise<void>;
  modal?: {
    ondismiss?: () => void;
  };
  theme?: {
    color: string;
  };
};

type RazorpayFailureResponse = {
  error?: {
    description?: string;
    reason?: string;
  };
};

type RazorpayInstance = {
  open: () => void;
  on: (
    event: "payment.failed",
    handler: (response: RazorpayFailureResponse) => void,
  ) => void;
};

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

const PENDING_ORDER_KEY = "mortiforge_pending_payment_order";

const initialForm: AddressForm = {
  recipientName: "",
  recipientPhone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
};

async function getError(response: Response) {
  const data = (await response.json().catch(() => ({}))) as {
    error?: string;
    message?: string;
  };

  return data.error ?? data.message ?? "Something went wrong. Please try again.";
}

export default function CheckoutForm() {
  const router = useRouter();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [form, setForm] = useState<AddressForm>(initialForm);
  const [showNewAddress, setShowNewAddress] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);
  const [pendingOrderId, setPendingOrderId] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadAddresses = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/addresses", {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(await getError(response));
      }

      const data = (await response.json()) as AddressesResponse;
      const loadedAddresses = data.addresses ?? [];

      setAddresses(loadedAddresses);

      setSelectedAddressId((currentId) => {
        if (loadedAddresses.some((address) => address.id === currentId)) {
          return currentId;
        }

        return (
          loadedAddresses.find((address) => address.isDefault)?.id ??
          loadedAddresses[0]?.id ??
          ""
        );
      });

      if (loadedAddresses.length === 0) {
        setShowNewAddress(true);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load saved addresses.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAddresses();

    const savedOrderId = sessionStorage.getItem(PENDING_ORDER_KEY);
    if (savedOrderId) {
      setPendingOrderId(savedOrderId);
      setSuccess(
        "You have an unfinished payment. You can retry payment for the existing order.",
      );
    }
  }, [loadAddresses]);

  function updateField<K extends keyof AddressForm>(
    name: K,
    value: AddressForm[K],
  ) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function saveAddress(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const recipientName = form.recipientName.trim();
    const recipientPhone = form.recipientPhone.trim();
    const line1 = form.line1.trim();
    const line2 = form.line2.trim();
    const city = form.city.trim();
    const state = form.state.trim();
    const postalCode = form.postalCode.trim();

    if (recipientName.length < 2 || recipientName.length > 100) {
      setError("Enter a recipient name between 2 and 100 characters.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(recipientPhone)) {
      setError("Enter a valid 10-digit Indian mobile number.");
      return;
    }

    if (line1.length < 3 || line1.length > 200) {
      setError("Enter an address between 3 and 200 characters.");
      return;
    }

    if (line2.length > 200) {
      setError("Address line 2 must be 200 characters or fewer.");
      return;
    }

    if (city.length < 2 || city.length > 100) {
      setError("Enter a valid city.");
      return;
    }

    if (state.length < 2 || state.length > 100) {
      setError("Enter a valid state.");
      return;
    }

    if (!/^\d{6}$/.test(postalCode)) {
      setError("Enter a valid 6-digit Indian PIN code.");
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientName,
          recipientPhone,
          line1,
          line2: line2 || null,
          city,
          state,
          postalCode,
          country: "India",
          isDefault: addresses.length === 0,
        }),
      });

      if (!response.ok) {
        throw new Error(await getError(response));
      }

      const data = (await response.json()) as { address: Address };

      setAddresses((current) => [
        data.address,
        ...current.map((address) =>
          data.address.isDefault ? { ...address, isDefault: false } : address,
        ),
      ]);

      setSelectedAddressId(data.address.id);
      setForm(initialForm);
      setShowNewAddress(false);
      setSuccess("Delivery address saved successfully.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to save the address.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function startPayment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError(null);
    setSuccess(null);

    if (!selectedAddressId || showNewAddress) {
      setError("Please select a saved delivery address or save your new address.");
      return;
    }

    if (!window.Razorpay || !isRazorpayLoaded) {
      setError(
        "Payment checkout is still loading. Please wait a moment and try again.",
      );
      return;
    }

    setIsPaying(true);

    try {
      // Reuse a previously created order after a dismissed popup or failed
      // payment initialization instead of creating another order.
      let orderId =
        pendingOrderId || sessionStorage.getItem(PENDING_ORDER_KEY) || "";

      if (!orderId) {
        const checkoutResponse = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ addressId: selectedAddressId }),
        });

        if (!checkoutResponse.ok) {
          throw new Error(await getError(checkoutResponse));
        }

        const checkoutData =
          (await checkoutResponse.json()) as CheckoutResponse;

        if (!checkoutData.order?.id) {
          throw new Error("The order was created without a valid order ID.");
        }

        orderId = checkoutData.order.id;

        // Save immediately so payment retries can reuse this order.
        sessionStorage.setItem(PENDING_ORDER_KEY, orderId);
        setPendingOrderId(orderId);
      }

      const paymentOrderResponse = await fetch(
        "/api/payments/razorpay/order",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId }),
        },
      );

      if (!paymentOrderResponse.ok) {
        throw new Error(await getError(paymentOrderResponse));
      }

      const paymentData =
        (await paymentOrderResponse.json()) as PaymentOrderResponse;

      if (
        !paymentData.keyId ||
        !paymentData.razorpayOrderId ||
        !paymentData.orderId ||
        typeof paymentData.amount !== "number" ||
        paymentData.amount <= 0 ||
        paymentData.currency !== "INR"
      ) {
        throw new Error("The payment service returned invalid order details.");
      }

      const razorpay = new window.Razorpay({
        key: paymentData.keyId,
        amount: paymentData.amount,
        currency: paymentData.currency,
        name: "Mortiforge 3D",
        description: "Secure payment for your order",
        order_id: paymentData.razorpayOrderId,
        theme: {
          color: "#7C3AED",
        },
        handler: async (paymentResponse) => {
          setError(null);
          setSuccess("Payment received. Verifying your payment...");

          try {
            const verifyResponse = await fetch(
              "/api/payments/razorpay/verify",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(paymentResponse),
              },
            );

            const verifyData =
              (await verifyResponse.json().catch(() => ({}))) as VerifyResponse;

            if (!verifyResponse.ok || !verifyData.success || !verifyData.orderId) {
              throw new Error(
                verifyData.error ??
                  "We couldn't confirm your payment yet. Please don't pay again; check your order or contact support.",
              );
            }

            sessionStorage.removeItem(PENDING_ORDER_KEY);
            setPendingOrderId("");
            router.push(`/customer/orders/${verifyData.orderId}`);
            router.refresh();
          } catch (err) {
            setError(
              err instanceof Error
                ? err.message
                : "Payment verification failed. Please contact support before retrying.",
            );
            setSuccess(null);
          } finally {
            setIsPaying(false);
          }
        },
        modal: {
          ondismiss: () => {
            setIsPaying(false);
            setSuccess(null);
            setError(
              "Payment was not completed. Your pending order has been saved; you can retry payment.",
            );
          },
        },
      });

      razorpay.on("payment.failed", (response) => {
        setIsPaying(false);
        setSuccess(null);
        setError(
          response.error?.description ??
            "Payment failed. Your pending order has been saved so you can retry.",
        );
      });

      razorpay.open();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to start payment. Your pending order, if created, can be retried.",
      );
      setIsPaying(false);
    }
  }

  return (
    <div className="space-y-10">
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
        onReady={() => setIsRazorpayLoaded(true)}
        onError={() => {
          setIsRazorpayLoaded(false);
          setError("Unable to load secure payment checkout. Please refresh and try again.");
        }}
      />

      <div>
        <h2 className="heading-font text-3xl uppercase">Shipping Address</h2>

        {isLoading ? (
          <p className="mt-6 text-sm text-muted-foreground">
            Loading your saved addresses...
          </p>
        ) : (
          <>
            {addresses.length > 0 && (
              <div className="mt-6 space-y-3">
                {addresses.map((address) => (
                  <label
                    key={address.id}
                    className={`flex cursor-pointer gap-4 rounded-2xl border p-5 transition-colors ${
                      selectedAddressId === address.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="shippingAddress"
                      value={address.id}
                      checked={selectedAddressId === address.id}
                      onChange={() => {
                        setSelectedAddressId(address.id);
                        setShowNewAddress(false);
                        setError(null);
                        setSuccess(null);
                      }}
                      className="mt-1 accent-primary"
                    />

                    <span className="min-w-0 body-font text-sm">
                      <span className="flex flex-wrap items-center gap-2 font-semibold">
                        {address.recipientName}
                        {address.isDefault && (
                          <span className="text-xs text-primary">DEFAULT</span>
                        )}
                      </span>

                      <span className="mt-2 block text-muted-foreground">
                        {address.recipientPhone}
                      </span>

                      <span className="mt-1 block text-muted-foreground">
                        {address.line1}
                        {address.line2 ? `, ${address.line2}` : ""}
                      </span>

                      <span className="block text-muted-foreground">
                        {address.city}, {address.state} - {address.postalCode}
                      </span>

                      <span className="block text-muted-foreground">
                        {address.country}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                setShowNewAddress((current) => !current);
                setError(null);
                setSuccess(null);
              }}
              className="mt-5 text-sm text-primary transition-opacity hover:opacity-80"
            >
              {showNewAddress ? "Cancel adding address" : "+ Add New Address"}
            </button>

            {showNewAddress && (
              <form onSubmit={saveAddress} className="mt-6 space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <Field label="Recipient Name" required>
                    <Input
                      name="recipientName"
                      autoComplete="name"
                      placeholder="Full name"
                      required
                      minLength={2}
                      maxLength={100}
                      value={form.recipientName}
                      onChange={(event) =>
                        updateField("recipientName", event.target.value)
                      }
                    />
                  </Field>

                  <Field label="Phone Number" required>
                    <Input
                      name="recipientPhone"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel"
                      placeholder="10-digit mobile number"
                      required
                      maxLength={10}
                      value={form.recipientPhone}
                      onChange={(event) =>
                        updateField(
                          "recipientPhone",
                          event.target.value.replace(/\D/g, "").slice(0, 10),
                        )
                      }
                    />
                  </Field>
                </div>

                <Field label="Address Line 1" required>
                  <Input
                    name="line1"
                    autoComplete="address-line1"
                    placeholder="House number, street, area"
                    required
                    minLength={3}
                    maxLength={200}
                    value={form.line1}
                    onChange={(event) => updateField("line1", event.target.value)}
                  />
                </Field>

                <Field label="Address Line 2" hint="Optional">
                  <Input
                    name="line2"
                    autoComplete="address-line2"
                    placeholder="Apartment, landmark, etc."
                    maxLength={200}
                    value={form.line2}
                    onChange={(event) => updateField("line2", event.target.value)}
                  />
                </Field>

                <div className="grid gap-6 md:grid-cols-2">
                  <Field label="City" required>
                    <Input
                      name="city"
                      autoComplete="address-level2"
                      required
                      minLength={2}
                      maxLength={100}
                      value={form.city}
                      onChange={(event) => updateField("city", event.target.value)}
                    />
                  </Field>

                  <Field label="State" required>
                    <Input
                      name="state"
                      autoComplete="address-level1"
                      required
                      minLength={2}
                      maxLength={100}
                      value={form.state}
                      onChange={(event) => updateField("state", event.target.value)}
                    />
                  </Field>

                  <Field label="PIN Code" required>
                    <Input
                      name="postalCode"
                      inputMode="numeric"
                      autoComplete="postal-code"
                      placeholder="6-digit PIN code"
                      required
                      maxLength={6}
                      value={form.postalCode}
                      onChange={(event) =>
                        updateField(
                          "postalCode",
                          event.target.value.replace(/\D/g, "").slice(0, 6),
                        )
                      }
                    />
                  </Field>

                  <Field label="Country">
                    <Input name="country" value="India" readOnly />
                  </Field>
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-full border border-primary px-6 py-3 text-sm font-semibold transition-colors hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSaving ? "Saving Address..." : "Save Address"}
                </button>
              </form>
            )}
          </>
        )}
      </div>

      {error && (
        <div
          role="alert"
          aria-live="polite"
          className="rounded-xl border border-destructive/40 p-4 text-sm text-destructive"
        >
          {error}

          {!isLoading && addresses.length === 0 && (
            <button
              type="button"
              onClick={() => void loadAddresses()}
              className="ml-2 underline"
            >
              Retry loading addresses
            </button>
          )}
        </div>
      )}

      {success && (
        <p role="status" aria-live="polite" className="text-sm text-primary">
          {success}
        </p>
      )}

      <div>
        <h2 className="heading-font text-3xl uppercase">Payment</h2>

        <div className="mt-6 rounded-2xl border border-border bg-card/40 p-6">
          <p className="body-font text-sm text-muted-foreground">
            Pay securely through Razorpay. Your order is confirmed only after
            the server verifies the payment.
          </p>
        </div>
      </div>

      <form onSubmit={startPayment}>
        <button
          type="submit"
          disabled={
            isLoading ||
            isSaving ||
            isPaying ||
            addresses.length === 0 ||
            !selectedAddressId ||
            showNewAddress ||
            !isRazorpayLoaded
          }
          className="w-full rounded-full bg-primary px-8 py-4 body-font font-semibold text-primary-foreground transition-all hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPaying
            ? "Processing Payment..."
            : pendingOrderId
              ? "Retry Payment"
              : !isRazorpayLoaded
                ? "Loading Secure Checkout..."
                : "Place Order & Pay"}
        </button>
      </form>

      {!isLoading && addresses.length > 0 && showNewAddress && (
        <p className="-mt-6 text-sm text-muted-foreground">
          Save the new address or cancel to continue with a saved address.
        </p>
      )}

      <p className="text-center text-xs text-muted-foreground">
        Need to review your items?{" "}
        <Link href="/cart" className="underline hover:text-primary">
          Return to cart
        </Link>
      </p>
    </div>
  );
}