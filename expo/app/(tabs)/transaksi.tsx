import PageTitle from "@/components/PageTitle";
import useSales from "@/hooks/useSales";
import { router, useFocusEffect } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import { useCallback } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import {
  ActivityIndicator,
  DataTable,
  FAB,
  MD2Colors,
  Text,
  useTheme,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TransaksiPage() {
  const { state, handler } = useSales();

  const theme = useTheme();

  async function lockOrientation() {
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.LANDSCAPE
    );
  }

  async function restoreScreen() {
    await ScreenOrientation.unlockAsync();
  }

  function converDateToString(tgl: string) {
    const date = new Date(tgl);
    const years = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${years}-${month}-${day}`;
  }

  function formatCurrency(raw: number) {
    if (raw === 0) return "-";

    return raw.toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
    });
  }

  useFocusEffect(
    useCallback(() => {
      lockOrientation();

      return () => {
        restoreScreen();
      };
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <PageTitle title="Data Transaksi" />
      {state.loading ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator animating color={MD2Colors.brown400} />
        </View>
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={state.refreshing}
              onRefresh={handler.refresh}
            />
          }
        >
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>No Transaksi</DataTable.Title>
              <DataTable.Title>Tanggal</DataTable.Title>
              <DataTable.Title>Nama Customer</DataTable.Title>
              <DataTable.Title>Jumlah Barang</DataTable.Title>
              <DataTable.Title>Sub Total</DataTable.Title>
              <DataTable.Title>Diskon</DataTable.Title>
              <DataTable.Title>Ongkir</DataTable.Title>
              <DataTable.Title>Total</DataTable.Title>
            </DataTable.Header>

            {state.data.map((sale) => (
              <DataTable.Row key={sale.id}>
                <DataTable.Cell>{sale.kode}</DataTable.Cell>
                <DataTable.Cell>{converDateToString(sale.tgl)}</DataTable.Cell>
                <DataTable.Cell>{sale.cust.name}</DataTable.Cell>
                <DataTable.Cell>{sale.sales_detail.length}</DataTable.Cell>
                <DataTable.Cell>
                  {formatCurrency(
                    sale.sales_detail.reduce((a, b) => a + b.total, 0)
                  )}
                </DataTable.Cell>
                <DataTable.Cell>{formatCurrency(sale.diskon)}</DataTable.Cell>
                <DataTable.Cell>{formatCurrency(sale.ongkir)}</DataTable.Cell>
                <DataTable.Cell>
                  {formatCurrency(sale.total_bayar)}
                </DataTable.Cell>
              </DataTable.Row>
            ))}

            <DataTable.Row
              style={{ backgroundColor: theme.colors.primaryContainer }}
            >
              <DataTable.Cell style={{ justifyContent: "flex-start" }}>
                <Text
                  variant="bodyMedium"
                  style={{
                    color: theme.colors.onPrimaryContainer,
                    fontWeight: "bold",
                  }}
                >
                  Grand Total
                </Text>
              </DataTable.Cell>
              <DataTable.Cell style={{ justifyContent: "flex-start" }}>
                <Text
                  variant="bodyMedium"
                  style={{
                    color: theme.colors.onPrimaryContainer,
                    fontWeight: "bold",
                  }}
                >
                  {formatCurrency(
                    state.data.reduce((a, b) => a + b.total_bayar, 0)
                  )}
                </Text>
              </DataTable.Cell>
            </DataTable.Row>
          </DataTable>
        </ScrollView>
      )}

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => router.push("/sales/create")}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    gap: 16,
    padding: 16,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
