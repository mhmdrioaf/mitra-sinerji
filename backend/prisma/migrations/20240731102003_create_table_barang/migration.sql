-- CreateTable
CREATE TABLE "Barang" (
    "id" SERIAL NOT NULL,
    "kode" VARCHAR(10) NOT NULL,
    "nama" VARCHAR(100) NOT NULL,
    "harga" INTEGER NOT NULL,
    "is_diskon" BOOLEAN NOT NULL DEFAULT false,
    "diskon" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Barang_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Barang_kode_key" ON "Barang"("kode");
