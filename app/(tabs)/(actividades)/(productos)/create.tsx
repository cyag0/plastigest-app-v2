import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import {
  ActivityIndicator,
  Button,
  TextInput,
  Text as TextPaper,
} from "react-native-paper";
import { FontAwesome } from "@expo/vector-icons";
import Api from "@/services";
import { useRouter } from "expo-router";

interface CreateProductProps {
  id?: string;
}

const CreateProduct = ({ id }: CreateProductProps) => {
  const [product, setProduct] = useState<App.Entities.Products.Product>({
    name: "",
    img: "",
    description: "",
    stock: "",
    price: "",
  });
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        console.log("id", id);
        if (id) {
          const product = await Api.products.show(id);
          console.log("product", product);
          setProduct(product);
        }
      } catch (error) {
        console.error("Error al obtener el producto:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  return loading ? (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator animating={true} />
    </View>
  ) : (
    <Formik
      initialValues={{
        name: product.name,
        description: product.description,
        stock: product.stock.toString() || "0",
        price: product.price.toString() || "0",
      }}
      onSubmit={(values: App.Entities.Products.Product) => {
        (async () => {
          setLoading(true);
          try {
            if (id) {
              await Api.products.update(id, values);
            } else {
              await Api.products.create(values);
            }

            router.back();
          } catch (error) {
            console.error("Error al crear el producto:", error);
          } finally {
            setLoading(false);
          }
        })();
      }}
    >
      {({ handleChange, handleBlur, handleSubmit, values }) => (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
          <View style={{ padding: 16, gap: 10, flex: 1 }}>
            <View style={{ gap: 10, flex: 1 }}>
              <TextPaper variant="displaySmall" style={{ fontWeight: "bold" }}>
                Nuevo Producto
              </TextPaper>
              <TextInput
                label={"Nombre"}
                onChangeText={handleChange("name")}
                onBlur={handleBlur("name")}
                value={values.name}
                placeholder="Botella, Tapadera, etc."
              />
              <TextInput
                label={"Descripción"}
                placeholder="Descripción del producto"
                onChangeText={handleChange("description")}
                onBlur={handleBlur("description")}
                value={values.description}
              />
              <View style={{ flexDirection: "row", gap: 10 }}>
                <TextInput
                  label={"Precio"}
                  placeholder="100, 200, 300, etc."
                  onChangeText={handleChange("price")}
                  onBlur={handleBlur("price")}
                  keyboardType="numeric"
                  value={values.price}
                  style={{ flex: 1 }}
                />
                <TextInput
                  label={"Cantidad"}
                  placeholder="1, 2, 3, etc."
                  onChangeText={handleChange("stock")}
                  onBlur={handleBlur("stock")}
                  keyboardType="numeric"
                  value={values.stock}
                />
              </View>
            </View>
            <Button
              style={{ borderRadius: 10 }}
              mode="contained"
              icon="plus"
              textColor="#fff"
              onPress={handleSubmit}
            >
              {id ? "Actualizar" : "Crear"}
            </Button>
          </View>
        </View>
      )}
    </Formik>
  );
};

export default CreateProduct;
