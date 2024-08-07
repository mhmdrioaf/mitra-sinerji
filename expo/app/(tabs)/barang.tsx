import useBarang from "@/hooks/useBarang";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import {
  ActivityIndicator,
  Button,
  Card,
  FAB,
  MD2Colors,
  Searchbar,
  Text,
  useTheme,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BarangPage() {
  const { state, handler } = useBarang();
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
          Data Barang
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
            placeholder="Cari barang..."
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
            {state.data.map((barang) => (
              <Card key={barang.id} mode="contained">
                <Card.Title title={barang.kode} subtitle={barang.nama} />
                <Card.Content>
                  <Text>
                    {barang.harga.toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    })}
                  </Text>
                </Card.Content>

                <Card.Actions>
                  <Button
                    buttonColor={theme.colors.primary}
                    textColor={theme.colors.onPrimary}
                    icon="pencil"
                  >
                    Edit
                  </Button>

                  <Button
                    buttonColor={theme.colors.error}
                    textColor={theme.colors.onError}
                    icon="delete"
                  >
                    Hapus
                  </Button>
                </Card.Actions>
              </Card>
            ))}
          </ScrollView>
        </>
      )}

      <FAB style={styles.fab} icon="plus" onPress={() => {}} />
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
