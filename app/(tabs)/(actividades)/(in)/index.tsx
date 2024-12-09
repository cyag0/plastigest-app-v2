import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import ProTable from "@/components/ProComponents/ProTable";
import Api from "@/services";
import Select from "@/components/FormComponents/Select";
import FormInput from "@/components/FormComponents/FormInput";
import itemsToSelect from "@/utils/itemsToSelect";
import { FormikProps } from "formik";
import { useAuthContext } from "@/context/AuthContext";
import { RadioButton, TextInput } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";

const index = () => {
  const [products, setProducts] = useState<App.Entities.Products.Product[]>([]);
  const [loading, setLoading] = useState(true);

  const auth = useAuthContext();

  useEffect(() => {
    (async () => {
      try {
        const data = await Api.movements.getProductsWithPackages(
          auth?.selectedLocation?.id || 0
        );

        setProducts(data?.data?.data || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <ProTable<App.Entities.Movement.Entrada>
      resource="in"
      validationScheme={(yup) => {
        return {
          product_id: yup.number().required("El producto es requerido"),
          quantity: yup.number().required("La cantidad es requerida"),
          total: yup.number().required("El total es requerido"),
          action: yup.string().required("La acción es requerida"),
        };
      }}
      indexParams={{
        filters: {
          type: "entrada",
          location_id: auth?.selectedLocation?.id,
        },
      }}
      inputs={(props) => <Form products={products} formProps={props} />}
      title={"Entradas - " + auth?.selectedLocation?.name}
      columns={[]}
      filtersInputs={(props) => (
        <>
          {/* <Select
            placeholder={{
              label: "Selecciona un proveedor",
              value: null,
            }}
            items={itemsToSelect(proveedores)}
            name="supplier_id"
            FormProps={props}
          /> */}
        </>
      )}
      //@ts-ignore
      api={Api.movements}
    />
  );
};

interface FormProps {
  products: App.Entities.Products.Product[];
  formProps: FormikProps<any>;
}

function Form(props: FormProps) {
  const [selectedProduct, setSelectedProduct] =
    useState<App.Entities.Products.Product | null>(null);

  const [selectedPackage, setSelectedPackage] =
    useState<App.Entities.Package | null>(null);
  const [products, setProducts] = useState<App.Entities.Products.Product[]>([]);

  useEffect(() => {
    setProducts(props.products);
  }, [props.products]);

  function handleQuantity(
    _quantity?: string,
    _unit?: App.Entities.Package,
    price?: number
  ) {
    // Validación de la cantidad
    const quantity =
      _quantity && !isNaN(parseFloat(_quantity)) ? parseFloat(_quantity) : 0;

    // Validación del precio
    const unitPrice = price || 0;

    // Validación de la unidad (ejemplo: ajuste por unidad)
    const unitMultiplier = _unit?.quantity || 1; // Asegúrate de que `_unit` tenga esta propiedad

    // Calcular el total
    const total = quantity * unitPrice * unitMultiplier;

    // Actualizar el campo "total" en Formik
    props.formProps.setFieldValue("total", total);
  }

  return (
    <>
      <Select
        placeholder={{
          label: "Selecciona un producto",
          value: undefined,
        }}
        onValueChange={(value) => {
          props.formProps.setFieldTouched("product_id", true);
          props.formProps.setFieldValue("product_id", value);

          props.formProps.setFieldValue("quantity", "");
          props.formProps.setFieldValue("quantity_unit", "");
          props.formProps.setFieldValue("total", "");

          const product =
            products.find((product) => product.id === value) || null;

          setSelectedProduct(product);
        }}
        items={products.map((product) => ({
          label: product.name + " ($" + product.price + ")",
          value: product.id,
        }))}
        name="product_id"
        FormProps={props.formProps}
      />
      <FormInput
        label="Cantidad"
        name="quantity"
        formProps={props.formProps}
        onChangeText={(value) => {
          handleQuantity(
            value,
            selectedPackage || undefined,
            selectedProduct?.price
          );
        }}
        placeholder="Cantidad"
      />

      <Select
        name="quantity_unit"
        FormProps={props.formProps}
        disabled={!selectedProduct}
        items={
          selectedProduct?.packages?.map((item) => ({
            label: item?.name + " (" + item?.quantity + " unidadaes)",
            value: item?.id,
          })) || []
        }
        onValueChange={(value: number) => {
          console.log(value);
          console.log(selectedProduct?.packages);

          const newSelectedPackage =
            selectedProduct?.packages?.find(
              (_package) => _package?.id === value
            ) || null;

          console.log(newSelectedPackage);

          props.formProps.setFieldTouched("quantity_unit", true);
          props.formProps.setFieldValue("quantity_unit", value);
          setSelectedPackage(newSelectedPackage);

          if (!newSelectedPackage) return;

          handleQuantity(
            props.formProps.values.quantity,
            newSelectedPackage,
            selectedProduct?.price
          );
        }}
        placeholder={{
          label: "Unidad",
          value: "unidad",
        }}
      />
      <FormInput
        label="Total"
        name="total"
        readOnly
        formProps={props.formProps}
        onChangeText={(value) => {}}
        placeholder="Total"
        left={<TextInput.Affix text="$" />}
      />

      <Select
        placeholder={{
          label: "Selecciona el tipo de acción",
          value: "",
        }}
        items={[
          { label: "Compra", value: "compra" },
          { label: "Recarga", value: "recarga" },
        ]}
        name="action"
        FormProps={props.formProps}
      />
    </>
  );
}

export default index;
