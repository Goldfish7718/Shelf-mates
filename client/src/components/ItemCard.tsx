import { Button, Card, CardBody, CardFooter, Divider, HStack, Heading, Image, Stack, Text } from "@chakra-ui/react"
import { AiFillStar } from "react-icons/ai"
import { ProductProps } from "../views/Product"

function ItemCard ({ name, price, image, _id, category, stars, reviews }: ProductProps) {
    return (
        <>
        <Card borderTop='10px solid orange'>
            <CardBody>
                <Image m={3} h='150px' w='full' src={image} objectFit='cover' borderRadius='2xl' />
                <Stack>
                    <Heading>{name}</Heading>
                    <HStack spacing={0}>
                        {Array.from({ length: stars }).map((_, index) => (
                            <AiFillStar key={index} size={24} />
                        ))}
                        <Text ml={2} color='gray.500'>{reviews.length}</Text>
                    </HStack>
                    <Text color='gray.700'>$11.50 Delivery Charges</Text>
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