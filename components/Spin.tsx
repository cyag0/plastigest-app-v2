import React from "react";
import { View, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { ActivityIndicator } from "react-native-paper";

interface SpinProps {
  loading: boolean;
  children: React.ReactNode;
  styles?: StyleProp<ViewStyle>; // Estilos personalizados para el contenedor principal
}

const Spin: React.FC<SpinProps> = ({
  loading,
  children,
  styles: customStyles,
}) => {
  return (
    <View style={[styles.container, customStyles]}>
      {children}
      {loading && (
        <View style={styles.overlay}>
          <ActivityIndicator animating={true} size="large" color="white" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative", // Importante para el overlay
  },
  overlay: {
    ...StyleSheet.absoluteFillObject, // Cubre toda el área del contenedor
    backgroundColor: "rgba(0, 0, 0, 0.2)", // Fondo semitransparente
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1, // Asegura que el overlay esté por encima
  },
});

export default Spin;
