import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Button,
  DataTable,
  IconButton,
  Text,
  TextInput,
} from "react-native-paper";
import { Colors } from "@/constants/Colors";
import { FontAwesome } from "@expo/vector-icons";
import ModalFormComponent, { ModalFormRef } from "../modals/ModalForm";
import Spin from "../Spin";
import { useFocusEffect, usePathname, useRouter } from "expo-router";
import { CrudType } from "@/services/crud";
import { FormikProps } from "formik";
import * as yup from "yup";
import { useMenuContext } from "@/context/MenuContext";
import Toaster, { ToasterRef } from "../Toaster";

/**
 * Props para el componente ProTable.
 *
 * @template T El tipo de los elementos que se manejarán en la tabla.
 */
interface ProTableProps<T> {
  /**
   * API para realizar operaciones de CRUD en la tabla.
   */
  api: CrudType<T>;

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

    /**
     * El ancho mínimo de la columna (opcional).
     */
    minWidth?: number;

    /**
     * Función que se ejecuta para renderizar el contenido de la celda (opcional).
     * @param {any} field - El campo del elemento.
     * @param {T} item - El elemento.
     * @returns {React.ReactNode} Un nodo React que representa el contenido de la celda.
     */
    render?: (field: any, item: T) => React.ReactNode;
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
  inputs?: (props: FormikProps<any>) => React.ReactNode;

  /**
   * Función que se ejecuta al terminar una acción (crear o editar) (opcional).
   * @param {any} values - Los valores enviados.
   * @param {number} [id] - El ID del elemento a editar (opcional).
   */
  onFinish?: (values: any, id?: number) => void;

  /**
   * Función que se ejecuta antes de realizar una acción, para realizar validaciones u otros procesos (opcional).
   * @param {any} values - Los valores enviados.
   * @param {number} [id] - El ID del elemento (opcional).
   * @returns {any} Un valor que puede modificar el flujo de la acción.
   */
  beforeAction?: (values: any, id?: number) => any;

  /**
   * Función que se ejecuta después de realizar una acción (opcional).
   * @param {T} item - El elemento creado o actualizado.
   * @returns {boolean} Un valor booleano que indica si se debe recargar la tabla.
   */
  afterAction?: (item: T) => boolean;

  validationScheme?: (Yup: typeof import("yup")) => any;

  /**
   * El recurso que se está manejando en la tabla (opcional).
   * Se utiliza para resaltar el recurso en el menú lateral.
   * @example "actividades"
   *
   * @type {string}
   */
  resource?: App.Entities.Roles.ResourceType;

