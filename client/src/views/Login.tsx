import { Alert, AlertIcon, AlertTitle, Box, Button, Flex, FormControl, FormLabel, Heading, Input, InputGroup, InputRightElement, Link, Stack, Text, useColorModeValue, useToast } from "@chakra-ui/react"
import Navbar from "../components/Navbar"
import { useState } from "react"
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons"
import { useAuth } from "../context/AuthContext"

function Login () {

    const { decode, requestLogin, error, isLoading  } = useAuth()

    const [showPassword, setShowPassword] = useState(false)

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleLogin = () => {
        requestLogin({ username, password })
    }
   
    return (
    <>
        {decode ? <Navbar username={decode.username} /> : <Navbar />}
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
                        loadingText="Logging in..."
                        size="lg"
                        isLoading={isLoading}
                        colorScheme='orange'
                        onClick={handleLogin}>
                        Login
                        </Button>
                    </Stack>
                    <Stack pt={{ sm: 3, md: 6 }}>
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