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

    namespace Products {
      interface Product {
        id: number;
        name: string;
        price: number;
        description?: string;
        img?: string;
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
        | "packages";
    }
    interface Package {
      id: number;
      name: string;
      product_id: number;
      labels?: string;
      code?: string;
      quantity: number;
    }
  }
}
