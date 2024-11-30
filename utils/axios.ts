import axios from "axios";

const clientAxios = axios.create({
  // web
  baseURL: "http://127.0.0.1:8000/api/",
  //android emulator
  //baseURL: "http://10.0.2.2:8000/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

export default clientAxios;
