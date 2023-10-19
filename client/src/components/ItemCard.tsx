import { Button, Card, CardBody, CardFooter, Divider, HStack, Heading, Image, Stack, Text } from "@chakra-ui/react"
import { AiFillStar } from "react-icons/ai"
import { ItemData } from "../views/Items"

function ItemCard ({ name, price, image, _id, category }: ItemData) {
    return (
        <>
        <Card borderTop='10px solid orange'>
            <CardBody>
                <Image m={3} h='150px' w='full' src={image} objectFit='cover' borderRadius='2xl' />
                <Stack>
                    <Heading>{name}</Heading>
                    <HStack spacing={0}>
                        <AiFillStar />
                        <AiFillStar />
                        <AiFillStar />
                        <AiFillStar />
                        <AiFillStar />
                        <Text ml={2} color='gray.500'>265</Text>
                    </HStack>
                    <Text color='gray.700'>$11.50 Delivery Charges</Text>
                </Stack>
            </CardBody>
            <Divider borderColor='gray.400' />
            <CardFooter>
                <HStack spacing={5}>
                    <Text fontSize='2xl' color='blue'>${price}</Text>
                    <Button colorScheme="orange" onClick={() => window.location.href = `/categories/${category}/${_id}`}>Buy</Button>
                </HStack>
            </CardFooter>
        </Card>
        </>
    )
}

export default ItemCard