import { createSales, listBarang, listCustomer, listSales } from "@/lib/api";
import { TBarang } from "@/types/barang";
import { SalesDto, TSalesDetail } from "@/types/sales";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ToastAndroid } from "react-native";
import * as z from "zod";

export default function useSalesForm() {
  const queryClient = useQueryClient();
  const [salesDetail, setSalesDetail] = useState<TSalesDetail[]>([]);
  const [createModal, showCreateModal] = useState<boolean>(false);
  const [editModal, showEditModal] = useState<boolean>(false);
  const [detailToEdit, setDetailToEdit] = useState<number | null>(null);
  const [date, setDate] = useState<Date | undefined>();
  const [pickingDate, setPickingDate] = useState<boolean>(false);
  const [customerId, setCustomerId] = useState<number | null>(null);
  const [customerModal, showCustomerModal] = useState<boolean>(false);

  const { data: barang, isLoading: barangLoading } = useQuery({
    queryKey: ["barang"],
    queryFn: listBarang,
  });
  const { data: customer, isLoading: customerLoading } = useQuery({
    queryKey: ["customer"],
    queryFn: listCustomer,
  });

  const mutation = useMutation({
    mutationFn: listSales,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      router.back();
    },
  });

  const form = useForm<z.infer<typeof SalesDto>>({
    defaultValues: {
      diskon: 0,
      ongkir: 0,
    },
  });

  const dataBarang = barang?.data || [];

  const barangToAdd = dataBarang.filter(
    (a) => !salesDetail.find((detail) => detail.barang.id === a.id)
  );

  const addBarang = (barang: TBarang) => {
    setSalesDetail((prev) => [
      ...prev,
      {
        barang: barang,
        diskon_nilai: 0,
        diskon_pct: 0,
        harga_diskon: barang.harga,
        id: prev.slice(-1).length > 0 ? prev.slice(-1)[0].id + 1 : 1,
        qty: 1,
        total: barang.harga,
      },
    ]);
  };

  function deleteBarang(id: number) {
    setSalesDetail((prev) => prev.filter((detail) => detail.id !== id));
  }

  function onShowEditModal(id: number) {
    setDetailToEdit(id);
    showEditModal(true);
  }

  function onHideEditModal() {
    setDetailToEdit(null);
    showEditModal(false);
  }

  function onDetailEdit(key: "qty" | "diskon_pct", value: any) {
    let editedDetail = salesDetail.find((a) => a.id === detailToEdit);

    if (!editedDetail) return;

    editedDetail[key] = value;
    editedDetail["diskon_nilai"] =
      (editedDetail.diskon_pct / 100) * editedDetail.barang.harga;
    editedDetail["harga_diskon"] =
      editedDetail.barang.harga - editedDetail.diskon_nilai;
    editedDetail["total"] = editedDetail.harga_diskon * editedDetail.qty;

    setSalesDetail((prev) => [
      ...prev.filter((s) => s.id !== detailToEdit),
      editedDetail,
    ]);
  }

  function calculateSubTotal() {
    return salesDetail.reduce((a, b) => a + b.total, 0);
  }

  function calculateTotal() {
    const diskon = form.watch("diskon");
    const ongkir = form.watch("ongkir");
    const subTotal = calculateSubTotal();
    const total = subTotal - diskon - ongkir;

    return total;
  }

  function pickDate() {
    setPickingDate(true);
  }

  function onDateChange(date: Date) {
    setDate(date);
    setPickingDate(false);
  }

  async function onSubmit() {
    if (!date) {
      ToastAndroid.showWithGravityAndOffset(
        "Tanggal transaksi tidak boleh kosong!",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
      return;
    }

    if (!customerId) {
      ToastAndroid.showWithGravityAndOffset(
        "Data customer tidak boleh kosong!",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
      return;
    }

    if (salesDetail.some((detail) => detail.qty < 1)) {
      ToastAndroid.showWithGravityAndOffset(
        "Kuantitas barang tidak boleh kurang dari 0!",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
      return;
    }

    if (salesDetail.length < 1) {
      ToastAndroid.showWithGravityAndOffset(
        "Data barang tidak boleh kosong!",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
      return;
    }

    const salesDetailData = salesDetail.map((detail) => {
      const { id, barang, ...rest } = detail;

      return {
        barang_id: barang.id,
        harga_bandrol: barang.harga,
        ...rest,
      };
    });

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    const data: z.infer<typeof SalesDto> = {
      cust_id: customerId,
      diskon: form.watch("diskon"),
      ongkir: form.watch("ongkir"),
      salesDetail: salesDetailData,
      subtotal: calculateSubTotal(),
      tgl: `${year}-${month}-${day}`,
      total_bayar: calculateTotal(),
    };

    const response = await createSales(data);

    if (response.status === 201 || response.status === 200) {
      ToastAndroid.showWithGravityAndOffset(
        "Berhasil menambahkan data transaksi.",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        25,
        50
      );
      mutation.mutate();
      form.reset();
    } else {
      ToastAndroid.showWithGravityAndOffset(
        `Terjadi kesalahan ketika menyimpan data transaksi: ${response.message?.join(
          ", "
        )}`,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    }
  }

  useEffect(() => {
    if (barangToAdd.length < 1) {
      showCreateModal(false);
    }
  }, [barangToAdd]);

  return {
    state: {
      detail: salesDetail,
      barang: barangToAdd,
      createModal,
      editModal,
      detailToEdit:
        salesDetail.find((sale) => sale.id === detailToEdit) ?? null,
      subTotal: calculateSubTotal(),
      total: calculateTotal(),
      form: form,
      date,
      pickingDate,
      customer: customer?.data || [],
      pickedCustomer: customerId,
      customerModal,
    },
    handler: {
      addBarang,
      showCreateModal,
      deleteBarang,
      edit: onShowEditModal,
      hideEdit: onHideEditModal,
      onDetailEdit,
      pickDate,
      onDateChange,
      setCustomerId,
      showCustomerModal,
      save: onSubmit,
    },
  };
}
