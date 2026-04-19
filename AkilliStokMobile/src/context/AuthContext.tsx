import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type User = {
    id: number;
    fullName: string;
    email: string;
    role: string;
    token: string;
};

type AuthContextType = {
    userToken: string | null;
    user: User | null;
    isLoading: boolean;
    login: (token: string, userData: User) => Promise<void>;
    logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
    userToken: null,
    user: null,
    isLoading: true,
    login: async () => {},
    logout: async () => {},
});

export const AuthProvider = ({ children }: any) => {
    const [userToken, setUserToken] = useState<string | null>(null);
    const [user, setUser]           = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const login = async (token: string, userData: User) => {
        setUserToken(token);
        setUser(userData);
        await AsyncStorage.setItem('userToken', token);
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
    };

    const logout = async () => {
        setUserToken(null);
        setUser(null);
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('userData');
    };

    const loadToken = async () => {
        try {
            const token    = await AsyncStorage.getItem('userToken');
            const userData = await AsyncStorage.getItem('userData');
            setUserToken(token);
            setUser(userData ? JSON.parse(userData) : null);
        } catch (e) {
            console.log("Token yükleme hatası:", e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { loadToken(); }, []);

    return (
        <AuthContext.Provider value={{ userToken, user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};