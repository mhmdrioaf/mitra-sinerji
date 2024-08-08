import FormInput from "@/components/FormInput";
import PageTitle from "@/components/PageTitle";
import { getCustomer, listCustomer, updateCustomer } from "@/lib/api";
import { CustomerDto } from "@/types/customer";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { useForm } from "react-hook-form";
import { StyleSheet, ToastAndroid } from "react-native";
import { ActivityIndicator, Button, Text, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import * as z from "zod";

export default function EditPage() {
  const queryClient = useQueryClient();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data, isLoading, error } = useQuery({
    refetchOnMount: true,
    queryKey: ["detail"],
    queryFn: async () => await getCustomer(Number(id)),
  });

  const mutation = useMutation({
    mutationFn: listCustomer,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["customer"] });
      router.back();
    },
  });

  const theme = useTheme();

  const form = useForm<z.infer<typeof CustomerDto>>({
    values: data?.data,
  });

  async function onSubmit(data: z.infer<typeof CustomerDto>) {
    const response = await updateCustomer(Number(id), data);

    if (response.status === 200) {
      ToastAndroid.showWithGravityAndOffset(
        "Berhasil mengubah data customer",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        25,
        50
      );
      form.reset();
      mutation.mutate();
    } else {
      ToastAndroid.showWithGravityAndOffset(
        "Terjadi kesalahan ketika mengubah data customer",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    }
  }

  return (
    <SafeAreaView
      style={{
        ...styles.container,
        backgroundColor: theme.colors.background,
      }}
    >
      <PageTitle title="Edit Customer" />

      {isLoading ? (
        <ActivityIndicator animating color={theme.colors.primary} />
      ) : !data?.data ? (
        <Text>Terjadi kesalahan ketika mendapatkan data customer</Text>
      ) : (
        <>
          <FormInput
            control={form.control}
            name="kode"
            label="Kode Customer"
            defaultValue={data?.data.kode}
            disabled
          />
          <FormInput control={form.control} name="name" label="Nama Customer" />
          <FormInput
            control={form.control}
            name="telp"
            label="Nomor Telepon Customer"
            inputMode="tel"
          />

          <Button mode="contained-tonal" onPress={form.handleSubmit(onSubmit)}>
            Simpan
          </Button>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    padding: 16,
    gap: 16,
  },
});
