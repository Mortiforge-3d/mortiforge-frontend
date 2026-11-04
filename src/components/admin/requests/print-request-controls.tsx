"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type PrintRequestStatus =
  | "SUBMITTED"
  | "CONTACTED"
  | "DISCUSSING"
  | "WAITING_FOR_CUSTOMER"
  | "PRICE_FINALIZED"
  | "PAYMENT_PENDING"
  | "PRINTING"
  | "COMPLETED"
  | "CLOSED";

const statusOptions: { value: PrintRequestStatus; label: string }[] = [
  { value: "SUBMITTED", label: "Request Submitted" },
  { value: "CONTACTED", label: "Under Review" },
  { value: "DISCUSSING", label: "Consultation" },
  { value: "WAITING_FOR_CUSTOMER", label: "Awaiting Customer" },
  { value: "PRICE_FINALIZED", label: "Quote Created" },
  { value: "PAYMENT_PENDING", label: "Payment Pending" },
  { value: "PRINTING", label: "In Production" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CLOSED", label: "Closed" },
];

interface Props {
  requestId: string;
  initialStatus: PrintRequestStatus;
  initialNotes: string;
  initialQuote: string;
}

export default function PrintRequestControls({
  requestId,
  initialStatus,
  initialNotes,
  initialQuote,
}: Props) {
  const router = useRouter();

  const [status, setStatus] = useState(initialStatus);
  const [notes, setNotes] = useState(initialNotes);
  const [quote, setQuote] = useState(initialQuote);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function updateRequest(
    data: {
      status?: PrintRequestStatus;
      adminNotes?: string;
      quotedPrice?: number;
    },
    successMessage: string,
  ) {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        `/api/admin/print-requests/${requestId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to update request.");
      }

      setMessage(successMessage);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  }

  function saveStatus() {
    void updateRequest(
      { status },
      "Request status updated successfully.",
    );
  }

  function saveNotes() {
    void updateRequest(
      { adminNotes: notes },
      "Private notes saved successfully.",
    );
  }

  function saveQuote() {
    const amount = Number(quote);

    if (!quote.trim() || !Number.isFinite(amount) || amount <= 0) {
      setError("Enter a valid quote amount greater than zero.");
      return;
    }

    void updateRequest(
      {
        quotedPrice: amount,
        status: "PRICE_FINALIZED",
      },
      "Quote saved successfully.",
    );

    setStatus("PRICE_FINALIZED");
  }

  return (
    <div className="space-y-8">
      {message && (
        <p className="rounded-xl border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-600">
          {message}
        </p>
      )}

      {error && (
        <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-500">
          {error}
        </p>
      )}

      <section>
        <label
          htmlFor="request-status"
          className="body-font text-xs uppercase tracking-[0.15em] text-muted-foreground"
        >
          Update project status
        </label>

        <select
          id="request-status"
          value={status}
          onChange={(event) =>
            setStatus(event.target.value as PrintRequestStatus)
          }
          disabled={loading}
          className="mt-3 w-full rounded-full border border-border bg-background px-5 py-3 body-font text-sm outline-none focus:border-primary"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={saveStatus}
          disabled={loading}
          className="mt-4 rounded-full bg-primary px-6 py-3 body-font text-xs font-medium uppercase tracking-[0.2em] text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Update Status"}
        </button>
      </section>

      <section className="border-t border-border pt-8">
        <label
          htmlFor="admin-notes"
          className="body-font text-xs uppercase tracking-[0.15em] text-muted-foreground"
        >
          Private admin notes
        </label>

        <textarea
          id="admin-notes"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          disabled={loading}
          maxLength={5000}
          placeholder="Add private consultation notes..."
          className="mt-3 min-h-32 w-full resize-y rounded-2xl border border-border bg-background px-5 py-4 body-font text-sm outline-none focus:border-primary"
        />

        <button
          type="button"
          onClick={saveNotes}
          disabled={loading}
          className="mt-4 rounded-full border border-border px-6 py-3 body-font text-xs font-medium uppercase tracking-[0.2em] transition-colors hover:border-primary hover:text-primary disabled:opacity-50"
        >
          Save Notes
        </button>
      </section>

      <section className="border-t border-border pt-8">
        <label
          htmlFor="quote-amount"
          className="body-font text-xs uppercase tracking-[0.15em] text-muted-foreground"
        >
          Quote amount (₹)
        </label>

        <input
          id="quote-amount"
          type="number"
          min="0.01"
          max="99999999.99"
          step="0.01"
          value={quote}
          onChange={(event) => setQuote(event.target.value)}
          disabled={loading}
          placeholder="Enter quote amount"
          className="mt-3 w-full rounded-2xl border border-border bg-background px-5 py-3 body-font text-sm outline-none focus:border-primary"
        />

        <button
          type="button"
          onClick={saveQuote}
          disabled={loading}
          className="mt-4 rounded-full bg-primary px-6 py-3 body-font text-xs font-medium uppercase tracking-[0.2em] text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          Save Quote
        </button>
      </section>
    </div>
  );
}