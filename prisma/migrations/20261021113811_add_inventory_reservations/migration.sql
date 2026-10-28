-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('ACTIVE', 'CONSUMED', 'RELEASED', 'EXPIRED');

-- CreateTable
CREATE TABLE "InventoryReservation" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productVariantId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "status" "ReservationStatus" NOT NULL DEFAULT 'ACTIVE',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InventoryReservation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "InventoryReservation_status_expiresAt_idx" ON "InventoryReservation"("status", "expiresAt");

-- CreateIndex
CREATE INDEX "InventoryReservation_productVariantId_status_idx" ON "InventoryReservation"("productVariantId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "InventoryReservation_orderId_productVariantId_key" ON "InventoryReservation"("orderId", "productVariantId");

-- AddForeignKey
ALTER TABLE "InventoryReservation" ADD CONSTRAINT "InventoryReservation_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryReservation" ADD CONSTRAINT "InventoryReservation_productVariantId_fkey" FOREIGN KEY ("productVariantId") REFERENCES "ProductVariant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
