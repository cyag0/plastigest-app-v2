import { StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import ProTable from "@/components/ProComponents/ProTable";
import Api from "@/services";
import { TextInput, Text } from "react-native-paper";
import FormInput from "@/components/FormComponents/FormInput";
import { Colors } from "@/constants/Colors";
import Select from "@/components/FormComponents/Select";

const index = () => {
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState<App.Entities.Roles.Role[]>([]);
  const [locations, setLocations] = useState<App.Entities.Location[]>([]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        /* const [rolesReq, locationReq] = Promise.all([Api.roles.roles.index()]);
        setRoles(res.data); */
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <ProTable<App.Entities.User>
      loadingInputs={loading}
      api={Api.usuarios}
      resource="users"
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
      inputs={(props) => {
        return (
          <>
            <FormInput
              formProps={props}
              name="name"
              label={"Nombre"}
              placeholder={"Alejandro, Noe, Enrique..."}
            />

            <FormInput
              formProps={props}
              name="last_name"
              label={"Apellidos"}
              placeholder={"Perez, Lopez, Hernandez..."}
            />

            <FormInput
              formProps={props}
              name="email"
              label={"Correo electronico"}
              placeholder={"ejemplo@gmail.com"}
            />

            <FormInput
              formProps={props}
              name="password"
              label={"Contraseña"}
              placeholder={"********"}
              secureTextEntry
            />

            <FormInput
              formProps={props}
              name="phone_number"
              left={<TextInput.Affix text="+52 " />}
              textContentType="telephoneNumber"
              inputMode="numeric"
              placeholder="1234567890"
              label={"Numero de telefono"}
            />

            <FormInput
              formProps={props}
              name="address"
              label={"Direccion"}
              placeholder={"Calle, numero, colonia..."}
            />

            <Select
              placeholder={{
                label: "Selecciona un rol",
                value: null,
              }}
              FormProps={props}
              name="role_id"
              items={roles.map((role) => ({
                label: role.name,
                value: role.id,
              }))}
            />
          </>
        );
      }}
    />
  );
};

export default index;

const styles = StyleSheet.create({});
