import { Button, Flex, Heading, Text, useBreakpointValue } from "@chakra-ui/react"
import Navbar from "../components/Navbar"
import { BsBoxArrowUpRight } from "react-icons/bs"
import Animator from "../utils/Animator"
import { useAuth } from "../context/AuthContext"

function Landing () {

    const headingFontSize = useBreakpointValue({ sm: 40, md: 50 })
    const buttonMargin = useBreakpointValue({ sm: 2, md: 4 })
    const buttonWidth = useBreakpointValue({ sm: "50%", md: "20%" })

    const { decode } = useAuth()

    return (
        <>
            {decode ? <Navbar username={decode.username} /> : <Navbar />}
            <Animator watch={false} animation_type="vertical">
                <Flex h="90vh" p={8} alignItems="center" justifyContent="center" direction="column">
                    <Heading fontSize={headingFontSize}>Fastest Grocery Delivery in <Text as="span" color="orange.500">Your Area</Text></Heading>
                    <Flex mt={10} direction={{ sm: "column", md: "row" }} alignItems={{ sm: "flex-start", md: "center" }} justifyContent="center" w="full">
                        <Button size="lg" m={buttonMargin} w={buttonWidth} colorScheme='orange' onClick={() => window.location.href = '/categories'}>Order <BsBoxArrowUpRight style={{ marginLeft: "8px" }} /></Button>
                        <Button size="lg" m={buttonMargin} w={buttonWidth} colorScheme='orange' onClick={() => window.location.href = '/login'}>Log In <BsBoxArrowUpRight style={{ marginLeft: "8px" }} /></Button>
                    </Flex>
                </Flex>
            </Animator>
        </>
    )
}

export default Landing