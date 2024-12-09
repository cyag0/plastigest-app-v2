import { StyleSheet, Text, View } from "react-native";
import React, { useMemo } from "react";
import RNPickerSelect, { PickerSelectProps } from "react-native-picker-select";
import { Colors } from "@/constants/Colors";
import { FormikProps } from "formik";

interface SelectProps extends PickerSelectProps {
  FormProps: FormikProps<any>;
  name: string;
  onValueChange?: (value: any) => void;
}

const Select: React.FC<SelectProps> = ({
  FormProps,
  name,
  ...props
}: SelectProps) => {
  // Memoriza las opciones para evitar renderizados innecesarios
  const options = useMemo(() => props, [props]);

  // Estilos de error si hay validación
  const errorStyles = useMemo(() => {
    return FormProps.errors[name] && FormProps.touched[name]
      ? {
          backgroundColor: Colors.red[100],
          borderBottomWidth: 2,
          borderBottomColor: Colors.red[500],
        }
      : {};
  }, [FormProps.errors[name], FormProps.touched[name]]);

  return (
    <>
      <RNPickerSelect
        style={{
          inputAndroid: {
            ...errorStyles,
            backgroundColor: Colors.primary[100],
          },
          inputIOS: {
            backgroundColor: Colors.primary[100],
          },
          inputWeb: {
            backgroundColor: Colors.primary[100],
            paddingVertical: 16,
            paddingHorizontal: 10,
            borderWidth: 0,
            fontSize: 16,
            ...errorStyles,
          },
          placeholder: {
            color: Colors.black[900],
          },
        }}
        onValueChange={(value) => {
          FormProps.setFieldTouched(name, true);
          FormProps.setFieldValue(name, value);
        }}
        value={FormProps.values[name] ?? undefined}
        {...options}
      />
      {FormProps.errors[name] && FormProps.touched[name] ? (
        <Text style={{ color: Colors.red[500] }}>
          {(FormProps.errors[name] as string) || "Campo requerido"}
        </Text>
      ) : null}
    </>
  );
};

export default Select;

const styles = StyleSheet.create({});
