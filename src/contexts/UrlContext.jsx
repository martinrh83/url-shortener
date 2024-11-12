import useFetch from "@/hooks/useFetch";
import { getCurrentUser } from "@/services/apiAuth";
import { createContext, useContext, useEffect } from "react";

const UrlContext = createContext();

function UrlProvider({ children }) {
  const { data: user, loading, fn: fetchUser } = useFetch(getCurrentUser);

  const isAuthenticated = user?.role === "authenticated";

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UrlContext.Provider value={{ user, fetchUser, isAuthenticated, loading }}>
      {children}
    </UrlContext.Provider>
  );
}

function useUrl() {
  return useContext(UrlContext);
}

export { UrlProvider, useUrl };
