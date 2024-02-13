import React, { createContext, useState, useContext, useCallback } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = useCallback(async (username, password) => {
        try {
            const response = await axios.post('http://localhost:3000/login', { username, password });
            const { token, role } = response.data;
            localStorage.setItem('token', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setUser({ username, role });
        } catch (error) {
            console.error('Login error:', error);
        }
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

