import { Flex, Spinner, Text } from "@chakra-ui/react"

function Loading () {
    return (
        <>
            <Flex h='100vh' alignItems='center' justifyContent='center'>
                <Text fontSize='3xl'>Fetching data... <Spinner size='lg' /></Text>
            </Flex>
        </>
    )
}

export default Loading