import React, { useEffect, useState } from "react";
import { Stack, useRouter } from "expo-router";
import { useAuthContext } from "@/context/AuthContext";

const AuthLayout = () => {
  const navigator = useRouter();
  const { user, authLoading } = useAuthContext();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      if (user) {
        navigator.replace("/(tabs)");
      }
    }
  }, [user, isMounted, navigator]);

  return (
    <Stack initialRouteName="login">
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
    </Stack>
  );
};

export default AuthLayout;
