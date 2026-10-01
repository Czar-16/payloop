-- CreateEnum
CREATE TYPE "TransferStatus" AS ENUM ('Success', 'Failed');

-- AlterTable
ALTER TABLE "OnRampTransaction" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "TransferTransaction" (
    "id" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "status" "TransferStatus" NOT NULL DEFAULT 'Success',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TransferTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TransferTransaction_senderId_idx" ON "TransferTransaction"("senderId");

-- CreateIndex
CREATE INDEX "TransferTransaction_receiverId_idx" ON "TransferTransaction"("receiverId");

-- CreateIndex
CREATE INDEX "OnRampTransaction_userId_idx" ON "OnRampTransaction"("userId");

-- AddForeignKey
ALTER TABLE "TransferTransaction" ADD CONSTRAINT "TransferTransaction_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransferTransaction" ADD CONSTRAINT "TransferTransaction_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
