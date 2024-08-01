import FormSales from "@/components/ui/forms/FormSales";
import { listBarang } from "@/lib/api/barang/fetcher";
import { listCustomer } from "@/lib/api/customer/fetcher";

export default async function SalesCreatePage() {
  const dataBarang = listBarang();
  const dataCustomer = listCustomer();

  const [barang, customer] = await Promise.all([dataBarang, dataCustomer]);
  return (
    <div>
      <FormSales dataBarang={barang.data} dataCustomer={customer.data} />
    </div>
  );
}
