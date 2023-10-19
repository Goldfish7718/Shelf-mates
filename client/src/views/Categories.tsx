import { Heading, SimpleGrid } from "@chakra-ui/react"
import Navbar from "../components/Navbar"
import CategoryCard from "../components/CategoryCard"
import data from "../data/CategoryData"
import { Outlet } from "react-router-dom"

function Categories () {
    return (
        <>
            <Navbar />
            <Heading mt={10} mb={10} textAlign='center' color='gray.800'>Explore! We Got your shelves! 😉</Heading>
            <SimpleGrid m={{ base: 5, md: 10, lg: 16 }} columns={{ base: 1, md: 2 }} spacing={5}>
                {data.map(item => (
                    <CategoryCard key={item.key} title={item.title} image={item.image} description={item.description} />
                ))}
            </SimpleGrid>
            <Outlet />
        </>
    )
}

export default Categories