import clientAxios from "@/utils/axios";
import Crud from "../crud";

export default {
  ...Crud<App.Entities.User>("movements"),
  getProductsWithPackages: async (id: number) => {
    try {
      const res = clientAxios.get("/movements/products-with-packages/" + id);
      return res;
    } catch (error) {
      console.log(error);
    }
  },
};
