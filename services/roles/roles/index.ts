import Crud from "@/services/crud";

export default { ...Crud<App.Entities.Roles.Role>("roles") };
