import FormInput from "@/components/FormInput";
import PageTitle from "@/components/PageTitle";
import useSalesForm from "@/hooks/useSalesForm";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Button,
  Card,
  Modal,
  Portal,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "react-native-ui-datepicker";

export default function CreateSales() {
  const theme = useTheme();
  const salesForm = useSalesForm();

  return (
    <>
      <SafeAreaView
        style={{
          ...styles.container,
          backgroundColor: theme.colors.background,
        }}
      >
        <PageTitle title="Tambah Transaksi" />
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 16,
            }}
          >
            <Button
              style={{ flex: 1 }}
              mode="contained-tonal"
              onPress={() => salesForm.handler.showCreateModal(true)}
            >
              Plih Barang
            </Button>
            <Button
              style={{ flex: 1 }}
              mode="contained-tonal"
              onPress={() => salesForm.handler.showCustomerModal(true)}
            >
              {salesForm.state.pickedCustomer
                ? salesForm.state.customer.find(
                    (c) => c.id === salesForm.state.pickedCustomer
                  )?.name ?? "Pilih Customer"
                : "Pilih Customer"}
            </Button>
          </View>

          {salesForm.state.pickingDate ? (
            <DateTimePicker
              mode="single"
              date={salesForm.state.date}
              onChange={(params) =>
                salesForm.handler.onDateChange(
                  new Date(params.date?.toString() ?? "")
                )
              }
            />
          ) : (
            <Button mode="contained-tonal" onPress={salesForm.handler.pickDate}>
              {salesForm.state.date
                ? salesForm.state.date.toLocaleDateString("id-ID", {
                    dateStyle: "medium",
                  })
                : "Pilih Tanggal"}
            </Button>
          )}
        </View>

        <ScrollView
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
          contentContainerStyle={{ gap: 16 }}
        >
          {salesForm.state.detail.map((detail) => (
            <Card key={detail.id} mode="outlined">
              <Card.Title
                title={detail.barang.kode}
                subtitle={detail.barang.nama}
              />
              <Card.Content>
                <Text>
                  Harga Bandrol:{" "}
                  {detail.barang.harga.toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  })}
                </Text>
                <Text>Jumlah Barang: {detail.qty}</Text>
                <Text>
                  Diskon Barang:{" "}
                  {detail.diskon_nilai.toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  })}{" "}
                  {`(${detail.diskon_pct}%)`}
                </Text>
                <Text>
                  Harga Setelah Diskon:{" "}
                  {detail.harga_diskon.toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  })}
                </Text>
                <Text>
                  Total Harga:{" "}
                  {detail.total.toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  })}
                </Text>
              </Card.Content>

              <Card.Actions>
                <Button
                  mode="contained-tonal"
                  icon="pencil"
                  onPress={() => salesForm.handler.edit(detail.id)}
                >
                  Sesuaikan
                </Button>
                <Button
                  mode="contained-tonal"
                  buttonColor={theme.colors.error}
                  textColor={theme.colors.onError}
                  icon="delete"
                  onPress={() => salesForm.handler.deleteBarang(detail.id)}
                >
                  Hapus
                </Button>
              </Card.Actions>
            </Card>
          ))}
        </ScrollView>

        <Portal>
          <Modal
            visible={salesForm.state.createModal}
            onDismiss={() => salesForm.handler.showCreateModal(false)}
            contentContainerStyle={{
              ...styles.modal,
              backgroundColor: theme.colors.background,
            }}
          >
            <ScrollView
              style={{
                display: "flex",
                flexDirection: "column",
              }}
              contentContainerStyle={{
                gap: 16,
              }}
            >
              {salesForm.state.barang.map((barang) => (
                <Card
                  key={barang.id}
                  mode="outlined"
                  onPress={() => salesForm.handler.addBarang(barang)}
                >
                  <Card.Title title={barang.kode} subtitle={barang.nama} />
                </Card>
              ))}
            </ScrollView>
          </Modal>
        </Portal>

        <Portal>
          <Modal
            visible={salesForm.state.customerModal}
            onDismiss={() => salesForm.handler.showCustomerModal(false)}
            contentContainerStyle={{
              ...styles.modal,
              backgroundColor: theme.colors.background,
            }}
          >
            <ScrollView
              style={{
                display: "flex",
                flexDirection: "column",
              }}
              contentContainerStyle={{
                gap: 16,
              }}
            >
              {salesForm.state.customer.map((customer) => (
                <Card
                  key={customer.id}
                  mode="outlined"
                  onPress={() => {
                    salesForm.handler.showCustomerModal(false);
                    salesForm.handler.setCustomerId(customer.id);
                  }}
                >
                  <Card.Title title={customer.kode} subtitle={customer.name} />
                </Card>
              ))}
            </ScrollView>
          </Modal>
        </Portal>

        <Portal>
          <Modal
            visible={salesForm.state.editModal}
            onDismiss={salesForm.handler.hideEdit}
            contentContainerStyle={{
              ...styles.modal,
              backgroundColor: theme.colors.background,
            }}
          >
            <TextInput
              label="Qty"
              mode="outlined"
              value={salesForm.state.detailToEdit?.qty.toString()}
              onChangeText={(text) =>
                salesForm.handler.onDetailEdit("qty", Number(text))
              }
            />
            <TextInput
              label="Diskon (%)"
              mode="outlined"
              value={salesForm.state.detailToEdit?.diskon_pct.toString()}
              onChangeText={(text) =>
                salesForm.handler.onDetailEdit("diskon_pct", Number(text))
              }
            />

            <Button mode="contained-tonal" onPress={salesForm.handler.hideEdit}>
              Simpan
            </Button>
          </Modal>
        </Portal>
      </SafeAreaView>

      <View
        style={{
          backgroundColor: theme.colors.background,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 16,
        }}
      >
        <View style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
            }}
          >
            <Text
              variant="bodyMedium"
              style={{
                fontWeight: "bold",
                color: theme.colors.onPrimaryContainer,
              }}
            >
              Diskon
            </Text>
            <Text
              variant="bodyMedium"
              style={{
                fontWeight: "bold",
                color: theme.colors.onPrimaryContainer,
              }}
            >
              :
            </Text>
            <FormInput
              control={salesForm.state.form.control}
              name="diskon"
              asCurrency
              label="Diskon"
            />
          </View>

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
            }}
          >
            <Text
              variant="bodyMedium"
              style={{
                fontWeight: "bold",
                color: theme.colors.onPrimaryContainer,
              }}
            >
              Ongkir
            </Text>
            <Text
              variant="bodyMedium"
              style={{
                fontWeight: "bold",
                color: theme.colors.onPrimaryContainer,
              }}
            >
              :
            </Text>
            <FormInput
              control={salesForm.state.form.control}
              name="ongkir"
              asCurrency
              label="Ongkir"
              theme={{
                colors: {
                  primary: theme.colors.primaryContainer,
                },
              }}
            />
          </View>
        </View>

        <View style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
            }}
          >
            <Text
              variant="bodyMedium"
              style={{
                fontWeight: "bold",
                color: theme.colors.onPrimaryContainer,
              }}
            >
              Subtotal
            </Text>
            <Text
              variant="bodyMedium"
              style={{
                fontWeight: "bold",
                color: theme.colors.onPrimaryContainer,
              }}
            >
              :
            </Text>
            <Text
              variant="bodyMedium"
              style={{
                fontWeight: "bold",
                color: theme.colors.onPrimaryContainer,
              }}
            >
              {salesForm.state.subTotal.toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
              })}
            </Text>
          </View>

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
            }}
          >
            <Text
              variant="bodyMedium"
              style={{
                fontWeight: "bold",
                color: theme.colors.onPrimaryContainer,
              }}
            >
              Total Bayar
            </Text>
            <Text
              variant="bodyMedium"
              style={{
                fontWeight: "bold",
                color: theme.colors.onPrimaryContainer,
              }}
            >
              :
            </Text>
            <Text
              variant="bodyMedium"
              style={{
                fontWeight: "bold",
                color: theme.colors.onPrimaryContainer,
              }}
            >
              {salesForm.state.total.toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
              })}
            </Text>
          </View>

          <Button
            mode="contained-tonal"
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
            onPress={salesForm.handler.save}
          >
            Simpan
          </Button>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
    display: "flex",
    flexDirection: "column",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
  },
  modal: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    padding: 20,
  },
});
