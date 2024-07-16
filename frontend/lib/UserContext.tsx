'use client';

import React, { createContext, useState, ReactNode, FC } from "react";
import { User } from "./types";

// Define the context type
interface UserContextType {
  userInfo: User | undefined;
  setUserInfo: React.Dispatch<React.SetStateAction<User | undefined>>;
}

// Initialize the context with a default value
export const UserContext = createContext<UserContextType>({
  userInfo: undefined,
  setUserInfo: () => {},
});

interface UserContextProviderProps {
  children: ReactNode;
}

const UserContextProvider: FC<UserContextProviderProps> = ({ children }) => {
  const [userInfo, setUserInfo] = useState<User | undefined>();

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
