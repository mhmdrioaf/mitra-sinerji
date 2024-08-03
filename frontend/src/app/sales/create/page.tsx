import FormSales from "@/components/ui/forms/FormSales";
import { QueryProvider } from "@/components/ui/QueryProvider";

export default function SalesCreatePage() {
  return (
    <QueryProvider>
      <FormSales />
    </QueryProvider>
  );
}
