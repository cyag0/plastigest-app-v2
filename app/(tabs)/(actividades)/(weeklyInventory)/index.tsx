import { Image, StyleSheet, View } from "react-native";
import React, { useEffect } from "react";
import { Button, Icon, IconButton, Text, TextInput } from "react-native-paper";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { useAuthContext } from "@/context/AuthContext";
import ProTable from "@/components/ProComponents/ProTable";
import Api from "@/services";

function Table() {
  const auth = useAuthContext();
  const router = useRouter();
  return (
    <ProTable<App.Entities.WeeklyInventory.WeeklyInventory>
      api={Api.weeklyInventory}
      resource="weeklyInventory"
      columns={[
        {
          title: "Usuario",
          field: "user",
        },
        {
          title: "Fecha de inicio",
          field: "start_date",
        },
        {
          title: "Fecha de fin",
          field: "end_date",
        },
        {
          title: "Movimientos",
          field: "total_movements",
        },
        {
          title: "Stock total",
          field: "total_stock",
        },
        {
          title: "Costo total",
          field: "total_cost",
          render: (row) => <Text>${row}</Text>,
        },
        {
          title: "Estado",
          field: "status",
          render: (row) => (
            <View
              style={{
                backgroundColor:
                  row === "Activo" ? Colors.green[200] : Colors.yellow[100],
                padding: 5,
                paddingHorizontal: 10,
                borderRadius: 5,
                minWidth: 100,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon
                size={16}
                source={row === "completado" ? "check" : "close"}
                color={
                  row === "completado" ? Colors.green[600] : Colors.yellow[700]
                }
              />
              <Text
                style={{
                  color:
                    row === "completado"
                      ? Colors.green[700]
                      : Colors.yellow[700],
                  textAlign: "center",
                  fontWeight: 600,
                }}
              >
                {row === "completado" ? "Completado" : "Pendiente"}
              </Text>
            </View>
          ),
        },
      ]}
      indexParams={{
        filters: {
          location_id: auth?.selectedLocation?.id,
        },
      }}
      title={"Inventarios semanales - " + auth?.selectedLocation?.name}
      renderActions={(_, row) => {
        return (
          <View style={{ flexDirection: "row", gap: 4 }}>
            <IconButton
              icon={"eye"}
              iconColor={Colors.primary[500]}
              onPress={() => {
                router.push({
                  pathname: "/(actividades)/(weeklyInventory)/details/[id]",
                  params: { id: row.id },
                });
              }}
            />
            <IconButton
              iconColor={Colors.primary[500]}
              icon={"pencil"}
              onPress={() => {
                router.push({
                  pathname: "/(actividades)/(weeklyInventory)/edit/[id]",
                  params: { id: row.id },
                });
              }}
            />
          </View>
        );
      }}
    />
  );
}

const index = () => {
  const [thereAnInventory, setThereAnInventory] = React.useState(false);
  const router = useRouter();

  const auth = useAuthContext();

  useEffect(() => {
    (async () => {
      try {
        const res = await Api.weeklyInventory.exists(
          auth?.selectedLocation?.id as number
        );

        setThereAnInventory(res || false);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  async function startInventory() {
    try {
      const res = await Api.weeklyInventory.create({
        location_id: auth.selectedLocation?.id,
      });

      setThereAnInventory(true);
    } catch (error) {
      console.log(error);
    }
  }

  return thereAnInventory ? (
    <Table />
  ) : (
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
              router.replace({
                pathname: "/(actividades)/(dashboard)",
              });
            }}
            icon={"arrow-left"}
            textColor={Colors.primary[700]}
          >
            <Text variant="titleMedium" style={styles.title}>
              Inventario semanal {""}
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

      <View style={[{ flex: 1, backgroundColor: "#fff" }, styles.card]}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <View>
            <View
              style={{
                marginBottom: 8,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 16,
                overflow: "hidden",
              }}
            >
              <Image
                style={{
                  resizeMode: "contain",
                  maxWidth: 200,
                  maxHeight: 150,
                  width: "100%",
                  borderRadius: 16,
                }}
                source={require("./../../../../assets/empty.png")}
              />
            </View>
            <Text>
              Parece que todavia no se ha hecho un corte en esta sucursal
            </Text>
            <View>
              <Button
                style={{ alignSelf: "center" }}
                onPress={startInventory}
                icon={"scissors-cutting"}
              >
                Hacer corte
              </Button>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default index;

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
