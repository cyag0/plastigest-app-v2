import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import ProTable from "@/components/ProComponents/ProTable";
import Api from "@/services";
import FormInput from "@/components/FormComponents/FormInput";
import Select from "@/components/FormComponents/Select";
import itemsToSelect from "@/utils/itemsToSelect";

const index = () => {
  const [products, setProducts] = useState<App.Entities.Products.Product[]>([]);
  const [loading, setLoading] = useState(true);

  const test = "text";
  async function getProducts() {
    try {
      setLoading(true);
      const res = await Api.products.index();
      setProducts(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    getProducts();
  }, []);

  return (
    <ProTable
      loadingInputs={loading}
      title="Paquetes"
      resource="packages"
      validationScheme={(yup) => {
        return {
          name: yup.string().required("Nombre requerido"),
          quantity: yup.number().required("Cantidad requerida"),
          code: yup.string().required("Codigo requerido"),
          product_id: yup.number().required("Id del product"),
        };
      }}
      api={Api.packages}
      columns={[
        { title: "Nombre", field: "name" },
        { title: "Nombre del producto", field: "product" },
        { title: "Codigo", field: "code" },
        { title: "Cantidad", field: "quantity" },
      ]}
      inputs={(props) => {
        return (
          <>
            <FormInput formProps={props} name="name" label="Nombre" />
            <FormInput formProps={props} name="quantity" label="Cantidad" />
            <FormInput formProps={props} name="code" label="Codigo" />
            <Select
              FormProps={props}
              name="product_id"
              placeholder={{ label: "Prodcuto" }}
              items={itemsToSelect(products)}
            />
          </>
        );
      }}
    />
  );
};

export default index;

const styles = StyleSheet.create({});
