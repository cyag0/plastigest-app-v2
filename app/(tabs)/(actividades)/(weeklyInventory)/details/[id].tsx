import { StyleSheet, View } from "react-native";
import React from "react";
import { Button, Text } from "react-native-paper";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { useAuthContext } from "@/context/AuthContext";

export default function Details() {
  const router = useRouter();
  const auth = useAuthContext();
  return (
    <View style={styles.container}>
      <View style={[styles.card]}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 0,
          }}
        >
          <Button
            style={{ margin: 0, padding: 0 }}
            onPress={() => {
              router.navigate({
                pathname: "/(actividades)/(weeklyInventory)",
              });
            }}
            icon={"arrow-left"}
            textColor={Colors.primary[700]}
          >
            <Text variant="titleMedium" style={styles.title}>
              Inventario semanal - {auth.selectedLocation?.name}
            </Text>
          </Button>
        </View>
        <View style={styles.filters}>
          <View style={{ flexDirection: "row", gap: 4 }}></View>
          <View
            style={{
              flexDirection: "row",
              gap: 4,
              alignItems: "center",
            }}
          ></View>
        </View>
      </View>

      <View style={[{ flex: 1, backgroundColor: "#fff" }, styles.card]}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#e1e1e1",
    flex: 1,
    padding: 10,
    gap: 10,
  },
  card: {
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 16,
  },
  filters: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  title: {
    color: Colors.primary[800],
    fontWeight: "bold",
  },
});
