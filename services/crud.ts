import { db } from "@/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from "firebase/firestore";

export default function Crud<T>(table: string) {
  return {
    index: async () => {
      try {
        const querySnapshot = await getDocs(collection(db, table));
        const items = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        return items as T[];
      } catch (e) {
        console.error("Error al obtener los items:", table, e);
      }
    },
    create: async (item: any) => {
      try {
        const docRef = await addDoc(collection(db, table), item);
        console.log("Item agregado con ID:", docRef.id);
        return docRef as T;
      } catch (e) {
        console.error("Error al agregar el item:", e);
      }
    },
    show: async (id: string) => {
      try {
        const docRef = await getDoc(doc(db, table, id));
        if (docRef.exists()) {
          return docRef.data() as T;
        } else {
          console.error("No se encontró el item");
        }
      } catch (e) {
        console.error("Error al obtener el item:", e);
      }
    },
    update: async (id: string, item: any) => {
      try {
        await setDoc(doc(db, table, id), item);
      } catch (e) {
        console.error("Error al actualizar el item:", e);
      }
    },
    delete: async (id: string) => {
      try {
        const itemRef = doc(db, table, id);
        await deleteDoc(itemRef);
      } catch (e) {
        console.error("Error al eliminar el item:", e);
      }
    },
  };
}

/*Adapta lo siguiente

{
  index: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const products = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return products as App.Entities.Products.Product[];
    } catch (e) {
      console.error("Error al obtener los productos:", e);
    }
  },
  create: async (product: App.Entities.Products.Product) => {
    try {
      const docRef = await addDoc(collection(db, "products"), product);
      console.log("Producto agregado con ID:", docRef.id);
    } catch (e) {
      console.error("Error al agregar el producto:", e);
    }
  },
  show: async (id: string) => {
    try {
      const docRef = await getDoc(doc(db, "products", id));
      if (docRef.exists()) {
        return docRef.data() as App.Entities.Products.Product;
      } else {
        console.error("No se encontró el producto");
      }
    } catch (e) {
      console.error("Error al obtener el producto:", e);
    }
  },
  update: async (id: string, product: App.Entities.Products.Product) => {
    try {
      await setDoc(doc(db, "products", id), product);
      console.log("Producto actualizado con ID:", id);
    } catch (e) {
      console.error("Error al actualizar el producto:", e);
    }
  },
  delete: async (id: string) => {
    try {
      const productRef = doc(db, "products", id);
      await deleteDoc(productRef);
      console.log("Producto eliminado con ID:", id);
    } catch (e) {
      console.error("Error al eliminar el producto:", e);
    }
  },
}*/
