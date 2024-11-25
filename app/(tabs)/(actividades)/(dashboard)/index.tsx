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
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { dashboardItems } from "../_layout";
import Animated, { Layout, FadeInDown } from "react-native-reanimated";

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

export default function DashboardScreen() {
  const navigator = useRouter();

  const isTablet = width >= 768;

  const handleNavigation = (screen: string) => {
    if (!screen) return;
    navigator.push(screen as any);
  };

  const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.black[100],
          flexDirection: isTablet ? "row" : "column",
          gap: 10,
          padding: 10,
        }}
      >
        <View style={{ flex: 0.65, gap: 10 }}>
          <View
            style={{
              flex: 0.65,
              backgroundColor: "#fff",
              borderRadius: 12,
              padding: 12,
            }}
          >
            <ScrollView
              style={{
                flex: 1,
              }}
            >
              <View style={[styles.content]}>
                {dashboardItems.map((item, index) => (
                  <AnimatedTouchable
                    key={"menu-item-" + index}
                    entering={FadeInDown.delay(index * 100)} // Entrada animada
                    layout={Layout.springify()
                      .damping(15) // Controla la amortiguación (menor valor = más elástico)
                      .stiffness(120) // Controla la rigidez (mayor valor = menos elástico)}
                      .mass(1)}
                    style={[
                      styles.card,
                      { backgroundColor: Colors.primary[400], maxHeight: 150 },
                    ]}
                    onPress={() => handleNavigation(item.route)}
                  >
                    <MaterialCommunityIcons
                      name={item.icon}
                      size={24}
                      color="#FFFFFF"
                    />
                    <Text style={styles.cardText}>{item.name}</Text>
                  </AnimatedTouchable>
                ))}
              </View>
            </ScrollView>
          </View>
          <View
            style={{ flex: 0.35, backgroundColor: "#fff", borderRadius: 12 }}
          ></View>
        </View>

        <View
          style={{ flex: 0.35, backgroundColor: "#fff", borderRadius: 12 }}
        ></View>
      </View>
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
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  card: {
    flex: 1,
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minWidth: 150,
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
