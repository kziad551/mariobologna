import React, {createContext, useContext, useEffect, useState} from 'react';

interface AuthContextProps {}

const AuthContext = createContext<AuthContextProps>({});

export function AuthProvider({children}: {children: React.ReactNode}) {
  const login = (token: string) => {};

  const logout = () => {};

  useEffect(() => {}, []);

  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
