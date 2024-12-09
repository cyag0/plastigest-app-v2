namespace App {
  namespace Entities {
    interface User {
      name: string;
      last_name: string;
      email: string;
      password: string;
      id: number;
      phone_number: string;
      role_id: number;
      role: Roles.Role;
      address: string;
      is_active: boolean;
      image: string;
    }

    interface Supplier {
      id: number;
      name: string;
      email: string;
      phone: string;
      address: string;
    }

    interface Location {
      id: number;
      name: string;
      in_charge: string;
      address: string;
    }

    interface ProductLocation {
      product_id: number;
      location_id: number;
      stock: number;
    }

    namespace Products {
      interface Product {
        id: number;
        name: string;
        price: number;
        description?: string;
        img?: string;
        packages?: Package[];
      }
    }

    interface Location {
      id: number;
      name: string;
      address: string;
      in_charge: string;
    }

    namespace Roles {
      interface Role {
        id: number;
        name: string;
        description: string;
      }
      interface Resource {
        id: number;
        name: string;
        description: string;
        resource: ResourceType;
        route: string;
        icon: string;
        category?: string;
      }

      type ResourceType =
        | "users"
        | "products"
        | "suppliers"
        | "roles"
        | "locations"
        | "packages"
        | "in"
        | "out"
        | "inventory";
    }
    interface Package {
      id: number;
      name: string;
      product_id: number;
      labels?: string;
      code?: string;
      quantity: number;
    }

    namespace Movement {
      /*     protected $fillable = [
        "id",
        "user_id",
        "product_id",
        "location_id",
        "quantity",
        "quantity_unit",
        "total",
        "date",
        "type", // entrada o salida
        "action",  // venta, compra, traslado, recarga, uso
        "status", // pendiente, completado
    ]; */
      interface Entrada {
        id: number;
        user_id: number;
        product_id: number;
        location_id: number;
        quantity: number;
        quantity_unit: string;
        total: number;
        date: string;
        type: "entrada";
        action: "compra" | "recarga";
        status: "pendiente" | "completado";
      }

      interface Salida {
        id: number;
        user_id: number;
        product_id: number;
        location_id: number;
        quantity: number;
        quantity_unit: string;
        total: number;
        date: string;
        type: "salida";
        action: "venta" | "traslado" | "uso";
        status: "pendiente" | "completado";
      }
    }
  }
}
