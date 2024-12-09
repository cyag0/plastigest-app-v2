import { View } from "react-native";
import React, { useEffect, useState } from "react";
import ProTable from "@/components/ProComponents/ProTable";
import FormInput from "@/components/FormComponents/FormInput";
import Api from "@/services";
import { FormikProps } from "formik";
import { Checkbox, DataTable, Text } from "react-native-paper";
import { Colors } from "@/constants/Colors";

type Resource = {
  id: number;
  name: string;
  resource: string;
};

export default function index() {
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState<App.Entities.Roles.Resource[]>(
    []
  );

  useEffect(() => {
    getPermissions();
  }, []);

  async function getPermissions() {
    try {
      setLoading(true);
      const res = await Api.roles.resources.index();
      setPermissions(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ProTable<App.Entities.Roles.Role>
      loadingInputs={loading}
      resource="roles"
      api={Api.roles.roles}
      columns={[
        {
          title: "Name",
          field: "name",
        },
        {
          title: "Descripcion",
          field: "description",
        },
      ]}
      title="Roles y permisos"
      validationScheme={(yup) => {
        return {
          name: yup.string().required("El nombre es requerido"),
          description: yup.string().required("La descripción es requerida"),
        };
      }}
      inputs={(props) => {
        return <Form permissions={permissions} formProps={props} />;
      }}
    />
  );
}

interface PermissionsTableProps {
  permissions: App.Entities.Roles.Resource[];
  props: FormikProps<any>;
}

function Form(props: {
  permissions: App.Entities.Roles.Resource[];
  formProps: FormikProps<any>;
}) {
  const [permissions, setPermissions] = useState<App.Entities.Roles.Resource[]>(
    props.permissions || []
  );

  useEffect(() => {
    console.log(props.permissions);
    setPermissions(props.permissions);
  }, [props.permissions]);

  return (
    <>
      <FormInput
        label={"Nombre del rol"}
        placeholder="Operador de almacen, Gerente..."
        name="name"
        formProps={props.formProps}
      />
      <FormInput
        label={"Descripción del rol"}
        placeholder="Se encarga de..."
        name="description"
        formProps={props.formProps}
      />
      <PermissionsTable permissions={permissions} props={props.formProps} />
    </>
  );
}

function PermissionsTable({ permissions = [], props }: PermissionsTableProps) {
  return (
    <DataTable>
      <DataTable.Header style={{ padding: 0 }}>
        <DataTable.Title style={{ flex: 0.55 }}>
          <Text variant="titleMedium">Permisos</Text>
        </DataTable.Title>
        <DataTable.Title
          style={{
            flexBasis: 60,
            flex: 0.15,
            justifyContent: "center",
          }}
        >
          <Text variant="titleMedium">Crear</Text>
        </DataTable.Title>
        <DataTable.Title
          style={{ flexBasis: 60, flex: 0.15, justifyContent: "center" }}
        >
          <Text variant="titleMedium">Editar</Text>
        </DataTable.Title>
        <DataTable.Title
          style={{ flexBasis: 60, flex: 0.15, justifyContent: "center" }}
        >
          <Text variant="titleMedium">Eliminar</Text>
        </DataTable.Title>
      </DataTable.Header>

      {permissions.map((permission) => {
        return (
          <DataTable.Row
            key={permission.id}
            style={{ paddingHorizontal: 0, paddingVertical: 4 }}
          >
            <DataTable.Cell style={{ flex: 0.55, flexDirection: "row" }}>
              <View style={{ flexDirection: "column", flex: 1 }}>
                <Text variant="titleMedium">{permission.name}</Text>
                <Text
                  style={{ color: Colors.black[300] }}
                  variant="labelMedium"
                >
                  {permission.description}
                </Text>
              </View>
            </DataTable.Cell>
            <DataTable.Cell
              style={{
                flex: 0.15,
                justifyContent: "center",
              }}
            >
              <Checkbox
                onPress={() => {
                  props.setFieldValue(
                    `permissions.${String(permission.id)}_${
                      permission.resource
                    }.create`,
                    !props?.values?.permissions?.[
                      String(permission.id) + "_" + permission.resource
                    ]?.create || false
                  );
                }}
                status={
                  props?.values?.permissions?.[
                    String(permission.id) + "_" + permission.resource
                  ]?.create || false
                    ? "checked"
                    : "unchecked"
                }
              />
            </DataTable.Cell>
            <DataTable.Cell
              style={{
                flex: 0.15,
                justifyContent: "center",
              }}
            >
              <Checkbox
                onPress={() => {
                  const value =
                    !props?.values?.permissions?.[
                      String(permission.id) + "_" + permission.resource
                    ]?.edit || false;
                  props.setFieldValue(
                    `permissions.${String(permission.id)}_${
                      permission.resource
                    }.edit`,
                    value
                  );
                }}
                status={
                  props?.values?.permissions?.[
                    String(permission.id) + "_" + permission.resource
                  ]?.edit || false
                    ? "checked"
                    : "unchecked"
                }
              />
            </DataTable.Cell>

            <DataTable.Cell
              style={{
                flex: 0.15,
                justifyContent: "center",
              }}
            >
              <Checkbox
                onPress={() => {
                  const value =
                    !props?.values?.permissions?.[
                      String(permission.id) + "_" + permission.resource
                    ]?.delete || false;
                  props.setFieldValue(
                    `permissions.${String(permission.id)}_${
                      permission.resource
                    }.delete`,
                    value
                  );
                }}
                status={
                  props?.values?.permissions?.[
                    String(permission.id) + "_" + permission.resource
                  ]?.delete || false
                    ? "checked"
                    : "unchecked"
                }
              />
            </DataTable.Cell>
          </DataTable.Row>
        );
      })}
    </DataTable>
  );
}
