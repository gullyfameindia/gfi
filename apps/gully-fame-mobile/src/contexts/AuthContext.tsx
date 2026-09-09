import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setAuthToken } from "../api/axios";

type AuthContextType = {
  token: string | null;
  isLoading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    
    AsyncStorage.getItem("authToken").then((t) => {
      setToken(t);
      setIsLoading(false);
    });
  }, []);

  const login = async (newToken: string) => {
    
    
    setToken(newToken);
  };

  const logout = async () => {
    
    await AsyncStorage.multiRemove([
      "authToken",
      "isLoggedIn",
      "userRole",
      "userEmail",
      "userFirstName",
      "userLastName",
      "userMobile",
      "profileCompleted",
      "userId",
      "accountCreatedVia",
    ]);
    await setAuthToken(""); 
    setToken(null); 
  };

  return (
    <AuthContext.Provider value={{ token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
