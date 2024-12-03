import locations from "./locations";
import movimientos from "./movimientos";
import packages from "./packages";
import products from "./products";
import resources from "./roles/resources";
import roles from "./roles/roles";
import suppliers from "./suppliers";
import usuarios from "./usuarios";

const Api = {
  products,
  suppliers,
  movimientos,
  usuarios,

  roles: {
    roles,
    resources,
  },
  locations,
  packages,
};

export default Api;
