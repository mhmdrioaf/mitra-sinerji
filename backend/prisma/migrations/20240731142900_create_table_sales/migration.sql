-- CreateTable
CREATE TABLE "Sales" (
    "id" SERIAL NOT NULL,
    "kode" VARCHAR(15) NOT NULL,
    "tgl" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "subtotal" INTEGER NOT NULL,
    "diskon" INTEGER NOT NULL,
    "ongkir" INTEGER NOT NULL,
    "total_bayar" INTEGER NOT NULL,
    "cust_id" INTEGER NOT NULL,

    CONSTRAINT "Sales_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Sales_kode_key" ON "Sales"("kode");

-- AddForeignKey
ALTER TABLE "Sales" ADD CONSTRAINT "Sales_cust_id_fkey" FOREIGN KEY ("cust_id") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
