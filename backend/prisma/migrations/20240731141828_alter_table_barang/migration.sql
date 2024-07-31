/*
  Warnings:

  - You are about to drop the column `diskon` on the `Barang` table. All the data in the column will be lost.
  - You are about to drop the column `is_diskon` on the `Barang` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Barang" DROP COLUMN "diskon",
DROP COLUMN "is_diskon";
