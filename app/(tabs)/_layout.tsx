import { Tabs, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthContext } from "@/context/AuthContext";
import { ActivityIndicator } from "react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const navigator = useRouter();

  const { user, authLoading } = useAuthContext();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Marcamos que el componente está montado
    setIsMounted(true);
  }, []);

  useEffect(() => {
    console.log("user", user);
    console.log("user loading", authLoading);
    // Solo redirige si el componente está montado y listo
    if (isMounted) {
      if (!user) {
        navigator.replace("/(auth)/login");
      }
    }
  }, [user, isMounted, navigator]);

  return !user ? (
    <ActivityIndicator />
  ) : (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary[700],
        headerShown: false,
      }}
      initialRouteName="(actividades)"
    >
      <Tabs.Screen
        name="(actividades)"
        options={{
          title: "Inicio",
          tabBarLabelStyle: {
            fontSize: 14,
          },
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "home" : "home-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: "Reportes",
          tabBarLabelStyle: {
            fontSize: 14,
          },
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "bar-chart" : "bar-chart-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: "Perfil",
          tabBarLabelStyle: {
            fontSize: 14,
          },
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "person" : "person-outline"}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
