-- CreateTable
CREATE TABLE "PaymentReconciliation" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "razorpayPaymentId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "refundId" TEXT,
    "refundStatus" TEXT,
    "adminNotes" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentReconciliation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PaymentReconciliation_refundId_key" ON "PaymentReconciliation"("refundId");

-- CreateIndex
CREATE INDEX "PaymentReconciliation_orderId_createdAt_idx" ON "PaymentReconciliation"("orderId", "createdAt");

-- CreateIndex
CREATE INDEX "PaymentReconciliation_status_createdAt_idx" ON "PaymentReconciliation"("status", "createdAt");

-- CreateIndex
CREATE INDEX "PaymentReconciliation_razorpayPaymentId_idx" ON "PaymentReconciliation"("razorpayPaymentId");

-- AddForeignKey
ALTER TABLE "PaymentReconciliation" ADD CONSTRAINT "PaymentReconciliation_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
