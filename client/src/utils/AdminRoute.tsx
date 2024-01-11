import { useAuth } from "../context/AuthContext"
import { Box, Spinner } from '@chakra-ui/react'
import { useEffect } from "react"
import ErrorComponent from "../components/ErrorComponent"

type AdminRouteProps = {
    element: React.ReactNode
}

function AdminRoute ({ element }: AdminRouteProps) {

    const {
        isLoggedIn,
        isLoading,
        requestVerification,
        decode
    } = useAuth()

    console.log(decode?.isAdmin);
    

    useEffect(() => {
        requestVerification()
    }, [isLoading, isLoggedIn])

    if (!isLoggedIn && isLoading)
        return (
            <Box h="100vh" display="flex" justifyContent="center" alignItems="center">
                <Spinner size="lg" />
            </Box>
        )

    if (!decode?.isAdmin) {
        return <ErrorComponent error="403 Forbidden"  />
    }

    return element
}

export default AdminRoute