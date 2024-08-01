export function getSalesDates(salesDate: string) {
  const date = new Date(salesDate);
  date.setDate(1);
  const firstDay = date.toISOString();
  date.setMonth(date.getMonth() + 1);
  date.setDate(date.getDate() - 1);
  const lastDay = date.toISOString();

  return {
    firstDay: firstDay,
    lastDay: lastDay,
  };
}

export function generateKodeSales(maxKode: number, salesDate: string) {
  const kode = maxKode + 1;
  const date = new Date(salesDate);
  const [year, month] = [date.getFullYear(), date.getMonth() + 1];

  return `${year}${month.toString().padStart(2, '0')}-${kode.toString().padStart(5, '0')}`;
}
