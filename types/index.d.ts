namespace App {
  namespace Entities {
    interface User {
      name: string;
      email: string;
      password: string;
    }

    namespace Products {
      interface Product {
        id: number;
        name: string;
        price: number;
        stock: number;
        description?: string;
        img?: string;
      }
    }
  }
}
