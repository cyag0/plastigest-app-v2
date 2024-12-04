import { Image, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import ProTable from "@/components/ProComponents/ProTable";
import Api from "@/services";
import { TextInput, Text, Switch, Checkbox } from "react-native-paper";
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
        const [rolesReq, locationReq] = await Promise.all([
          Api.roles.roles.index(),
          Api.locations.index(),
        ]);

        setRoles(rolesReq.data);
        setLocations(locationReq.data);
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
      validationScheme={(yup) => {
        return {
          name: yup.string().required("El nombre es requerido"),
          last_name: yup.string().required("El Apellido es requerido"),
          password: yup.string().required("La contraseña es requerida"),
          email: yup.string().required("El correo es requerido"),
          phone_number: yup.string().required("El nombre es requerido"),
          role_id: yup.number().required("El role es requerido"),
          location_id: yup.string().required("La sucursal es requerida"),
          is_active: yup.boolean().required("El estado es requerido"),
        };
      }}
      columns={[
        {
          title: "Nombre",
          field: "nombre",
        },

        {
          title: "Apellido",
          field: "last_name",
        },
        {
          title: "Contraseña",
          field: "password",
        },

        {
          title: "Email",
          field: "email",
        },
        {
          title: "Telefono",
          field: "phone_number",
        },
        {
          title: "ROLE_ID",
          field: "role_id",
        },

        {
          title: "Sucusal",
          field: "location_id",
        },
        {
          title: "Estado",
          field: "is_active",
        },
      ]}
      title="Usuarios"
      inputs={(props) => {
        return (
          <>
            <View>
              <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <Image
                  style={{
                    width: 150,
                    height: 150,
                    borderRadius: 150,
                    backgroundColor: Colors.black[100],
                  }}
                  source={{
                    uri: "https://www.kindpng.com/picc/m/78-785827_user-profile-avatar-login-account-profile-user-icon.png",
                  }}
                />
              </View>
            </View>
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
            <View
              style={{
                flexDirection: "row",
                gap: 8,
                width: "100%",
                minWidth: 50,
              }}
            >
              <View style={{ flex: 1 }}>
                <FormInput
                  formProps={props}
                  name="password"
                  label={"Contraseña"}
                  placeholder={"********"}
                  secureTextEntry
                />
              </View>
              <View style={{ flex: 1 }}>
                <FormInput
                  formProps={props}
                  name="phone_number"
                  left={<TextInput.Affix text="+52 " />}
                  textContentType="telephoneNumber"
                  inputMode="numeric"
                  placeholder="1234567890"
                  label={"Numero de telefono"}
                />
              </View>
            </View>
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
            <Select
              placeholder={{
                label: "Selecciona una ubicacion",
                value: null,
              }}
              FormProps={props}
              name="location_id"
              items={locations.map((location) => ({
                label: location.name,
                value: location.id,
              }))}
            />
            {locations.map((location) => (
              <Checkbox.Item
                label={location.name}
                value={location.id}
                onPress={() => {
                  props.setFieldValue("locations", {
                    ...props.values.locations,
                    [location.id]: !props.values.locations?.[location.id],
                  });

                  console.log(props.values.locations);
                }}
                status={
                  props.values.locations?.[location.id]
                    ? "checked"
                    : "unchecked"
                }
              />
            ))}
            <Switch
              value={props.values.status}
              onValueChange={(value) => {
                console.log(value);
              }}
            />
          </>
        );
      }}
    />
  );
};

export default index;

const styles = StyleSheet.create({});
