/**
 * Transforma un arreglo de objetos en un formato estándar adecuado para
 * componentes de selección, como `RNPickerSelect` o `Select`.
 *
 * @param {any[]} items - Arreglo de objetos a transformar.
 * @param {string} labelKey - Clave del objeto que se usará para el texto a mostrar en el componente (`label`).
 * @param {string} valueKey - Clave del objeto que se usará para el valor asociado a cada opción (`value`).
 * @returns {{ label: string, value: any }[]} Un nuevo arreglo de objetos con las propiedades `label` y `value`.
 *
 * @example
 * // Ejemplo de uso:
 * const items = [
 *   { id: 1, name: "Opción 1" },
 *   { id: 2, name: "Opción 2" },
 * ];
 *
 * const result = itemsToSelect(items, "name", "id");
 * // Resultado:
 * // [
 * //   { label: "Opción 1", value: 1 },
 * //   { label: "Opción 2", value: 2 },
 * // ]
 */
export default function itemsToSelect(
  items: any[] = [],
  labelKey: string = "name",
  valueKey: string = "id"
): { label: string; value: any }[] {
  return items.map((item) => ({
    label: item[labelKey],
    value: item[valueKey],
  }));
}
