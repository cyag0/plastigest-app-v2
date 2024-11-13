import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { green } from "react-native-reanimated/lib/typescript/reanimated2/Colors";

const { width } = Dimensions.get("window");

const colores = {
  red: {
    normal: "#ff6968",
    light: "#ff9f9e",
  },
  purple: {
    normal: "#7A54FF",
    light: "#A68FFF",
  },
  orange: {
    normal: "#FF8F61",
    light: "#FFBFA0",
  },
  blue: {
    normal: "#2AC2FF",
    light: "#7EDFFF",
  },
  purple2: {
    normal: "#5C61FF",
    light: "#8F92FF",
  },
  green: {
    normal: "#96DA45",
    light: "#C4F08A",
  },
};

const dashboardItems = [
  {
    title: "Inventario",
    icon: "bars",
    navigateTo: "(inventario)",
    color: "red",
  },
  {
    title: "Inventario Semanal",
    icon: "calendar",
    navigateTo: "inventarioSemanal",
    color: "purple",
  },
  {
    title: "Entradas y Salidas",
    icon: "exchange",
    navigateTo: "entradasSalidas",
    color: "orange",
  },
  {
    title: "Usuarios",
    icon: "user",
    navigateTo: "(usuarios)",
    color: "blue",
  },
  {
    title: "Sucursales",
    icon: "building",
    navigateTo: "sucursales",
    color: "purple2",
  },
  {
    title: "Productos",
    icon: "shopping-cart",
    navigateTo: "(productos)",
    color: "green",
  },
];

export default function DashboardScreen() {
  const navigator = useRouter();

  const handleNavigation = (screen: string) => {
    if (!screen) return;
    navigator.push(screen);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Dashboard</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {dashboardItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.card,
              { backgroundColor: colores[item.color].normal },
            ]}
            onPress={() => handleNavigation(item.navigateTo)}
          >
            <FontAwesome name={item.icon} size={24} color="#FFFFFF" />
            <Text style={styles.cardText}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8F1FF",
  },
  header: {
    backgroundColor: "#1E90FF",
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
  },
  content: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    padding: 10,
  },
  card: {
    backgroundColor: "#4169E1",
    width: width / 2 - 20,
    aspectRatio: 1,
    borderRadius: 10,
    padding: 20,
    margin: 5,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardText: {
    color: "#FFFFFF",
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

interface MenuItemProps {
  title: string;
  icon: string;
  navigateTo: string;
}
