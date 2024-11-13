import { View, Text, Dimensions } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import ProTable from "@/components/ProComponents/ProTable";
import Api from "@/services";

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
    />
  );
};

export default index;
