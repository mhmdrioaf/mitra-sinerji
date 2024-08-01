import FormCustomer from "@/components/ui/forms/FormCustomer";
import { FormCustomerAction } from "@/lib/api/customer/definitions";
import { getCustomer } from "@/lib/api/customer/fetcher";

export default async function DetailCustomer({
  params,
}: {
  params: { id: string };
}) {
  const dataCustomer = await getCustomer(Number(params.id));

  if (!dataCustomer.data) {
    return (
      <div className="w-full px-4 py-2 md:px-8 flex items-center min-h-svh justify-center">
        <p className="text-center">Data customer tidak ditemukan...</p>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-2 md:px-8 flex items-center min-h-svh justify-center">
      <FormCustomer
        action={FormCustomerAction.Update}
        defaultValues={dataCustomer.data}
      />
    </div>
  );
}
