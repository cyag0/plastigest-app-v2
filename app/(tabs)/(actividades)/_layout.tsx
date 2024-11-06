import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import Inventario from "./inventario";

export default function _layout() {
  return (
    <Stack>
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="inventario" />
      <Stack.Screen name="inventarioSemanal" />
    </Stack>
  );
}
