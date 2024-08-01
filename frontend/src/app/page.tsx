import FormBarang from "@/components/ui/forms/FormBarang";
import { listBarang } from "@/lib/api/barang/fetcher";
import Link from "next/link";

export default async function Home() {
  const dataBarang = await listBarang();
  return (
    <div>
      <div className="inline-flex gap-2 items-center">
        {dataBarang.data.map((barang) => (
          <Link
            href={`/barang/${barang.id}`}
            key={barang.id}
            className="hover:undeline"
          >
            <p>{barang.nama}</p>
          </Link>
        ))}
      </div>

      <div className="w-full px-4 py-2 md:px-8 flex items-center">
        <FormBarang />
      </div>
    </div>
  );
}
