import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const useAuthToken = () => {
    const navigate = useNavigate()
    const [authToken, setAuthToken] = useState<string | null>(null);

    const login = async (username: string, password: string) => {
        try {
        const response = await axios.post('https://test-assignment.emphasoft.com/api/v1/login/', {
            username,
            password,
        });
        const token = response.data.token; 
        setAuthToken(token);
        localStorage.setItem('authToken', `Token ${token}`);
        } catch (error) {
        console.error('Ошибка при авторизации:', error);
        }
    };

    const logout = () => {
        setAuthToken(null);
        localStorage.clear();
        navigate('/login')
    };

    return { authToken, login, logout };
};

export default useAuthToken;
