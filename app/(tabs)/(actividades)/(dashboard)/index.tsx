import React, { useEffect } from "react";
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
import Animated, { Layout, FadeInDown } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import {
  Button,
  Card,
  Icon,
  Modal,
  Portal,
  RadioButton,
  Text,
  TouchableRipple,
} from "react-native-paper";
import { useAuthContext } from "@/context/AuthContext";
import { useMenuContext } from "@/context/MenuContext";
import Api from "@/services";

const { width } = Dimensions.get("window");
interface MovementProp {
  id: number;
  product: string;
  quantity: number;
  total: number;
  date: string;
  action: "entrada" | "salida";
  type: "compra" | "traslado" | "recarga" | "venta" | "uso";
}

export default function DashboardScreen() {
  const navigator = useRouter();
  const { dashboardItems } = useMenuContext();
  const auth = useAuthContext();

  const [items, setItems] = React.useState<MenuItemProps[]>([]);

  const isTablet = width >= 768;

  const handleNavigation = (screen: string) => {
    if (!screen) return;
    navigator.push(screen as any);
  };

  const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

  useEffect(() => {
    //sort items by category

    if (!auth.userPermissions) {
      return;
    }

    const itemsFiltered = dashboardItems.filter((item) => {
      /* item.category &&
        item.category !== "dashboard" &&
        (auth.userPermissions[item.resource]?.create || false) === true */

      if (!item.category) return false;

      if (item.category === "dashboard") return false;

      if (
        !auth.userPermissions[item.resource] ||
        !auth.userPermissions[item.resource].create
      ) {
        return false;
      }

      return true;
    });

    const sortedItems = itemsFiltered.sort((a, b) =>
      a.category.localeCompare(b.category)
    );

    setItems(sortedItems);
  }, [dashboardItems, auth.userPermissions]);

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
              flex: 1,
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
                  {items.map((item, index) => (
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
                        colors={
                          item.category === "admin"
                            ? ["#FFA07A", "#FF6347"]
                            : [Colors.primary[400], Colors.primary[500]]
                        }
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
        </View>

        {/* Movements Card */}
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

      {/* <SelectLocation /> */}
    </SafeAreaView>
  );
}

function RenderTypeText(movement: MovementProp) {
  switch (movement.action as any) {
    case "compra":
      return "Se compraron " + movement.quantity + " " + movement.product;
    case "recarga":
      return (
        "Se entregaron " +
        movement.quantity +
        " " +
        movement.product +
        " a una sucursal"
      );
    case "traslado":
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

//make a const for the last 7 days
const TYPE_ICON = {
  compra: "shopping",
  traslado: "truck-delivery",
  recarga: "package-variant",
  venta: "cash-register",
  uso: "hammer-wrench",
};

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

function SelectLocation(prevValue: any) {
  const auth = useAuthContext();
  const [radioValue, setRadioValue] = React.useState(
    auth.selectedLocation?.id?.toString() || ""
  );
  const router = useRouter();
  const [visible, setVisible] = React.useState(true);

  return (
    <Portal
      theme={{
        colors: {
          backdrop: "#00000099",
        },
      }}
    >
      <Modal
        onDismiss={() => setVisible(false)}
        style={{
          backgroundColor: "transparent",
          padding: 16,
          borderRadius: 12,
        }}
        contentContainerStyle={{
          padding: 16,
          borderRadius: 12,
          backgroundColor: "#fff",
          maxWidth: 500,
          width: "95%",
          alignSelf: "center",
        }}
        visible={visible}
      >
        <RadioButton.Group
          onValueChange={(value) => {
            setRadioValue(value);
          }}
          value={radioValue || ""}
        >
          {auth.locations.length > 0 &&
            auth.locations.map((location) => (
              <RadioButton.Item
                label={location.name}
                value={location.id.toString()}
              />
            ))}
        </RadioButton.Group>

        <Button
          disabled={auth.selectedLocation?.id === null}
          onPress={() => {
            if (radioValue !== auth.selectedLocation?.toString()) {
              router.replace({
                pathname: "/(actividades)/(dashboard)",
              });
              auth.setSelectedLocation(
                auth.locations.find((l) => l.id.toString() === radioValue) ||
                  null
              );
            }
            setVisible(false);
          }}
        >
          Confirmar
        </Button>
      </Modal>
    </Portal>
  );
}

function Movements() {
  const [movements, setMovements] = React.useState<MovementProp[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const movements = await Api.movements.index();
        setMovements(movements.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

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
                        movement.type === "entrada"
                          ? Colors.green[200]
                          : Colors.red[100],
                      borderRadius: 50,
                      padding: 8,
                      marginRight: 8,
                    }}
                  >
                    <Icon
                      source={TYPE_ICON[movement.action as any]}
                      size={24}
                      color={
                        movement.type === "entrada"
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
                            movement.type === "entrada"
                              ? "arrow-up"
                              : "arrow-down"
                          }
                          size={16}
                          color={
                            movement.type === "entrada"
                              ? Colors.green[600]
                              : Colors.red[500]
                          }
                        />
                        <Text
                          variant="labelSmall"
                          style={{
                            color:
                              movement.type === "entrada"
                                ? Colors.green[600]
                                : Colors.red[500],
                            fontWeight: "bold",
                            fontSize: 14,
                          }}
                        >
                          {movement.total}$
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
                key={"movement-divider-" + movement.id}
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
