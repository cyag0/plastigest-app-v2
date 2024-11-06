import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";

export default function entradasSalidas() {
  return (
    <View style={styles.container}>
      <View
        style={{
          flex: 0.7,
          backgroundColor: "#fff",
          borderBottomLeftRadius: 60,
        }}
      ></View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.text}>Entradas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.text}>Entradas</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#4e8ff3",
    flex: 1,
    gap: 10,
  },

  buttonContainer: {
    gap: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flex: 0.3,
  },
  button: {
    backgroundColor: "#5795f4",
    borderRadius: 16,
    borderBottomLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 30,
    height: 100,
  },
  text: {
    color: "#fff",
    fontSize: 24,
  },
});
