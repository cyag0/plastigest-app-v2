import {
  Image,
  StyleSheet,
  Platform,
  ScrollView,
  TouchableOpacity,
  Text,
  View,
} from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useEffect, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";

interface MenuItemProps {
  title: string;
  icon: string;
  navigateTo: string;
}

export default function HomeScreen() {
  const [items, setItems] = useState<MenuItemProps[]>([]);
  useEffect(() => {
    setItems([
      {
        title: "Inventario",
        icon: "home",
        navigateTo: "inventario",
      },
      {
        title: "Inventario Semanal",
        icon: "home",
        navigateTo: "inventarioSemanal",
      },
      {
        title: "Entradas y Salidas",
        icon: "home",
        navigateTo: "entradasSalidas",
      },
      {
        title: "Usuarios",
        icon: "user",
        navigateTo: "users",
      },
    ]);
  }, []);

  return (
    <ScrollView>
      <View
        style={{ flexDirection: "row", flexWrap: "wrap", padding: 10, gap: 10 }}
      >
        {items.map((item, index) => (
          <Menu key={index} item={item} />
        ))}
      </View>
    </ScrollView>
  );
}

function Menu({ item }: { item: MenuItemProps }) {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={{
        backgroundColor: "#fff",
        minWidth: 150,
        flex: 1,
        alignItems: "center",
        paddingVertical: 14,
        paddingHorizontal: 10,
      }}
      onPress={() => {
        router.navigate(`/(tabs)/(actividades)/${item.navigateTo || ""}`);
      }}
    >
      <AntDesign name={item.icon} size={30} />
      <Text style={{ fontSize: 20, textAlign: "center" }}>{item.title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
