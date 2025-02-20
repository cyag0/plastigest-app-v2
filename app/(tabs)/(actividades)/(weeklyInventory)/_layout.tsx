import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";

export default function _layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="index"
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="details/[id]"
        options={{
          title: "Detalles de inventario",
        }}
      />
      <Stack.Screen
        name="edit/[id]"
        options={{
          title: "Editar inventario",
        }}
      />
    </Stack>
  );
}
