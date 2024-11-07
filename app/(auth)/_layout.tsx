import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { Stack } from "expo-router";

const AuthLayout = () => {
  return (
    <Stack initialRouteName="login">
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
    </Stack>
  );
};

export default AuthLayout;
