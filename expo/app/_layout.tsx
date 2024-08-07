import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import {
  MD3LightTheme as DefaultTheme,
  MD2Colors,
  PaperProvider,
} from "react-native-paper";
import { createMaterialBottomTabNavigator } from "react-native-paper/react-navigation";
import HomePage from "./(tabs)";
import BarangPage from "./(tabs)/barang";
import CustomerPage from "./(tabs)/customer";
import TransaksiPage from "./(tabs)/transaksi";

const test = MD2Colors.brown400;

const theme = {
  ...DefaultTheme,
  colors: {
    primary: "rgb(156, 66, 52)",
    onPrimary: "rgb(255, 255, 255)",
    primaryContainer: "rgb(255, 218, 212)",
    onPrimaryContainer: "rgb(64, 2, 0)",
    secondary: "rgb(119, 86, 81)",
    onSecondary: "rgb(255, 255, 255)",
    secondaryContainer: "rgb(255, 218, 212)",
    onSecondaryContainer: "rgb(44, 21, 17)",
    tertiary: "rgb(111, 92, 46)",
    onTertiary: "rgb(255, 255, 255)",
    tertiaryContainer: "rgb(251, 224, 166)",
    onTertiaryContainer: "rgb(37, 26, 0)",
    error: "rgb(186, 26, 26)",
    onError: "rgb(255, 255, 255)",
    errorContainer: "rgb(255, 218, 214)",
    onErrorContainer: "rgb(65, 0, 2)",
    background: "rgb(255, 251, 255)",
    onBackground: "rgb(32, 26, 25)",
    surface: "rgb(255, 251, 255)",
    onSurface: "rgb(32, 26, 25)",
    surfaceVariant: "rgb(245, 221, 217)",
    onSurfaceVariant: "rgb(83, 67, 64)",
    outline: "rgb(133, 115, 112)",
    outlineVariant: "rgb(216, 194, 190)",
    shadow: "rgb(0, 0, 0)",
    scrim: "rgb(0, 0, 0)",
    inverseSurface: "rgb(54, 47, 45)",
    inverseOnSurface: "rgb(251, 238, 235)",
    inversePrimary: "rgb(255, 180, 167)",
    elevation: {
      level0: "transparent",
      level1: "rgb(250, 242, 245)",
      level2: "rgb(247, 236, 239)",
      level3: "rgb(244, 231, 233)",
      level4: "rgb(243, 229, 231)",
      level5: "rgb(241, 225, 227)",
    },
    surfaceDisabled: "rgba(32, 26, 25, 0.12)",
    onSurfaceDisabled: "rgba(32, 26, 25, 0.38)",
    backdrop: "rgba(59, 45, 43, 0.4)",
  },
};

const Tab = createMaterialBottomTabNavigator();

export default function RootLayout() {
  return (
    <>
      <PaperProvider theme={theme}>
        <Tab.Navigator
          initialRouteName="(tabs)/index"
          activeColor={theme.colors.primary}
        >
          <Tab.Screen
            name="(tabs)/index"
            component={HomePage}
            options={{
              tabBarLabel: "Dashboard",
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons name="home" color={color} size={22} />
              ),
            }}
          />
          <Tab.Screen
            name="(tabs)/barang"
            component={BarangPage}
            options={{
              tabBarLabel: "Barang",
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons
                  name="package"
                  color={color}
                  size={22}
                />
              ),
            }}
          />
          <Tab.Screen
            name="(tabs)/customer"
            component={CustomerPage}
            options={{
              tabBarLabel: "Customer",
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons
                  name="account-group"
                  color={color}
                  size={22}
                />
              ),
            }}
          />
          <Tab.Screen
            name="(tabs)/transaksi"
            component={TransaksiPage}
            options={{
              tabBarLabel: "Transaksi",
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons
                  name="cash-register"
                  color={color}
                  size={22}
                />
              ),
            }}
          />
        </Tab.Navigator>
      </PaperProvider>
      <StatusBar style="dark" backgroundColor={theme.colors.background} />
    </>
  );
}
