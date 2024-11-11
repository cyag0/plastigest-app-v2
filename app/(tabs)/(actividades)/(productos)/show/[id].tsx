import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { items } from "..";
import { Colors } from "@/constants/Colors";
import { FontAwesome } from "@expo/vector-icons";
import Api from "@/services";
import { ActivityIndicator } from "react-native-paper";

const ShowProduct = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [product, setProduct] = useState<App.Entities.Products.Product | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  /*   useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const product = await Api.products.show(id);
        setProduct(product);
      } catch (error) {
        console.error("Error al obtener el producto:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]); */

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        setLoading(true);
        try {
          const product = await Api.products.show(id);
          setProduct(product);
        } catch (error) {
          console.error("Error al obtener el producto:", error);
        } finally {
          setLoading(false);
        }
      })();
    }, [])
  );

  return loading ? (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator animating={true} />
    </View>
  ) : (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          style={{ width: "100%", height: "100%", resizeMode: "contain" }}
          source={{
            width: 100,
            uri: "https://www.alpla.com/sites/default/files/styles/square_1x/public/2019-08/water_bottle_500ml_neue_dimension_0.jpg?itok=dtumfxAn",
          }}
        />
      </View>
      <Text
        style={{ textAlign: "right", fontSize: 14, color: Colors.black[600] }}
      >
        {product?.stock
          ? product?.stock + (product?.stock > 1 ? " Productos" : " Producto")
          : "No hay stock"}
      </Text>
      <View style={styles.infoContainer}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text
            style={{
              fontSize: 20,
              color: Colors.black[800],
              fontWeight: "bold",
            }}
          >
            {product?.name}
          </Text>
          <Text
            style={{
              fontSize: 20,
              color: Colors.black[600],
              fontWeight: "bold",
            }}
          >
            ${product?.price}.00 MXN
          </Text>
        </View>
        <View>
          <Text style={{ fontSize: 16, color: Colors.black[600] }}>
            {product?.description}
          </Text>
        </View>
      </View>
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          onPress={() => {
            (async () => {
              try {
                await Api.products.delete(id);
                router.back();
              } catch (error) {
                console.error("Error al eliminar el producto:", error);
              }
            })();
          }}
          style={[
            styles.button,
            { borderColor: Colors.primary[600], borderWidth: 0.5 },
          ]}
        >
          <FontAwesome name="trash" size={24} color={Colors.primary[600]} />
          <Text
            style={{
              color: Colors.primary[600],
              textAlign: "center",
              fontWeight: "bold",
              fontSize: 16,
            }}
          >
            Eliminar
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            router.navigate(`/(tabs)/(actividades)/(productos)/edit/${id}`)
          }
          style={[styles.button, { backgroundColor: Colors.primary[600] }]}
        >
          <FontAwesome name="edit" size={24} color="#fff" />
          <Text
            style={{
              color: "#fff",
              textAlign: "center",
              fontWeight: "bold",
              fontSize: 16,
            }}
          >
            Editar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    backgroundColor: "#fff",
    gap: 10,
  },
  imageContainer: {
    width: "100%",
    height: 200,
    backgroundColor: "#e1e1e1",
    borderRadius: 16,
  },
  infoContainer: {
    flex: 1,
  },
  actionsContainer: {
    flexDirection: "row",
    gap: 16,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginTop: 16,
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
});

export default ShowProduct;
