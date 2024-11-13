import React from "react";
import { Stack } from "expo-router";
import { Colors } from "@/constants/Colors";

export default function _layout() {
  return (
    <Stack initialRouteName="index">
      <Stack.Screen
        name="index"
        options={{ headerShown: false, title: "Dashboard" }}
      />
      <Stack.Screen name="inventarioSemanal" />
      {/* Inventario */}
      <Stack.Screen name="(inventario)/index" />
      <Stack.Screen name="(inventario)/create" />
      <Stack.Screen name="(inventario)/show" />
      {/* Productos */}
      <Stack.Screen
        name="(productos)/index"
        options={{
          title: "Productos",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="(productos)/create"
        options={{
          title: "",
        }}
      />
      <Stack.Screen
        name="(productos)/show/[id]"
        options={{
          title: "Detalles del Producto",
        }}
      />
      <Stack.Screen
        name="(productos)/edit/[id]"
        options={{
          title: "Productos/Mostrar",
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
    </Stack>
  );
}
