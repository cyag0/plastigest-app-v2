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
  }
}
