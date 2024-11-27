import React, { createContext } from "react";
import { Dimensions } from "react-native";

interface AppContextType {}

const AppContext = createContext<AppContextType | null>(null);

export default function AppContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobil, setIsMobil] = React.useState<boolean>(false);

  //determina si el dispositivo es un móvil y rota la pantalla
  React.useEffect(() => {
    const { width } = Dimensions.get("screen");
    setIsMobil(width < 768);
  }, []);

  return (
    <AppContext.Provider value={{ isMobil, setIsMobil }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = React.useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
}
