import React, { createContext, ReactNode, useEffect, useState } from "react";

// Define the shape of the context data
type StoreContextType = {
  token: string;
  setToken: (token: string) => void;
  admin: boolean;
  setAdmin: (admin: boolean) => void;
};

// Provide a default value (empty object casted to StoreContextType)
export const StoreContext = createContext<StoreContextType | null>(null);

const StoreContextProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string>("");
  const [admin, setAdmin] = useState<boolean>(false);

  useEffect(() => {
    async function loadData() {
      const storedToken = localStorage.getItem("token");
      const storedAdmin = localStorage.getItem("admin");

      if (storedToken) setToken(storedToken);
      if (storedAdmin) setAdmin(storedAdmin === "true"); // Ensure it's a boolean
    }
    loadData();
  }, []);

  const contextValue: StoreContextType = {
    token,
    setToken,
    admin,
    setAdmin,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
