import { Dimensions } from "react-native";
import React from "react";
import ProTable from "@/components/ProComponents/ProTable";
import Api from "@/services";
import { TextInput } from "react-native-paper";

const { width } = Dimensions.get("window");

const index = () => {
  return (
    <ProTable
      title={"Usuarios"}
      api={Api.products}
      columns={[
        {
          title: "Nombre",
          field: "name",
        },
        {
          title: "Precio",
          field: "price",
          type: "numeric",
        },
        {
          title: "Stock",
          field: "stock",
          type: "numeric",
        },
        {
          title: "Descripción",
          field: "description",
        },
      ]}
      inputs={(handleChange, handleBlur, handleSubmit, values) => {
        return (
          <>
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
          </>
        );
      }}
      onFinish={(values) => {
        console.log(values);
      }}
    />
  );
};

export default index;
