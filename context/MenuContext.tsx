import Api from "@/services";
import React, { createContext, useEffect, useState } from "react";

interface MenuContextType {
  selectedMenu: string | null;
  setSelectedMenu: React.Dispatch<React.SetStateAction<string | null>>;
  dashboardItems: App.Entities.Roles.Resource[];
  setDashboardItems: React.Dispatch<
    React.SetStateAction<App.Entities.Roles.Resource[]>
  >;
}

const MenuContext = createContext<MenuContextType | null>(null);

export default function MenuContextContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedMenu, setSelectedMenu] = React.useState<string | null>("");
  const [dashboardItems, setDashboardItems] = useState<
    App.Entities.Roles.Resource[]
  >([]);

  /*   useEffect(() => {
    (async () => {
      try {
        const data = await Api.roles.resources.index();
        console.log(data);
        setDashboardItems(data.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []); */

  return (
    <MenuContext.Provider
      value={{
        selectedMenu,
        setSelectedMenu,
        dashboardItems,
        setDashboardItems,
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
