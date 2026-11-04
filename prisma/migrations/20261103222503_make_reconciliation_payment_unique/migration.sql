/*
  Warnings:

  - A unique constraint covering the columns `[razorpayPaymentId]` on the table `PaymentReconciliation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PaymentReconciliation_razorpayPaymentId_key" ON "PaymentReconciliation"("razorpayPaymentId");
