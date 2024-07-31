export function getSalesDates(salesDate: Date) {
  const firstDay = new Date(salesDate.getFullYear(), salesDate.getMonth(), 2);
  const lastDay = new Date(
    salesDate.getFullYear(),
    salesDate.getMonth() + 1,
    1,
  );

  return {
    firstDay: firstDay,
    lastDay: lastDay,
  };
}

export function generateKodeSales(maxKode: number, salesDate: Date) {
  const kode = maxKode + 1;
  const [year, month] = [salesDate.getFullYear(), salesDate.getMonth() + 1];

  return `${year}${month.toString().padStart(2, '0')}-${kode.toString().padStart(5, '0')}`;
}
