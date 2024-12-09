import locations from "./locations";
import movements from "./movements";
import packages from "./packages";
import ProductLocation from "./ProductLocation";
import products from "./products";
import resources from "./roles/resources";
import roles from "./roles/roles";
import suppliers from "./suppliers";
import usuarios from "./usuarios";

const Api = {
  products,
  suppliers,
  movements,
  usuarios,
  ProductLocation,
  roles: {
    roles,
    resources,
  },
  locations,
  packages,
};

export default Api;
