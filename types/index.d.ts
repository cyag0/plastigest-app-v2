namespace App {
  namespace Entities {
    interface User {
      name: string;
      email: string;
      password: string;
      id: number;
    }

    interface Supplier {
      id: number;
      name: string;
      email: string;
      phone: string;
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

      type ResourceType = "users" | "products" | "suppliers" | "roles";
    }
  }
}
