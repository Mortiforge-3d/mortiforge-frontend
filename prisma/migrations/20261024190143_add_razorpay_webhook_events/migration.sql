-- CreateTable
CREATE TABLE "RazorpayWebhookEvent" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "payload" JSONB,
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RazorpayWebhookEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RazorpayWebhookEvent_eventId_key" ON "RazorpayWebhookEvent"("eventId");

-- CreateIndex
CREATE INDEX "RazorpayWebhookEvent_processed_createdAt_idx" ON "RazorpayWebhookEvent"("processed", "createdAt");
