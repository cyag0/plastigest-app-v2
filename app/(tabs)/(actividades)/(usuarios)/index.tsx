import { StyleSheet, Text, View } from "react-native";
import React from "react";
import ProTable from "@/components/ProComponents/ProTable";
import Api from "@/services";
import { TextInput } from "react-native-paper";

const index = () => {
  return (
    <ProTable<App.Entities.User>
      api={Api.usuarios}
      columns={[
        {
          title: "Nombre",
          field: "nombre",
        },
        {
          title: "Email",
          field: "email",
        },
        {
          title: "Telefono",
          field: "telefono",
        },
      ]}
      title="Usuarios"
      inputs={(handleChange, handleBlur, handlerSubmit, values) => {
        return (
          <>
            <TextInput
              label={"Nombre"}
              onChangeText={handleChange("nombre")}
              onBlur={handleBlur("nombre")}
              value={values.nombre}
              placeholder="Jose, carlos, ..."
            />
            <TextInput
              label={"Email"}
              placeholder="ejemplo@gmail.com"
              onChangeText={handleChange("test")}
              onBlur={handleBlur("test")}
              value={values.contacto}
            />
          </>
        );
      }}
    />
  );
};

export default index;

const styles = StyleSheet.create({});
