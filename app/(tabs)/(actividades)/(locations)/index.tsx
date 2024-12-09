import { View, Text } from "react-native";
import React from "react";
import ProTable from "@/components/ProComponents/ProTable";
import FormInput from "@/components/FormComponents/FormInput";
import Api from "@/services";

export default function index() {
  return (
    <ProTable<App.Entities.Location>
      api={Api.locations}
      title="Sucursales"
      resource="locations"
      columns={[
        {
          title: "Name",
          field: "name",
        },
        {
          title: "Address",
          field: "address",
        },
        {
          title: "In charge",
          field: "in_charge",
        },
      ]}
      inputs={(props) => {
        return (
          <>
            <FormInput
              label={"Nombre"}
              placeholder="Lija, Bodega..."
              formProps={props}
              name="name"
            />
            <FormInput formProps={props} label={"Direccion"} name="address" />
            <FormInput formProps={props} label={"Encargado"} name="in_charge" />
          </>
        );
      }}
    />
  );
}
