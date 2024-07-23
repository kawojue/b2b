-- CreateEnum
CREATE TYPE "CardStatus" AS ENUM ('active', 'frozen', 'pending', 'terminated');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "refresh_token" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Business" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ownerId" UUID NOT NULL,

    CONSTRAINT "Business_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" UUID NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "businessId" UUID NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Card" (
    "id" UUID NOT NULL,
    "cardId" TEXT,
    "cardName" TEXT,
    "cardNumber" TEXT,
    "last4" TEXT,
    "cardType" TEXT,
    "cardBrand" TEXT,
    "expiry" TEXT,
    "cvv" TEXT,
    "valid" TEXT,
    "reference" TEXT NOT NULL,
    "billingAddress" JSONB,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "status" "CardStatus" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "customerId" UUID NOT NULL,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Webhook" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "businessId" UUID NOT NULL,

    CONSTRAINT "Webhook_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_name_refresh_token_idx" ON "User"("name", "refresh_token");

-- CreateIndex
CREATE INDEX "Business_name_idx" ON "Business"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_email_key" ON "Customer"("email");

-- CreateIndex
CREATE INDEX "Customer_firstname_lastname_email_idx" ON "Customer"("firstname", "lastname", "email");

-- CreateIndex
CREATE UNIQUE INDEX "Card_cardId_key" ON "Card"("cardId");

-- CreateIndex
CREATE UNIQUE INDEX "Card_reference_key" ON "Card"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "Webhook_businessId_key" ON "Webhook"("businessId");

-- AddForeignKey
ALTER TABLE "Business" ADD CONSTRAINT "Business_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Webhook" ADD CONSTRAINT "Webhook_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;
