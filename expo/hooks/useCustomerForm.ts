import { createCustomer, listCustomer } from "@/lib/api";
import { CustomerDto } from "@/types/customer";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import React from "react";
import { useForm } from "react-hook-form";
import { ToastAndroid } from "react-native";
import * as z from "zod";

export default function useCustomerForm() {
  const queryClient = useQueryClient();

  const [submitting, setSubmitting] = React.useState<boolean>(false);
  const mutation = useMutation({
    mutationFn: listCustomer,
    onSuccess() {
      setSubmitting(false);
      queryClient.invalidateQueries({ queryKey: ["customer"] });
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

  const form = useForm<z.infer<typeof CustomerDto>>({
    resolver: zodResolver(CustomerDto),
  });

  const onSubmit = async (data: z.infer<typeof CustomerDto>) => {
    setSubmitting(true);
    const response = await createCustomer(data);

    if (response.status === 201 || response.status === 200) {
      form.reset();
      ToastAndroid.showWithGravityAndOffset(
        "Berhasil menambahkan data customer.",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
      mutation.mutate();
      router.back();
    } else {
      ToastAndroid.showWithGravityAndOffset(
        `Gagal menambahkan data customer: ${response.message?.join(", ")}`,
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
