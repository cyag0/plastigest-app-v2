import React, { useRef, useState } from "react";
import { Stack, useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Animated, Dimensions, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, IconButton, Text } from "react-native-paper";
import MenuContextContextProvider, {
  useMenuContext,
} from "@/context/MenuContext";
import { Link } from "expo-router";

const { width } = Dimensions.get("window");
const isTablet = width >= 768;

const BASE_URL = "(tabs)/(actividades)/";
export const dashboardItems: App.Entities.Roles.Resource[] = [
  {
    name: "Dashboard",
    icon: "view-dashboard",
    route: "",
    description: "Dashboard de la tienda",
    id: 0,
    resource: "dashboard",
  },
  {
    name: "Productos",
    icon: "package",
    route: "(productos)",
    description: "Administra los productos de la tienda",
    id: 1,
    resource: "products",
    category: "inventory",
  },
  {
    name: "Usuarios",
    icon: "account",
    route: "(users)",
    description: "Administra los usuarios de la tienda",
    id: 2,
    resource: "users",
    category: "admin",
  },
  {
    name: "Proveedores",
    icon: "truck",
    route: "(provedores)",
    description: "Administra los proveedores de la tienda",
    id: 3,
    resource: "suppliers",
    category: "inventory",
  },
  {
    name: "Roles y Permisos",
    icon: "shield-account",
    route: "(rolesPermisos)",
    description: "Administra los roles y permisos de la sucursal",
    id: 4,
    resource: "roles",
    category: "admin",
  },
];

function _layout() {
  return (
    <Stack
      initialRouteName="(dashboard)"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name="(dashboard)"
        options={{ headerShown: false, title: "Dashboard" }}
      />
      <Stack.Screen name="inventarioSemanal" />
      {/* Productos */}
      <Stack.Screen
        name="(productos)/index"
        options={{
          title: "Productos",
          headerShown: false,
        }}
      />

      {/* users */}
      <Stack.Screen
        name="(usuarios)/index"
        options={{
          title: "Usuarios",
          headerStyle: { backgroundColor: Colors.primary[500] },
        }}
      />

      {/* Proveedores */}
      <Stack.Screen
        name="(provedores)/index"
        options={{
          title: "Proveedores",
          headerStyle: { backgroundColor: Colors.primary[500] },
        }}
      />
    </Stack>
  );
}

function DrawerLayout() {
  const [open, setOpen] = useState<boolean>(false);
  const animatedWidth = useRef(new Animated.Value(100)).current;

  const menuProps = useMenuContext();

  const navigator = useRouter();

  const toggleDrawer = () => {
    setOpen(!open);
    Animated.timing(animatedWidth, {
      toValue: open ? 100 : 225, // Cambia el ancho dependiendo del estado
      duration: 200, // Duración de la animación en milisegundos
      useNativeDriver: false, // No puede usarse para propiedades no transformables como "width"
    }).start();
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {isTablet ? (
        <View
          style={{
            flexDirection: "row",
            flex: 1,
            backgroundColor: Colors.primary[400],
          }}
        >
          <Animated.View
            style={{
              width: animatedWidth,
              alignItems: !open ? "center" : "flex-end",
              padding: 16,
            }}
          >
            <IconButton
              icon={"menu"}
              iconColor={"#fff"}
              size={20}
              onPress={toggleDrawer}
            />

            <Animated.View
              style={[
                {
                  width: open ? "100%" : 80, // Ajusta el ancho según el estado
                  overflow: "hidden",
                  borderRadius: 16, // Un poco de suavidad en los bordes
                },
              ]}
            >
              {dashboardItems.map((item, index) => (
                <MenuButton
                  key={item.id}
                  item={item}
                  selectedItem={menuProps.selectedMenu}
                  setSelectedItem={menuProps.setSelectedMenu}
                  index={index}
                  open={open}
                />
              ))}
            </Animated.View>
          </Animated.View>
          <Animated.View
            style={{
              flex: 1,
              backgroundColor: Colors.primary[400],
              padding: 16,
              paddingLeft: 0,
            }}
          >
            <View
              style={{
                flex: 1,
                borderRadius: 20,
                overflow: "hidden",
              }}
            >
              <_layout />
            </View>
          </Animated.View>
        </View>
      ) : (
        <_layout />
      )}
    </SafeAreaView>
  );
}

export default function DrawerLayoutWithMenu() {
  return (
    <MenuContextContextProvider>
      <DrawerLayout />
    </MenuContextContextProvider>
  );
}

function MenuButton({
  item,
  selectedItem,
  index,
  open,
  setSelectedItem,
}: {
  item: App.Entities.Roles.Resource;
  selectedItem: string | null;
  index: number;
  open: boolean;
  setSelectedItem: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  const navigator = useRouter();

  function handleNavigation(route: string) {
    if (item.route === "") {
      navigator.replace("/(tabs)/(actividades)/(dashboard)");
      return;
    }

    navigator.navigate(BASE_URL + route);
  }

  return (
    <View
      style={{
        width: "100%",
        alignItems: "center",
      }}
    >
      {open ? (
        <Button
          key={"menu-item-" + index}
          icon={item.icon}
          style={{
            width: "100%",
            borderRadius: 12,
            padding: 6, // Espaciado interno
            alignItems: "stretch",
            transition: "all 0.3s ease", // Transición fluida
          }}
          textColor="#fff"
          mode={selectedItem === item.resource ? "contained" : "text"}
          labelStyle={{
            color: "#fff",
            fontSize: 24,
          }}
          onPress={() => {
            handleNavigation(item.route);
          }}
        >
          {open && <Text style={{ fontSize: 16, flex: 1 }}>{item.name}</Text>}
        </Button>
      ) : (
        <IconButton
          icon={item.icon}
          size={24}
          containerColor={
            selectedItem === item.resource ? Colors.primary[600] : "transparent"
          }
          mode="contained-tonal"
          iconColor="#fff"
          onPress={(e) => {
            handleNavigation(item.route);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "",
    flexDirection: "row",
    width: "100%",
    gap: 6,
  },
  textWhite: {
    color: "#fff",
    fontSize: 16,
    //truncate text if it's too long
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
});
