import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import ProTable from "@/components/ProComponents/ProTable";
import Api from "@/services";
import Select from "@/components/FormComponents/Select";
import FormInput from "@/components/FormComponents/FormInput";
import itemsToSelect from "@/utils/itemsToSelect";
import { FormikProps } from "formik";
import Spin from "@/components/Spin";
import { AutocompleteDropdown } from "react-native-autocomplete-dropdown";
import { useAuthContext } from "@/context/AuthContext";

const index = () => {
  const [locations, setLocations] = useState<App.Entities.Location[]>([]);
  const [products, setProducts] = useState<App.Entities.Products.Product[]>([]);
  const [loading, setLoading] = useState(true);

  const auth = useAuthContext();

  const test = "text";
  useEffect(() => {
    (async () => {
      try {
        const [productReq, locationReq] = await Promise.all([
          Api.products.index(),
          Api.locations.index(),
        ]);

        setProducts(productReq.data);
        setLocations(locationReq.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function RenderInputs(props: FormikProps<any>) {
    return (
      <>
        <Select
          placeholder={{
            label: "Selecciona un producto",
            value: null,
          }}
          items={itemsToSelect(products)}
          name="product_id"
          FormProps={props}
        />

        <Select
          placeholder={{
            label: "Selecciona una ubicación",
            value: null,
          }}
          items={itemsToSelect(locations)}
          name="location_id"
          FormProps={props}
        />

        <FormInput
          formProps={props}
          name="stock"
          label={"Stock"}
          keyboardType="numeric"
          placeholder={"Stock del producto"}
        />
      </>
    );
  }

  return (
    <Spin loading={loading}>
      <ProTable<App.Entities.ProductLocation>
        loadingInputs={loading}
        resource="inventory"
        validationScheme={(yup) => {
          return {
            product_id: yup.string().required("El producto es requerido"),
            location_id: yup.string().required("La ubicación es requerida"),
            stock: yup.number().required("El stock es requerido"),
          };
        }}
        /* indexParams={{
          searchBy: ["name", "description", "price"],
        }} */
        inputs={
          loading
            ? () => (
                <>
                  <Text>Lo primero que ves</Text>
                </>
              )
            : RenderInputs
        }
        title={"Productos - " + auth.selectedLocation?.name}
        columns={[
          {
            title: "Producto",
            field: "product",
          },
          {
            title: "Ubicación",
            field: "location",
          },
          {
            title: "Stock",
            field: "stock",
            sorter: {
              stock: "asc",
            },
          },
        ]}
        indexParams={{
          filters: {
            location_id: auth.selectedLocation,
          },
        }}
        filtersInputs={(props) => (
          <>
            <Select
              placeholder={{
                label: "Selecciona una locación",
                value: null,
              }}
              items={itemsToSelect(locations)}
              name="location_id"
              FormProps={props}
            />
          </>
        )}
        api={Api.ProductLocation}
      />
    </Spin>
  );
};

export default index;

const styles = StyleSheet.create({});
