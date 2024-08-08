import useCustomer from "@/hooks/useCustomer";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import {
  ActivityIndicator,
  Button,
  Card,
  Dialog,
  FAB,
  MD2Colors,
  Portal,
  Searchbar,
  Text,
  useTheme,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CustomerPage() {
  const { state, handler } = useCustomer();
  const theme = useTheme();

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text
          variant="headlineMedium"
          style={{
            fontWeight: "bold",
            color: theme.colors.primary,
          }}
        >
          Data Customer
        </Text>
      </View>
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
        <>
          {/* TODO: Change the caret (text cursor) color */}
          <Searchbar
            placeholder="Cari customer..."
            value={state.search}
            clearIcon={() =>
              state.search ? (
                <MaterialCommunityIcons name="close" size={16} />
              ) : null
            }
            onChangeText={(text) => handler.search(text)}
          />

          <ScrollView
            contentContainerStyle={{ rowGap: 8 }}
            refreshControl={
              <RefreshControl
                refreshing={state.refreshing}
                onRefresh={handler.refresh}
              />
            }
          >
            {state.data.length > 0 ? (
              state.data.map((customer) => (
                <Card key={customer.id} mode="contained">
                  <Card.Title title={customer.kode} subtitle={customer.name} />
                  <Card.Content>
                    <Text>{customer.telp}</Text>
                  </Card.Content>

                  <Card.Actions>
                    <Button
                      buttonColor={theme.colors.primary}
                      textColor={theme.colors.onPrimary}
                      icon="pencil"
                      onPress={() =>
                        router.push({
                          pathname: "/customer/edit",
                          params: {
                            id: customer.id,
                          },
                        })
                      }
                    >
                      Edit
                    </Button>

                    <Button
                      buttonColor={theme.colors.error}
                      textColor={theme.colors.onError}
                      onPress={() => handler.showDeleteModal(customer.id)}
                      icon="delete"
                    >
                      Hapus
                    </Button>
                  </Card.Actions>
                </Card>
              ))
            ) : (
              <Text variant="bodySmall" style={{ textAlign: "center" }}>
                Tidak ada data customer...
              </Text>
            )}
          </ScrollView>
        </>
      )}

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => router.push("/customer/create")}
      />

      <Portal>
        <Dialog visible={state.deleting} onDismiss={handler.hideDeleteModal}>
          <Dialog.Title>
            Apakah anda yakin akan menghapus customer ini?
          </Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Tindakan ini akan menghapus data customer selamanya di database.
              Lanjutkan penghapusan customer?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={handler.hideDeleteModal}>Batal</Button>
            <Button onPress={handler.delete}>Hapus</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
