import { useAuth } from "../context/AuthContext"
import { Box, Spinner } from '@chakra-ui/react'
import { useEffect } from "react"
import { Navigate } from 'react-router-dom'

type ProtectedRouteProps = {
    element: React.ReactNode
}

function ProtectedRoute ({ element }: ProtectedRouteProps) {

    const {
        isLoggedIn,
        isLoading,
        requestVerification,
    } = useAuth()

    useEffect(() => {
        requestVerification()
    }, [isLoading, isLoggedIn])

    if (!isLoggedIn && isLoading)
        return (
            <Box h="100vh" display="flex" justifyContent="center" alignItems="center">
                <Spinner size="lg" />
            </Box>
        )

    if (!isLoggedIn && !isLoading) {
        return <Navigate to='/login' />
    }

    return element
}

export default ProtectedRoute