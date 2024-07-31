-- CreateTable
CREATE TABLE "Customer" (
    "id" SERIAL NOT NULL,
    "kode" VARCHAR(10) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "telp" VARCHAR(20) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Customer_kode_key" ON "Customer"("kode");
