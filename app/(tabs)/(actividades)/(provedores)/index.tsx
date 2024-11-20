import { Dimensions } from "react-native";
import React from "react";
import ProTable from "@/components/ProComponents/ProTable";
import Api from "@/services";
import { TextInput } from "react-native-paper";

const { width } = Dimensions.get("window");

const index = () => {
  async function onFinish(values: any) {
    try {
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <ProTable<{
      name: string;
      description: string;
    }>
      title={"Suppliers"}
      api={Api.suppliers}
      columns={[
        {
          title: "Nombre",
          field: "name",
        },
        {
          title: "Contacto",
          field: "contacto",
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
              label={"Contacto"}
              placeholder="Numero de telefono, correo, etc.."
              onChangeText={handleChange("contacto")}
              onBlur={handleBlur("contacto")}
              value={values.contacto}
            />
          </>
        );
      }}
    />
  );
};

export default index;
