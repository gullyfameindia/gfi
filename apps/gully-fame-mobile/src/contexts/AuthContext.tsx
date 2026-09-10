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
    // App open hone par token check karo
    AsyncStorage.getItem("authToken").then((t) => {
      setToken(t);
      setIsLoading(false);
    });
  }, []);

  const login = async (newToken: string) => {
    // saveUserSession pehle se AsyncStorage me save karta hai
    // Yahan sirf React state update karo
    setToken(newToken);
  };

  const logout = async () => {
    // saveUserSession ki saari keys clear karo
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
    await setAuthToken(""); // axios header bhi clear karo
    setToken(null); // AuthGate trigger → /auth/signin redirect
  };

  return (
    <AuthContext.Provider value={{ token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
