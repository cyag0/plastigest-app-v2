import React, { useRef, useState } from "react";
import { Stack } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Animated, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, IconButton } from "react-native-paper";

function _layout() {
  return (
    <Stack initialRouteName="index" screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="index"
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

export const dashboardItems = [
  {
    title: "Inventario",
    icon: "circle",
    navigateTo: "(inventario)",
    color: Colors.primary[500],
  },
  {
    title: "Inventario Semanal",
    icon: "calendar",
    navigateTo: "inventarioSemanal",
    color: Colors.primary[500],
  },
  {
    title: "Entradas y Salidas",
    icon: "circle",
    navigateTo: "entradasSalidas",
    color: Colors.primary[500],
  },
  {
    title: "Usuarios",
    icon: "circle",
    navigateTo: "(usuarios)",
    color: Colors.primary[500],
  },
  {
    title: "Sucursales",
    icon: "circle",
    navigateTo: "sucursales",
    color: Colors.primary[500],
  },
  {
    title: "Productos",
    icon: "circle",
    navigateTo: "(productos)",
    color: Colors.primary[500],
  },
  {
    title: "Proveedores",
    icon: "circle",
    navigateTo: "(provedores)",
    color: Colors.primary[500],
  },
];

export default function DrawerLayout() {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(
    "(productos)"
  );
  const animatedWidth = useRef(new Animated.Value(100)).current;

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
                gap: 16,
                width: open ? "100%" : 80, // Ajusta el ancho según el estado
                alignItems: open ? "flex-start" : "center", // Cambia alineación
                overflow: "hidden",
                borderRadius: 16, // Un poco de suavidad en los bordes
                transition: "all 0.3s ease", // Transición fluida
              },
            ]}
          >
            {dashboardItems.map((item, index) => (
              <Button
                key={"menu-item-" + index}
                icon={item.icon}
                style={{
                  borderRadius: 12,
                  alignItems: "center",
                  backgroundColor:
                    selectedItem === item.navigateTo
                      ? Colors.primary[400]
                      : "transparent", // Destaca el seleccionado
                  width: open ? "100%" : 60, // Botón compacto cuando está cerrado
                  flexDirection: "row",
                  padding: 10, // Espaciado interno
                  transition: "all 0.3s ease", // Transición fluida
                }}
                textColor="#fff"
                mode={selectedItem === item.navigateTo ? "contained" : "text"}
                contentStyle={{
                  padding: 0,
                  width: "100%",
                  justifyContent: open ? "flex-start" : "center", // Centra iconos cuando está cerrado
                }}
                labelStyle={{
                  color: "#fff",
                  fontSize: 16,
                  opacity: open ? 1 : 0, // Oculta el texto suavemente cuando está cerrado
                  transition: "opacity 0.3s ease", // Transición para la opacidad
                }}
                onPress={() => console.log("Navigate to", item.navigateTo)}
              >
                {open && item.title}
              </Button>
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
    </SafeAreaView>
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
