import React, { createContext, useContext, useState } from "react";
import { API_URL } from "../App";
import axios from 'axios'
import { useNavigate } from "react-router-dom";

type AuthContextProps = {
    children: React.ReactNode
}

type DecodeType = {
    fName: string,
    lName: string,
    username: string
}

type AuthContextType = {
    isLoggedIn: boolean;
    isLoading: boolean;
    setIsLoggedIn: Function;
    setIsLoading: Function;
    requestVerification: Function;
    requestLogout: Function;
    decode: DecodeType | null;
};

const AuthContext = createContext<AuthContextType | null>(null);
export const useAuth = (): AuthContextType => {return useContext(AuthContext) as AuthContextType}

function AuthProvider({ children }: AuthContextProps) {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [decode, setDecode] = useState(null)

    const navigate = useNavigate()

    const requestVerification = async () => {
        try {
            const res = await axios.get(`${API_URL}/auth/verify`)
            const { isAuthenticated } = res.data
            
            setIsLoggedIn(isAuthenticated)
            setDecode(res.data.decode)
            setIsLoading(false)
        } catch (err: any) {
            setIsLoggedIn(err.response.data.isAuthenticated)
            setIsLoading(false)
        }
    }

    const requestLogout = async () => {
        await axios.post(`${API_URL}/auth/logout`)
        navigate('/login')
    }
    
    const value = {
        isLoggedIn,
        setIsLoggedIn,
        isLoading,
        setIsLoading,
        requestVerification,
        requestLogout,
        decode
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider