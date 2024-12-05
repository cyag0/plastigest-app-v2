import { Image, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import ProTable from "@/components/ProComponents/ProTable";
import Api from "@/services";
import {
  TextInput,
  Text,
  Switch,
  Checkbox,
  Divider,
  Icon,
} from "react-native-paper";
import FormInput from "@/components/FormComponents/FormInput";
import { Colors } from "@/constants/Colors";
import Select from "@/components/FormComponents/Select";
import { Form } from "formik";
import Spin from "@/components/Spin";

const index = () => {
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState<App.Entities.Roles.Role[]>([]);
  const [locations, setLocations] = useState<App.Entities.Location[]>([]);
  const [passwordVisible, setPasswordVisible] = useState(false);

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
    <Spin loading={loading}>
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
            phone_number: yup.number().required("El nombre es requerido"),
            role_id: yup.number().required("El role es requerido"),
            is_active: yup.boolean().required("El estado es requerido"),
          };
        }}
        columns={[
          {
            title: "Nombre",
            field: "name",
          },
          {
            title: "Apellido",
            field: "last_name",
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
            title: "Rol",
            field: "role",
          },

          {
            title: "Sucusales",
            field: "locations",
            render: (row, item) => {
              if (!row || row.length == 0) return "Sin sucursal";

              return item.locations.map((location) => location.name).join(", ");
            },
          },
          {
            title: "Estado",
            field: "status",
            align: "center",
            render: (row) => (
              <View
                style={{
                  backgroundColor:
                    row === "Activo" ? Colors.green[200] : Colors.red[200],
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
                  source={row === "Activo" ? "check" : "close"}
                  color={row === "Activo" ? Colors.green[600] : Colors.red[500]}
                />
                <Text
                  style={{
                    color:
                      row === "Activo" ? Colors.green[700] : Colors.red[500],
                    textAlign: "center",
                    fontWeight: 600,
                  }}
                >
                  {row}
                </Text>
              </View>
            ),
          },
        ]}
        title="Usuarios"
        inputs={(props) => {
          console.log(props.values);
          return (
            <>
              {/*   <View>
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
            </View> */}
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  marginBottom: 10,
                }}
              >
                Informacion Personal
              </Text>
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
                    right={
                      <TextInput.Icon
                        icon={passwordVisible ? "eye-off" : "eye"}
                        color={Colors.primary[500]}
                        onPress={() => setPasswordVisible(!passwordVisible)}
                      />
                    }
                    label={"Contraseña"}
                    placeholder={"********"}
                    secureTextEntry={!passwordVisible}
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

              <FormInput
                formProps={props}
                name="address"
                label={"Dirección"}
                placeholder={"Calle, Colonia, Ciudad, Estado"}
              />

              <View
                style={{
                  borderBottomColor: "#999",
                  borderBottomWidth: 0.5,
                  marginVertical: 10,
                }}
              ></View>
              <Text
                style={{
                  fontSize: 16,
                  marginBottom: 10,
                  fontWeight: "bold",
                }}
              >
                Informacion para la empresa
              </Text>
              <Select
                placeholder={{
                  label: "Rol del empleado",
                  value: null,
                }}
                FormProps={props}
                name="role_id"
                items={roles.map((role) => ({
                  label: role.name,
                  value: role.id,
                }))}
              />

              <Text>Sucursales a las que pertenece el empleado</Text>
              {locations.map((location) => (
                <Checkbox.Item
                  label={location.name}
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
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginVertical: 10,
                }}
              >
                <Text>Estado del usuario</Text>
                <Switch
                  value={props.values.is_active}
                  onValueChange={(value) => {
                    props.setFieldValue("is_active", value);
                  }}
                />
              </View>
            </>
          );
        }}
      />
    </Spin>
  );
};

export default index;

const styles = StyleSheet.create({});
