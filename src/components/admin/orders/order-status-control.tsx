"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

const statusOptions: { value: OrderStatus; label: string }[] = [
  { value: "PENDING", label: "Pending" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "PROCESSING", label: "Processing" },
  { value: "SHIPPED", label: "Shipped" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
];

export default function OrderStatusControl({
  orderId,
  initialStatus,
}: {
  orderId: string;
  initialStatus: OrderStatus;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function updateStatus() {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to update order status.");
      }

      setMessage("Order status updated successfully.");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-6">
      {message && (
        <p className="mb-4 text-sm text-green-600">{message}</p>
      )}

      {error && (
        <p role="alert" className="mb-4 text-sm text-red-500">
          {error}
        </p>
      )}

      <select
        value={status}
        onChange={(event) => setStatus(event.target.value as OrderStatus)}
        disabled={loading}
        className="w-full rounded-full border border-border bg-background px-5 py-3 body-font text-sm outline-none focus:border-primary"
      >
        {statusOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <button
        type="button"
        onClick={updateStatus}
        disabled={loading || status === initialStatus}
        className="mt-4 rounded-full bg-primary px-6 py-3 body-font text-xs font-medium uppercase tracking-[0.2em] text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Updating..." : "Update Status"}
      </button>
    </div>
  );
}