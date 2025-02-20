import { ScrollView, StyleSheet, View } from "react-native";
import React, { useEffect } from "react";
import { Button, DataTable, Text, TextInput } from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { useAuthContext } from "@/context/AuthContext";
import Api from "@/services";
import weeklyInventory from "@/services/weeklyInventory";
import FormInput from "@/components/FormComponents/FormInput";
import { Formik } from "formik";

export default function Edit() {
  const router = useRouter();
  const auth = useAuthContext();
  const [details, setDetails] = React.useState<{
    [key: string]: {
      cost: number;
      created_at: string;
      id: number;
      initial_stock: number;
      movements: number;
      physical_stock: number;
      product_id: number;
      stock: number;
      total_stock: number;
      updated_at: string;
      weekly_inventory_id: number;
    };
  }>({});

  const { id: weeklyInventoryId } = useLocalSearchParams();

  useEffect(() => {
    getDetails();
  }, []);

  async function getDetails() {
    try {
      const res = await Api.weeklyInventory.getDetails(
        parseInt(weeklyInventoryId as string)
      );

      console.log(res);

      setDetails(res.data);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.card,
          {
            backgroundColor: "transparent",
          },
        ]}
      >
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

      <View style={{ flex: 1 }}>
        <View style={[styles.card, { flex: 1, width: "100%" }]}>
          <ScrollView>
            <Formik onSubmit={() => {}} initialValues={details}>
              {(props) => (
                <DataTable style={{ flex: 1, width: "100%" }}>
                  <DataTable.Header>
                    <DataTable.Title>Producto</DataTable.Title>
                    <DataTable.Title>Stock Inicial</DataTable.Title>
                    <DataTable.Title>Stock Final</DataTable.Title>
                    <DataTable.Title>Movimientos</DataTable.Title>
                    <DataTable.Title>Costo</DataTable.Title>
                    <DataTable.Title>Stock Físico</DataTable.Title>
                  </DataTable.Header>
                  {Object.keys(details).map((key) => {
                    const detail = details[key];

                    //si no hubo movimientos y el stock final es 0, usar el stock inicial
                    /* if (
    (!details.movements || detail.movements === 0) &&
    (!details.stock || detail.stock === 0)
  ) {
    detail["stock"] = detail.initial_stock;
    console.log("stock inicial");
  } */

                    return (
                      <DataTable.Row key={key}>
                        <DataTable.Cell>{detail.product}</DataTable.Cell>
                        <DataTable.Cell>{detail.initial_stock}</DataTable.Cell>
                        <DataTable.Cell>{detail.stock}</DataTable.Cell>
                        <DataTable.Cell>{detail.movements || 0}</DataTable.Cell>
                        <DataTable.Cell>
                          <Text
                            style={{
                              color: !detail.cost
                                ? "#888"
                                : detail.cost > 0
                                ? Colors.green[700]
                                : Colors.red[700],
                            }}
                          >
                            {detail.cost || 0}
                          </Text>
                        </DataTable.Cell>
                        <DataTable.Cell>
                          <View>
                            <TextInput
                              style={{ width: "100%", height: 40, padding: 0 }}
                              value={props.values.product_id?.physical_stock.toString()}
                              onChange={(e) => {
                                props.setFieldValue(
                                  `product_id.physical_stock`,
                                  e.target.value
                                );
                              }}
                            />
                          </View>
                        </DataTable.Cell>
                      </DataTable.Row>
                    );
                  })}
                </DataTable>
              )}
            </Formik>
          </ScrollView>
        </View>
      </View>
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
