import clientAxios from "@/utils/axios";
import Crud from "../crud";

export default {
  ...Crud<App.Entities.User>("weekly-inventory"),
  exists: async (location_id: number) => {
    try {
      const res = await clientAxios.post("/weekly-inventory/exists", {
        location_id,
      });
      return res.data as boolean;
    } catch (error) {
      console.log(error);
    }
  },
  getDetails: async (weeklyInventoryId: number) => {
    try {
      const res = await clientAxios.post("/weekly-inventory/get-details", {
        weekly_inventory_id: weeklyInventoryId,
      });
      return res.data as WeeklyInventoryDetails;
    } catch (error) {
      console.log(error);
    }
  },
};

interface WeeklyInventoryDetails {
  [key: string]: {
    product_id: number;
    stock: number;
    initial_stock: number;
    weekly_inventory_id: number;
    physical_stock: number;
    total_stock: number;
  };
}
