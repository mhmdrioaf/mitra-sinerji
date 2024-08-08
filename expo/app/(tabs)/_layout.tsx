import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "react-native-paper";
import { createMaterialBottomTabNavigator } from "react-native-paper/react-navigation";
import BarangPage from "./barang";
import CustomerPage from "./customer";
import TransaksiPage from "./transaksi";

const Tab = createMaterialBottomTabNavigator();

export default function TabsLayout() {
  const theme = useTheme();
  return (
    <Tab.Navigator
      initialRouteName="transaksi"
      activeColor={theme.colors.primary}
    >
      <Tab.Screen
        name="transaksi"
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
      <Tab.Screen
        name="barang"
        component={BarangPage}
        options={{
          tabBarLabel: "Barang",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="package" color={color} size={22} />
          ),
        }}
      />
      <Tab.Screen
        name="customer"
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
    </Tab.Navigator>
  );
}
