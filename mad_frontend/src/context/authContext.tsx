import React, { createContext, useState, useContext, ReactNode } from 'react';
import { saveToken, getToken, removeToken, saveUserData, getUserData } from '../store/storages';
import UserResponse from "../types/response/user-response";

interface AuthContextType {
    isAuthenticated: boolean;
    token: string | null;
    currentUser: UserResponse | null;
    roles: string[];
    login: (token: string) => void;
    logout: () => void;
    setUser: (userData: UserResponse) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [token, setToken] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [currentUser, setCurrentUser] = useState<UserResponse | null>(null);
    const [roles, setRoles] = useState<string[]>([]);

    const login = async (token: string) => {
        await saveToken(token);
        setToken(token);
        setIsAuthenticated(true);
    };

    const setUser = async (userData : UserResponse) => {
        setCurrentUser(userData);
        setRoles(userData.roles);
        await saveUserData(userData);
    }

    const logout = async () => {
        setToken(null);
        setCurrentUser(null);
        setRoles([]);
        setIsAuthenticated(false);

        await removeToken();
        await saveUserData(null);
    };

    const checkAuthentication = async () => {
        const storedToken = await getToken();
        const storedUserData = await getUserData() as any;

        if (storedToken && storedUserData) {
            setToken(storedToken);
            setCurrentUser(storedUserData);
            setRoles(storedUserData.roles);
            setIsAuthenticated(true);
        }
    };

    React.useEffect(() => {
        checkAuthentication();
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, token, currentUser, roles, login, logout, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};