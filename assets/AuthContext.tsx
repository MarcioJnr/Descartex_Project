import React, { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig";

// Define o tipo do contexto
type AuthContextType = {
  user: User | null;
  loading: boolean;
};

// Cria o contexto
const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

// Hook personalizado para usar o contexto
export const useAuth = () => useContext(AuthContext);

// Provedor do contexto
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Observa mudanças no estado de autenticação
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    // Limpa o observador ao desmontar o componente
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};