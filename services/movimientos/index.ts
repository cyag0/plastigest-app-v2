import Crud from "../crud";

export default {
  ...Crud<App.Entities.User>("usuarios"),
};
