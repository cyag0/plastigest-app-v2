import { Colors } from "@/constants/Colors";
import { useAuthContext } from "@/context/AuthContext";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Button } from "react-native-paper";

const { width } = Dimensions.get("window");

const userRoles = [
  { id: 1, role: "Administrador", description: "Acceso completo al sistema" },
  { id: 2, role: "Editor", description: "Puede editar y publicar contenido" },
  { id: 3, role: "Analista", description: "Acceso a reportes y estadísticas" },
  { id: 4, role: "Usuario", description: "Acceso básico a la plataforma" },
];

const chartData = {
  labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
  datasets: [
    {
      data: [20, 45, 28, 80, 99, 43],
      color: (opacity = 1) => "#fff",
      strokeWidth: 2,
    },
  ],
};

export default function UserDashboard() {
  const { logout } = useAuthContext();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Dashboard de Usuario</Text>
        </View>

        <Button
          style={{
            backgroundColor: "#fff",
            marginBottom: 12,
            borderRadius: 10,
          }}
          onPress={logout}
          mode="contained"
        >
          <Text style={{ color: Colors.red[600] }}>Cerrar sesion</Text>
        </Button>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tus Roles</Text>
          {userRoles.map((role) => (
            <View key={role.id} style={styles.roleItem}>
              <Text style={styles.roleName}>{role.role}</Text>
              <Text style={styles.roleDescription}>{role.description}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actividad Reciente</Text>
          <View
            style={{
              borderRadius: 16,
              width: "100%",
              overflow: "hidden",
              flexDirection: "row",
            }}
          >
            <LineChart
              data={chartData}
              height={220}
              width={width - 40}
              chartConfig={{
                backgroundColor: "#e26a00",
                backgroundGradientFrom: "#fb8c00",
                backgroundGradientTo: "#ffa726",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  flex: 1,
                },
                propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                  stroke: "#ffa726",
                },
              }}
              bezier
              style={styles.chart}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  section: {
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  roleItem: {
    marginBottom: 10,
  },
  roleName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4a4a4a",
  },
  roleDescription: {
    fontSize: 14,
    color: "#777",
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});
