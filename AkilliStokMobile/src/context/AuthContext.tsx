import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
    const [userToken, setUserToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const login = async (token: string) => {
        setUserToken(token);
        await AsyncStorage.setItem('userToken', token); 
    };

    const logout = async () => {
        setUserToken(null);
        await AsyncStorage.removeItem('userToken');
    };

    const loadToken = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            setUserToken(token);
        } catch (e) {
            console.log("Token yükleme hatası:", e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadToken();
    }, []);

    return (
        <AuthContext.Provider value={{ userToken, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};