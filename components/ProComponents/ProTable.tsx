import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Button,
  DataTable,
  Icon,
  IconButton,
  Text,
  TextInput,
  TouchableRipple,
} from "react-native-paper";
import { Colors } from "@/constants/Colors";
import { FontAwesome } from "@expo/vector-icons";
import ModalFormComponent, { ModalFormRef } from "../modals/ModalForm";
import Spin from "../Spin";
import { useFocusEffect, usePathname, useRouter } from "expo-router";
import { CrudType, IndexProps } from "@/services/crud";
import { FormikProps } from "formik";
import * as yup from "yup";
import { useMenuContext } from "@/context/MenuContext";
import Toaster, { ToasterRef } from "../Toaster";
import { useAuthContext } from "@/context/AuthContext";

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
     * sorter: nombre del campo por el cual se ordenará la tabla
     */
    sorter?: {
      [key: string]: "asc" | "desc";
    };

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

  renderActions?: (
    actions: ActionProp[],
    item: T,
    index: number
  ) => React.ReactNode;

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

  indexParams?: IndexProps;

  filtersInputs?: (props: FormikProps<any>) => React.ReactNode;

  initialValues?: any;
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
  loadingInputs = false,
  filtersInputs = undefined,
  indexParams: indexParamsProps,
  renderActions,
  initialValues,
}: ProTableProps<T>) {
  const auth = useAuthContext();

  const CAN_EDIT = auth.userPermissions[resource]?.edit || false;
  const CAN_DELETE = auth.userPermissions[resource]?.delete || false;

  const [items, setItems] = useState<T[]>([]);

  const initialSorterBy = columns.reduce((acc, column) => {
    if (column.sorter) {
      Object.entries(column.sorter).forEach(([key, value]) => {
        acc[key] = value as "asc" | "desc";
      });
    }
    return acc;
  }, {} as { [key: string]: "asc" | "desc" });

  //filters
  const [sorterBy, setSorterBy] = useState<{
    [key: string]: "asc" | "desc" | undefined;
  }>(initialSorterBy);
  const [filters, setFilters] = useState<{ [key: string]: any }>(
    indexParamsProps?.filters || {}
  );
  const [indexParams, setIndexParams] = useState<IndexProps | undefined>(
    indexParamsProps
  );
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

  const [loading, setLoading] = useState<boolean>(true);
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
      initialValues: initialValues,
    });
  }

  async function handleEdit(id: string) {
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

  async function reloadTable(
    newPage?: number,
    options?: {
      _sorterBy?: { [key: string]: "asc" | "desc" | undefined };
      _filters?: { [key: string]: any };
    }
  ) {
    try {
      setLoading(true);
      const thisSorterBy = options?._sorterBy || sorterBy;
      const thisFilters = options?._filters || filters;
      const indexParamsKeys = Object.keys(indexParams || {});

      const params = {
        query: {
          page: newPage ? newPage + 1 : page,
          items_per_page: itemsPerPage,
        },
      } as any;

      if (search.length > 3) {
        params["query"]["search"] = search;
      }

      //agregamos los filtros adicionales
      indexParamsKeys.forEach((key) => {
        if (indexParams?.[key]) {
          if (Object.keys(indexParams[key] || {}).length > 0) {
            params[key] = indexParams[key];
          }
        }
      });

      const paramsData = {
        query: params["query"],
      } as IndexProps;

      if (thisFilters && Object.keys(thisFilters).length > 0) {
        paramsData["filters"] = thisFilters;
      }

      if (thisSorterBy && Object.keys(thisSorterBy).length > 0) {
        paramsData["sorter"] = thisSorterBy;
      }

      if (params["searchBy"]) {
        paramsData["searchBy"] = params["searchBy"];
      }

      const data = await api.index(paramsData);

      if (Array.isArray(data.data)) {
        setItems(data.data);
      } else {
        setItems([]);
      }
      setPage(data.meta.current_page - 1);
      setMeta(data.meta);
    } catch (error) {
      console.error(error);
      setItems([]);
      toasterRef.current?.showToast({
        type: "error",
        message: "Ocurrió un error al cargar los datos",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleFilters() {
    modalRef.current?.open({
      content: filtersInputs,
      title: "Filtros",
      okText: "Aplicar",
      initialValues: filters,
      onOk: async (values: any, id?: number) => {
        try {
          setFilters({ ...indexParamsProps?.filters, ...values });
          reloadTable(page, {
            _filters: { ...indexParamsProps?.filters, ...values },
          });
          return true;
        } catch (error) {
          return false;
        }
      },
    });
  }

  return (
    <Spin loading={loading || loadingInputs} styles={styles.container}>
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
              onPress={() => {
                handleFilters();
              }}
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
        <View style={[styles.card, { flex: 1 }]}></View>
      ) : (
        <View
          style={[
            styles.card,
            { flex: 1, paddingVertical: 0, paddingHorizontal: 8 },
          ]}
        >
          <ModalFormComponent ref={modalRef} />
          <ScrollView
            horizontal
            contentContainerStyle={[{ flexDirection: "row", flex: 1 }]}
          >
            <DataTable style={{ flex: 1, height: "100%" }}>
              <DataTable.Header>
                {columns.map((column) => (
                  <TouchableRipple
                    key={"header-column-" + column.field}
                    style={{
                      width: column.minWidth || 150,
                      minWidth: column.minWidth || 150,
                      flexDirection: "row",
                      justifyContent: column.align || "flex-center",
                      flex: 1,
                    }}
                    rippleColor={Colors.primary[100]}
                    children={() => {
                      const columnSorter = Object.keys(column.sorter || {})[0];
                      const sortDirection = sorterBy[columnSorter] || undefined;

                      return (
                        <DataTable.Title
                          style={{
                            justifyContent: column.align || "flex-center",
                            alignItems: "center",
                          }}
                          sortDirection={
                            sortDirection
                              ? sortDirection === "asc"
                                ? "ascending"
                                : "descending"
                              : undefined
                          }
                          children={
                            <>
                              <Text variant="titleMedium">{column.title}</Text>
                            </>
                          }
                          key={"header-column-" + column.field}
                        />
                      );
                    }}
                    onPress={
                      column.sorter
                        ? () => {
                            if (column.sorter) {
                              const columnSorter = Object.keys(
                                column.sorter
                              )[0];
                              const newSorterdBy = { ...sorterBy };

                              switch (sorterBy[columnSorter]) {
                                case "asc":
                                  newSorterdBy[columnSorter] = "desc";
                                  break;
                                case "desc":
                                  newSorterdBy[columnSorter] = undefined;
                                  break;
                                default:
                                  newSorterdBy[columnSorter] = "asc";
                                  break;
                              }

                              reloadTable(page, newSorterdBy);
                              setSorterBy(newSorterdBy);
                            }
                          }
                        : undefined
                    }
                  />
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
                {items.map((item, index) => (
                  <DataTable.Row key={"header-" + (item.id || index)}>
                    {columns.map((column) => (
                      <DataTable.Cell
                        numeric={column.type === "numeric"}
                        key={index + "content-" + column.field}
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
                        {renderActions ? (
                          renderActions(
                            {
                              edit: CAN_EDIT ? (
                                <IconButton
                                  key={
                                    "action-" +
                                    "create" +
                                    "-" +
                                    (item.id || index)
                                  }
                                  size={20}
                                  mode="contained-tonal"
                                  style={{ margin: 0 }}
                                  iconColor={Colors.primary[700]}
                                  icon={"pencil"}
                                  onPress={() => {
                                    handleEdit(String(item.id));
                                  }}
                                />
                              ) : null,
                              delete: CAN_DELETE ? (
                                <IconButton
                                  key={
                                    "action-" +
                                    "delete" +
                                    "-" +
                                    (item.id || index)
                                  }
                                  size={20}
                                  mode="contained-tonal"
                                  style={{ margin: 0 }}
                                  iconColor={Colors.primary[700]}
                                  icon={"delete"}
                                  onPress={() => {
                                    handleDelete(item.id);
                                  }}
                                />
                              ) : null,
                            },
                            item,
                            index
                          )
                        ) : (
                          <>
                            {CAN_EDIT && (
                              <IconButton
                                key={
                                  "action-" +
                                  "create" +
                                  "-" +
                                  (item.id || index)
                                }
                                size={20}
                                mode="contained-tonal"
                                style={{ margin: 0 }}
                                iconColor={Colors.primary[700]}
                                icon={"pencil"}
                                onPress={() => {
                                  handleEdit(String(item.id));
                                }}
                              />
                            )}

                            {CAN_DELETE && (
                              <IconButton
                                key={
                                  "action-" +
                                  "delete" +
                                  "-" +
                                  (item.id || index)
                                }
                                size={20}
                                mode="contained-tonal"
                                style={{ margin: 0 }}
                                iconColor={Colors.primary[700]}
                                icon={"delete"}
                                onPress={() => {
                                  handleDelete(item.id);
                                }}
                              />
                            )}
                          </>
                        )}
                      </View>
                    </DataTable.Cell>
                  </DataTable.Row>
                ))}
              </View>
            </DataTable>
          </ScrollView>

          <View style={{ alignItems: "center" }}>
            <DataTable.Pagination
              page={page}
              style={{
                padding: 0,
              }}
              numberOfPages={meta.last_page}
              onPageChange={(newPage) => {
                console.log(newPage);
                setPage(newPage);
                reloadTable(newPage);
              }}
              label={`${meta.from}-${meta.to} of ${meta.total}`}
              selectPageDropdownLabel="Rows per page"
            />
          </View>
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

  return <Table {...props} />;
}

export default ProTable;
