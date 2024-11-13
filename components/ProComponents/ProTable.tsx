import { View, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Button, DataTable, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import { FontAwesome } from "@expo/vector-icons";
import ModalComponent, { ModalProps, ModalRef } from "../modals/Modal";

interface ProTableProps {
  api: {
    index: () => Promise<any>;
    create: (item: any) => Promise<any>;
    show: (id: string) => Promise<any>;
    update: (id: string, item: any) => Promise<any>;
    delete: (id: string) => Promise<any>;
  };
  columns: {
    title: string;
    field: string;
    type?: "numeric" | "text";
    align?: "flex-start" | "center" | "flex-end";
  }[];
  title: string;
  actions?: any[];
}

type ActionProp = {
  title: string;
  icon: string;
  onPress: () => void;
};

function ProTable<T>({ api, columns, title, actionsProp }: ProTableProps) {
  const [items, setItems] = useState<T[]>([]);
  const [actions, setActions] = useState<ActionProp[]>([
    {
      title: "Editar",
      icon: "edit",
      onPress: () => {},
    },
    {
      title: "Ver",
      icon: "eye",
      onPress: () => {},
    },
    {
      title: "Eliminar",
      icon: "trash",
      onPress: () => {},
    },
  ]);

  const [page, setPage] = React.useState<number>(0);
  const [numberOfItemsPerPageList] = React.useState([2, 3, 4]);
  const [itemsPerPage, onItemsPerPageChange] = React.useState(
    numberOfItemsPerPageList[0]
  );
  const modalRef = useRef<ModalRef>(null);

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, items.length);

  useEffect(() => {
    (async () => {
      try {
        const data = await api.index();
        console.log(data);
        setItems(data);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  function handleCreate() {
    modalRef.current?.open({
      content: <Text>Crear</Text>,
    });
  }

  return (
    <View style={styles.container}>
      <ModalComponent ref={modalRef} />
      <View style={[styles.card, styles.filters]}>
        <View style={{ flexDirection: "row", flex: 0.3, gap: 4 }}>
          <TextInput placeholder="Buscar" style={styles.textInput} />
          <TouchableOpacity
            style={[styles.button, { backgroundColor: Colors.primary[600] }]}
          >
            <FontAwesome name="search" size={16} color={"#fff"} />
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: "row", gap: 4 }}>
          <TouchableOpacity style={styles.button}>
            <FontAwesome name="repeat" size={16} color={Colors.primary[600]} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <FontAwesome name="filter" size={16} color={Colors.primary[600]} />
            <Text style={{ color: Colors.primary[600] }}>Filtros</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleCreate}
            style={[styles.button, { backgroundColor: Colors.primary[600] }]}
          >
            <FontAwesome name="plus" size={16} color={"#fff"} />
            <Text style={{ color: "#fff" }}>Crear</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.card}>
        <DataTable>
          <DataTable.Header>
            {columns.map((column) => (
              <DataTable.Title key={column.field}>
                {column.title}
              </DataTable.Title>
            ))}

            <DataTable.Title
              style={{
                flexDirection: "row",
                gap: 4,
                justifyContent: "center",
              }}
            >
              Acciones
            </DataTable.Title>
          </DataTable.Header>

          {items.slice(from, to).map((item) => (
            <DataTable.Row key={item.id}>
              {columns.map((column) => (
                <DataTable.Cell
                  numeric={column.type === "numeric"}
                  key={column.field}
                  style={{
                    justifyContent: column.align ? column.align : "left",
                  }}
                >
                  {item[column.field]}
                </DataTable.Cell>
              ))}

              <DataTable.Cell>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    gap: 4,
                    justifyContent: "center",
                  }}
                >
                  {actions.map((action) => (
                    <TouchableOpacity
                      key={action.title}
                      onPress={action.onPress}
                      style={styles.actionButton}
                    >
                      <FontAwesome
                        name={action.icon}
                        size={16}
                        color={Colors.primary[600]}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              </DataTable.Cell>
            </DataTable.Row>
          ))}

          <DataTable.Pagination
            page={page}
            numberOfPages={Math.ceil(items.length / itemsPerPage)}
            onPageChange={(page) => setPage(page)}
            label={`${from + 1}-${to} of ${items.length}`}
            numberOfItemsPerPageList={numberOfItemsPerPageList}
            numberOfItemsPerPage={itemsPerPage}
            onItemsPerPageChange={onItemsPerPageChange}
            showFastPaginationControls
            selectPageDropdownLabel={"Rows per page"}
          />
        </DataTable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#e1e1e1",
    flex: 1,
    padding: 10,
    gap: 10,
  },

  title: {
    color: Colors.black[800],
  },

  filters: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    justifyContent: "space-between",
  },
  card: {
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 16,
  },

  textInput: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary[600],
    flex: 1,
  },

  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.primary[600],
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    borderColor: Colors.primary[700],
    borderWidth: 0.3,
  },
});

export default ProTable;
