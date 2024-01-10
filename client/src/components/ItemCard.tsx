import { Button, Card, CardBody, CardFooter, Divider, HStack, Heading, Image, Stack, Text } from "@chakra-ui/react"
import { ProductProps } from "../views/Product"
import { FaMessage } from "react-icons/fa6"

function ItemCard ({ name, price, image, _id, category, reviews }: ProductProps) {
    return (
        <>
        <Card borderTop='10px solid orange'>
            <CardBody>
                <Image m={3} h='150px' w='full' src={image} objectFit='cover' borderRadius='2xl' />
                <Stack>
                    <Heading>{name}</Heading>
                    <HStack spacing={0}>
                        <FaMessage />
                        <Text ml={2} color='gray.500'>{reviews.length} Reviews</Text>
                    </HStack>
                    <Text color='gray.700'>Shipping charges calculated at checkout</Text>
                </Stack>
            </CardBody>
            <Divider borderColor='gray.400' />
            <CardFooter>
                <HStack spacing={5}>
                    <Text fontSize='2xl' color='blue'>&#8377;{price}</Text>
                    <Button colorScheme="orange" onClick={() => window.location.href = `/categories/${category}/${_id}`}>Buy</Button>
                </HStack>
            </CardFooter>
        </Card>
        </>
    )
}

export default ItemCard