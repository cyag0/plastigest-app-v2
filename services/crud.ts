import { MetaProps } from "@/components/ProComponents/ProTable";
import clientAxios from "@/utils/axios";
export interface IndexProps {
  query?: any[];
  filters?: { [key: string]: any };
  sorter?: { [key: string]: any };
  searchBy?: any[];
}

type IndexResponse<T> = { data: T[]; meta: MetaProps };

export interface CrudType<T> {
  index: (props?: IndexProps) => Promise<IndexResponse<T>>;
  create: (data: any) => Promise<T>;
  show: (id: number) => Promise<T>;
  update: (id: number, data: any) => Promise<T>;
  delete: (id: number) => Promise<T>;
}

export default function Crud<T>(table: string) {
  return {
    index: async (props?: IndexProps) => {
      try {
        const response = await clientAxios.get(table, {
          params: props,
        });
        return response?.data;
      } catch (error) {
        console.log(error);
      }
    },
    create: async (data: any) => {
      try {
        const response = await clientAxios.post(table, data);
        console.log("cuantas veces ", response);
        return response.data.data as T;
      } catch (error) {
        console.log(error);
      }
    },
    show: async (id: number) => {
      try {
        const response = await clientAxios.get(`${table}/${id}`);
        console.log(response);
        return response.data.data as T;
      } catch (error) {
        console.log(error);
      }
    },
    update: async (id: number, data: any) => {
      try {
        const response = await clientAxios.put(`${table}/${id}`, data);
        console.log(response);
        return response.data.data as T;
      } catch (error) {
        console.log(error);
      }
    },
    delete: async (id: number) => {
      try {
        const response = await clientAxios.delete(`${table}/${id}`);
        console.log(response);
        return response.data;
      } catch (error) {
        console.log(error);
      }
    },
  } as CrudType<T>;
}
