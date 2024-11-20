import { View, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Button, DataTable, IconButton, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import { FontAwesome } from "@expo/vector-icons";
import ModalFormComponent, { ModalFormRef } from "../modals/ModalForm";
import Spin from "../Spin";
import { useRouter } from "expo-router";

/**
 * Props para el componente ProTable.
 *
 * @template T El tipo de los elementos que se manejarán en la tabla.
 */
interface ProTableProps<T> {
  /**
   * API para realizar operaciones de CRUD en la tabla.
   */
  api: {
    /**
     * Obtiene la lista completa de elementos.
     * @returns {Promise<any>} Una promesa que resuelve en un arreglo de elementos.
     */
    index: () => Promise<any>;

    /**
     * Crea un nuevo elemento.
     * @param {any} item - El elemento a crear.
     * @returns {Promise<any>} Una promesa que resuelve con el elemento creado.
     */
    create: (item: any) => Promise<any>;

    /**
     * Obtiene los datos de un elemento específico por su ID.
     * @param {string} id - El ID del elemento.
     * @returns {Promise<any>} Una promesa que resuelve con los datos del elemento.
     */
    show: (id: string) => Promise<any>;

    /**
     * Actualiza un elemento existente.
     * @param {string} id - El ID del elemento a actualizar.
     * @param {any} item - Los datos actualizados del elemento.
     * @returns {Promise<any>} Una promesa que resuelve con el elemento actualizado.
     */
    update: (id: string, item: any) => Promise<any>;

    /**
     * Elimina un elemento existente.
     * @param {string} id - El ID del elemento a eliminar.
     * @returns {Promise<any>} Una promesa que resuelve cuando el elemento ha sido eliminado.
     */
    delete: (id: string) => Promise<any>;
  };

  /**
   * Configuración de las columnas de la tabla.
   */
  columns: {
    /**
     * El título de la columna.
     */
    title: string;

    /**
     * El campo del elemento que se mostrará en la columna.
     */
    field: string;

    /**
     * El tipo de dato en la columna (opcional).
     */
    type?: "numeric" | "text";

    /**
     * La alineación del contenido en la columna (opcional).
     */
    align?: "flex-start" | "center" | "flex-end";
  }[];

  /**
   * Título que se mostrará en la tabla.
   */
  title: string;

  /**
   * Acciones personalizadas que se pueden realizar en los elementos de la tabla (opcional).
   */
  actionsProp?: ActionProp[];

  /**
   * Función que genera los inputs del formulario para crear/editar elementos (opcional).
   * @param {Function} handleChange - Función para manejar los cambios en los inputs.
   * @param {Function} handleBlur - Función para manejar cuando un input pierde el foco.
   * @param {Function} handleSubmit - Función para manejar el envío del formulario.
   * @param {any} values - Los valores actuales del formulario.
   * @returns {React.ReactNode} Un nodo React que representa los inputs.
   */
  inputs?: (
    handleChange: (field: string) => void,
    handleBlur: (field: string) => void,
    handleSubmit: () => void,
    values: any
  ) => React.ReactNode;

  /**
   * Función que se ejecuta al terminar una acción (crear o editar) (opcional).
   * @param {any} values - Los valores enviados.
   * @param {string} [id] - El ID del elemento a editar (opcional).
   */
  onFinish?: (values: any, id?: string) => void;

  /**
   * Función que se ejecuta antes de realizar una acción, para realizar validaciones u otros procesos (opcional).
   * @param {any} values - Los valores enviados.
   * @param {string} [id] - El ID del elemento (opcional).
   * @returns {any} Un valor que puede modificar el flujo de la acción.
   */
  beforeAction?: (values: any, id?: string) => any;

  /**
   * Función que se ejecuta después de realizar una acción (opcional).
   * @param {T} item - El elemento creado o actualizado.
   * @returns {boolean} Un valor booleano que indica si se debe recargar la tabla.
   */
  afterAction?: (item: T) => boolean;
}

/**
 * Representa una acción personalizada en los elementos de la tabla.
 */
type ActionProp = {
  /**
   * El título de la acción.
   */
  title: string;

  /**
   * El ícono de la acción.
   */
  icon: string;

  /**
   * La función que se ejecuta al presionar la acción.
   * @param {string} id - El ID del elemento sobre el cual se ejecuta la acción.
   */
  onPress: (id: string) => void;
};

function ProTable<T>({
  api,
  columns,
  title,
  actionsProp,
  inputs,
  onFinish,
  beforeAction = undefined,
  afterAction = undefined,
}: ProTableProps<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [actions, setActions] = useState<ActionProp[]>([
    {
      title: "Editar",
      icon: "edit",
      onPress: (id: string) => {
        handleEdit(id);
      },
    },
    {
      title: "Ver",
      icon: "eye",
      onPress: () => {},
    },
    {
      title: "Eliminar",
      icon: "trash",
      onPress: (id: string) => {
        handleDelete(id);
      },
    },
  ]);

  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = React.useState<number>(0);
  const [numberOfItemsPerPageList] = React.useState([10]);
  const [itemsPerPage, onItemsPerPageChange] = React.useState(
    numberOfItemsPerPageList[0]
  );
  const modalRef = useRef<ModalFormRef>(null);

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, items.length);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      reloadTable();
    })();
  }, []);

  async function handleCreate() {
    modalRef.current?.open({
      content: inputs,
      title: "Crear",
      okText: "Guardar",
      onOk: handleOnFinish,
      action: api.create,
    });
  }

  async function handleEdit(id: string) {
    console.log("edit", id);
    modalRef.current?.open({
      content: inputs,
      title: "Editar",
      okText: "Editar",
      onOk: handleOnFinish,
      getValues: api.show,
      id: id,
    });
  }

  async function handleDelete(id: string) {
    try {
      const res = await api.delete(id);
      reloadTable();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleOnFinish(values: any, id?: string) {
    try {
      let beforeActionResponse = undefined;
      let data;

      if (beforeAction) {
        beforeActionResponse = await beforeAction(values, id);
      }

      if (beforeActionResponse) {
        data = beforeActionResponse;
      } else {
        data = values;
      }

      if (onFinish) {
        onFinish(values, id);
        reloadTable();
        return true;
      }

      let item;
      if (id) {
        item = await api.update(id, values);
      } else {
        item = await api.create(values);
      }

      if (afterAction) {
        const res = afterAction(item);

        if (res) {
          reloadTable();
          return true;
        }
      }

      reloadTable();
      return true;
    } catch (error) {
      console.log(error);
      return false;
    } finally {
      return false;
    }
  }

  async function reloadTable() {
    try {
      setLoading(true);
      const data = await api.index();
      setItems(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Spin loading={loading} styles={styles.container}>
      <ModalFormComponent ref={modalRef} />
      <View style={[styles.card]}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 4,
          }}
        >
          <IconButton
            style={{ margin: 0, padding: 0 }}
            icon="arrow-left"
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              }
            }}
          />
          <Text variant="titleMedium" style={styles.title}>
            {title}
          </Text>
        </View>
        <View style={styles.filters}>
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
              <FontAwesome
                name="repeat"
                size={16}
                color={Colors.primary[600]}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
              <FontAwesome
                name="filter"
                size={16}
                color={Colors.primary[600]}
              />
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
      </View>
      <View style={[styles.card, { flex: 1 }]}>
        <DataTable style={{ flex: 1 }}>
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

          <View style={{ flex: 1 }}>
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
                        onPress={() => {
                          action.onPress(item.id);
                        }}
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
          </View>
          <DataTable.Pagination
            page={page}
            numberOfPages={Math.ceil(items.length / itemsPerPage)}
            onPageChange={(page) => {
              console.log(page);
              if (page) {
                setPage(page);
              }
            }}
            label={`${from + 1}-${to} of ${items.length}`}
            selectPageDropdownLabel={"Rows per page"}
          />

          {/* <DataTable.Pagination
            page={page || 0}
            numberOfPages={3}
            onPageChange={(newPage) => setPage(newPage)}
            numberOfItemsPerPageList={[10, 20, 30]}
            numberOfItemsPerPage={10}
            showFastPaginationControls
            selectPageDropdownLabel={"Rows xd"}
            onItemsPerPageChange={(value) => onItemsPerPageChange(value)}
          /> */}
        </DataTable>
      </View>
    </Spin>
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
    color: Colors.primary[800],
    fontWeight: "bold",
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
