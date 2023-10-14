import { Button, Flex, Heading, Text, useBreakpointValue } from "@chakra-ui/react"
import Navbar from "../components/Navbar"
import { BsBoxArrowUpRight } from "react-icons/bs"
import { useNavigate } from "react-router-dom"
import Animator from "../utils/Animator"

function Landing () {

    const headingFontSize = useBreakpointValue({ sm: 40, md: 50 })
    const buttonMargin = useBreakpointValue({ sm: 2, md: 4 })
    const buttonWidth = useBreakpointValue({ sm: "50%", md: "20%" })

    const navigate = useNavigate()

    return (
        <>
            <Navbar />
            <Animator watch={false} animation_type="vertical">
                <Flex h="90vh" p={8} alignItems="center" justifyContent="center" direction="column">
                    <Heading fontSize={headingFontSize}>Fastest Grocery Delivery in <Text as="span" color="orange.500">Your Area</Text></Heading>
                    <Flex mt={10} direction={{ sm: "column", md: "row" }} alignItems={{ sm: "flex-start", md: "center" }} justifyContent="center" w="full">
                        <Button size="lg" m={buttonMargin} w={buttonWidth} colorScheme='orange' onClick={() => navigate("/categories")}>Order <BsBoxArrowUpRight style={{ marginLeft: "8px" }} /></Button>
                        <Button size="lg" m={buttonMargin} w={buttonWidth} colorScheme='orange' onClick={() => navigate("/login")} variant="outline">Log In <BsBoxArrowUpRight style={{ marginLeft: "8px" }} /></Button>
                    </Flex>
                </Flex>
            </Animator>
        </>
    )
}

export default Landing