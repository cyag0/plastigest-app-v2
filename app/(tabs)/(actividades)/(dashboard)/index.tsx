import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { dashboardItems } from "../_layout";
import Animated, { Layout, FadeInDown } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { Card, Icon, Text, TouchableRipple } from "react-native-paper";

const { width } = Dimensions.get("window");
interface MovementProp {
  id: number;
  product: string;
  quantity: number;
  total: number;
  date: string;
  action: "entrada" | "salida";
  type: "compra" | "entrega" | "recibido" | "venta" | "uso";
}

const movements: MovementProp[] = [
  {
    id: 1,
    product: "Botella",
    quantity: 100,
    total: 500,
    date: "2024-11-01",
    action: "entrada",
    type: "compra",
  },
  {
    id: 2,
    product: "Tapadera",
    quantity: 50,
    total: 250,
    date: "2024-11-02",
    action: "entrada",
    type: "recibido",
  },
  {
    id: 3,
    product: "Botella",
    quantity: 20,
    total: 120,
    date: "2024-11-03",
    action: "salida",
    type: "venta",
  },
  {
    id: 4,
    product: "Tapadera",
    quantity: 10,
    total: 50,
    date: "2024-11-04",
    action: "salida",
    type: "entrega",
  },
  {
    id: 5,
    product: "Botella",
    quantity: 30,
    total: 150,
    date: "2024-11-05",
    action: "entrada",
    type: "compra",
  },
  {
    id: 6,
    product: "Tapadera",
    quantity: 15,
    total: 75,
    date: "2024-11-06",
    action: "salida",
    type: "venta",
  },
  {
    id: 7,
    product: "Botella",
    quantity: 25,
    total: 125,
    date: "2024-11-07",
    action: "entrada",
    type: "recibido",
  },
  {
    id: 8,
    product: "Tapadera",
    quantity: 5,
    total: 25,
    date: "2024-11-08",
    action: "salida",
    type: "uso",
  },
  {
    id: 9,
    product: "Botella",
    quantity: 40,
    total: 200,
    date: "2024-11-09",
    action: "entrada",
    type: "compra",
  },
  {
    id: 10,
    product: "Tapadera",
    quantity: 20,
    total: 100,
    date: "2024-11-10",
    action: "salida",
    type: "entrega",
  },
  {
    id: 11,
    product: "Botella",
    quantity: 10,
    total: 50,
    date: "2024-11-11",
    action: "salida",
    type: "uso",
  },
  {
    id: 12,
    product: "Tapadera",
    quantity: 35,
    total: 175,
    date: "2024-11-12",
    action: "entrada",
    type: "recibido",
  },
  {
    id: 13,
    product: "Botella",
    quantity: 60,
    total: 300,
    date: "2024-11-13",
    action: "entrada",
    type: "compra",
  },
  {
    id: 14,
    product: "Tapadera",
    quantity: 18,
    total: 90,
    date: "2024-11-14",
    action: "salida",
    type: "venta",
  },
  {
    id: 15,
    product: "Botella",
    quantity: 45,
    total: 225,
    date: "2024-11-15",
    action: "salida",
    type: "entrega",
  },
  {
    id: 16,
    product: "Tapadera",
    quantity: 12,
    total: 60,
    date: "2024-11-16",
    action: "entrada",
    type: "recibido",
  },
  {
    id: 17,
    product: "Botella",
    quantity: 70,
    total: 350,
    date: "2024-11-17",
    action: "entrada",
    type: "compra",
  },
  {
    id: 18,
    product: "Tapadera",
    quantity: 8,
    total: 40,
    date: "2024-11-18",
    action: "salida",
    type: "uso",
  },
  {
    id: 19,
    product: "Botella",
    quantity: 55,
    total: 275,
    date: "2024-11-19",
    action: "salida",
    type: "venta",
  },
  {
    id: 20,
    product: "Tapadera",
    quantity: 22,
    total: 110,
    date: "2024-11-20",
    action: "salida",
    type: "entrega",
  },
];

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
        <View style={{ flex: 0.7, gap: 10 }}>
          <Card
            style={{
              flex: 0.65,
              backgroundColor: "#fff",
              borderRadius: 12,
            }}
          >
            <Card.Title
              titleVariant="titleLarge"
              titleStyle={{ color: Colors.primary[800], fontWeight: "bold" }}
              title={"Tareas"}
            />
            <Card.Content style={{ flex: 1 }}>
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
                        {
                          backgroundColor: "transparent",
                          flex: 1,
                          flexBasis: 150,
                        },
                      ]}
                      onPress={() => handleNavigation(item.route)}
                    >
                      <LinearGradient
                        colors={[Colors.primary[400], Colors.primary[500]]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={[styles.card, { maxHeight: 150 }]}
                      >
                        <MaterialCommunityIcons
                          name={item.icon}
                          size={24}
                          color="#FFFFFF"
                        />
                        <Text style={styles.cardText}>{item.name}</Text>
                      </LinearGradient>
                    </AnimatedTouchable>
                  ))}
                </View>
              </ScrollView>
            </Card.Content>
          </Card>
          <View
            style={{ flex: 0.35, backgroundColor: "#fff", borderRadius: 12 }}
          ></View>
        </View>

        <View
          style={{
            flex: 0.3,
            backgroundColor: "#fff",
            borderRadius: 12,
            // no shadow
            shadowColor: "transparent",
            elevation: 0,
            padding: 10,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <Text
              variant="titleLarge"
              style={{ color: Colors.black[800], fontWeight: "bold" }}
            >
              Actividad
            </Text>
            <TouchableRipple
              onPress={() => {}}
              style={{
                borderWidth: 1,
                borderColor: Colors.black[200],
                padding: 8,
                borderRadius: 8,
                flexDirection: "row",
                gap: 4,
                alignItems: "center",
              }}
            >
              <>
                <Icon size={16} source={"calendar"} />
                <Text
                  variant="labelMedium"
                  style={{
                    color: Colors.black[800],
                  }}
                >
                  Ultimos 7 dias
                </Text>
              </>
            </TouchableRipple>
          </View>
          <View style={{ flex: 1, gap: 12 }}>
            <LastSevenDays />
            <Movements />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

function RenderTypeText(movement: MovementProp) {
  switch (movement.type) {
    case "compra":
      return "Se compraron " + movement.quantity + " " + movement.product;
    case "entrega":
      return (
        "Se entregaron " +
        movement.quantity +
        " " +
        movement.product +
        " a una sucursal"
      );
    case "recibido":
      return (
        "Se recibieron " +
        movement.quantity +
        " " +
        movement.product +
        " de otra sucursal"
      );
    case "venta":
      return "Se vendieron " + movement.quantity + " " + movement.product;
    case "uso":
      return "Se usaron " + movement.quantity + " " + movement.product;
    default:
      return "Se realizaron movimientos";
  }
}

function RenderIcon(movement: MovementProp) {
  switch (movement.type) {
    case "compra":
      return "shopping";
    case "entrega":
      return "truck-delivery";
    case "recibido":
      return "package-variant";
    case "venta":
      return "cash-register";
    case "uso":
      return "hammer-wrench";
    default:
      return "cube";
  }
}

function LastSevenDays() {
  return (
    <View style={{ height: 150, width: "100%" }}>
      <View
        style={{
          borderRadius: 16,
          backgroundColor: Colors.black[200],
          flex: 1,
          width: "100%",
        }}
      ></View>
    </View>
  );
}

function Movements() {
  return (
    <View style={{ flex: 1 }}>
      <Text
        variant="titleMedium"
        style={{
          color: Colors.black[800],
          marginBottom: 8,
        }}
      >
        Movimientos
      </Text>
      <ScrollView
        style={{
          flex: 1,
        }}
      >
        <View style={{ gap: 4 }}>
          {movements.map((movement, index) => (
            <>
              <TouchableRipple
                onPress={() => {}}
                key={"movement-" + movement.id}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 12,
                  flex: 1,
                  paddingHorizontal: 8,
                  paddingVertical: 8,
                  flexDirection: "row",
                  gap: 8,
                  alignItems: "center",
                  margin: 0,
                }}
              >
                <>
                  <View
                    style={{
                      backgroundColor:
                        movement.action === "entrada"
                          ? Colors.green[200]
                          : Colors.red[100],
                      borderRadius: 50,
                      padding: 8,
                      marginRight: 8,
                    }}
                  >
                    <Icon
                      source={RenderIcon(movement)}
                      size={24}
                      color={
                        movement.action === "entrada"
                          ? Colors.green[600]
                          : Colors.red[500]
                      }
                    />
                  </View>
                  <View style={{ gap: 4, flex: 1 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text
                        style={{
                          color: Colors.black[900],
                          fontSize: 14,
                          fontWeight: "bold",
                        }}
                      >
                        {movement.product}
                      </Text>
                      <View style={{ flexDirection: "row" }}>
                        <Icon
                          source={
                            movement.action === "entrada"
                              ? "arrow-up"
                              : "arrow-down"
                          }
                          size={16}
                          color={
                            movement.action === "entrada"
                              ? Colors.green[600]
                              : Colors.red[500]
                          }
                        />
                        <Text
                          variant="labelSmall"
                          style={{
                            color:
                              movement.action === "entrada"
                                ? Colors.green[600]
                                : Colors.red[500],
                            fontWeight: "bold",
                            fontSize: 14,
                          }}
                        >
                          {movement.total}.00$
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text
                        style={{
                          color: Colors.black[500],
                          fontSize: 12,
                        }}
                      >
                        {RenderTypeText(movement)}
                      </Text>
                      <Text
                        style={{
                          color: Colors.black[400],
                          fontSize: 12,
                        }}
                      >
                        {new Date(movement.date).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                </>
              </TouchableRipple>

              <View
                style={{
                  height: 1,
                  backgroundColor: Colors.black[100],
                  width: "100%",
                  marginVertical: 4,
                }}
              ></View>
            </>
          ))}
        </View>
      </ScrollView>
    </View>
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
