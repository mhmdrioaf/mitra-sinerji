import FormInput from "@/components/FormInput";
import PageTitle from "@/components/PageTitle";
import useCustomerForm from "@/hooks/useCustomerForm";
import { StyleSheet } from "react-native";
import { Button, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CreateCustomerPage() {
  const theme = useTheme();
  const hook = useCustomerForm();
  return (
    <SafeAreaView
      style={{
        ...styles.container,
        backgroundColor: theme.colors.background,
      }}
    >
      <PageTitle title="Tambahkan Customer" />

      <FormInput
        control={hook.form.control}
        name="kode"
        label="Kode Customer"
      />
      <FormInput
        control={hook.form.control}
        name="name"
        label="Nama Customer"
      />
      <FormInput
        control={hook.form.control}
        name="telp"
        label="Nomor Telepon Customer"
        inputMode="tel"
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
