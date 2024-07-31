-- DropForeignKey
ALTER TABLE "Sales" DROP CONSTRAINT "Sales_cust_id_fkey";

-- DropForeignKey
ALTER TABLE "SalesDetail" DROP CONSTRAINT "SalesDetail_barang_id_fkey";

-- DropForeignKey
ALTER TABLE "SalesDetail" DROP CONSTRAINT "SalesDetail_sales_id_fkey";

-- AddForeignKey
ALTER TABLE "Sales" ADD CONSTRAINT "Sales_cust_id_fkey" FOREIGN KEY ("cust_id") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalesDetail" ADD CONSTRAINT "SalesDetail_sales_id_fkey" FOREIGN KEY ("sales_id") REFERENCES "Sales"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalesDetail" ADD CONSTRAINT "SalesDetail_barang_id_fkey" FOREIGN KEY ("barang_id") REFERENCES "Barang"("id") ON DELETE CASCADE ON UPDATE CASCADE;
