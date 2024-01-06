import { Box, Card, Image, Text } from "@chakra-ui/react";

interface OrderCardProps {
    quantity: number;
    price: number;
    image: string;
    name: string;
}


const OrderCard = ({ image, quantity, name, price }: OrderCardProps) => {
    return (
        <>
            <Card variant='filled' direction='row' w='100%' h='120px' borderRadius='lg' my={1}>
                <Image src={image} w='45%' h='100%' objectFit='cover' backgroundColor='white' border='1px solid #e2e8f0' borderTopLeftRadius='lg' borderBottomLeftRadius='lg' />
                <Box p={2}>
                    <Text fontWeight='bold'>{name}</Text>
                    <Text fontWeight='bold' color='gray.600'>&#8377;{price}</Text> 
                    <Text color='gray.600'>Quantity: {quantity}</Text> 
                </Box>
            </Card>
        </>
    )
}

export default OrderCard