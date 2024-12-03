import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import ProTable from "@/components/ProComponents/ProTable";
import Api from "@/services";
import Select from "@/components/FormComponents/Select";
import FormInput from "@/components/FormComponents/FormInput";
import itemsToSelect from "@/utils/itemsToSelect";
import { FormikProps } from "formik";

const index = () => {
  const [proveedores, setProveedores] = useState<App.Entities.Supplier[]>([]);
  const [loading, setLoading] = useState(true);

  const test = "text";
  useEffect(() => {
    (async () => {
      try {
        const data = await Api.suppliers.index();
        setProveedores(data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    console.log("proveedores", proveedores);
  }, [proveedores]);

  async function onLoad() {
    try {
      const data = await Api.suppliers.index();
      setProveedores(data.data);
    } catch (error) {
      console.log(error);
    }
  }

  function RenderInputs(props: FormikProps<any>) {
    return (
      <>
        <FormInput
          formProps={props}
          name="name"
          label={"Nombre"}
          placeholder={"Nombre del producto"}
        />
        <FormInput
          name="price"
          formProps={props}
          label={"Precio"}
          placeholder={"Precio del producto"}
        />
        <FormInput
          name="description"
          formProps={props}
          label={"Descripción"}
          placeholder={"Descripción del producto"}
        />
         <FormInput
          name="code"
          formProps={props}
          label={"Ingresa el codigo"}
          placeholder={"Codigo del producto"}
        />
        <Select
          placeholder={{
            label: "Selecciona un proveedor",
            value: null,
          }}
          items={itemsToSelect(proveedores)}
          name="supplier_id"
          FormProps={props}
        />
      </>
    );
  }

  return (
    <ProTable<App.Entities.Products.Product>
      loadingInputs={loading}
      resource="products"
      validationScheme={(yup) => {
        return {
          name: yup.string().required("El nombre es requerido"),
          supplier_id: yup.number().required("El proveedor es requerido"),
          price: yup.number().required("El precio es requerido"),
          description: yup.string().required("La descripción es requerida"),
          code: yup.string().required("El codigo es requerido"),
        };
      }}
      indexParams={{
        searchBy: ["name", "description", "price"],
      }}
      inputs={
        loading
          ? () => (
              <>
                <Text>Lo primero que ves</Text>
              </>
            )
          : RenderInputs
      }
      title="Productos"
      columns={[
        {
          title: "Nombre",
          field: "name",
          sorter: {
            name: "asc",
          },
        },
        {
          title: "Precio",
          field: "price",
        },
        {
          title: "Proveedor",
          field: "supplier",
        },
        {
          title: "Descripción",
          field: "description",
          sorter: {
            description: "asc",
          },
        },
      ]}
      filtersInputs={(props) => (
        <>
          <Select
            placeholder={{
              label: "Selecciona un proveedor",
              value: null,
            }}
            items={itemsToSelect(proveedores)}
            name="supplier_id"
            FormProps={props}
          />
        </>
      )}
      api={Api.products}
    />
  );
};

export default index;

const styles = StyleSheet.create({});

/* import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Colors } from "@/constants/Colors";
import { useFocusEffect, useRouter } from "expo-router";
import Api from "@/services";
import { ActivityIndicator } from "react-native-paper";

//crea un array de 10 productos
export const items: App.Entities.Products.Product[] = [
  {
    id: 1,
    name: "Producto 1",
    price: 100,
    stock: 10,
    description: "Descripcion del producto 1",
  },
  {
    id: 2,
    name: "Producto 2",
    price: 200,
    stock: 20,
    description: "Descripcion del producto 2",
  },
  {
    id: 3,
    name: "Producto 3",
    price: 300,
    stock: 30,
    description: "Descripcion del producto 3",
  },
  {
    id: 4,
    name: "Producto 4",
    price: 400,
    stock: 40,
    description: "Descripcion del producto 4",
  },
  {
    id: 5,
    name: "Producto 5",
    price: 500,
    stock: 50,
    description: "Descripcion del producto 5",
  },
  {
    id: 6,
    name: "Producto 6",
    price: 600,
    stock: 60,
    description: "Descripcion del producto 6",
  },
  {
    id: 7,
    name: "Producto 7",
    price: 700,
    stock: 70,
    description: "Descripcion del producto 7",
  },
  {
    id: 8,
    name: "Producto 8",
    price: 800,
    stock: 80,
    description: "Descripcion del producto 8",
  },
  {
    id: 9,
    name: "Producto 9",
    price: 900,
    stock: 90,
    description: "Descripcion del producto 9",
  },
  {
    id: 10,
    name: "Producto 10",
    price: 1000,
    stock: 100,
    description: "Descripcion del producto 10",
  },
];

function index() {
  const [products, setProducts] =
    React.useState<App.Entities.Products.Product[]>(items);
  const navigator = useRouter();
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    getProducts();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      getProducts();
    }, [])
  );
  async function getProducts() {
    setLoading(true);
    try {
      const products = await Api.products.index();
      setProducts(products);
    } catch (error) {
      console.error("Error al obtener los productos:", error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <SafeAreaView style={styles.container}>
      <Header />

      <View style={{ backgroundColor: Colors.primary[900], flex: 1 }}>
        <View
          style={{
            borderTopRightRadius: 30,
            overflow: "hidden",
            backgroundColor: "#e9e9e9",
            flex: 1,
            paddingVertical: 8,
          }}
        >
          {loading ? (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ActivityIndicator
                animating={true}
                color={Colors.primary["600"]}
                size="large"
              />
            </View>
          ) : (
            <ScrollView>
              <View style={{ gap: 8, paddingHorizontal: 8 }}>
                {products.map((product) => (
                  <Card key={product.id} product={product} />
                ))}
              </View>
            </ScrollView>
          )}
          <View style={{ position: "absolute", bottom: 16, right: 16 }}>
            <TouchableOpacity
              onPress={() => {
                navigator.push({ pathname: "create" });
              }}
              style={{
                backgroundColor: Colors.primary[200],
                borderRadius: 50,
                padding: 14,
                alignItems: "center",
              }}
            >
              <FontAwesome5
                name="plus"
                size={20}
                color={Colors.primary["600"]}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

function Header() {
  const navigator = useRouter();

  return (
    <View style={{ backgroundColor: "#e9e9e9" }}>
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              if (navigator.canGoBack()) {
                navigator.back();
              }
            }}
          >
            <AntDesign size={24} color={"white"} name="arrowleft" />
          </TouchableOpacity>
          <Text
            style={[styles.textWhite, { fontSize: 20, fontWeight: "bold" }]}
          >
            Productos
          </Text>
          <TouchableOpacity>
            <AntDesign size={20} color={"white"} name="search1" />
          </TouchableOpacity>
        </View>
        <View style={styles.filtersContainer}>
          <TouchableOpacity style={styles.button}>
            <FontAwesome5 name="filter" size={16} color="white" />
            <Text style={styles.textWhite}>Filtrar por</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <FontAwesome5 name="sort-alpha-up" size={16} color="white" />
            <Text style={styles.textWhite}>Ordenar por</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

function Card({ product }: { product: App.Entities.Products.Product }) {
  const navigator = useRouter();
  function handleNavigation() {
    navigator.push(("show/" + (product?.id?.toString() || "")) as any);
  }

  return (
    <TouchableOpacity onPress={handleNavigation} style={styles.card}>
      <View
        style={{
          flex: 0.25,
          minHeight: 60,
          maxHeight: 80,
          height: "100%",
          borderRadius: 10,
          backgroundColor: "#eee",
        }}
      >
        <Image
          style={{ width: "100%", height: "100%", resizeMode: "cover" }}
          source={require("./../../../../assets/images/placeholder.png")}
        />
      </View>
      <View style={{ flex: 0.75, justifyContent: "center" }}>
        <Text
          style={{
            fontSize: 14,
            color: Colors.black[600],
          }}
        >
          {product.name}
        </Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text
            style={{
              fontSize: 16,
              color: Colors.black[800],
              fontWeight: "bold",
            }}
          >
            ${product.price}.00 MXN
          </Text>
          <Text style={{ color: Colors.black[400] }}>
            {product.stock} Productos
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerContainer: {
    backgroundColor: Colors.primary[900],
    padding: 16,
    borderBottomLeftRadius: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  filtersContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  button: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
    borderColor: "#fff",
    borderWidth: 0.3,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  textWhite: {
    color: "#fff",
    fontSize: 16,
  },
  card: {
    borderRadius: 18,
    backgroundColor: "#fff",
    padding: 10,
    gap: 10,
    flexDirection: "row",
  },
});

export default index;
 */
