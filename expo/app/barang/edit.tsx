import FormInput from "@/components/FormInput";
import PageTitle from "@/components/PageTitle";
import { getBarang, listBarang, updateBarang } from "@/lib/api";
import { BarangDto } from "@/types/barang";
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
    queryFn: async () => await getBarang(Number(id)),
  });

  const mutation = useMutation({
    mutationFn: listBarang,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["barang"] });
      router.back();
    },
  });

  const theme = useTheme();

  const form = useForm<z.infer<typeof BarangDto>>({
    values: data?.data,
  });

  async function onSubmit(data: z.infer<typeof BarangDto>) {
    const response = await updateBarang(Number(id), data);

    if (response.status === 200) {
      ToastAndroid.showWithGravityAndOffset(
        "Berhasil mengubah data barang",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        25,
        50
      );
      form.reset();
      mutation.mutate();
    } else {
      ToastAndroid.showWithGravityAndOffset(
        "Terjadi kesalahan ketika mengubah data barang",
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
      <PageTitle title="Edit Barang" />

      {isLoading ? (
        <ActivityIndicator animating color={theme.colors.primary} />
      ) : !data?.data ? (
        <Text>Terjadi kesalahan ketika mendapatkan data barang</Text>
      ) : (
        <>
          <FormInput
            control={form.control}
            name="kode"
            label="Kode Barang"
            defaultValue={data?.data.kode}
            disabled
          />
          <FormInput control={form.control} name="nama" label="Nama Barang" />
          <FormInput
            control={form.control}
            name="harga"
            label="Harga Barang"
            asCurrency
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
