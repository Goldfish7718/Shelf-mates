import React, { createContext, useContext, useState, useEffect } from "react";
import { API_URL } from "../App";
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";

type AuthContextProps = {
    children: React.ReactNode
}

type DecodeType = {
    fName: string;
    lName: string;
    username: string;
    isAdmin: boolean;
    _id: string;
}

type AuthContextType = {
    isLoggedIn: boolean;
    isLoading: boolean;
    setIsLoggedIn: Function;
    setIsLoading: Function;
    requestLogin: Function;
    requestSignup: Function;
    requestVerification: Function;
    requestLogout: Function;
    decode: DecodeType | null;
    verificationDone: boolean;
    error: string;
};

type UserCredentialsType = {
    fName?: string;
    lName?: string;
    username: string;
    password: string;
}

const AuthContext = createContext<AuthContextType | null>(null);
export const useAuth = (): AuthContextType => {return useContext(AuthContext) as AuthContextType}

function AuthProvider({ children }: AuthContextProps) {

    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [decode, setDecode] = useState(null)
    const [error, setError] = useState('')
    const [verificationDone, setVerificationDone] = useState(false)

    const navigate = useNavigate()
    const toast = useToast()

    const requestLogin = async ({ username, password }: UserCredentialsType) => {
        try {
            setIsLoading(true)
            const res = await axios.post(`${API_URL}/auth/login`, {
                username, 
                password
            })
            toast({
                title: `Welcome Back! ${res?.data?.fName}`,
                description: 'We are at your service',
                status: 'success',
                duration: 3000,
                isClosable: true,
              })
            setIsLoggedIn(true)
            navigate('/categories')
        } catch (err: any) {
            setError(err?.response?.data?.message)
        } finally {
            setIsLoading(false)
        }
    }
    
    const requestSignup = async ({ fName, lName, username, password }: UserCredentialsType) => {
        try {
            setIsLoading(true)
            await axios.post(`${API_URL}/auth/signup`, {
                username, 
                password,
                fName,
                lName
            })

            toast({
              title: `Welcome To Shelf-Mates! ${fName}`,
              description: "Account Created Succesfully",
              status: 'success',
              duration: 5000,
              isClosable: true,
            })
            
            setIsLoggedIn(true)
            navigate('/categories')
        } catch (err: any) {
          setError(err.response.data.message)
        } finally {
          setIsLoading(false)
        }
      }

    const requestVerification = async () => {
        try {
            const res = await axios.get(`${API_URL}/auth/verify`)
            const { isAuthenticated } = res.data
            
            setIsLoggedIn(isAuthenticated)
            setDecode(res.data.decode)
            
        } catch (err: any) {
            setIsLoggedIn(err.response.data.isAuthenticated)
        } finally {
            setIsLoading(false)
            setVerificationDone(true)
        }
    }

    const requestLogout = async () => {
        await axios.post(`${API_URL}/auth/logout`)
        
        toast({
            title: 'Logged Out',
            description: 'Come back soon!',
            status: "success",
            duration: 3000
        })
        
        setIsLoggedIn(false)
        setError('')
        setDecode(null)
        navigate('/login')
    }
    
    const value = {
        isLoggedIn,
        setIsLoggedIn,
        isLoading,
        setIsLoading,
        requestLogin,
        requestSignup,
        requestVerification,
        requestLogout,
        decode,
        verificationDone,
        error,
    }

    useEffect(() => {
        requestVerification()
    }, [isLoggedIn])

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider