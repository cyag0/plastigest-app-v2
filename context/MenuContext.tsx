import React, { createContext } from "react";

interface MenuContextType {
  selectedMenu: string | null;
  setSelectedMenu: React.Dispatch<React.SetStateAction<string | null>>;
}

const MenuContext = createContext<MenuContextType | null>(null);

export default function MenuContextContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedMenu, setSelectedMenu] = React.useState<string | null>("");

  return (
    <MenuContext.Provider
      value={{
        selectedMenu,
        setSelectedMenu,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
}

export function useMenuContext() {
  const context = React.useContext(MenuContext);
  if (!context) {
    throw new Error(
      "useMenuContext must be used within an MenuContextContextProvider"
    );
  }
  return context;
}
