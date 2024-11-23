import Crud from "../crud";

export default {
  ...Crud<App.Entities.User>("usuarios"),
  registro: async (email: string, password: string) => {
    try {
      return null;
    } catch (error) {
      console.log(error);
    }
  },
};
