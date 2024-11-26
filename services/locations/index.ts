import Crud from "../crud";

export default {
  ...Crud<App.Entities.Location>("locations"),
};
