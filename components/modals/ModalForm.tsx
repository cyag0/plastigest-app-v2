import { Colors } from "@/constants/Colors";
import { Formik } from "formik";
import React, { useImperativeHandle, useState, forwardRef } from "react";
import { View, StyleSheet } from "react-native";
import {
  ActivityIndicator,
  Divider,
  Modal,
  Portal,
  Text,
  Button,
} from "react-native-paper";

export type ModalFormRef = {
  close: () => void;
  open: (options: ModalFormProps) => void;
};

export interface ModalFormProps {
  content?: (
    handleChange: (field: string) => void,
    handleBlur: (field: string) => void,
    handleSubmit: () => void,
    values: any
  ) => React.ReactNode;
  title?: string;
  footer?: React.ReactNode;
  onClose?: () => void;
  onOpen?: () => void;
  onOk?: (values: any, id?: string) => boolean | Promise<boolean>;
  okText?: string;
  cancelText?: string;
  width?: number;
  id?: any; // id para obtener los datos del formulario o enviarlos
  params?: any; // parametros adicionales al enviar el formulario
  action?: any; // esta es la ruta de la acción que se ejecutará al presionar el botón de OK
  initialValues?: any;
  getValues?: any; //ruta para obtener los valores iniciales del formulario;
}

const ModalFormComponent = forwardRef<ModalFormRef>((props, ref) => {
  const [isVisible, setIsVisible] = useState(false);
  const [options, setOptions] = useState<ModalFormProps>({});
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState<any | null>({});

  useImperativeHandle(ref, () => ({
    open: (options: ModalFormProps) => {
      setOptions(options);
      setIsVisible(true);
      onOpen(options);
    },
    close: () => {
      onClose();
    },
  }));

  async function onOpen(options: ModalFormProps) {
    try {
      setLoading(true);

      if (options.onOpen) {
        await options.onOpen();
      }
      console.log("options", options);
      //funcion para obtener los datos iniciales del formulario
      if (options.id) {
        const data = await options.getValues(options.id);
        console.log("data", data);
        setInitialValues({ ...options.initialValues, ...data });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function onClose() {
    setOptions({});
    setInitialValues({});
    setIsVisible(false);
    if (options.onClose) {
      options.onClose();
    }
    setIsVisible(false);
  }

  return (
    <Portal
      theme={{
        colors: {
          backdrop: "#00000077",
        },
      }}
    >
      <Modal
        visible={isVisible}
        onDismiss={onClose}
        contentContainerStyle={[styles.modalContainer]}
      >
        {loading ? (
          <ActivityIndicator animating={true} color="#fff" />
        ) : (
          <ModalContent
            setLoading={setLoading}
            initialValues={initialValues}
            setIsVisible={setIsVisible}
            options={options}
            onClose={onClose}
          />
        )}
      </Modal>
    </Portal>
  );
});

function ModalContent({
  options,
  setIsVisible,
  initialValues,
  onClose,
  setLoading,
}: {
  options: ModalFormProps;
  setIsVisible: any;
  initialValues: any;
  onClose: any;
  setLoading: any;
}) {
  async function onOk(values: any) {
    try {
      if (options.onOk) {
        setLoading(true);
        const res = await options.onOk(values, options.id);

        if (res) {
          setIsVisible(false);
          onClose();
          return;
        }
      }

      const data = {
        ...values,
        ...options.params,
      };

      let res;

      if (options.action) {
        if (options.id) {
          res = await options.action(options.id, data);
        } else {
          res = await options.action(data);
        }
      }

      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={[styles.modalContent, { width: options.width || 500 }]}>
      {/* Header del modal */}
      <View style={styles.horizontalPadding}>
        {options.title && (
          <Text variant="titleMedium" style={{ fontWeight: "bold" }}>
            {options.title}
          </Text>
        )}
      </View>
      <Divider style={styles.divider} />

      {/* Contenido del modal */}
      <Formik initialValues={initialValues} onSubmit={onOk}>
        {({ handleChange, handleBlur, handleSubmit, values }) => (
          <View style={[styles.horizontalPadding]}>
            {/* Inputs del modal o contenido */}
            <View style={{ gap: 10 }}>
              {options.content &&
                options.content(handleChange, handleBlur, handleSubmit, values)}
            </View>

            {/* Footer del modal */}
            <Divider style={styles.divider} />
            <View style={[styles.footer]}>
              {options.footer && options.footer}
              <Button
                style={[styles.buttons]}
                mode="outlined"
                onPress={onClose}
              >
                {options.cancelText || "Cancelar"}
              </Button>
              <Button
                style={[styles.buttons]}
                mode="contained"
                contentStyle={{ padding: 0 }}
                onPress={handleSubmit}
                textColor="white"
              >
                {options.okText || "OK"}
              </Button>
            </View>
          </View>
        )}
      </Formik>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    zIndex: 1000,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  horizontalPadding: {
    paddingHorizontal: 20,
  },
  modalContent: {
    width: 300,
    paddingVertical: 20,
    backgroundColor: "white",
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  divider: {
    backgroundColor: Colors.black[200], // Cambia el color de la línea
    height: 0.5, // Cambia el grosor
    marginVertical: 8, // Espaciado vertical
  },

  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },

  buttons: {
    borderRadius: 6,
    borderWidth: 0.6,
  },
});
export default ModalFormComponent;
