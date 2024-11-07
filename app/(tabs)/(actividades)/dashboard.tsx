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
import { AntDesign } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const dashboardItems = [
  {
    title: "Inventario",
    icon: "cube",
    navigateTo: "inventario",
  },
  {
    title: "Inventario Semanal",
    icon: "calendar",
    navigateTo: "inventarioSemanal",
  },
  {
    title: "Entradas y Salidas",
    icon: "exchange",
    navigateTo: "entradasSalidas",
  },
  {
    title: "Usuarios",
    icon: "users",
    navigateTo: "users",
  },
  {
    title: "Sucursales",
    icon: "building",
    navigateTo: "sucursales",
  },
];

export default function DashboardScreen({ navigation }) {
  const handleNavigation = (screen) => {
    // Aquí iría la lógica de navegación
    console.log(`Navigating to: ${screen}`);
    // navigation.navigate(screen);
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
            style={styles.card}
            onPress={() => handleNavigation(item.navigateTo)}
          >
            <AntDesign name={item.icon} size={30} color="#FFFFFF" />
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
