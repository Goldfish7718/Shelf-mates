import { Text, VStack } from "@chakra-ui/react"

type ErrorProps = {
    error: string;
    status?: number;
}

function ErrorComponent ({ error, status }: ErrorProps) {
    return (
        <>
            <VStack px={5} h='100vh' alignItems='center' justifyContent='center'>
                {status && <Text fontSize='3xl'>{status}</Text>}
                <Text color='gray.700' fontSize='2xl'>{error}</Text>
            </VStack>
        </>
    )
}

export default ErrorComponent