import { Colors } from "@/constants/Colors";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import { View } from "react-native";
import { Icon, Snackbar, Text } from "react-native-paper";

export type ToasterRef = {
  showToast: (props: ToasterProps) => void;
};

export type ToasterProps = {
  message: string;
  type?: "info" | "success" | "error";
  bgColor?: string;
  color?: string;
};

const Toaster = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);
  const [toast, setToast] = useState<ToasterProps>({
    message: "",
    type: "info",
    color: "black",
    bgColor: "red",
  });

  // Exponer funciones a través de la referencia
  useImperativeHandle(ref, () => ({
    showToast: (props: ToasterProps) => {
      if (!props.type) {
        props.type = "info";
      }
      console.log("props", props);

      if (props.type === "info") {
        props.color = "#fff";
        props.bgColor = Colors.primary[500];
      } else if (props.type === "success") {
        // strong green
        props.color = "#fff";
        props.bgColor = "#5cb85c";
      } else if (props.type === "error") {
        // strong red
        props.color = "#fff";
        props.bgColor = Colors.red[500];
      }

      setToast(props);
      setVisible(true);

      // Ocultar el snackbar después de 3 segundos
      setTimeout(() => {
        setVisible(false);
      }, 3000);
    },
  }));

  return (
    <Snackbar
      visible={visible}
      onDismiss={() => setVisible(false)}
      duration={3000}
      wrapperStyle={{
        maxWidth: 500,
        alignSelf: "center",
      }}
      action={{
        label: (
          <View style={{ alignItems: "center" }}>
            <Icon source={"close"} size={20} color={toast.color} />
          </View>
        ),
        onPress: () => {
          // Acción opcional al presionar "Cerrar"
          setVisible(false);
        },
      }}
      style={{ backgroundColor: toast.bgColor }}
    >
      <Text style={{ color: toast.color }}>{toast.message}</Text>
    </Snackbar>
  );
});

export default Toaster;
