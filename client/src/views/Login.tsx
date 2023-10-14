import { Alert, AlertIcon, AlertTitle, Box, Button, Flex, FormControl, FormLabel, Heading, Input, InputGroup, InputRightElement, Link, Stack, Text, useColorModeValue, useToast } from "@chakra-ui/react"
import Navbar from "../components/Navbar"
import { useState } from "react"
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons"
import { API_URL } from "../App"
import axios from "axios"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

function Login () {

    const navigate = useNavigate()
    const toast = useToast()
    const { setIsLoggedIn } = useAuth()

    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const [error, setError] = useState('')

    const requestLogin = async () => {
        try {
            const res = await axios.post(`${API_URL}/auth/login`, {
                username, 
                password
            })
            toast({
                title: `Welcome Back! ${res?.data?.fName}`,
                description: 'We are at your service',
                status: 'success',
                duration: 5000,
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

    return (
    <>
        <Navbar />
        <Flex
            h='100vh'
            align={'center'}
            justify={'center'}
            bg={useColorModeValue('gray.50', 'gray.800')}>
            <Stack spacing={8} w='100%' maxW={'lg'} py={12} px={6}>
            <Stack align={'center'}>
                <Heading fontSize={'4xl'} textAlign={'center'}>
                Login
                </Heading>
            </Stack>
            <Box
                rounded={'lg'}
                bg={useColorModeValue('white', 'gray.700')}
                boxShadow={'lg'}
                p={8}>
                <Stack spacing={4}>
                    <FormControl id="username" isRequired>
                        <FormLabel>Username</FormLabel>
                        <Input onChange={e => setUsername(e.target.value)} type="string" />
                    </FormControl>
                    <FormControl id="password" isRequired>
                        <FormLabel>Password</FormLabel>
                        <InputGroup>
                        <Input onChange={e => setPassword(e.target.value)} type={showPassword ? 'text' : 'password'} />
                        <InputRightElement h={'full'}>
                            <Button
                            variant={'ghost'}
                            onClick={() => setShowPassword(showPassword => !showPassword)}>
                            {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                            </Button>
                        </InputRightElement>
                        </InputGroup>
                    </FormControl>
                    {error && 
                        <Alert status='error' variant="left-accent">
                            <AlertIcon />
                            <AlertTitle>{error}</AlertTitle>
                        </Alert>
                    }
                    <Stack spacing={10} pt={2}>
                        <Button
                        loadingText="Submitting"
                        size="lg"
                        isLoading={isLoading}
                        colorScheme='orange'
                        onClick={requestLogin}>
                        Login
                        </Button>
                    </Stack>
                    <Stack pt={6}>
                        <Text align={'center'}>
                            <Link color='orange' href='/signup'>Sign Up</Link>
                        </Text>
                    </Stack>
                </Stack>
            </Box>
            </Stack>
        </Flex>
    </>
    )
}

export default Login