import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { TextInput, TextInputProps } from "react-native-paper";
import { FormikProps } from "formik";
import { Colors } from "@/constants/Colors";

interface FormInputProps extends TextInputProps {
  formProps: FormikProps<any>;
  name: string;
}

export default function FormInput({
  formProps,
  name,
  ...props
}: FormInputProps) {
  const config = {
    ...props,
    placeholderTextColor: Colors.black[500],
    onChangeText: formProps.handleChange(name),
    onBlur: formProps.handleBlur(name),
    value: formProps.values[name],
    error: formProps.errors[name] && formProps.touched[name],
  } as TextInputProps;

  const styles =
    formProps.errors[name] && formProps.touched[name]
      ? {
          backgroundColor: Colors.red[100],
          borderBottomWidth: 2,
          borderBottomColor: Colors.red[500],
        }
      : {};

  return (
    <>
      <TextInput {...config} style={styles} />
      {formProps.errors[name] && formProps.touched[name] ? (
        <Text style={{ color: Colors.red[500] }}>{formProps.errors[name]}</Text>
      ) : null}
    </>
  );
}
