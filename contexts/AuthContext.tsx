import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Database } from '@/db/database';
import { AuthService } from '@/db/services/AuthService';
import { UserProfile, LoginDTO, CreateUserDTO } from '@/db/models';

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginDTO) => Promise<boolean>;
  register: (userData: CreateUserDTO) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<CreateUserDTO>) => Promise<boolean>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authService] = useState(() => new AuthService());

  const isAuthenticated = user !== null;

  useEffect(() => {
    initializeDatabase();
  }, []);

  const initializeDatabase = async () => {
    try {
      const db = Database.getInstance();
      await db.init();
      console.log('Base de datos inicializada en AuthContext');
      
      // En una app real, aquí verificarías si hay un token guardado
      // Por ahora, simplemente marcamos como no loading
      setIsLoading(false);
    } catch (error) {
      console.error('Error inicializando base de datos:', error);
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginDTO): Promise<boolean> => {
    try {
      setIsLoading(true);
      const userProfile = await authService.login(credentials);
      
      if (userProfile) {
        setUser(userProfile);
        // En una app real, aquí guardarías el token de autenticación
        console.log('Login exitoso para:', userProfile.email);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error en login:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: CreateUserDTO): Promise<boolean> => {
    try {
      setIsLoading(true);
      const userProfile = await authService.register(userData);
      
      if (userProfile) {
        setUser(userProfile);
        console.log('Registro exitoso para:', userProfile.email);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error en registro:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    // En una app real, aquí eliminarías el token de autenticación
    console.log('Usuario desconectado');
  };

  const updateProfile = async (updates: Partial<CreateUserDTO>): Promise<boolean> => {
    if (!user) return false;

    try {
      setIsLoading(true);
      const success = await authService.updateUserProfile(user.id, updates);
      
      if (success) {
        // Actualizar el perfil local
        setUser(prev => prev ? { ...prev, ...updates } : null);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (!user) return;

    try {
      const updatedProfile = await authService.getUserProfile(user.id);
      if (updatedProfile) {
        setUser(updatedProfile);
      }
    } catch (error) {
      console.error('Error refrescando perfil:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
