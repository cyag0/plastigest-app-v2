import debounce from "@/utils/debouce";
import itemsToSelect from "@/utils/itemsToSelect";
import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Modal,
  Checkbox,
  RadioButton,
  Portal,
  TextInput,
  Button,
} from "react-native-paper";

export default function AutocompleteModal(props: {
  onChange: Function;
  value: any;
  multiple?: boolean;
  debounce?: number;
  route?: Function;
  params?: any;
  initialValues?: any[];
}) {
  const {
    onChange,
    value,
    multiple = false,
    debounce: debounceTime = 500,
    route,
    params,
    initialValues = [],
  } = props;

  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(initialValues);
  const [options, setOptions] = useState([]);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const handleSelect = (selectedValue) => {
    if (multiple) {
      setSelected((prev) => {
        if (prev.includes(selectedValue)) {
          return prev.filter((val) => val !== selectedValue);
        }
        return [...prev, selectedValue];
      });
    } else {
      onChange(selectedValue);
      hideModal();
    }
  };

  async function handleFetchData(text) {
    if (!route) return;
    try {
      const res = await route({ ...params, search: text });
      setOptions(itemsToSelect(res.data));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  return (
    <View>
      <TextInput
        label="Buscar"
        value={value}
        onFocus={showModal}
        right={<TextInput.Icon icon="magnify" onPress={showModal} />}
      />

      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.modalContainer}
        >
          <TextInput
            placeholder="Buscar"
            style={styles.searchInput}
            onChangeText={debounce(
              (text) => handleFetchData(text),
              debounceTime
            )}
          />

          <ScrollView>
            {options.map((option) =>
              multiple ? (
                <Checkbox.Item
                  key={option.value}
                  label={option.label}
                  status={
                    selected.includes(option.value) ? "checked" : "unchecked"
                  }
                  onPress={() => handleSelect(option.value)}
                />
              ) : (
                <RadioButton.Item
                  key={option.value}
                  label={option.label}
                  value={option.value}
                  status={value === option.value ? "checked" : "unchecked"}
                  onPress={() => handleSelect(option.value)}
                />
              )
            )}
          </ScrollView>

          <Button
            mode="contained"
            onPress={() => {
              if (multiple) {
                onChange(selected);
              }
              hideModal();
            }}
            style={styles.closeButton}
          >
            Cerrar
          </Button>
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "white",
    margin: 20,
    borderRadius: 10,
    padding: 10,
  },
  searchInput: {
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 10,
  },
});
