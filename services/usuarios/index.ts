import Crud from "../crud";

export default {
  ...Crud<App.Entities.User>("users"),
  registro: async (email: string, password: string) => {
    try {
      return null;
    } catch (error) {
      console.log(error);
    }
  },
};
