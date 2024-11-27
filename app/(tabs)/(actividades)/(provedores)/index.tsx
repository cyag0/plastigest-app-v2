import { Dimensions } from "react-native";
import React from "react";
import ProTable from "@/components/ProComponents/ProTable";
import Api from "@/services";
import { TextInput } from "react-native-paper";
import FormInput from "@/components/FormComponents/FormInput";

const { width } = Dimensions.get("window");

const index = () => {
  async function onFinish(values: any) {
    try {
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <ProTable<App.Entities.Supplier>
      title={"Proveedores"}
      resource="suppliers"
      api={Api.suppliers}
      columns={[
        {
          title: "Nombre",
          field: "name",
        },
        {
          title: "Ubicacion",
          field: "address",
        },
        {
          title: "Telefono",
          field: "phone",
        },
      ]}
      inputs={(props) => {
        return (
          <>
            <FormInput
              formProps={props}
              name="name"
              label="Nombre"
              placeholder="Botella, Tapadera, etc."
            />
            <FormInput
              formProps={props}
              name="address"
              label="Direccion"
              placeholder="Numero de telefono, correo, etc.."
            />

            <FormInput
              formProps={props}
              name="phone"
              label="Numero"
              placeholder="Numero de telefono, correo, etc.."
            />
          </>
        );
      }}
    />
  );
};

export default index;
