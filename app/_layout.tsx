import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { SafeAreaView } from "react-native";
import { PaperProvider } from "react-native-paper";
import { Colors } from "@/constants/Colors";
import AuthContextProvider, { useAuthContext } from "@/context/AuthContext";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function RootLayout() {
  const { user } = useAuthContext();
  const navigator = useRouter();

  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <PaperProvider
        theme={{
          ...DefaultTheme,
          roundness: 8,
          colors: {
            ...DefaultTheme.colors,
            primary: Colors.primary[600],
            secondary: "tomato",
            surfaceVariant: Colors.primary[100],
          },
        }}
      >
        <Stack initialRouteName={!user ? "(auth)" : "(tabs)"}>
          {!user ? (
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          ) : (
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          )}
          <Stack.Screen name="+not-found" />
        </Stack>
      </PaperProvider>
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <AuthContextProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <RootLayout />
      </SafeAreaView>
    </AuthContextProvider>
  );
}
