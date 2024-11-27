import movimientos from "./movimientos";
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
};

export default Api;
