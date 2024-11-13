import React, { useImperativeHandle, useState, forwardRef } from "react";
import { View, Button, StyleSheet, Text } from "react-native";
import { Modal, PaperProvider, Portal } from "react-native-paper";

export type ModalRef = {
  close: () => void;
  open: (options: ModalProps) => void;
};

export interface ModalProps {
  content?: React.ReactNode;
  footer?: React.ReactNode;
  onClose?: () => void;
  onOpen?: () => void;
}

const ModalComponent = forwardRef<ModalRef>((props, ref) => {
  const [isVisible, setIsVisible] = useState(false);
  const [options, setOptions] = useState<ModalProps>({
    content: null,
  });

  useImperativeHandle(ref, () => ({
    open: (options: ModalProps) => {
      console.log("open", options);
      setOptions(options);
      setIsVisible(true);
    },
    close: () => {
      setIsVisible(false);
    },
  }));

  async function onClose() {
    console.log("close");
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
        contentContainerStyle={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          <Text>Example Modal. Click outside this area to dismiss.</Text>
        </View>
      </Modal>
    </Portal>
  );
});

const styles = StyleSheet.create({
  modalContainer: {
    zIndex: 1000,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
});
export default ModalComponent;
