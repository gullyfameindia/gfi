import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";
type roles = "participants" | "fan";
interface UserRoleContextProps {
  role: roles;
  setRole: (role: roles) => void;
  isLoading: boolean;
}
const UserRoleContext = createContext<UserRoleContextProps>({
  role: "fan",
  setRole: () => {},
  isLoading: true,
});
export const useUserRole = () => useContext(UserRoleContext);

export const UserRoleProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [role, setRoleState] = useState<roles>("fan");
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const loadRole = async () => {
      try {
        const storedRole = (await AsyncStorage.getItem("userRole")) as roles;

        setRoleState(storedRole);
      } catch (error) {
        console.error("Failed to load role from storage", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadRole();
  }, []);
  const setRole = async (newRole: roles) => {
    setRoleState(newRole);
    await AsyncStorage.setItem("userRole", newRole);
  };
  return (
    <UserRoleContext.Provider value={{ role, setRole, isLoading }}>
      {children}
    </UserRoleContext.Provider>
  );
};
