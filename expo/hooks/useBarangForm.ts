import { createBarang, listBarang } from "@/lib/api";
import { BarangDto } from "@/types/barang";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import React from "react";
import { useForm } from "react-hook-form";
import { ToastAndroid } from "react-native";
import * as z from "zod";

export default function useBarangForm() {
  const queryClient = useQueryClient();

  const [submitting, setSubmitting] = React.useState<boolean>(false);
  const mutation = useMutation({
    mutationFn: listBarang,
    onSuccess() {
      setSubmitting(false);
      queryClient.invalidateQueries({ queryKey: ["barang"] });
    },
    onError(error) {
      setSubmitting(false);
      ToastAndroid.showWithGravityAndOffset(
        error.message,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    },
  });

  const form = useForm<z.infer<typeof BarangDto>>({
    resolver: zodResolver(BarangDto),
  });

  const onSubmit = async (data: z.infer<typeof BarangDto>) => {
    setSubmitting(true);
    const response = await createBarang(data);

    if (response.status === 201 || response.status === 200) {
      form.reset();
      ToastAndroid.showWithGravityAndOffset(
        "Berhasil menambahkan data barang.",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
      mutation.mutate();
      router.back();
    } else {
      ToastAndroid.showWithGravityAndOffset(
        `Gagal menambahkan data barang: ${response.message?.join(", ")}`,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    }

    setSubmitting(false);
  };

  return {
    form,
    submitting,
    onSubmit,
  };
}
