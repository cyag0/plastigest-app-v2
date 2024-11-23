import clientAxios from "@/utils/axios";
import React, { createContext, useEffect } from "react";

interface AuthContextType {
  user: App.Entities.User | null;
  login: (data: App.Entities.User) => void;
  logout: () => void;
  authLoading: boolean;
}

//create a context
const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = React.useState<App.Entities.User | null>({
    id: 1,
    name: "John Doe",
    email: "cyag.cesar@gmail.com",
    password: "1234",
  });
  const [authLoading, setAuthLoading] = React.useState<boolean>(true);

  async function login(data: App.Entities.User) {
    try {
      const user = await clientAxios.post("login", data);
    } catch (error) {}
  }

  async function logout() {
    try {
      await clientAxios.post("logout");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error(
      "useAuthContext must be used within an AuthContextProvider"
    );
  }
  return context;
}
