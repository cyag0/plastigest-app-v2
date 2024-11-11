import React, { createContext, useEffect } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  User,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase";

interface AuthContextType {
  user: User | null;
  login: (data: { email: string; password: string }) => void;
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
  const [user, setUser] = React.useState<User | null>(null);
  const [authLoading, setAuthLoading] = React.useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("user", user);
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }

      setAuthLoading(false);
    });

    // Limpieza de la suscripción al desmontar el componente
    return () => unsubscribe();
  }, [auth]);

  async function login(data: { email: string; password: string }) {
    const { email, password } = data;
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setUser(user);
      })
      .catch((error) => {
        throw new Error(error.message);
      });
  }

  async function logout() {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
      })
      .catch((error) => {
        // An error happened.
      });
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
