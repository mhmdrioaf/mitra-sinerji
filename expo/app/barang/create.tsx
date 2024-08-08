import FormInput from "@/components/FormInput";
import PageTitle from "@/components/PageTitle";
import useBarangForm from "@/hooks/useBarangForm";
import { StyleSheet } from "react-native";
import { Button, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CreateBarangPage() {
  const theme = useTheme();
  const hook = useBarangForm();
  return (
    <SafeAreaView
      style={{
        ...styles.container,
        backgroundColor: theme.colors.background,
      }}
    >
      <PageTitle title="Tambahkan Barang" />

      <FormInput control={hook.form.control} name="kode" label="Kode Barang" />
      <FormInput control={hook.form.control} name="nama" label="Nama Barang" />
      <FormInput
        control={hook.form.control}
        name="harga"
        label="Harga Barang"
        asCurrency
      />

      <Button
        mode="contained-tonal"
        onPress={hook.form.handleSubmit(hook.onSubmit)}
      >
        Simpan
      </Button>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 16,
    padding: 16,
  },
});
