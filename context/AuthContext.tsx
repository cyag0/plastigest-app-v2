import { createContext, useContext, useEffect, useState } from "react";
import clientAxios from "@/utils/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthContextProps {
  login: (data: { email: string; password: string }) => void;
  user: App.Entities.User | null;
  setUser: React.Dispatch<React.SetStateAction<App.Entities.User | null>>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | null>(null);

export default function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<App.Entities.User | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          clientAxios.defaults.headers["Authorization"] = `Bearer ${token}`;
          const userReq = await clientAxios.get("user");
          setUser(userReq.data);
        }
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  async function login(data: { email: string; password: string }) {
    try {
      const userReq = await clientAxios.post("login", data);

      console.log(userReq);

      const user = userReq.data.user;
      const token = userReq.data.token;

      if (user && token) {
        await AsyncStorage.setItem("token", token);
        clientAxios.defaults.headers["Authorization"] = `Bearer ${token}`;
        setUser(userReq.data.user);
      }

      return userReq;
    } catch (error) {
      console.log(error);
    }
  }

  async function logout() {
    try {
      const response = await clientAxios.post("/logout");
      console.log(response);
      clientAxios.defaults.headers["Authorization"] = "";
      await AsyncStorage.removeItem("token");
      setUser(null);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <AuthContext.Provider value={{ login, user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
export { useAuthContext };
