import FormBarang from "@/components/ui/forms/FormBarang";
import { FormBarangAction } from "@/lib/api/barang/definitions";
import { getBarang } from "@/lib/api/barang/fetcher";

export default async function DetailBarang({
  params,
}: {
  params: { id: string };
}) {
  const dataBarang = await getBarang(Number(params.id));

  if (!dataBarang.data) {
    return (
      <div className="w-full px-4 py-2 md:px-8 flex items-center min-h-svh justify-center">
        <p className="text-center">Data barang tidak ditemukan...</p>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-2 md:px-8 flex items-center min-h-svh justify-center">
      <FormBarang
        action={FormBarangAction.Update}
        defaultValues={dataBarang.data}
      />
    </div>
  );
}