  loadingInputs?: boolean;
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

//make type
export type MetaProps = {
  current_page: number;
  from: number;
  to: number;
  last_page: number;
  links: any[];
  total: number;
  per_page: number;
};

function Table<T>({
  api,
  columns,
  title,
  actionsProp,
  inputs,
  onFinish,
  beforeAction = undefined,
  afterAction = undefined,
  validationScheme = () => ({}),
  resource,
  loadingInputs,
}: ProTableProps<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [actions, setActions] = useState<ActionProp[]>([
    {
      title: "Editar",
      icon: "pencil",
      onPress: async (id: string) => {
        await handleEdit(id);
      },
    },
    {
      title: "Ver",
      icon: "eye-outline",
      onPress: () => {},
    },
    {
      title: "Eliminar",
      icon: "delete-outline",
      onPress: (id: string) => {
        handleDelete(id);
      },
    },
  ]);

  //filters
  const [search, setSearch] = useState<string>("");
  const [meta, setMeta] = useState<MetaProps>({
    total: 0,
    current_page: 0,
    from: 0,
    to: 0,
    last_page: 0,
    links: [],
    per_page: 0,
  });
  const [page, setPage] = React.useState<number>(0);
  const [itemsPerPage, onItemsPerPageChange] = React.useState(10);

  const [loading, setLoading] = useState<boolean>(false);
  const [numberOfItemsPerPageList] = React.useState([10]);
  const modalRef = useRef<ModalFormRef>(null);
  const toasterRef = useRef<ToasterRef>(null);

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
      validationSchema: validationScheme,
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
      validationSchema: validationScheme,
    });
  }

  async function handleDelete(id: number) {
    try {
      const res = await api.delete(id);
      reloadTable();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleOnFinish(values: any, id?: number) {
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

      toasterRef.current?.showToast({
        type: "success",
        message: "Operación exitosa",
      });
      reloadTable();
      return true;
    } catch (error) {
      console.log(error);
      return false;
    } finally {
      return false;
    }
  }

  async function reloadTable(newPage?: number) {
    try {
      setLoading(true);

      const params = {} as any;
      params["page"] = newPage ? newPage + 1 : page;
      params["items_per_page"] = itemsPerPage;

      if (search.length > 3) {
        params["search"] = search;
      }

      const data = await api.index({ query: params });

      console.log(data);
      if (Array.isArray(data.data)) {
        setItems(data.data);
      }
      setPage(data.meta.current_page - 1);
      setMeta(data.meta);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Spin loading={loading} styles={styles.container}>
      {!loadingInputs && <ModalFormComponent ref={modalRef} />}

      <View style={[styles.card]}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 0,
          }}
        >
          <Button
            style={{ margin: 0, padding: 0 }}
            onPress={() => {
              router.replace({
                pathname: "/(actividades)/(dashboard)",
              });
            }}
            icon={"arrow-left"}
            textColor={Colors.primary[700]}
          >
            <Text variant="titleMedium" style={styles.title}>
              {title}
            </Text>
          </Button>
        </View>
        <View style={styles.filters}>
          <View style={{ flexDirection: "row", gap: 4 }}>
            <TextInput
              onSubmitEditing={() => {
                reloadTable();
              }}
              placeholder="Buscar"
              value={search}
              onChangeText={(e) => setSearch(e)}
              style={{
                height: 40,
                flex: 1,
              }}
              left={
                <TextInput.Icon
                  onPress={() => {
                    reloadTable();
                  }}
                  icon="magnify"
                  color={Colors.primary[500]}
                />
              }
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              gap: 4,
              alignItems: "center",
            }}
          >
            <IconButton
              mode="contained"
              icon="refresh"
              onPress={() => reloadTable()}
            />
            <Button
              style={{ padding: 0, borderRadius: 8, height: 40, flex: 1 }}
              mode="text"
              onPress={() => {}}
              icon={"filter-menu"}
            >
              Filtros
            </Button>
            <Button
              icon={"plus"}
              style={{
                padding: 0,
                borderRadius: 8,
                height: 40,
              }}
              mode="contained"
              onPress={handleCreate}
              textColor="#fff"
            >
              Crear
            </Button>
          </View>
        </View>
      </View>
      {loadingInputs ? (
        <View
          style={{ height: 200, width: 200, backgroundColor: "red" }}
        ></View>
      ) : (
        <View style={[styles.card, { flex: 1 }]}>
          <ScrollView
            horizontal
            contentContainerStyle={[{ flexDirection: "row", flex: 1 }]}
          >
            <DataTable style={{ flex: 1, height: "100%" }}>
              <DataTable.Header>
                {columns.map((column) => (
                  <DataTable.Title
                    style={{ minWidth: column.minWidth || 150 }}
                    key={column.field}
                  >
                    <Text variant="titleMedium">{column.title}</Text>
                  </DataTable.Title>
                ))}

                <DataTable.Title
                  style={{
                    flexDirection: "row",
                    gap: 4,
                    justifyContent: "center",
                    minWidth: 200,
                  }}
                >
                  <Text variant="titleMedium">Acciones</Text>
                </DataTable.Title>
              </DataTable.Header>

              <View style={{ flex: 1 }}>
                {items.map((item) => (
                  <DataTable.Row key={item.id}>
                    {columns.map((column) => (
                      <DataTable.Cell
                        numeric={column.type === "numeric"}
                        key={column.field}
                        style={{
                          justifyContent: column.align
                            ? column.align
                            : "flex-start",
                          minWidth: column.minWidth || 150,
                        }}
                      >
                        {column.render
                          ? column.render(item[column.field], item)
                          : item[column.field]}
                      </DataTable.Cell>
                    ))}

                    <DataTable.Cell
                      style={{
                        minWidth: 200,
                      }}
                    >
                      <View
                        style={{
                          flex: 1,
                          flexDirection: "row",
                          justifyContent: "center",
                          gap: 4,
                        }}
                      >
                        {actions.map((action) => (
                          <IconButton
                            size={20}
                            mode="contained-tonal"
                            style={{ margin: 0 }}
                            iconColor={Colors.primary[700]}
                            icon={action.icon}
                            onPress={() => {
                              action.onPress(item.id);
                            }}
                          />
                        ))}
                      </View>
                    </DataTable.Cell>
                  </DataTable.Row>
                ))}
              </View>

              <View style={{ alignItems: "center" }}>
                <DataTable.Pagination
                  page={page}
                  numberOfPages={meta.last_page}
                  onPageChange={(newPage) => {
                    setPage(newPage);
                    reloadTable(newPage);
                  }}
                  label={`${meta.from}-${meta.to} of ${meta.total}`}
                  selectPageDropdownLabel="Rows per page"
                />
              </View>
            </DataTable>
          </ScrollView>
        </View>
      )}

      <Toaster ref={toasterRef} />
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
    flexWrap: "wrap",
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

function ProTable<T>(props: ProTableProps<T>) {
  const menuProps = useMenuContext();
  const location = usePathname();

  useFocusEffect(
    useCallback(() => {
      if (props.resource) {
        menuProps.setSelectedMenu(props.resource);
      }
    }, [props.resource])
  );

  return props.loadingInputs ? <View></View> : <Table {...props} />;
}

export default ProTable;
