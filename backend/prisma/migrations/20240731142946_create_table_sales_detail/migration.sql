-- CreateTable
CREATE TABLE "SalesDetail" (
    "id" SERIAL NOT NULL,
    "sales_id" INTEGER NOT NULL,
    "barang_id" INTEGER NOT NULL,
    "harga_bandrol" INTEGER NOT NULL,
    "qty" INTEGER NOT NULL,
    "diskon_pct" INTEGER NOT NULL,
    "diskon_nilai" INTEGER NOT NULL,
    "harga_diskon" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,

    CONSTRAINT "SalesDetail_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SalesDetail" ADD CONSTRAINT "SalesDetail_sales_id_fkey" FOREIGN KEY ("sales_id") REFERENCES "Sales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalesDetail" ADD CONSTRAINT "SalesDetail_barang_id_fkey" FOREIGN KEY ("barang_id") REFERENCES "Barang"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
