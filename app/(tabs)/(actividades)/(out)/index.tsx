import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import ProTable from "@/components/ProComponents/ProTable";
import Api from "@/services";
import Select from "@/components/FormComponents/Select";
import FormInput from "@/components/FormComponents/FormInput";
import itemsToSelect from "@/utils/itemsToSelect";
import { FormikProps } from "formik";
import { useAuthContext } from "@/context/AuthContext";
import {
  Icon,
  IconButton,
  RadioButton,
  Switch,
  TextInput,
} from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

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
          type: "salida",
          location_id: auth?.selectedLocation?.id,
        },
      }}
      inputs={(props) => <Form products={products} formProps={props} />}
      title={"Entradas - " + auth?.selectedLocation?.name}
      columns={[
        {
          title: "Producto",
          field: "product",
        },
        {
          title: "Cantidad",
          field: "quantity_formatted",
        },
        {
          title: "Usuario",
          field: "user",
        },
        {
          title: "Estado",
          field: "status",
          render: (row) => (
            <View
              style={{
                backgroundColor:
                  row === "completado" ? Colors.green[200] : Colors.yellow[100],
                padding: 5,
                paddingHorizontal: 10,
                borderRadius: 5,
                minWidth: 100,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon
                size={16}
                source={row === "completado" ? "check" : "close"}
                color={
                  row === "completado" ? Colors.green[600] : Colors.yellow[700]
                }
              />
              <Text
                style={{
                  color:
                    row === "completado"
                      ? Colors.green[700]
                      : Colors.yellow[700],
                  textAlign: "center",
                  fontWeight: 600,
                }}
              >
                {row === "completado" ? "Completado" : "Pendiente"}
              </Text>
            </View>
          ),
        },
        {
          title: "Total",
          field: "total",
          render: (row) => "$" + row,
        },
        {
          title: "Acción",
          field: "action",
        },
        {
          title: "Fecha",
          field: "date",
        },
      ]}
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
      renderActions={(actions, item, index) => {
        return item.status === "pendiente" ? (
          <>
            {actions.edit && actions.edit}

            {actions.delete && actions.delete}
          </>
        ) : (
          <></>
        );
      }}
      //@ts-ignore
      api={Api.movements}
      initialValues={{
        type: "salida",
        location_id: auth?.selectedLocation?.id,
        status: "pendiente",
      }}
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

  const [canChangeValues, setCanChangeValues] = useState(false);

  useEffect(() => {
    const values = (Object.values(props.formProps.values) as any[]) || [];
    if (!props.formProps.values.status) {
      props.formProps.setFieldValue("status", "pendiente");
    }
    setCanChangeValues(true);
  }, []);

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

    if (
      selectedProduct?.id &&
      quantity * unitMultiplier > selectedProduct?.pivot?.stock
    ) {
      props.formProps.setFieldError(
        "quantity",
        "La cantidad supera el stock del producto"
      );

      alert("La cantidad supera el stock del producto");
    }

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
          value: "",
        }}
        onValueChange={(value) => {
          const product =
            products.find((product) => product.id === value) || null;

          setSelectedProduct(product);

          if (!canChangeValues) return;

          props.formProps.setFieldTouched("product_id", true);
          props.formProps.setFieldValue("product_id", value);
        }}
        items={products.map((product) => ({
          //@ts-ignore
          label:
            product.name +
            " ($" +
            product.price +
            " - " +
            product.pivot.stock +
            ")",
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
        name="package_id"
        FormProps={props.formProps}
        disabled={!selectedProduct}
        items={
          selectedProduct?.packages?.map((item) => ({
            label: item?.name + " (" + item?.quantity + " unidadaes)",
            value: item?.id,
          })) || []
        }
        onValueChange={(value: number) => {
          const newSelectedPackage =
            selectedProduct?.packages?.find(
              (_package) => _package?.id === value
            ) || null;

          props.formProps.setFieldTouched("package_id", true);
          props.formProps.setFieldValue("package_id", value);
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
          { label: "Venta", value: "venta" },
          { label: "Traslado", value: "traslado" },
          { label: "Uso", value: "uso" },
        ]}
        name="action"
        FormProps={props.formProps}
      />

      <View
        style={{
          alignItems: "flex-end",
          marginVertical: 10,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            gap: 10,
            alignItems: "center",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderRadius: 5,
              padding: 5,
              backgroundColor:
                props.formProps.values.status === "completado"
                  ? Colors.green[200]
                  : Colors.yellow[100],
            }}
          >
            <Icon
              size={16}
              source={
                props.formProps.values.status === "completado"
                  ? "check"
                  : "close"
              }
              color={
                props.formProps.values.status === "completado"
                  ? Colors.green[600]
                  : Colors.yellow[700]
              }
            />
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                color:
                  props.formProps.values.status === "completado"
                    ? Colors.green[700]
                    : Colors.yellow[700],
              }}
            >
              {props.formProps.values.status === "completado"
                ? "Completado"
                : "Pendiente"}
            </Text>
          </View>
          <Switch
            value={
              props.formProps.values.status === "completado" ? true : false
            }
            onValueChange={(value) => {
              props.formProps.setFieldValue(
                "status",
                value ? "completado" : "pendiente"
              );
            }}
          />
        </View>
      </View>
    </>
  );
}

export default index;
