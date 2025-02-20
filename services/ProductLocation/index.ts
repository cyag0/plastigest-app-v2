import clientAxios from "@/utils/axios";
import Crud from "../crud";

export default {
  ...Crud<App.Entities.ProductLocation>("product-location"),
  productNotInLocation: async (location_id: number) => {
    try {
      const res = await clientAxios.get(
        "product-location/products-not-in-location/" + location_id
      );

      return res.data as { data: App.Entities.Products.Product[] };
    } catch (error) {
      console.log(error);
    }
  },
};
