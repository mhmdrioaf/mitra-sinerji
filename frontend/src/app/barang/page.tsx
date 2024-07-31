import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import TableBarang from "@/components/ui/tables/TableBarang";
import { listBarang } from "@/lib/api/barang";
import Link from "next/link";

export default async function ListBarangPage() {
  const dataBarang = await listBarang();

  return (
    <div className="w-full flex flex-col gap-4 md:gap-8 px-4 md:px-8 py-2 min-h-svh">
      <div className="w-full flex flex-col gap-px">
        <h3 className="font-bold text-lg md:text-xl">Data Barang</h3>
        <p className="text-xs text-neutral-600">
          Berikut merupakan data barang yang tersedia di database
        </p>
      </div>

      <div className="w-full inline-flex gap-8 items-end justify-between">
        <form className="w-full max-w-md flex flex-col gap-2">
          <Label htmlFor="search">Cari Barang</Label>
          <Input
            type="text"
            id="search"
            name="search"
            placeholder="Cari berdasarkan nama barang"
            className="w-full"
          />
        </form>

        <Button asChild>
          <Link href="/barang/create">Tambah Barang</Link>
        </Button>
      </div>

      <TableBarang />
    </div>
  );
}
